/**
 * 《测测你是〈大明王朝1566〉里的谁》核心配置、大白话题库与人物数据库
 */

const QUIZ_CONFIG = {
  // 本地打开或未识别到公网域名时，默认使用的线上公开测试链接
  defaultShareUrl: 'https://vkvkvickii-art.github.io/ming1566-quiz/'
};

const DIMENSIONS = [
  { key: 'zhidao',   name: '执道', fullName: '执道守正', lowLabel: '灵活变通', highLabel: '认死理讲原则', desc: '面对潜规则和妥协时，死守底线的程度' },
  { key: 'yuju',     name: '驭局', fullName: '全局操盘', lowLabel: '管好自己', highLabel: '掌控全局', desc: '在复杂局面里统筹安排、调动别人的倾向' },
  { key: 'cangfeng', name: '藏锋', fullName: '藏锋隐忍', lowLabel: '有啥说啥', highLabel: '沉得住气', desc: '把真实情绪和底牌藏在心里的克制力' },
  { key: 'renshi',   name: '任事', fullName: '实干扛事', lowLabel: '及时抽身', highLabel: '迎难扛事', desc: '遇到麻烦烂摊子时，主动顶上去解决的意愿' },
  { key: 'wenqing',  name: '温情', fullName: '悲悯人情', lowLabel: '冷静算账', highLabel: '心软重情义', desc: '做决定时有多在乎别人的难处和感情' },
  { key: 'fenggu',   name: '风骨', fullName: '清雅风骨', lowLabel: '务实接地气', highLabel: '追求精神自由', desc: '比起赚钱升职，有多看重个人审美和内心清净' }
];

const QUESTIONS = [
  // 第一部分 · 日常习惯
  {
    id: 1,
    chapter: '第一部分 · 日常状态',
    question: '周末终于有一天不用回任何工作消息，你最想怎么过？',
    options: [
      { label: 'A', text: '关起门自己待着，听歌、看书、喝茶或者发呆，谁也别找我', scores: { cangfeng: 2, renshi: -2, fenggu: 3, yuju: -1 } },
      { label: 'B', text: '喊两三个最熟的朋友出来吃顿好的，聊聊天吐吐槽', scores: { wenqing: 3, cangfeng: -1, fenggu: -1, yuju: -1 } },
      { label: 'C', text: '把家里收拾利索，顺便把下周要办的事理个清单，心里踏实', scores: { yuju: 2, renshi: 2, wenqing: -1, fenggu: -1 } },
      { label: 'D', text: '出门跑步、打球或者徒步，痛痛快快出顿汗把脑子清空', scores: { zhidao: 2, cangfeng: -2, renshi: 2 } }
    ]
  },
  {
    id: 2,
    chapter: '第一部分 · 日常状态',
    question: '一群人聚餐点菜，大家都在客气说“随便，看你们”，你一般怎么弄？',
    options: [
      { label: 'A', text: '先不吭声听大家聊一圈，最后拍板点一两道镇场子的硬菜', scores: { yuju: 3, cangfeng: 2, wenqing: -2 } },
      { label: 'B', text: '主动接过菜单，问清楚谁不吃辣、谁有忌口，把每个人都照顾到', scores: { wenqing: 3, renshi: 2, zhidao: -1 } },
      { label: 'C', text: '直接点两个自己想吃的菜，懒得来回推让耽误工夫', scores: { zhidao: 2, cangfeng: -3, fenggu: 1 } },
      { label: 'D', text: '看谁请客或者谁辈分高就顺着谁夸两句，自己绝不抢风头', scores: { zhidao: -2, cangfeng: 2, renshi: -2 } }
    ]
  },
  {
    id: 3,
    chapter: '第一部分 · 日常状态',
    question: '平时看剧或者看电影，哪种角色最让你上头？',
    options: [
      { label: 'A', text: '认准一个理就死磕到底，哪怕得罪全世界也不低头的硬骨头', scores: { zhidao: 3, cangfeng: -2, renshi: 2 } },
      { label: 'B', text: '自己受尽夹板气，但拼了命也要把大家护在身后的老大哥/老大姐', scores: { renshi: 3, wenqing: 2, zhidao: -1 } },
      { label: 'C', text: '脸上永远笑眯眯看不出深浅，其实背后每一步都算准了的高手', scores: { yuju: 3, cangfeng: 3, wenqing: -2 } },
      { label: 'D', text: '有才华又有品味，虽然混在圈子里但早就看透名利的明白人', scores: { fenggu: 3, renshi: -2, yuju: -2 } }
    ]
  },
  {
    id: 4,
    chapter: '第一部分 · 日常状态',
    question: '你平时的办公桌或者房间桌面，一般是什么样子的？',
    options: [
      { label: 'A', text: '干干净净啥多余东西都不放，外人根本看不出我的喜好', scores: { cangfeng: 2, zhidao: 1, wenqing: -2 } },
      { label: 'B', text: '杯子、摆件、灯光都得挑好看有质感的，乱一点没事但不能丑', scores: { fenggu: 3, zhidao: 1, renshi: -1 } },
      { label: 'C', text: '堆着好几摊正在干的活，别人看着乱，但我自己闭着眼都能摸到', scores: { renshi: 3, yuju: 1, fenggu: -2 } },
      { label: 'D', text: '常备零食、纸巾、充电线，同事朋友缺啥都能来我这顺手拿', scores: { wenqing: 3, yuju: -1, zhidao: -1 } }
    ]
  },
  {
    id: 5,
    chapter: '第一部分 · 日常状态',
    question: '半夜翻来覆去睡不着的时候，你脑子里最常想的是啥？',
    options: [
      { label: 'A', text: '想起某件特别不公平、不讲理的事，越想越替人窝火', scores: { zhidao: 3, cangfeng: -2, wenqing: 1 } },
      { label: 'B', text: '盘算未来一两年怎么升职、转型或者搞钱，下一步棋怎么走', scores: { yuju: 3, cangfeng: 2, fenggu: -1 } },
      { label: 'C', text: '琢磨白天哪句话是不是说重了，或者手头的事还有啥漏洞没补', scores: { cangfeng: 2, wenqing: 2, zhidao: -1 } },
      { label: 'D', text: '感叹天天忙这些破事有啥意思，啥时候才能彻底躺平去过清净日子', scores: { fenggu: 3, renshi: -3, yuju: -2 } }
    ]
  },

  // 第二部分 · 工作风格
  {
    id: 6,
    chapter: '第二部分 · 工作风格',
    question: '老板突然甩给你一个时间紧、没预算、别的部门还不配合的烂摊子，你第一反应是？',
    options: [
      { label: 'A', text: '咬牙先接过来，一边找老板要缓冲，一边自己加班加点硬啃下来', scores: { renshi: 3, wenqing: 2, yuju: 1 } },
      { label: 'B', text: '先把丑话说前头、留好文字记录，分清哪部分归我管，绝不白背黑锅', scores: { zhidao: -2, renshi: -2, wenqing: -2, cangfeng: 1 } },
      { label: 'C', text: '干脆借这个项目把各方利益绑一块儿，顺手树立自己的话语权', scores: { yuju: 3, renshi: 2, wenqing: -1 } },
      { label: 'D', text: '直接跟老板挑明这活不合常理，不给够资源和权限没法干', scores: { zhidao: 3, cangfeng: -2, yuju: -1 } }
    ]
  },
  {
    id: 7,
    chapter: '第二部分 · 工作风格',
    question: '开大会时，大领导刚定下来的新方案明显有大坑，但全场都在点头附和，你会？',
    options: [
      { label: 'A', text: '直接举手把问题摆出来，现在不讲清楚，后面爆雷大家更惨', scores: { zhidao: 3, cangfeng: -3, renshi: 1 } },
      { label: 'B', text: '会上不吭声给足领导面子，散会后私下找他提个醒、递个备选方案', scores: { cangfeng: 3, renshi: 2, wenqing: 1 } },
      { label: 'C', text: '看破不说破，领导自己拍的板，我照做留好底、把自己摘干净就行', scores: { zhidao: -3, cangfeng: 2, renshi: -2 } },
      { label: 'D', text: '装作请教执行细节，顺嘴问两个关键问题，引导领导自己发现不对劲', scores: { yuju: 2, cangfeng: 2, zhidao: -1 } }
    ]
  },
  {
    id: 8,
    chapter: '第二部分 · 工作风格',
    question: '组里有个同事总爱把累活推给你，到领导面前邀功却冲在第一个，你会怎么办？',
    options: [
      { label: 'A', text: '直接把聊天记录和分工甩出来硬刚，我的功劳别想抢，不是我的活不干', scores: { zhidao: 2, cangfeng: -3, wenqing: -1 } },
      { label: 'B', text: '表面上不撕破脸，暗地里留好证据，在关键汇报上让领导看清到底谁在干活', scores: { cangfeng: 3, yuju: 2, zhidao: -1 } },
      { label: 'C', text: '算了，只要项目别黄就行，他爱抢那点虚名就让他拿去吧', scores: { renshi: 2, wenqing: 2, fenggu: 1, yuju: 1 } },
      { label: 'D', text: '懒得跟这种人扯皮内耗，找机会换个自己单干、清静点的岗位', scores: { fenggu: 3, yuju: -3, renshi: -2 } }
    ]
  },
  {
    id: 9,
    chapter: '第二部分 · 工作风格',
    question: '如果让你当主管带一个十来人的小团队，你最像哪种领导？',
    options: [
      { label: 'A', text: '抓大放小，让不同性格的下属互相搭档也互相制衡，自己坐镇把关', scores: { yuju: 3, cangfeng: 3, wenqing: -2, renshi: -1 } },
      { label: 'B', text: '护犊子型，外面的压力和黑锅我来顶，大家跟着我踏踏实实干活就行', scores: { renshi: 3, wenqing: 3, yuju: 1 } },
      { label: 'C', text: '丑话说前头、按制度办事，行就行不行就换人，少拿私交讲人情', scores: { yuju: 2, renshi: 2, wenqing: -3, zhidao: 1 } },
      { label: 'D', text: '和气管家型，平时多关心大家累不累、家里顺不顺，靠人情味把人拢住', scores: { wenqing: 3, cangfeng: 1, zhidao: -1, yuju: 1 } }
    ]
  },
  {
    id: 10,
    chapter: '第二部分 · 工作风格',
    question: '年底写年终总结PPT向领导汇报时，你心里是怎么想、怎么干的？',
    options: [
      { label: 'A', text: '摸准领导今年最想听什么词，顺着他的思路包装，句句挠在痒处', scores: { zhidao: -3, cangfeng: 2, yuju: 2, fenggu: -2 } },
      { label: 'B', text: '干了一分活就写一分话，有啥问题也实话实说，最烦凑字数吹牛', scores: { zhidao: 3, cangfeng: -2, fenggu: 1 } },
      { label: 'C', text: '排版审美和逻辑必须漂亮讲究，绝不能做得土里土气丢份儿', scores: { fenggu: 2, yuju: 1, renshi: -1 } },
      { label: 'D', text: '多把帮忙的同事都点名夸一遍，功劳大家分，花花轿子众人抬', scores: { wenqing: 3, cangfeng: 1, zhidao: -1 } }
    ]
  },

  // 第三部分 · 人际社交
  {
    id: 11,
    chapter: '第三部分 · 人际交往',
    question: '刚进一家人际关系很复杂的新公司，前三个月你会怎么处？',
    options: [
      { label: 'A', text: '多看少说，没摸清谁跟谁是一伙的之前，绝不随便表态站队', scores: { cangfeng: 3, yuju: 2, wenqing: -1 } },
      { label: 'B', text: '见人三分笑、嘴甜勤快点，跟谁都客客气气混个脸熟，谁也不得罪', scores: { zhidao: -2, wenqing: 2, cangfeng: 1, fenggu: -1 } },
      { label: 'C', text: '不管那些弯弯绕绕，闷头把手里活干漂亮，靠本事站稳脚跟', scores: { zhidao: 2, renshi: 2, yuju: -2 } },
      { label: 'D', text: '看眼缘交一两个聊得来的朋友就行，其他人保持礼貌距离', scores: { fenggu: 2, wenqing: 2, yuju: -2, cangfeng: -1 } }
    ]
  },
  {
    id: 12,
    chapter: '第三部分 · 人际交往',
    question: '以前很照顾你的老领导突然犯错被边缘化了，周围人都躲着他，你会？',
    options: [
      { label: 'A', text: '工作场合注意避嫌不惹麻烦，私底下悄悄帮他办点实事渡难关', scores: { wenqing: 2, cangfeng: 3, zhidao: -1 } },
      { label: 'B', text: '该看望看望、该替他说话就说话，做人不能这么势利眼没良心', scores: { wenqing: 3, zhidao: 2, cangfeng: -2 } },
      { label: 'C', text: '赶紧划清界限少来往，成年人得现实点，不能把自己的饭碗搭进去', scores: { wenqing: -3, zhidao: -2, yuju: 1 } },
      { label: 'D', text: '心里挺不是滋味，约他出来喝顿小酒聊聊人生，劝他看开点歇一歇', scores: { fenggu: 3, wenqing: 2, renshi: -2 } }
    ]
  },
  {
    id: 13,
    chapter: '第三部分 · 人际交往',
    question: '突然听说有人在背后嚼你舌根、说你坏话，你一般会是什么反应？',
    options: [
      { label: 'A', text: '脸上跟没事人一样甚至对他更客气，心里默默记下，以后总有机会算账', scores: { cangfeng: 3, wenqing: -2, yuju: 2 } },
      { label: 'B', text: '直接找上门当面问清楚，有话当面锣对面鼓地说，别在背后搞小动作', scores: { zhidao: 3, cangfeng: -3 } },
      { label: 'C', text: '先想想是不是自己最近太高调惹人眼红了，主动收敛低调一点', scores: { cangfeng: 2, wenqing: 1, yuju: -1, zhidao: -1 } },
      { label: 'D', text: '翻个白眼懒得搭理，根本不是一路人，犯不着为他坏自己心情', scores: { fenggu: 3, renshi: -1, yuju: -1 } }
    ]
  },
  {
    id: 14,
    chapter: '第三部分 · 人际交往',
    question: '两个关系都不错的朋友吵翻了，两边都拉着你评理让你站队，你会？',
    options: [
      { label: 'A', text: '帮理不帮亲，这件事谁错了我就直说谁不对，得罪人也认了', scores: { zhidao: 3, cangfeng: -2, wenqing: -1 } },
      { label: 'B', text: '两边当和事佬顺毛哄，给双方都找个台阶下，尽量劝和别伤感情', scores: { wenqing: 3, cangfeng: 1, zhidao: -1 } },
      { label: 'C', text: '不纠结谁对谁错，直接帮他们把核心利益分歧理清楚，拿个解决方案', scores: { yuju: 3, renshi: 1, wenqing: -1 } },
      { label: 'D', text: '借口自己最近太忙躲远点，清官难断家务事，让他们自己解决', scores: { renshi: -3, fenggu: 1, zhidao: -1 } }
    ]
  },
  {
    id: 15,
    chapter: '第三部分 · 人际交往',
    question: '平时一起共事，你打心底里最烦哪种人？',
    options: [
      { label: 'A', text: '嘴上天天喊口号讲大道理，真到干活担责的时候跑得比谁都快的人', scores: { renshi: 3, fenggu: -1, zhidao: 1 } },
      { label: 'B', text: '没眼力见、说话不过脑子，随时可能把大家一块儿坑死的人', scores: { cangfeng: 3, zhidao: -2, yuju: 1 } },
      { label: 'C', text: '满脑子只有利益算计、毫无人情味，把身边人都当垫脚石的人', scores: { wenqing: 3, yuju: -1, fenggu: 1 } },
      { label: 'D', text: '一点骨气和主见都没有，谁权大就舔谁的墙头草', scores: { zhidao: 3, fenggu: 2, cangfeng: -1 } }
    ]
  },

  // 第四部分 · 现实取舍
  {
    id: 16,
    chapter: '第四部分 · 利益取舍',
    question: '摆在你面前两个岗位：一个是钱多权大但天天神仙打架的核心岗，一个是钱少点但清闲安稳的边缘岗，你选哪个？',
    options: [
      { label: 'A', text: '选核心岗！富贵险中求，手里有实权才能干成大事', scores: { yuju: 3, renshi: 3, fenggu: -2 } },
      { label: 'B', text: '选清闲边缘岗，少赚点无所谓，留出时间搞自己的爱好、开心生活最重要', scores: { fenggu: 3, renshi: -3, yuju: -3 } },
      { label: 'C', text: '看哪个岗干的活真正有用、能帮到实处，只要事有意义累点也去', scores: { zhidao: 2, wenqing: 2, renshi: 2 } },
      { label: 'D', text: '先打听清楚核心岗的直属靠山稳不稳，有七成把握再上，不然先不动', scores: { cangfeng: 3, zhidao: -2, yuju: 1 } }
    ]
  },
  {
    id: 17,
    chapter: '第四部分 · 利益取舍',
    question: '你负责的活动预算突然被砍了三分之一，但老板要求效果不能降，你会先砍哪块？',
    options: [
      { label: 'A', text: '先保住底下干活兄弟们的辛苦费，把花里胡哨的排场和包装全砍掉', scores: { wenqing: 3, zhidao: 2, fenggu: -1 } },
      { label: 'B', text: '重点保住老板看得见的那几个面子亮点，其他看不见的地方凑合过关', scores: { zhidao: -2, yuju: 2, wenqing: -2, fenggu: -1 } },
      { label: 'C', text: '自己到处刷脸找赞助、借资源东拼西凑，硬着头皮把场子圆下来', scores: { renshi: 3, yuju: 2, zhidao: -1 } },
      { label: 'D', text: '拿着账单找老板硬谈：给多少钱办多少事，砍了预算就必须降指标', scores: { zhidao: 3, cangfeng: -2, renshi: -1 } }
    ]
  },
  {
    id: 18,
    chapter: '第四部分 · 利益取舍',
    question: '只要在饭局上顺着甲方捧几句违心的客套话，就能拿到团队急需的预算，你会？',
    options: [
      { label: 'A', text: '张嘴就夸，还能夸得特自然，好听话又不花钱，把事办成才是硬道理', scores: { zhidao: -3, cangfeng: 2, fenggu: -2 } },
      { label: 'B', text: '心里挺别扭，但为了团队大家的饭碗还是会去捧场，散场后自己叹口气', scores: { renshi: 2, wenqing: 2, fenggu: 2, zhidao: -1 } },
      { label: 'C', text: '说不出口，宁可加班把方案改十遍靠实力赢，也绝不去低三下四拍马屁', scores: { zhidao: 3, fenggu: 2, cangfeng: -2 } },
      { label: 'D', text: '我自己不出面，派手下嘴甜会来事的人去陪酒，既拿了钱又保住我的清高', scores: { yuju: 3, cangfeng: 2, renshi: -2, wenqing: -1 } }
    ]
  },
  {
    id: 19,
    chapter: '第四部分 · 利益取舍',
    question: '假如你手里握着一个能镇住全场的独家资源或关键内幕，你会怎么用？',
    options: [
      { label: 'A', text: '藏在手里先不亮出来，让大家都有点忌惮我，留着关键时刻保命或翻盘', scores: { cangfeng: 3, yuju: 2, wenqing: -2 } },
      { label: 'B', text: '挑最关键的时机果断甩出来，用它换取最大的话语权和晋升筹码', scores: { yuju: 3, renshi: 2, fenggu: -1 } },
      { label: 'C', text: '只要眼下能帮大家救急解围，二话不说直接拿出来一起用', scores: { wenqing: 3, renshi: 2, cangfeng: -2 } },
      { label: 'D', text: '觉得拿在手里是个烫手山芋，赶紧按规矩上报交差，不想卷进是非里', scores: { renshi: -2, yuju: -2, zhidao: 1, fenggu: 1 } }
    ]
  },
  {
    id: 20,
    chapter: '第四部分 · 利益取舍',
    question: '在“多赚钱得实惠”和“好名声要体面”之间，你心里真实想法更偏向哪边？',
    options: [
      { label: 'A', text: '个人名声和体面最重要，钱少赚点没事，绝不能留下让人戳脊梁骨的把柄', scores: { fenggu: 2, renshi: -2, wenqing: -1, zhidao: 1 } },
      { label: 'B', text: '实惠到手才最实在，面子值几个钱？自己和家人过得滋润比啥都强', scores: { fenggu: -3, zhidao: -2, renshi: 2 } },
      { label: 'C', text: '只要摸着良心干的是正事，就算被人误解挨骂也无所谓', scores: { zhidao: 3, renshi: 3, wenqing: 2 } },
      { label: 'D', text: '钱和虚名我都不太在乎，别来管我、让我活得自由痛快就行', scores: { fenggu: 3, yuju: -3, renshi: -2 } }
    ]
  },

  // 第五部分 · 压力危机
  {
    id: 21,
    chapter: '第五部分 · 抗压反应',
    question: '工作上突然出了大篓子，眼看黑锅就要甩到你头上，其实你只是跟着执行的，这时候你会？',
    options: [
      { label: 'A', text: '马上把所有聊天记录、邮件时间线整理出来当场对质，这锅我绝对不背', scores: { zhidao: 3, cangfeng: -1, renshi: 2 } },
      { label: 'B', text: '赶紧请病假或者退到二线避风头，先从暴风眼摘出来保住自己再说', scores: { zhidao: -3, cangfeng: 3, renshi: -2, fenggu: -2 } },
      { label: 'C', text: '先冲上去把窟窿补好止损，责任自己多担一点，保住手底下干活的新人', scores: { renshi: 3, wenqing: 3, yuju: 1 } },
      { label: 'D', text: '冷静看看上面追责到底想敲打谁，顺水推舟把祸水引开化解危机', scores: { yuju: 3, cangfeng: 2, wenqing: -3 } }
    ]
  },
  {
    id: 22,
    chapter: '第五部分 · 抗压反应',
    question: '连着加班忙了一个月，整个人快被榨干崩溃的时候，你一般怎么缓过来？',
    options: [
      { label: 'A', text: '去听场音乐会、看个展或者找个山清水秀的地方待着，换换脑子充充电', scores: { fenggu: 3, renshi: -1, wenqing: 1 } },
      { label: 'B', text: '再咬牙死扛几天把事彻底干完，事情没落地之前让我歇也歇不踏实', scores: { renshi: 3, zhidao: 2, fenggu: -1 } },
      { label: 'C', text: '赶紧装弱喊累，把手里的活分出去一点，给自己留口气，不能真累垮了', scores: { cangfeng: 2, renshi: -2, zhidao: -1 } },
      { label: 'D', text: '找对象、家人或者死党吃顿火锅大吐苦水，有人陪着骂两句立马满血复活', scores: { wenqing: 3, cangfeng: -2, yuju: -1 } }
    ]
  },
  {
    id: 23,
    chapter: '第五部分 · 抗压反应',
    question: '你辛辛苦苦忙活了大半年的项目，因为公司大方向调整说停就停、全白干了，你会？',
    options: [
      { label: 'A', text: '脸上淡定接受，转身赶紧清点手里攒下的人脉和经验，准备押注下一个风口', scores: { yuju: 3, cangfeng: 3, wenqing: -2 } },
      { label: 'B', text: '彻底看开了，打工人折腾来折腾去都是替别人忙活，以后再也不这么拼命了', scores: { fenggu: 3, renshi: -3, yuju: -2 } },
      { label: 'C', text: '第一时间先帮跟着自己干的组员找好退路和转岗去处，不能亏待大家', scores: { wenqing: 3, renshi: 2, yuju: 1 } },
      { label: 'D', text: '只要我觉得这事本身是对的就不服输，换个地方或者换个机会早晚重头再来', scores: { zhidao: 3, renshi: 3, cangfeng: -1 } }
    ]
  },
  {
    id: 24,
    chapter: '第五部分 · 抗压反应',
    question: '遇到一个脾气特别臭的领导或客户，当着很多人的面冲你发飙拍桌子，你会？',
    options: [
      { label: 'A', text: '先低头认错顺着他把火消了，等他冷静下来再慢悠悠按我的节奏把事办了', scores: { cangfeng: 3, zhidao: -3, fenggu: -2 } },
      { label: 'B', text: '站直了不卑不亢回话：工作问题可以改，但拍桌子骂人这一套我不受', scores: { zhidao: 3, fenggu: 2, cangfeng: -2 } },
      { label: 'C', text: '听出他借题发挥背后真正在急什么，递句关键话帮他把焦虑解决了', scores: { yuju: 2, cangfeng: 2, wenqing: 1 } },
      { label: 'D', text: '表面上礼貌敷衍过去，回工位就开始改简历：这破地方不待也罢', scores: { fenggu: 2, renshi: -2, yuju: -1 } }
    ]
  },
  {
    id: 25,
    chapter: '第五部分 · 抗压反应',
    question: '在工作没啥起色、大环境也不好的低谷期，你最擅长怎么熬过去？',
    options: [
      { label: 'A', text: '沉住气猫着不动，悄悄攒钱攒资源，机会没出来之前绝不瞎折腾', scores: { cangfeng: 3, yuju: 3, wenqing: -1 } },
      { label: 'B', text: '过好眼前的每一天，把手里小事做好、把家人照顾好，别的顺其自然', scores: { wenqing: 3, renshi: 2, yuju: -2 } },
      { label: 'C', text: '正好趁清闲学点自己喜欢的手艺、多读点书，把自己的小世界经营丰富', scores: { fenggu: 3, yuju: -2, renshi: -1 } },
      { label: 'D', text: '坐不住，主动去跑一线找新路子，干等着不如自己撞开一条缝', scores: { renshi: 3, zhidao: 2, cangfeng: -2 } }
    ]
  },

  // 第六部分 · 底线价值观
  {
    id: 26,
    chapter: '第六部分 · 底线原则',
    question: '行业里有个“同行都在偷偷干、不干就少赚钱，但确实坑普通消费者”的潜规则，你会？',
    options: [
      { label: 'A', text: '坚决不碰，甚至想把这黑幕曝光出来，就算被同行排挤也不怕', scores: { zhidao: 3, wenqing: 2, cangfeng: -3 } },
      { label: 'B', text: '我自己肯定不干这种缺德事，但也不去管别人怎么搞，管好自己就行', scores: { zhidao: 1, fenggu: 3, yuju: -2, renshi: -1 } },
      { label: 'C', text: '在公司允许的范围内尽量给顾客多留点实惠，能少坑一点是一点', scores: { wenqing: 3, cangfeng: 2, renshi: 1, zhidao: -1 } },
      { label: 'D', text: '大家都这么玩，我清高就得饿死，先跟着活下来坐到高位再去改规矩', scores: { yuju: 3, zhidao: -3, wenqing: -2, fenggu: -1 } }
    ]
  },
  {
    id: 27,
    chapter: '第六部分 · 底线原则',
    question: '老熟人提着贵重礼物上门，求你在审批或规定上“睁一只眼闭一只眼”放个水，你会？',
    options: [
      { label: 'A', text: '东西当场退回去、一口回绝，把红线讲死，省得以后大家都进去', scores: { zhidao: 3, cangfeng: -2, wenqing: -1 } },
      { label: 'B', text: '好茶好烟招待着，但拿“上面查得严、系统锁死了”当借口，笑呵呵把事推掉', scores: { cangfeng: 2, zhidao: -1, renshi: -2, wenqing: 1 } },
      { label: 'C', text: '礼绝对不收，但如果他确实遇到难处了，在合规范围内帮他另想别的办法', scores: { wenqing: 3, zhidao: 2, renshi: 2 } },
      { label: 'D', text: '掂量一下风险大不大、这人以后用不用得上，没啥后患就顺水推舟卖个人情', scores: { zhidao: -3, cangfeng: 2, fenggu: -2, yuju: 1 } }
    ]
  },
  {
    id: 28,
    chapter: '第六部分 · 底线原则',
    question: '你觉得一个人真正活明白了、成熟了，最明显的表现是什么？',
    options: [
      { label: 'A', text: '顺风顺水时懂得留后路，得理也能饶人，把身段放软、把人情看透', scores: { cangfeng: 3, wenqing: 2, zhidao: -1 } },
      { label: 'B', text: '见识过社会的复杂和黑暗之后，心里那点正义感和热乎气还没丢', scores: { zhidao: 3, wenqing: 2, cangfeng: -1 } },
      { label: 'C', text: '情绪稳如老狗，不管多乱的局都能看清利益牌面，拿得起放得下', scores: { yuju: 3, cangfeng: 2, wenqing: -3 } },
      { label: 'D', text: '不再跟别人比房比车比职位，关起门来能把自己的精神世界过舒服', scores: { fenggu: 3, yuju: -2, renshi: -2 } }
    ]
  },
  {
    id: 29,
    chapter: '第六部分 · 底线原则',
    question: '等以后老了退休回头看这辈子，你最希望别人提起你时怎么评价？',
    options: [
      { label: 'A', text: '“这人是个狠角色，当年带着大家打下好大一片江山、改写了行业规矩”', scores: { yuju: 3, renshi: 3, fenggu: -1 } },
      { label: 'B', text: '“这人太不容易了，扛了最重的担子、帮了那么多人，一辈子对得起良心”', scores: { renshi: 3, wenqing: 3, zhidao: 1 } },
      { label: 'C', text: '“这人深不可测，一辈子没吃过亏，什么大风大浪都在他手心里攥着”', scores: { cangfeng: 3, yuju: 3, wenqing: -3, renshi: -1 } },
      { label: 'D', text: '“这人活得真潇洒干净，有才华有骨气，一辈子没向谁低过头”', scores: { fenggu: 3, zhidao: 2, yuju: -3 } }
    ]
  },
  {
    id: 30,
    chapter: '第六部分 · 底线原则',
    question: '如果现在中了大奖实现财富自由，彻底不用再看任何人脸色，你最想干嘛？',
    options: [
      { label: 'A', text: '在幕后搞投资当甩手大老板，平时深居简出，大方向我自己拍板就行', scores: { yuju: 2, cangfeng: 3, fenggu: 2, wenqing: -3, renshi: -2 } },
      { label: 'B', text: '找个风景好的小地方住下，弄个院子喝茶弹琴看书，只跟一两个知己来往', scores: { fenggu: 3, wenqing: 2, yuju: -3, renshi: -3 } },
      { label: 'C', text: '就在老地方买套舒服房子，天天陪家人吃饭、跟老朋友撸串喝酒吹牛', scores: { wenqing: 3, fenggu: -1, yuju: -2, cangfeng: -2 } },
      { label: 'D', text: '我肯定闲不住，还是想拉支队伍去干点真正有意义、能改变点什么的实事', scores: { zhidao: 3, renshi: 3, cangfeng: -2 } }
    ]
  }
];

/**
 * 12位核心人物档案
 */
const CHARACTERS = [
  {
    id: 'jiajing',
    name: '嘉靖帝',
    courtesy: '朱厚熜 · 大明执棋人',
    title: '渊默雷霆 · 万方执棋',
    seal: '执棋',
    accentColor: '#8E2424',
    bias: 0.031,
    target: { zhidao: 60, yuju: 96, cangfeng: 95, renshi: 16, wenqing: 12, fenggu: 82 },
    quote: '“云在青天水在瓶。世人皆以为自己在下棋，殊不知皆在朕的棋盘之中。”',
    tags: ['顶级洞察', '深不可测', '制衡大师', '精神独立'],
    traits: '你拥有极强的全局俯瞰视角与边界感，天生反感被人看透或拿捏。面对复杂的人事纠葛，你习惯退居幕后静观其变，一眼就能看穿每个人话里的真实算盘。你既懂现实规则的冷酷，内心深处又保留着一片谁也进不去的独立领地。',
    reason: '你在测试中展现出极高的「驭局」与「藏锋」倾向，同时遇到杂事倾向于保持抽离与克制。你不喜欢亲自下场干琐碎活，更擅长定规矩、看风向，把最终决定权牢牢攥在自己手里。',
    advantage: '超一流的看人眼力与情绪隔离能力。场面再乱你也不会被带偏节奏，总能一眼掐住核心矛盾。',
    easterEgg: {
      survival: '紫禁城玉熙宫终极BOSS（全剧存活率 99%，唯一对手只有时间）',
      ally: '吕芳（懂你每一句潜台词的贴心人）',
      nemesis: '海瑞（唯独拿不要命的直球选手毫无办法）',
      tip: '偶尔放下掌控欲，身边人的真心比制衡手腕更暖人。'
    }
  },
  {
    id: 'hairui',
    name: '海瑞',
    courtesy: '海刚峰 · 大明利剑',
    title: '孤峰独立 · 赤子利剑',
    seal: '守道',
    accentColor: '#1B4965',
    bias: 0.0291,
    target: { zhidao: 98, yuju: 42, cangfeng: 8, renshi: 92, wenqing: 72, fenggu: 68 },
    quote: '“无父无君，弃国弃家，留此铮铮傲骨，只为天下苍生求一个公道！”',
    tags: ['原则至上', '有话直说', '硬核实干', '不畏强权'],
    traits: '你是现实里极其少见的硬核直球选手。眼里揉不得沙子，对虚伪客套、甩锅扯皮和行业潜规则有着天然的反感。一旦认准了理字，就算对面来头再大、代价再高，你也会毫不犹豫地站出来硬刚到底。',
    reason: '你的「执道」与「任事」双双拉满，而「藏锋」很低。你懒得搞弯弯绕绕的心机话术，信奉身正不怕影子斜，遇到问题习惯正面硬上，用事实和证据说话，心里始终装着普通人的公道。',
    advantage: '无坚不摧的破局执行力与公信力。在所有人都和稀泥的死局里，只有你敢一剑捅破窗户纸，连对手都不得不服你的硬气。',
    easterEgg: {
      survival: '诏狱硬核通关王者（凭一身正气硬生生熬走对手，活到大结局）',
      ally: '王用汲（生死相托的患难好兄弟）',
      nemesis: '赵贞吉、严嵩（最烦打太极的老油条）',
      tip: '刚极易折，对身边真正关心你的家人朋友不妨柔和一点。'
    }
  },
  {
    id: 'huzongxian',
    name: '胡宗宪',
    courtesy: '胡汝贞 · 东南柱石',
    title: '负重致远 · 泥泞孤臣',
    seal: '担当',
    accentColor: '#3D5A45',
    bias: 0.1498,
    target: { zhidao: 58, yuju: 78, cangfeng: 64, renshi: 96, wenqing: 90, fenggu: 42 },
    quote: '“圣人的书是拿来看的，拿来办事百无一用。有些黑锅，总得有人背着往前走。”',
    tags: ['忍辱负重', '靠谱扛事', '顾全大局', '外圆内方'],
    traits: '你是团队和家里最让人踏实的“顶梁柱”。你早就明白现实世界不是非黑即白的童话，所以既懂人情世故的无奈，又死死守住良心底线。为了把事办成、为了护住手底下的人，你常常自己咽下委屈受夹板气，咬牙把烂摊子撑起来。',
    reason: '你在「任事」「温情」与「驭局」上得分都很高，「执道」与「藏锋」保持着成熟的平衡。你既不像书呆子那样只会唱高调，也绝不会变成冷血精致利己主义者，永远选最难但最对得起大家的那条路。',
    advantage: '极强的复杂烂摊子兜底能力。对上能沟通要资源，对下能体谅人心办实事，是真正能挑大梁的实干家。',
    easterEgg: {
      survival: '全身而退荣归故里（虽一路惊险万分，终凭实绩与分寸平安落地）',
      ally: '戚继光、谭纶（一起扛事的靠谱队友）',
      nemesis: '光说不练的键盘侠与贪得无厌的猪队友',
      tip: '别把所有人的责任都往自己一个人肩上扛，你也需要歇一歇。'
    }
  },
  {
    id: 'zhangjuzheng',
    name: '张居正',
    courtesy: '张叔大 · 破局国手',
    title: '蛰伏待时 · 铁腕革新',
    seal: '破局',
    accentColor: '#2B3A55',
    bias: 0.007,
    target: { zhidao: 66, yuju: 94, cangfeng: 80, renshi: 92, wenqing: 26, fenggu: 26 },
    quote: '“时机未到时，潜龙勿用；大势来临时，雷霆万钧！”',
    tags: ['长期主义', '沉得住气', '杀伐果断', '结果导向'],
    traits: '你是典型的战略型狠人。既有改写规则的野心，又有极强的忍耐力。实力不够、时机不对的时候，你能猫在角落里一声不吭攒本事；一旦等来风口拿到话语权，你出手比谁都快准狠，不达目的誓不罢休。',
    reason: '你的「驭局」「藏锋」与「任事」三项极高，而「温情」偏冷静克制。你深知没有实权支撑的理想只是空话，做决定时永远把长远大局和最终结果放在第一位。',
    advantage: '超强的战略定力与铁腕推进力。低谷期耐得住寂寞，掌权时顶得住压力，能真正把大项目干成。',
    easterEgg: {
      survival: '笑到最后执掌全局（一路稳扎稳打晋级，开启属于你的时代）',
      ally: '裕王、冯保（目标一致的核心合伙人）',
      nemesis: '拖延低效、混日子不干活的庸人',
      tip: '冲得再快再猛，也记得给身边并肩作战的人留点人情温度。'
    }
  },
  {
    id: 'yansong',
    name: '严嵩',
    courtesy: '严惟中 · 二十年首辅',
    title: '老成深算 · 揣摩入微',
    seal: '知机',
    accentColor: '#5C4033',
    bias: -0.0664,
    target: { zhidao: 10, yuju: 82, cangfeng: 96, renshi: 22, wenqing: 34, fenggu: 34 },
    quote: '“大明朝只有一个人能呼风唤雨。看懂了人心深处的忌讳，才能在风浪里稳坐钓鱼台。”',
    tags: ['人精雷达', '极其沉稳', '顺势借力', '向上管理大师'],
    traits: '你有着极其敏锐的人情世故雷达。不管在什么圈子里，你一眼就能看出谁说了算，以及对方嘴上没说出来的真实想法。你很少跟人硬碰硬红脸，擅长顺毛驴、借力打力，哪怕天塌下来脸上也能稳得住。',
    reason: '你在「藏锋」与「驭局」上非常突出，而「执道」较低，处事极具弹性。在你看来，面子之争和意气用事最没必要，看准风向、稳住核心位置才是最聪明的活法。',
    advantage: '顶级的风险嗅觉与向上管理能力。能在最微妙复杂的关系网里游刃有余，成为领导离不开的人。',
    easterEgg: {
      survival: '内阁超长待机二十年（但切记管好身边不靠谱的亲戚下属）',
      ally: '胡宗宪（关键时刻能替你把实活干漂亮的人）',
      nemesis: '徐阶、张居正（比你更能忍的后起之秀）',
      tip: '算无遗策固然厉害，但守住做人底线才能真正睡得踏实。'
    }
  },
  {
    id: 'lvfang',
    name: '吕芳',
    courtesy: '吕老祖宗 · 司礼监掌印',
    title: '春风化雨 · 思危知退',
    seal: '知退',
    accentColor: '#7A5C3E',
    bias: 0.1282,
    target: { zhidao: 36, yuju: 66, cangfeng: 84, renshi: 54, wenqing: 92, fenggu: 48 },
    quote: '“做人做事记住六个字：思危、思退、思变。得饶人处且饶人，留条生路就是留自己的福分。”',
    tags: ['高情商天花板', '说话熨帖', '知进知退', '广结善缘'],
    traits: '你是周围人眼里最舒服、最通透的明白人。见过不少风浪但一点不刻薄，说话办事永远让人如沐春风，懂得给每个人留面子、搭台阶。更难得的是你不贪恋风头，顺境时懂得给自己留后路，从不把事做绝。',
    reason: '你的「温情」与「藏锋」双高，各项性格十分圆融。你既看得懂职场的凶险，心里又存着善良，习惯用温和柔性的方式化解矛盾，护住自己的同时也愿意拉别人一把。',
    advantage: '满级的情绪价值与人际润滑能力。再僵的场面有你在就能缓和下来，走到哪都能攒下好人缘与福气。',
    easterEgg: {
      survival: '远赴南京平安养老（全剧最圆满通透的善终结局）',
      ally: '冯保、高翰文（受过你照顾的人都念你的好）',
      nemesis: '陈洪（戾气重、翻脸不认人的狠毒小人）',
      tip: '总替别人操心周全太累了，偶尔也任性一回先顾好自己。'
    }
  },
  {
    id: 'yangjinshui',
    name: '杨金水',
    courtesy: '杨公公 · 江南织造',
    title: '八面玲珑 · 绝境逢生',
    seal: '机变',
    accentColor: '#4A5859',
    bias: -0.1453,
    target: { zhidao: 14, yuju: 34, cangfeng: 62, renshi: 88, wenqing: 24, fenggu: 10 },
    quote: '“水太深的时候，看准风向果断按下暂停键，活下来才是一切的前提。”',
    tags: ['反应神速', '办事利索', '极其机灵', '极限求生'],
    traits: '你是典型的实战派聪明人，脑子转得飞快，干活麻利不拖泥带水。顺风局里你是能扛KPI的业务好手；一旦闻到不对劲的危险苗头，你比谁都果断，能立马踩急刹车缩回壳里，靠超强的应变力保住自己。',
    reason: '你的「任事」与「藏锋」偏高，而「执道」与「风骨」非常务实接地气。你不吃画大饼谈情怀那一套，只看重实打实的利益与安全，能屈能伸、随机应变。',
    advantage: '超强的临场反应速度与抗打击求生欲。再棘手的具体问题都能快速搞定，逆境里总能找到活路。',
    easterEgg: {
      survival: '装疯三年瞒天过海，最终平安脱身（影帝级极限避险操作）',
      ally: '吕芳（关键时刻真能保你一命的老领导）',
      nemesis: '沈一石、海瑞（一个拉你下水，一个盯你漏洞）',
      tip: '把这份机灵劲儿放在稳健长远的正道上，就不用天天提心吊胆走钢丝了。'
    }
  },
  {
    id: 'zhaozhenji',
    name: '赵贞吉',
    courtesy: '赵孟静 · 理学名臣',
    title: '明哲保身 · 体面算盘',
    seal: '明哲',
    accentColor: '#6B5B7B',
    bias: -0.1668,
    target: { zhidao: 34, yuju: 38, cangfeng: 46, renshi: 14, wenqing: 16, fenggu: 68 },
    quote: '“凡事皆有法度边界，先把自己的阵脚站稳了，再去谈其他。”',
    tags: ['边界感强', '爱惜羽毛', '算账精明', '绝不背锅'],
    traits: '你活得非常清醒且讲究体面，拥有极强的防背锅意识和个人边界感。你口才好、懂规则，遇到麻烦事第一反应是算清权责利弊，绝不脑子一热替别人的烂摊子买单。比起盲目冲锋，你更在乎自己的节奏和履历干不干净。',
    reason: '你在「任事」与「温情」上非常克制，同时保留了一定的「风骨」与「藏锋」。你既要好名声好体面，又深谙职场自保法则，永远把风险可控放在第一位。',
    advantage: '精准的避坑合规意识与场面控场力。很少掉进情绪陷阱或无底洞项目，总能体体面面守住自己的利益。',
    easterEgg: {
      survival: '一路升迁入阁拜相（虽然常被同事吐槽太滑头，但职场段位稳如泰山）',
      ally: '徐阶（同样讲究体面分寸的温和派）',
      nemesis: '海瑞、胡宗宪（最怕遇到逼你掏家底扛事的实在人）',
      tip: '算盘打得太精容易让人觉得冷漠，关键时刻多一点担当会更得人心。'
    }
  },
  {
    id: 'shenyishi',
    name: '沈一石',
    courtesy: '沈老板 · 江南首富',
    title: '锦绣孤舟 · 清醒悲歌',
    seal: '清醒',
    accentColor: '#2E4F4F',
    bias: 0.0827,
    target: { zhidao: 44, yuju: 66, cangfeng: 78, renshi: 72, wenqing: 66, fenggu: 94 },
    quote: '“侯非侯，王非王，千乘万骑归邙山……这一生织尽天下锦绣，终究只求死得体面干净。”',
    tags: ['人间清醒', '才华横溢', '外冷内热', '审美在线'],
    traits: '你既有搞定复杂业务的真本事，骨子里又是个极有品味的文艺青年。你比谁都更早看透名利场那套虚伪游戏，表面上不动声色地把应酬和活儿办得漂漂亮亮，心里却始终带着一丝疏离感，只对极少数真正懂你的人掏心窝子。',
    reason: '你的「风骨」高居榜首，同时「藏锋」「任事」与「温情」都不低。你在现实里能挑重担，但精神上绝不肯同流合污，是典型的“身在局中扛事、心在局外看戏”的清醒者。',
    advantage: '难得一见的审美品味与通透眼界。干出来的活既有实力又有高级感，关键时刻还能护住在乎的人。',
    easterEgg: {
      survival: '一曲广陵散绝响江南（虽然结局悲情，但留下了全剧最惊艳的体面背影）',
      ally: '高翰文、芸娘（真正懂你才华与苦衷的知音）',
      nemesis: '没完没了压榨你、把你当提款机的消耗型关系',
      tip: '别把所有苦水都一个人往肚子里咽，及时止损远离消耗你的人。'
    }
  },
  {
    id: 'gaohanwen',
    name: '高翰文',
    courtesy: '高凤鸣 · 翰林才子',
    title: '广陵绝响 · 清流书生',
    seal: '清雅',
    accentColor: '#3A6B7E',
    bias: -0.0365,
    target: { zhidao: 88, yuju: 16, cangfeng: 14, renshi: 26, wenqing: 64, fenggu: 96 },
    quote: '“以改兼赈，两难自解——纵使世道浑浊，总该留一方琴心剑胆的清白天地。”',
    tags: ['纯粹理想', '文艺浪漫', '真诚坦率', '讨厌应酬'],
    traits: '你心里住着一个干干净净的少年或艺术家。你喜欢一切美好、有逻辑、有格调的事物，极度讨厌酒桌文化、勾心斗角和甩锅扯皮。你待人真诚不设防，哪怕在复杂的社会里吃过点亏，也不愿意把自己变成油腻圆滑的样子。',
    reason: '你的「风骨」与「执道」极高，而「驭局」「藏锋」很低。你天生适合搞专业技术、创意内容或学术研究，实在懒得把宝贵的生命浪费在跟人斗心眼上。',
    advantage: '纯净的创造力与审美灵气。没有世俗条条框框的束缚，往往能想出别人想不到的妙招，活得坦荡干净。',
    easterEgg: {
      survival: '脱下官服携知己潇洒归隐（因祸得福，反倒过上了全剧最神仙眷侣的日子）',
      ally: '芸娘、吕芳（懂你的纯粹、愿意护着你的贵人与伴侣）',
      nemesis: '严世蕃、郑泌昌（最容易被职场老油条挖坑下套）',
      tip: '在复杂的圈子里签字答应事前，记得拉个心眼多的朋友帮你把把关。'
    }
  },
  {
    id: 'wangyongji',
    name: '王用汲',
    courtesy: '王润莲 · 人间良友',
    title: '人间烟火 · 侠义良友',
    seal: '重义',
    accentColor: '#8C4A27',
    bias: -0.065,
    target: { zhidao: 72, yuju: 26, cangfeng: 20, renshi: 80, wenqing: 96, fenggu: 32 },
    quote: '“圣人离我们太远，我只知道朋友有难要帮，百姓有冤要伸，做人要对得起良心！”',
    tags: ['有情有义', '踏实靠谱', '热心肠', '接地气'],
    traits: '你是现实生活里最值得深交的宝藏朋友！你没有高高在上的架子，也不搞虚头巴脑的套路，为人实在、热心、有良心。你既过得惯热气腾腾的普通小日子，又在朋友落难时第一个撸起袖子冲上去帮忙，谁跟你相处都觉得踏实暖心。',
    reason: '你的「温情」维度最高，同时具备扎实的「任事」与「执道」，且「藏锋」「驭局」较低。你看重真感情胜过权谋算计，是个脚踏实地、有血有肉的实在人。',
    advantage: '极高的人品口碑与落地执行力。走到哪都能交到真朋友，踏实肯干不踩雷，后半生福气往往特别稳。',
    easterEgg: {
      survival: '一路稳步升迁至南京刑部尚书（好人有好报代表，全程平平安安）',
      ally: '海瑞（哪怕平时拌嘴吵架，关键时刻也能把后背交给对方的铁哥们）',
      nemesis: '落井下石、忘恩负义的势利小人',
      tip: '热心帮朋友的时候，也记得捂好自己的钱包和精力，别被人白白消耗。'
    }
  },
  {
    id: 'yunniang',
    name: '芸娘',
    courtesy: '沈府清音 · 乱世佳人',
    title: '乱世清音 · 通透如水',
    seal: '通透',
    accentColor: '#7D4E57',
    bias: 0.0522,
    target: { zhidao: 52, yuju: 14, cangfeng: 64, renshi: 18, wenqing: 90, fenggu: 90 },
    quote: '“繁华场里的戏看多了，才明白平平安安、真心相待比什么泼天富贵都金贵。”',
    tags: ['温柔通透', '看人很准', '重情知恩', '不慕虚荣'],
    traits: '你平时看着温和安静、不争不抢，其实心里跟明镜似的，谁是真心、谁是假意你一眼就看得出来。你对争权夺利和虚荣排场没啥兴趣，就算身处热闹喧嚣的地方也能守住自己的清净；唯独对真感情和恩义看得很重，外柔内刚。',
    reason: '你的「风骨」与「温情」双高，「藏锋」内敛得体，而对「驭局」当老大或强行揽事没太大执念。你更看重内心的安稳与真挚的陪伴，活得清醒而温柔。',
    advantage: '超强的共情治愈力与内心定力。不容易被外界的焦虑内卷带跑偏，能把平淡日子过出舒服自在的味道。',
    easterEgg: {
      survival: '远离是非圈与心上人远走江南（跳出名利漩涡，收获自由安稳的新生活）',
      ally: '沈一石、高翰文（懂你的好、愿意护你周全的知心人）',
      nemesis: '身不由己的利益捆绑与道德绑架',
      tip: '你其实比自己想象中更有主见和力量，大胆按自己喜欢的方式活吧。'
    }
  }
];
