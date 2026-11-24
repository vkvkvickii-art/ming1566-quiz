/**
 * 《测测你是〈大明王朝1566〉里的谁》核心交互与评分引擎
 * 纯前端零依赖运行（支持 file:// 本地直开与移动端响应式浏览）
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'ming1566_quiz_progress_v1';
  const SHARE_URL_KEY = 'ming1566_share_url_v1';
  const TOTAL_QUESTIONS = QUESTIONS.length;
  const DIM_KEYS = DIMENSIONS.map((d) => d.key);

  // 应用状态
  const state = {
    currentIndex: 0,
    answers: new Array(TOTAL_QUESTIONS).fill(null), // 存放每题选中的 option index (0..3)
    isTransitioning: false,
    lastResult: null,
    customShareUrl: ''
  };

  // =========================================================================
  // 1. 六维白化向量匹配引擎（初始化时根据题库精确计算均值、标准差与白化矩阵）
  // =========================================================================
  const engine = initScoringEngine();

  function initScoringEngine() {
    const n = DIM_KEYS.length;
    const mean = new Array(n).fill(0);
    const cov = Array.from({ length: n }, () => new Array(n).fill(0));
    const minRaw = new Array(n).fill(0);
    const maxRaw = new Array(n).fill(0);

    for (const q of QUESTIONS) {
      const qMean = new Array(n).fill(0);
      const k = q.options.length;

      for (let i = 0; i < n; i++) {
        const key = DIM_KEYS[i];
        const vals = q.options.map((opt) => opt.scores[key] || 0);
        minRaw[i] += Math.min(...vals);
        maxRaw[i] += Math.max(...vals);
        qMean[i] = vals.reduce((a, b) => a + b, 0) / k;
        mean[i] += qMean[i];
      }

      for (const opt of q.options) {
        const diff = DIM_KEYS.map((key, i) => (opt.scores[key] || 0) - qMean[i]);
        for (let i = 0; i < n; i++) {
          for (let j = 0; j < n; j++) {
            cov[i][j] += (diff[i] * diff[j]) / k;
          }
        }
      }
    }

    const std = cov.map((row, i) => Math.sqrt(Math.max(row[i], 1e-6)));

    // Jacobi 对称矩阵特征分解，求白化矩阵 W = Cov^(-1/2)
    const { vals, vecs } = jacobiSymmetricEigen(cov);
    const W = Array.from({ length: n }, () => new Array(n).fill(0));
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        for (let m = 0; m < n; m++) {
          const invSqrt = 1 / Math.sqrt(Math.max(vals[m], 1e-6));
          W[i][j] += vecs[i][m] * invSqrt * vecs[j][m];
        }
      }
    }

    // 预计算每位角色在白化空间中的单位特征向量
    const charProfiles = CHARACTERS.map((char) => {
      const zTarget = DIM_KEYS.map((key) => (char.target[key] - 50) / 25);
      const xCentered = zTarget.map((z, i) => z * std[i]);
      const wVec = matVecMul(W, xCentered);
      const wNorm = Math.hypot(...wVec) || 1;
      return {
        character: char,
        wUnit: wVec.map((v) => v / wNorm),
        bias: char.bias || 0
      };
    });

    return { mean, std, minRaw, maxRaw, W, charProfiles };
  }

  function jacobiSymmetricEigen(matrix) {
    const n = matrix.length;
    const M = matrix.map((row) => row.slice());
    const V = Array.from({ length: n }, (_, i) =>
      Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))
    );

    for (let iter = 0; iter < 100; iter++) {
      let p = 0;
      let q = 1;
      let maxOff = 0;
      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          if (Math.abs(M[i][j]) > maxOff) {
            maxOff = Math.abs(M[i][j]);
            p = i;
            q = j;
          }
        }
      }
      if (maxOff < 1e-11) break;

      const theta = 0.5 * Math.atan2(2 * M[p][q], M[q][q] - M[p][p]);
      const c = Math.cos(theta);
      const s = Math.sin(theta);

      for (let i = 0; i < n; i++) {
        const mip = M[i][p];
        const miq = M[i][q];
        M[i][p] = c * mip - s * miq;
        M[i][q] = s * mip + c * miq;
      }
      for (let i = 0; i < n; i++) {
        const mpi = M[p][i];
        const mqi = M[q][i];
        M[p][i] = c * mpi - s * mqi;
        M[q][i] = s * mpi + c * mqi;
      }
      M[p][q] = 0;
      M[q][p] = 0;

      for (let i = 0; i < n; i++) {
        const vip = V[i][p];
        const viq = V[i][q];
        V[i][p] = c * vip - s * viq;
        V[i][q] = s * vip + c * viq;
      }
    }

    return {
      vals: M.map((row, i) => row[i]),
      vecs: V
    };
  }

  function matVecMul(M, v) {
    return M.map((row) => row.reduce((sum, x, idx) => sum + x * v[idx], 0));
  }

  /**
   * 根据30道题作答结果计算六维面板分（0~100）与人物契合度排行
   */
  function evaluateQuizResult(answers) {
    const raw = new Array(DIM_KEYS.length).fill(0);

    answers.forEach((optIdx, qIdx) => {
      const validIdx = optIdx !== null && optIdx >= 0 ? optIdx : 0;
      const opt = QUESTIONS[qIdx].options[validIdx];
      DIM_KEYS.forEach((key, dIdx) => {
        raw[dIdx] += opt.scores[key] || 0;
      });
    });

    const centered = raw.map((val, i) => val - engine.mean[i]);
    const zScores = centered.map((val, i) => val / engine.std[i]);

    // 将 Z-score 映射为直观饱满的 12~98 百分制面板分（兼顾理论极值线性插值与平滑 Sigmoid）
    const displayScores = {};
    const dimDetails = DIMENSIONS.map((dim, i) => {
      const linearRatio =
        (raw[i] - engine.minRaw[i]) / Math.max(1, engine.maxRaw[i] - engine.minRaw[i]);
      const sigmoidRatio = 1 / (1 + Math.exp(-0.85 * zScores[i]));
      const blended = 0.45 * linearRatio + 0.55 * sigmoidRatio;
      const score = Math.round(Math.min(98, Math.max(14, blended * 100)));
      displayScores[dim.key] = score;
      return {
        ...dim,
        score,
        z: zScores[i]
      };
    });

    // 白化空间相似度匹配
    const wUser = matVecMul(engine.W, centered);
    const wNorm = Math.hypot(...wUser);
    const wUnit = wNorm > 1e-6 ? wUser.map((v) => v / wNorm) : [0, 0, 1, 0, 0, 0];

    const ranked = engine.charProfiles
      .map((profile) => {
        let cosine = 0;
        for (let i = 0; i < wUnit.length; i++) {
          cosine += wUnit[i] * profile.wUnit[i];
        }
        const adjustedScore = cosine + profile.bias;
        // 映射为符合直觉的灵魂契合度百分比 (83% ~ 99%)
        const clampedCos = Math.max(-0.5, Math.min(1, adjustedScore));
        const matchPct = Math.round(83 + ((clampedCos + 0.5) / 1.5) * 15);
        return {
          character: profile.character,
          rawSim: adjustedScore,
          cosine,
          matchPct: Math.min(99, Math.max(82, matchPct))
        };
      })
      .sort((a, b) => b.rawSim - a.rawSim);

    const best = ranked[0];
    const runnerUp = ranked[1];

    // 提取用户最突出的两个维度，生成动态个性化匹配补充语
    const sortedByStrength = [...dimDetails].sort((a, b) => b.score - a.score);
    const topDim1 = sortedByStrength[0];
    const topDim2 = sortedByStrength[1];
    const dynamicNote = `你的心性图谱中，「${topDim1.fullName}」（${topDim1.score}分）与「${topDim2.fullName}」（${topDim2.score}分）尤为鲜明。`;

    return {
      best,
      runnerUp,
      displayScores,
      dimDetails,
      dynamicReason: `${dynamicNote}${best.character.reason}`
    };
  }

  // =========================================================================
  // 2. DOM 节点缓存与初始化
  // =========================================================================
  const els = {};

  function cacheElements() {
    els.viewHome = document.getElementById('view-home');
    els.viewQuiz = document.getElementById('view-quiz');
    els.viewComputing = document.getElementById('view-computing');
    els.viewResult = document.getElementById('view-result');

    els.rosterChips = document.getElementById('roster-chips');
    els.btnStart = document.getElementById('btn-start');
    els.resumeBanner = document.getElementById('resume-banner');
    els.resumeCount = document.getElementById('resume-count');
    els.btnResume = document.getElementById('btn-resume');

    els.chapterBadge = document.getElementById('chapter-badge');
    els.currentNum = document.getElementById('current-q-num');
    els.totalNum = document.getElementById('total-q-num');
    els.progressFill = document.getElementById('progress-fill');
    els.questionStage = document.getElementById('question-stage');
    els.questionTitle = document.getElementById('question-title');
    els.optionsList = document.getElementById('options-list');
    els.btnPrev = document.getElementById('btn-prev');
    els.btnNext = document.getElementById('btn-next');

    // 结果页节点
    els.resMatchPct = document.getElementById('res-match-pct');
    els.resName = document.getElementById('res-name');
    els.resCourtesy = document.getElementById('res-courtesy');
    els.resVerdict = document.getElementById('res-verdict');
    els.resSeal = document.getElementById('res-seal');
    els.resTags = document.getElementById('res-tags');
    els.resQuote = document.getElementById('res-quote');
    els.resRadarWrap = document.getElementById('res-radar-wrap');
    els.resDimBars = document.getElementById('res-dim-bars');
    els.resRunnerUp = document.getElementById('res-runner-up');
    els.resTraits = document.getElementById('res-traits');
    els.resReason = document.getElementById('res-reason');
    els.resAdvantage = document.getElementById('res-advantage');
    els.resSurvival = document.getElementById('res-survival');
    els.resAlly = document.getElementById('res-ally');
    els.resNemesis = document.getElementById('res-nemesis');
    els.resTip = document.getElementById('res-tip');
    els.resQrBox = document.getElementById('res-qr-box');

    els.btnSavePoster = document.getElementById('btn-save-poster');
    els.btnCopyText = document.getElementById('btn-copy-text');
    els.btnCleanShot = document.getElementById('btn-clean-shot');
    els.btnRestart = document.getElementById('btn-restart');
    els.qrUrlInput = document.getElementById('qr-url-input');
    els.btnUpdateQr = document.getElementById('btn-update-qr');
    els.cleanShotToast = document.getElementById('clean-shot-toast');
    els.toastMsg = document.getElementById('toast-msg');

    els.posterModal = document.getElementById('poster-modal');
    els.posterModalImg = document.getElementById('poster-modal-img');
    els.posterModalClose = document.getElementById('poster-modal-close');
  }

  function initApp() {
    cacheElements();
    loadSavedShareUrl();
    renderRosterPreview();
    checkSavedProgress();
    bindEvents();
  }

  function loadSavedShareUrl() {
    try {
      const saved = localStorage.getItem(SHARE_URL_KEY);
      if (saved && saved.trim()) {
        state.customShareUrl = saved.trim();
      }
    } catch (_) {
      // ignore
    }
  }

  function getActiveShareUrl() {
    if (state.customShareUrl) return state.customShareUrl;
    if (typeof window !== 'undefined' && window.location && window.location.href) {
      const host = window.location.hostname || '';
      const isLocal =
        host === 'localhost' ||
        host === '127.0.0.1' ||
        host === '0.0.0.0' ||
        window.location.protocol === 'file:';
      if (!isLocal && (window.location.protocol === 'http:' || window.location.protocol === 'https:')) {
        return window.location.href.split('#')[0];
      }
    }
    if (typeof QUIZ_CONFIG !== 'undefined' && QUIZ_CONFIG.defaultShareUrl) {
      return QUIZ_CONFIG.defaultShareUrl;
    }
    return 'https://vkvkvickii-art.github.io/ming1566-quiz/';
  }

  function refreshQRCodeUI() {
    const url = getActiveShareUrl();
    if (els.qrUrlInput) {
      els.qrUrlInput.value = url;
    }
    if (els.resQrBox && typeof MiniQR !== 'undefined') {
      els.resQrBox.innerHTML = MiniQR.renderQRToSVG(url, '#1A1815', '#FFFFFF');
    }
  }

  function renderRosterPreview() {
    els.rosterChips.innerHTML = CHARACTERS.map(
      (c) => `<span class="roster-chip">${c.name}</span>`
    ).join('');
    els.totalNum.textContent = String(TOTAL_QUESTIONS);
  }

  // =========================================================================
  // 3. 本地进度存储与恢复
  // =========================================================================
  function saveProgress() {
    try {
      const payload = {
        currentIndex: state.currentIndex,
        answers: state.answers
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (_) {
      // 忽略无痕/本地文件策略限制
    }
  }

  function clearProgress() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_) {
      // ignore
    }
  }

  function checkSavedProgress() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (
        parsed &&
        Array.isArray(parsed.answers) &&
        parsed.answers.length === TOTAL_QUESTIONS
      ) {
        const answeredCount = parsed.answers.filter((a) => a !== null).length;
        if (answeredCount > 0 && answeredCount < TOTAL_QUESTIONS) {
          els.resumeCount.textContent = String(answeredCount);
          els.resumeBanner.classList.add('visible');
        }
      }
    } catch (_) {
      // ignore
    }
  }

  // =========================================================================
  // 4. 视图与答题流程控制
  // =========================================================================
  function switchView(targetEl) {
    [els.viewHome, els.viewQuiz, els.viewComputing, els.viewResult].forEach((el) => {
      el.classList.toggle('active', el === targetEl);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function startNewQuiz() {
    state.currentIndex = 0;
    state.answers = new Array(TOTAL_QUESTIONS).fill(null);
    state.isTransitioning = false;
    clearProgress();
    els.resumeBanner.classList.remove('visible');
    renderCurrentQuestion('next');
    switchView(els.viewQuiz);
  }

  function resumeSavedQuiz() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return startNewQuiz();
      const parsed = JSON.parse(raw);
      state.answers = parsed.answers;
      const firstUnanswered = state.answers.findIndex((a) => a === null);
      state.currentIndex =
        firstUnanswered !== -1
          ? firstUnanswered
          : Math.min(parsed.currentIndex || 0, TOTAL_QUESTIONS - 1);
      state.isTransitioning = false;
      renderCurrentQuestion('next');
      switchView(els.viewQuiz);
    } catch (_) {
      startNewQuiz();
    }
  }

  function renderCurrentQuestion(direction) {
    const q = QUESTIONS[state.currentIndex];
    const selectedIdx = state.answers[state.currentIndex];

    els.chapterBadge.textContent = q.chapter;
    els.currentNum.textContent = String(state.currentIndex + 1).padStart(2, '0');
    const pct = ((state.currentIndex + 1) / TOTAL_QUESTIONS) * 100;
    els.progressFill.style.width = `${pct.toFixed(1)}%`;

    // 切换方向过渡动画
    els.questionStage.classList.remove('anim-next', 'anim-prev');
    void els.questionStage.offsetWidth;
    els.questionStage.classList.add(direction === 'prev' ? 'anim-prev' : 'anim-next');

    els.questionTitle.textContent = `${q.id}. ${q.question}`;

    els.optionsList.innerHTML = q.options
      .map((opt, idx) => {
        const isSelected = selectedIdx === idx ? 'selected' : '';
        return `
          <button type="button" class="option-btn ${isSelected}" data-idx="${idx}" aria-pressed="${selectedIdx === idx}">
            <span class="option-key">${opt.label}</span>
            <span class="option-text">${opt.text}</span>
          </button>
        `;
      })
      .join('');

    els.btnPrev.disabled = state.currentIndex === 0;
    els.btnNext.disabled = selectedIdx === null;
    els.btnNext.textContent =
      state.currentIndex === TOTAL_QUESTIONS - 1 ? '呈递考卷 →' : '下一题 →';
  }

  function handleSelectOption(optIndex) {
    if (state.isTransitioning) return;
    state.isTransitioning = true;
    state.answers[state.currentIndex] = optIndex;
    saveProgress();

    // 立即高亮反馈
    const buttons = els.optionsList.querySelectorAll('.option-btn');
    buttons.forEach((btn, idx) => {
      const active = idx === optIndex;
      btn.classList.toggle('selected', active);
      btn.setAttribute('aria-pressed', String(active));
    });
    els.btnNext.disabled = false;

    setTimeout(() => {
      if (state.currentIndex < TOTAL_QUESTIONS - 1) {
        state.currentIndex += 1;
        saveProgress();
        renderCurrentQuestion('next');
        state.isTransitioning = false;
      } else {
        finishQuiz();
      }
    }, 240);
  }

  function goPrevQuestion() {
    if (state.isTransitioning || state.currentIndex <= 0) return;
    state.currentIndex -= 1;
    saveProgress();
    renderCurrentQuestion('prev');
  }

  function goNextQuestion() {
    if (state.isTransitioning) return;
    if (state.answers[state.currentIndex] === null) return;
    if (state.currentIndex < TOTAL_QUESTIONS - 1) {
      state.currentIndex += 1;
      saveProgress();
      renderCurrentQuestion('next');
    } else {
      finishQuiz();
    }
  }

  function finishQuiz() {
    clearProgress();
    switchView(els.viewComputing);
    const result = evaluateQuizResult(state.answers);
    state.lastResult = result;

    setTimeout(() => {
      renderResultView(result);
      switchView(els.viewResult);
      state.isTransitioning = false;
    }, 950);
  }

  // =========================================================================
  // 5. 结果页面渲染与纯 SVG 六维雷达图
  // =========================================================================
  function renderResultView(result) {
    const char = result.best.character;

    els.resMatchPct.textContent = `灵魂契合度 ${result.best.matchPct}%`;
    els.resName.textContent = char.name;
    els.resCourtesy.textContent = char.courtesy;
    els.resVerdict.textContent = char.title;
    els.resVerdict.style.color = char.accentColor || '#1F445A';
    els.resSeal.textContent = char.seal;

    els.resTags.innerHTML = char.tags
      .map((t) => `<span class="char-tag">${t}</span>`)
      .join('');

    els.resQuote.textContent = char.quote;

    // 渲染 SVG 六维雷达图
    els.resRadarWrap.innerHTML = buildRadarSVG(
      result.dimDetails,
      char.accentColor || '#9E2A2B'
    );

    // 渲染右侧维度条
    els.resDimBars.innerHTML = result.dimDetails
      .map(
        (d) => `
        <div class="dim-bar-item">
          <span class="dim-bar-name">${d.name}</span>
          <div class="dim-bar-track">
            <div class="dim-bar-fill" style="width:${d.score}%; background:${char.accentColor || '#1F445A'}"></div>
          </div>
          <span class="dim-bar-val">${d.score}</span>
        </div>
      `
      )
      .join('');

    els.resRunnerUp.innerHTML = `
      <span>灵魂潜藏副色（次高契合）</span>
      <strong>${result.runnerUp.character.name} · ${result.runnerUp.matchPct}%</strong>
    `;

    els.resTraits.textContent = char.traits;
    els.resReason.textContent = result.dynamicReason;
    els.resAdvantage.textContent = char.advantage;

    els.resSurvival.textContent = char.easterEgg.survival;
    els.resAlly.textContent = char.easterEgg.ally;
    els.resNemesis.textContent = char.easterEgg.nemesis;
    els.resTip.textContent = char.easterEgg.tip;

    refreshQRCodeUI();
  }

  function buildRadarSVG(dimDetails, accentColor) {
    const size = 220;
    const cx = size / 2;
    const cy = size / 2;
    const radius = 74;
    const levels = [0.33, 0.66, 1.0];

    const pointAt = (idx, rRatio) => {
      const angle = -Math.PI / 2 + (idx * 2 * Math.PI) / 6;
      return [
        cx + radius * rRatio * Math.cos(angle),
        cy + radius * rRatio * Math.sin(angle)
      ];
    };

    const gridPolys = levels
      .map((lv) => {
        const pts = dimDetails
          .map((_, i) => pointAt(i, lv).map((n) => n.toFixed(1)).join(','))
          .join(' ');
        return `<polygon points="${pts}" fill="none" stroke="#D7CEBE" stroke-width="1" />`;
      })
      .join('');

    const axesLines = dimDetails
      .map((_, i) => {
        const [x, y] = pointAt(i, 1);
        return `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="#DFD7C8" stroke-width="1" />`;
      })
      .join('');

    const dataPoints = dimDetails.map((d, i) => pointAt(i, d.score / 100));
    const dataPolyStr = dataPoints
      .map((p) => p.map((n) => n.toFixed(1)).join(','))
      .join(' ');

    const dots = dataPoints
      .map(
        ([x, y]) =>
          `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.2" fill="${accentColor}" stroke="#FAF6EE" stroke-width="1.2" />`
      )
      .join('');

    const labels = dimDetails
      .map((d, i) => {
        const [lx, ly] = pointAt(i, 1.25);
        return `<text x="${lx.toFixed(1)}" y="${(ly + 4).toFixed(1)}" text-anchor="middle" font-size="12" font-family="Songti SC, STSong, Noto Serif SC, serif" font-weight="700" fill="#3E3932">${d.name}</text>`;
      })
      .join('');

    return `
      <svg viewBox="0 0 ${size} ${size}" role="img" aria-label="六维心性雷达图">
        ${gridPolys}
        ${axesLines}
        <polygon points="${dataPolyStr}" fill="${accentColor}" fill-opacity="0.20" stroke="${accentColor}" stroke-width="2" />
        ${dots}
        ${labels}
      </svg>
    `;
  }

  // =========================================================================
  // 6. 原生 Canvas 高清分享海报生成（带扫码二维码，动态自适应高度，中文避头点排版）
  // =========================================================================
  function generateSharePoster(result) {
    const char = result.best.character;
    const shareUrl = getActiveShareUrl();
    const W = 900;
    const serif = '"Songti SC", "STSong", "Noto Serif SC", "SimSun", Georgia, serif';
    const sans = '-apple-system, "PingFang SC", "Microsoft YaHei", sans-serif';
    const accent = char.accentColor || '#9E2A2B';

    // 先创建测量用画布，精确计算各模块高度，彻底杜绝文字重叠或留白失衡
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = 1600;
    const ctx = canvas.getContext('2d');

    const contentW = W - 144;
    const quoteLines = wrapCanvasText(ctx, char.quote, W - 196, `bold 26px ${serif}`);
    const qBoxY = 388;
    const qBoxH = quoteLines.length * 40 + 36;
    const radarBoxH = 260;

    const easterText = `结局：${char.easterEgg.survival} ｜ 最佳同僚：${char.easterEgg.ally}`;
    const traitsLines = wrapCanvasText(ctx, char.traits, contentW, `21px ${sans}`).slice(0, 5);
    const advLines = wrapCanvasText(ctx, char.advantage, contentW, `21px ${sans}`).slice(0, 4);
    const easterLines = wrapCanvasText(ctx, easterText, contentW, `21px ${sans}`).slice(0, 4);

    const secH = (lines) => 42 + lines.length * 33;
    const bodyEndY =
      qBoxY +
      qBoxH +
      28 +
      radarBoxH +
      28 +
      secH(traitsLines) +
      18 +
      secH(advLines) +
      18 +
      secH(easterLines);

    const footerTopY = bodyEndY + 30;
    const footerBoxH = 152;
    const H = footerTopY + footerBoxH + 56;
    canvas.height = H;

    // 1. 宣纸底色与明刻本双层边框
    ctx.fillStyle = '#F5EFE4';
    ctx.fillRect(0, 0, W, H);

    const grad = ctx.createRadialGradient(W * 0.85, H * 0.1, 20, W * 0.85, H * 0.1, 460);
    grad.addColorStop(0, 'rgba(158, 42, 43, 0.07)');
    grad.addColorStop(1, 'rgba(245, 239, 228, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = '#1A1815';
    ctx.lineWidth = 4;
    ctx.strokeRect(28, 28, W - 56, H - 56);

    ctx.strokeStyle = '#A68246';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(40, 40, W - 80, H - 80);

    // 2. 顶部卷首眉标
    ctx.fillStyle = '#6E665B';
    ctx.font = `22px ${serif}`;
    ctx.fillText('《测测你是〈大明王朝1566〉里的谁》', 72, 92);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#9E2A2B';
    ctx.fillText(`灵魂契合度 ${result.best.matchPct}%`, W - 72, 92);
    ctx.textAlign = 'left';

    ctx.strokeStyle = '#D7CEBE';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(72, 114);
    ctx.lineTo(W - 72, 114);
    ctx.stroke();

    // 3. 角色大字名号与朱砂印
    ctx.fillStyle = '#9E2A2B';
    ctx.font = `bold 22px ${serif}`;
    ctx.fillText('司礼监批红 · 灵魂人物判词', 72, 160);

    ctx.fillStyle = '#1A1815';
    ctx.font = `bold 74px ${serif}`;
    ctx.fillText(char.name, 72, 244);

    const nameWidth = ctx.measureText(char.name).width;
    ctx.fillStyle = '#6E665B';
    ctx.font = `26px ${serif}`;
    ctx.fillText(char.courtesy, 72 + nameWidth + 24, 240);

    ctx.fillStyle = accent;
    ctx.font = `bold 30px ${serif}`;
    ctx.fillText(char.title, 72, 294);

    // 右上朱砂印章
    const sealX = W - 168;
    const sealY = 152;
    ctx.save();
    ctx.translate(sealX + 48, sealY + 48);
    ctx.rotate(-0.04);
    ctx.fillStyle = '#9E2A2B';
    ctx.fillRect(-48, -48, 96, 96);
    ctx.strokeStyle = 'rgba(250, 246, 238, 0.55)';
    ctx.lineWidth = 2;
    ctx.strokeRect(-41, -41, 82, 82);
    ctx.fillStyle = '#FAF6EE';
    ctx.font = `bold 34px ${serif}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(char.seal, 0, 2);
    ctx.restore();

    // 4. 判词标签
    let tagX = 72;
    const tagY = 322;
    ctx.font = `22px ${serif}`;
    char.tags.forEach((tag) => {
      const tw = ctx.measureText(tag).width + 32;
      ctx.fillStyle = '#FBF8F2';
      ctx.fillRect(tagX, tagY, tw, 40);
      ctx.strokeStyle = '#C8A971';
      ctx.lineWidth = 1.2;
      ctx.strokeRect(tagX, tagY, tw, 40);
      ctx.fillStyle = '#1A1815';
      ctx.fillText(tag, tagX + 16, tagY + 28);
      tagX += tw + 14;
    });

    // 5. 专属记忆点金句框
    ctx.fillStyle = '#EFE7D7';
    ctx.fillRect(72, qBoxY, contentW, qBoxH);
    ctx.fillStyle = '#9E2A2B';
    ctx.fillRect(72, qBoxY, 6, qBoxH);

    ctx.fillStyle = '#1A1815';
    ctx.font = `bold 26px ${serif}`;
    quoteLines.forEach((line, idx) => {
      ctx.fillText(line, 98, qBoxY + 42 + idx * 40);
    });

    // 6. 六维雷达与维度数值区
    let curY = qBoxY + qBoxH + 28;
    ctx.fillStyle = '#FAF6EE';
    ctx.fillRect(72, curY, contentW, radarBoxH);
    ctx.strokeStyle = '#D7CEBE';
    ctx.lineWidth = 1;
    ctx.strokeRect(72, curY, contentW, radarBoxH);

    const rCx = 215;
    const rCy = curY + radarBoxH / 2 + 4;
    const rMax = 86;
    [0.35, 0.7, 1.0].forEach((lv) => {
      ctx.beginPath();
      result.dimDetails.forEach((_, i) => {
        const ang = -Math.PI / 2 + (i * 2 * Math.PI) / 6;
        const px = rCx + rMax * lv * Math.cos(ang);
        const py = rCy + rMax * lv * Math.sin(ang);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.closePath();
      ctx.strokeStyle = '#D7CEBE';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    ctx.beginPath();
    result.dimDetails.forEach((d, i) => {
      const ang = -Math.PI / 2 + (i * 2 * Math.PI) / 6;
      const px = rCx + rMax * (d.score / 100) * Math.cos(ang);
      const py = rCy + rMax * (d.score / 100) * Math.sin(ang);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.closePath();
    ctx.fillStyle = hexToRgba(accent, 0.22);
    ctx.fill();
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.fillStyle = '#3E3932';
    ctx.font = `bold 20px ${serif}`;
    ctx.textAlign = 'center';
    result.dimDetails.forEach((d, i) => {
      const ang = -Math.PI / 2 + (i * 2 * Math.PI) / 6;
      const lx = rCx + (rMax + 24) * Math.cos(ang);
      const ly = rCy + (rMax + 24) * Math.sin(ang) + 7;
      ctx.fillText(d.name, lx, ly);
    });
    ctx.textAlign = 'left';

    const barStartX = 375;
    const barStartY = curY + 34;
    result.dimDetails.forEach((d, idx) => {
      const by = barStartY + idx * 34;
      ctx.fillStyle = '#3E3932';
      ctx.font = `bold 21px ${serif}`;
      ctx.fillText(d.name, barStartX, by);

      ctx.fillStyle = '#E6DFD2';
      ctx.fillRect(barStartX + 62, by - 15, 300, 12);
      ctx.fillStyle = accent;
      ctx.fillRect(barStartX + 62, by - 15, Math.round(3 * d.score), 12);

      ctx.fillStyle = '#6E665B';
      ctx.font = `20px ${serif}`;
      ctx.fillText(String(d.score), barStartX + 376, by);
    });

    ctx.fillStyle = '#6E665B';
    ctx.font = `19px ${sans}`;
    ctx.fillText(
      `灵魂潜藏副色：${result.runnerUp.character.name}（契合度 ${result.runnerUp.matchPct}%）`,
      barStartX,
      curY + radarBoxH - 18
    );

    // 7. 性格画像与隐藏优势
    curY += radarBoxH + 28;
    curY = drawPreparedSection(ctx, '◆ 性格本色', traitsLines, 72, curY, serif, sans);
    curY += 18;
    curY = drawPreparedSection(ctx, '◆ 处世隐藏优势', advLines, 72, curY, serif, sans);
    curY += 18;
    curY = drawPreparedSection(ctx, '◆ 嘉靖朝生存彩蛋', easterLines, 72, curY, serif, sans);

    // 8. 底部扫码入局底栏（左文案 + 右二维码）
    ctx.fillStyle = '#EFE7D7';
    ctx.fillRect(72, footerTopY, contentW, footerBoxH);
    ctx.strokeStyle = '#C8A971';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(72, footerTopY, contentW, footerBoxH);

    // 左侧引导文案
    ctx.fillStyle = '#1A1815';
    ctx.font = `bold 25px ${serif}`;
    ctx.fillText('扫码测测你是《大明王朝1566》里的谁', 96, footerTopY + 46);

    ctx.fillStyle = '#524B42';
    ctx.font = `20px ${sans}`;
    ctx.fillText('30道大白话处世情境题 · 零门槛照见你的职场与性格底色', 96, footerTopY + 84);

    // 朱砂小印签
    ctx.fillStyle = 'rgba(158, 42, 43, 0.08)';
    ctx.fillRect(96, footerTopY + 102, 268, 32);
    ctx.strokeStyle = 'rgba(158, 42, 43, 0.4)';
    ctx.lineWidth = 1;
    ctx.strokeRect(96, footerTopY + 102, 268, 32);
    ctx.fillStyle = '#9E2A2B';
    ctx.font = `bold 18px ${serif}`;
    ctx.fillText('长按识别右侧二维码 · 立即入局', 110, footerTopY + 124);

    // 右侧高清二维码框
    const qrSize = 124;
    const qrX = W - 72 - qrSize - 16;
    const qrY = footerTopY + Math.round((footerBoxH - qrSize) / 2);
    if (typeof MiniQR !== 'undefined') {
      MiniQR.drawQROnCanvas(ctx, shareUrl, qrX, qrY, qrSize, '#1A1815', '#FFFFFF');
    }
    ctx.strokeStyle = '#A68246';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(qrX, qrY, qrSize, qrSize);

    return canvas.toDataURL('image/png');
  }

  function drawPreparedSection(ctx, title, lines, x, y, serif, sans) {
    ctx.fillStyle = '#1A1815';
    ctx.font = `bold 24px ${serif}`;
    ctx.fillText(title, x, y + 24);

    ctx.fillStyle = '#3E3932';
    ctx.font = `21px ${sans}`;
    lines.forEach((line, idx) => {
      ctx.fillText(line, x, y + 58 + idx * 33);
    });
    return y + 42 + lines.length * 33;
  }

  // 中文避头点标点集合：绝不出现在新行行首
  const NO_LINE_START = new Set([
    '，', '。', '、', '；', '：', '！', '？', '）', '》', '”', '’', '】', '〉', '%', ',', '.', ':', ';', '!', '?'
  ]);

  function wrapCanvasText(ctx, text, maxWidth, fontStr) {
    ctx.font = fontStr;
    const chars = Array.from(text);
    const lines = [];
    let current = '';

    for (let i = 0; i < chars.length; i++) {
      const ch = chars[i];
      const test = current + ch;
      if (ctx.measureText(test).width > maxWidth && current.length > 0) {
        if (NO_LINE_START.has(ch)) {
          // 将上一行末尾的一个字连同当前标点一起移到下一行，避免标点占行首
          const currentArr = Array.from(current);
          const carry = currentArr.pop() || '';
          lines.push(currentArr.join(''));
          current = carry + ch;
        } else {
          lines.push(current);
          current = ch;
        }
      } else {
        current = test;
      }
    }
    if (current) lines.push(current);
    return lines;
  }

  function hexToRgba(hex, alpha) {
    const clean = hex.replace('#', '');
    const r = parseInt(clean.substring(0, 2), 16) || 158;
    const g = parseInt(clean.substring(2, 4), 16) || 42;
    const b = parseInt(clean.substring(4, 6), 16) || 43;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  // =========================================================================
  // 7. 分享、下载海报与交互事件绑定
  // =========================================================================
  function handleSavePoster() {
    if (!state.lastResult) return;
    const dataUrl = generateSharePoster(state.lastResult);
    const charName = state.lastResult.best.character.name;

    // 桌面端触发自动下载，同时打开高清预览弹窗方便手机长按保存
    try {
      const link = document.createElement('a');
      link.download = `大明王朝1566人格测试_${charName}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (_) {
      // ignore
    }

    els.posterModalImg.src = dataUrl;
    els.posterModal.classList.add('open');
    showToast('已生成高清判词海报，可保存或长按分享');
  }

  function handleCopyShareText() {
    if (!state.lastResult) return;
    const char = state.lastResult.best.character;
    const pct = state.lastResult.best.matchPct;
    const runner = state.lastResult.runnerUp.character.name;

    const shareText = [
      `📜 我在《测测你是〈大明王朝1566〉里的谁》测出的灵魂人物是：【${char.name}】（契合度 ${pct}%）`,
      `🏷️ 人物判词：${char.title}｜${char.tags.join(' · ')}`,
      `💬 专属金句：${char.quote}`,
      `🏮 嘉靖朝生存结局：${char.easterEgg.survival}`,
      `🌗 灵魂潜藏副色：${runner}`,
      `—— 三十道现代处世情境，不考明史，只照人心。`
    ].join('\n');

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(shareText)
        .then(() => showToast('专属判词文案已复制，快去小红书/朋友圈分享吧'))
        .catch(() => fallbackCopy(shareText));
    } else {
      fallbackCopy(shareText);
    }
  }

  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      showToast('专属判词文案已复制，快去分享吧');
    } catch (_) {
      showToast('复制失败，请直接截图保存结果卡片');
    }
    document.body.removeChild(ta);
  }

  let toastTimer = null;
  function showToast(msg) {
    els.toastMsg.textContent = msg;
    els.toastMsg.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      els.toastMsg.classList.remove('show');
    }, 2400);
  }

  function bindEvents() {
    els.btnStart.addEventListener('click', startNewQuiz);
    els.btnResume.addEventListener('click', resumeSavedQuiz);

    els.optionsList.addEventListener('click', (e) => {
      const btn = e.target.closest('.option-btn');
      if (!btn) return;
      const idx = Number(btn.getAttribute('data-idx'));
      if (!Number.isNaN(idx)) {
        handleSelectOption(idx);
      }
    });

    els.btnPrev.addEventListener('click', goPrevQuestion);
    els.btnNext.addEventListener('click', goNextQuestion);

    els.btnSavePoster.addEventListener('click', handleSavePoster);
    els.btnCopyText.addEventListener('click', handleCopyShareText);

    if (els.btnUpdateQr && els.qrUrlInput) {
      const applyCustomUrl = () => {
        const val = els.qrUrlInput.value.trim();
        state.customShareUrl = val;
        try {
          if (val) localStorage.setItem(SHARE_URL_KEY, val);
          else localStorage.removeItem(SHARE_URL_KEY);
        } catch (_) {
          // ignore
        }
        refreshQRCodeUI();
        showToast('海报二维码链接已更新，点击上方按钮即可重新导出海报');
      };
      els.btnUpdateQr.addEventListener('click', applyCustomUrl);
      els.qrUrlInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          applyCustomUrl();
        }
      });
    }

    els.btnCleanShot.addEventListener('click', () => {
      document.body.classList.add('clean-shot-mode');
    });

    document.addEventListener('click', (e) => {
      if (
        document.body.classList.contains('clean-shot-mode') &&
        !e.target.closest('#btn-clean-shot')
      ) {
        document.body.classList.remove('clean-shot-mode');
      }
    });

    els.btnRestart.addEventListener('click', () => {
      document.body.classList.remove('clean-shot-mode');
      startNewQuiz();
    });

    els.posterModalClose.addEventListener('click', () => {
      els.posterModal.classList.remove('open');
    });

    els.posterModal.addEventListener('click', (e) => {
      if (e.target === els.posterModal) {
        els.posterModal.classList.remove('open');
      }
    });

    // 键盘快捷作答支持 (A/B/C/D, 1/2/3/4, 左右方向键)
    document.addEventListener('keydown', (e) => {
      if (els.posterModal.classList.contains('open')) {
        if (e.key === 'Escape') els.posterModal.classList.remove('open');
        return;
      }
      if (!els.viewQuiz.classList.contains('active')) return;

      const keyUpper = e.key.toUpperCase();
      const keyMap = { A: 0, B: 1, C: 2, D: 3, '1': 0, '2': 1, '3': 2, '4': 3 };
      if (Object.prototype.hasOwnProperty.call(keyMap, keyUpper)) {
        e.preventDefault();
        handleSelectOption(keyMap[keyUpper]);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrevQuestion();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNextQuestion();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
