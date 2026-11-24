/**
 * 纯前端零依赖标准 QR Code 矩阵生成器 (ISO/IEC 18004, Byte Mode UTF-8, ECC Level M)
 * 支持版本 1 ~ 10（最长可编码约 210 字节 URL），离线可用，无跨域限制
 */
(function (global) {
  'use strict';

  // Version 1..10 (ECC Level M): [totalCodewords, ecCodewordsPerBlock, numBlocksGroup1, dataCwGroup1, numBlocksGroup2, dataCwGroup2]
  const VERSION_TABLE_M = [
    null,
    [26, 10, 1, 16, 0, 0],   // V1:  16 bytes max (14 chars)
    [44, 16, 1, 28, 0, 0],   // V2:  28 bytes max (26 chars)
    [70, 26, 1, 44, 0, 0],   // V3:  44 bytes max (42 chars)
    [100, 18, 2, 32, 0, 0],  // V4:  64 bytes max (62 chars)
    [134, 24, 2, 43, 0, 0],  // V5:  86 bytes max (84 chars)
    [172, 16, 4, 27, 0, 0],  // V6: 108 bytes max (106 chars)
    [196, 18, 4, 31, 0, 0],  // V7: 124 bytes max (122 chars)
    [242, 22, 2, 38, 2, 39], // V8: 154 bytes max (152 chars)
    [292, 22, 3, 36, 2, 37], // V9: 182 bytes max (179 chars)
    [346, 26, 4, 43, 1, 44]  // V10:216 bytes max (213 chars)
  ];

  const ALIGNMENT_POS = [
    null,
    [],
    [6, 18],
    [6, 22],
    [6, 26],
    [6, 30],
    [6, 34],
    [6, 22, 38],
    [6, 24, 42],
    [6, 26, 46],
    [6, 28, 50]
  ];

  // GF(256) 指数与对数表 (primitive polynomial 0x11D)
  const GF_EXP = new Uint8Array(512);
  const GF_LOG = new Uint8Array(256);
  (function initGF() {
    let x = 1;
    for (let i = 0; i < 255; i++) {
      GF_EXP[i] = x;
      GF_LOG[x] = i;
      x <<= 1;
      if (x & 0x100) x ^= 0x11d;
    }
    for (let i = 255; i < 512; i++) {
      GF_EXP[i] = GF_EXP[i - 255];
    }
  })();

  function gfMul(a, b) {
    if (a === 0 || b === 0) return 0;
    return GF_EXP[GF_LOG[a] + GF_LOG[b]];
  }

  function rsGeneratorPoly(degree) {
    let poly = [1];
    for (let i = 0; i < degree; i++) {
      const next = new Array(poly.length + 1).fill(0);
      const root = GF_EXP[i];
      for (let j = 0; j < poly.length; j++) {
        next[j] ^= poly[j];
        next[j + 1] ^= gfMul(poly[j], root);
      }
      poly = next;
    }
    return poly;
  }

  function rsComputeRemainder(data, ecLen) {
    const gen = rsGeneratorPoly(ecLen);
    const rem = new Array(ecLen).fill(0);
    for (let i = 0; i < data.length; i++) {
      const factor = data[i] ^ rem[0];
      rem.shift();
      rem.push(0);
      if (factor !== 0) {
        for (let j = 0; j < ecLen; j++) {
          rem[j] ^= gfMul(gen[j + 1], factor);
        }
      }
    }
    return rem;
  }

  function utf8Bytes(str) {
    if (typeof TextEncoder !== 'undefined') {
      return Array.from(new TextEncoder().encode(str));
    }
    const out = [];
    for (let i = 0; i < str.length; i++) {
      let c = str.charCodeAt(i);
      if (c < 0x80) out.push(c);
      else if (c < 0x800) out.push(0xc0 | (c >> 6), 0x80 | (c & 0x3f));
      else out.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 0x3f), 0x80 | (c & 0x3f));
    }
    return out;
  }

  function chooseVersion(byteLen) {
    for (let v = 1; v <= 10; v++) {
      const info = VERSION_TABLE_M[v];
      const dataCapacityBytes = info[2] * info[3] + info[4] * info[5];
      const lenBits = v <= 9 ? 8 : 16;
      const neededBits = 4 + lenBits + byteLen * 8;
      if (neededBits <= dataCapacityBytes * 8) return v;
    }
    throw new Error('QR URL too long');
  }

  function encodeDataCodewords(bytes, version) {
    const info = VERSION_TABLE_M[version];
    const totalDataCw = info[2] * info[3] + info[4] * info[5];
    const bits = [];
    const pushBits = (val, len) => {
      for (let i = len - 1; i >= 0; i--) bits.push((val >>> i) & 1);
    };

    // Byte mode indicator: 0100
    pushBits(0b0100, 4);
    pushBits(bytes.length, version <= 9 ? 8 : 16);
    for (const b of bytes) pushBits(b, 8);

    const maxBits = totalDataCw * 8;
    const term = Math.min(4, maxBits - bits.length);
    pushBits(0, term);
    while (bits.length % 8 !== 0) bits.push(0);

    const codewords = [];
    for (let i = 0; i < bits.length; i += 8) {
      let byte = 0;
      for (let j = 0; j < 8; j++) byte = (byte << 1) | bits[i + j];
      codewords.push(byte);
    }

    const padBytes = [0xec, 0x11];
    let padIdx = 0;
    while (codewords.length < totalDataCw) {
      codewords.push(padBytes[padIdx % 2]);
      padIdx++;
    }
    return codewords;
  }

  function interleaveCodewords(dataCw, version) {
    const [, ecLen, g1Blocks, g1Len, g2Blocks, g2Len] = VERSION_TABLE_M[version];
    const dataBlocks = [];
    const ecBlocks = [];
    let offset = 0;

    for (let i = 0; i < g1Blocks; i++) {
      const blk = dataCw.slice(offset, offset + g1Len);
      offset += g1Len;
      dataBlocks.push(blk);
      ecBlocks.push(rsComputeRemainder(blk, ecLen));
    }
    for (let i = 0; i < g2Blocks; i++) {
      const blk = dataCw.slice(offset, offset + g2Len);
      offset += g2Len;
      dataBlocks.push(blk);
      ecBlocks.push(rsComputeRemainder(blk, ecLen));
    }

    const result = [];
    const maxDataLen = Math.max(g1Len, g2Len);
    for (let col = 0; col < maxDataLen; col++) {
      for (const blk of dataBlocks) {
        if (col < blk.length) result.push(blk[col]);
      }
    }
    for (let col = 0; col < ecLen; col++) {
      for (const blk of ecBlocks) {
        result.push(blk[col]);
      }
    }
    return result;
  }

  function createEmptyGrid(size) {
    return {
      size,
      modules: Array.from({ length: size }, () => new Uint8Array(size)),
      isFunc: Array.from({ length: size }, () => new Uint8Array(size))
    };
  }

  function setFuncModule(grid, r, c, dark) {
    if (r < 0 || r >= grid.size || c < 0 || c >= grid.size) return;
    grid.modules[r][c] = dark ? 1 : 0;
    grid.isFunc[r][c] = 1;
  }

  function drawFunctionPatterns(grid, version) {
    const size = grid.size;

    // Timing patterns
    for (let i = 0; i < size; i++) {
      setFuncModule(grid, 6, i, i % 2 === 0);
      setFuncModule(grid, i, 6, i % 2 === 0);
    }

    // Finder patterns + separators (top-left, top-right, bottom-left)
    const drawFinder = (cy, cx) => {
      for (let dy = -4; dy <= 4; dy++) {
        for (let dx = -4; dx <= 4; dx++) {
          const dist = Math.max(Math.abs(dx), Math.abs(dy));
          setFuncModule(grid, cy + dy, cx + dx, dist !== 2 && dist !== 4);
        }
      }
    };
    drawFinder(3, 3);
    drawFinder(3, size - 4);
    drawFinder(size - 4, 3);

    // Alignment patterns
    const pos = ALIGNMENT_POS[version];
    for (let i = 0; i < pos.length; i++) {
      for (let j = 0; j < pos.length; j++) {
        if (
          (i === 0 && j === 0) ||
          (i === 0 && j === pos.length - 1) ||
          (i === pos.length - 1 && j === 0)
        ) {
          continue;
        }
        const cy = pos[i];
        const cx = pos[j];
        for (let dy = -2; dy <= 2; dy++) {
          for (let dx = -2; dx <= 2; dx++) {
            setFuncModule(grid, cy + dy, cx + dx, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
          }
        }
      }
    }

    // Reserve format info bits & dark module
    for (let i = 0; i <= 8; i++) {
      if (i !== 6) {
        setFuncModule(grid, 8, i, false);
        setFuncModule(grid, i, 8, false);
      }
    }
    for (let i = 0; i < 8; i++) {
      setFuncModule(grid, 8, size - 1 - i, false);
      setFuncModule(grid, size - 1 - i, 8, false);
    }
    setFuncModule(grid, size - 8, 8, true); // Always dark module

    // Version >= 7 version info blocks (we support up to V10)
    if (version >= 7) {
      let rem = version;
      for (let i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1f25);
      const vBits = (version << 12) | rem;
      for (let i = 0; i < 18; i++) {
        const bit = ((vBits >>> i) & 1) === 1;
        const a = size - 11 + (i % 3);
        const b = Math.floor(i / 3);
        setFuncModule(grid, a, b, bit);
        setFuncModule(grid, b, a, bit);
      }
    }
  }

  function drawCodewords(grid, allCodewords) {
    const size = grid.size;
    let bitIdx = 0;
    const totalBits = allCodewords.length * 8;

    for (let right = size - 1; right >= 1; right -= 2) {
      if (right === 6) right = 5;
      for (let vert = 0; vert < size; vert++) {
        for (let j = 0; j < 2; j++) {
          const c = right - j;
          const upward = ((right + 1) & 2) === 0;
          const r = upward ? size - 1 - vert : vert;
          if (!grid.isFunc[r][c]) {
            let dark = false;
            if (bitIdx < totalBits) {
              dark = ((allCodewords[bitIdx >>> 3] >>> (7 - (bitIdx & 7))) & 1) === 1;
              bitIdx++;
            }
            grid.modules[r][c] = dark ? 1 : 0;
          }
        }
      }
    }
  }

  function applyMaskAndFormat(baseGrid, mask) {
    const size = baseGrid.size;
    const modules = baseGrid.modules.map((row) => new Uint8Array(row));
    const isFunc = baseGrid.isFunc;

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (isFunc[r][c]) continue;
        let invert = false;
        switch (mask) {
          case 0: invert = (r + c) % 2 === 0; break;
          case 1: invert = r % 2 === 0; break;
          case 2: invert = c % 3 === 0; break;
          case 3: invert = (r + c) % 3 === 0; break;
          case 4: invert = (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0; break;
          case 5: invert = ((r * c) % 2) + ((r * c) % 3) === 0; break;
          case 6: invert = (((r * c) % 2) + ((r * c) % 3)) % 2 === 0; break;
          case 7: invert = (((r + c) % 2) + ((r * c) % 3)) % 2 === 0; break;
        }
        if (invert) modules[r][c] ^= 1;
      }
    }

    // ECC Level M format indicator bits = 00
    const data = (0b00 << 3) | mask;
    let rem = data;
    for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
    const bits = ((data << 10) | rem) ^ 0x5412;
    const getBit = (idx) => ((bits >>> idx) & 1);

    // First copy around top-left
    for (let i = 0; i <= 5; i++) modules[8][i] = getBit(i);
    modules[8][7] = getBit(6);
    modules[8][8] = getBit(7);
    modules[7][8] = getBit(8);
    for (let i = 9; i < 15; i++) modules[14 - i][8] = getBit(i);

    // Second copy along top-right & bottom-left
    for (let i = 0; i < 8; i++) modules[8][size - 1 - i] = getBit(i);
    for (let i = 8; i < 15; i++) modules[size - 15 + i][8] = getBit(i);
    modules[size - 8][8] = 1;

    return modules;
  }

  function computePenalty(modules) {
    const size = modules.length;
    let score = 0;

    // Adjacent runs in rows & cols
    for (let r = 0; r < size; r++) {
      let runColor = modules[r][0], runLen = 1;
      for (let c = 1; c < size; c++) {
        if (modules[r][c] === runColor) {
          runLen++;
          if (runLen === 5) score += 3;
          else if (runLen > 5) score += 1;
        } else {
          runColor = modules[r][c];
          runLen = 1;
        }
      }
    }
    for (let c = 0; c < size; c++) {
      let runColor = modules[0][c], runLen = 1;
      for (let r = 1; r < size; r++) {
        if (modules[r][c] === runColor) {
          runLen++;
          if (runLen === 5) score += 3;
          else if (runLen > 5) score += 1;
        } else {
          runColor = modules[r][c];
          runLen = 1;
        }
      }
    }

    // 2x2 blocks
    for (let r = 0; r < size - 1; r++) {
      for (let c = 0; c < size - 1; c++) {
        const v = modules[r][c];
        if (v === modules[r][c + 1] && v === modules[r + 1][c] && v === modules[r + 1][c + 1]) {
          score += 3;
        }
      }
    }
    return score;
  }

  /**
   * 生成二维码布尔矩阵 (matrix[r][c] === 1 表示深色模块)
   */
  function generateQRMatrix(text) {
    let bytes = utf8Bytes(String(text || 'https://example.com'));
    if (bytes.length > 210) {
      bytes = bytes.slice(0, 210);
    }
    const version = chooseVersion(bytes.length);
    const size = version * 4 + 17;
    const dataCw = encodeDataCodewords(bytes, version);
    const allCw = interleaveCodewords(dataCw, version);

    const grid = createEmptyGrid(size);
    drawFunctionPatterns(grid, version);
    drawCodewords(grid, allCw);

    let bestModules = null;
    let bestPenalty = Infinity;
    for (let mask = 0; mask < 8; mask++) {
      const candidate = applyMaskAndFormat(grid, mask);
      const pen = computePenalty(candidate);
      if (pen < bestPenalty) {
        bestPenalty = pen;
        bestModules = candidate;
      }
    }
    return bestModules;
  }

  /**
   * 渲染为内联 SVG 字符串（带静区 Quiet Zone）
   */
  function renderQRToSVG(text, darkColor, bgColor) {
    const matrix = generateQRMatrix(text);
    const n = matrix.length;
    const quiet = 3;
    const total = n + quiet * 2;
    const dark = darkColor || '#1A1815';
    const bg = bgColor || '#FFFFFF';

    let paths = '';
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        if (matrix[r][c]) {
          paths += `M${c + quiet},${r + quiet}h1v1h-1z`;
        }
      }
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} ${total}" shape-rendering="crispEdges" aria-label="扫码参与测试二维码"><rect width="${total}" height="${total}" fill="${bg}"/><path d="${paths}" fill="${dark}"/></svg>`;
  }

  /**
   * 直接将二维码绘制到 Canvas 指定区域
   */
  function drawQROnCanvas(ctx, text, x, y, boxSize, darkColor, bgColor) {
    const matrix = generateQRMatrix(text);
    const n = matrix.length;
    const quiet = 3;
    const total = n + quiet * 2;
    const cell = boxSize / total;

    ctx.fillStyle = bgColor || '#FFFFFF';
    ctx.fillRect(x, y, boxSize, boxSize);

    ctx.fillStyle = darkColor || '#1A1815';
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        if (matrix[r][c]) {
          const rx = Math.round(x + (c + quiet) * cell);
          const ry = Math.round(y + (r + quiet) * cell);
          const rw = Math.round(x + (c + quiet + 1) * cell) - rx;
          const rh = Math.round(y + (r + quiet + 1) * cell) - ry;
          ctx.fillRect(rx, ry, rw, rh);
        }
      }
    }
  }

  global.MiniQR = {
    generateQRMatrix,
    renderQRToSVG,
    drawQROnCanvas
  };
})(typeof window !== 'undefined' ? window : globalThis);
