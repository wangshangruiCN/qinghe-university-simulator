import {
  BANK_RATES,
  BUILDINGS,
  CAMPUS_PLOTS,
  COLLEGE_TEMPLATES_V2 as COLLEGE_TEMPLATES,
  COMPETITIONS,
  DIFFICULTIES,
  SCHOOL_TIERS,
  STOCK_MARKET,
  getDomesticTags,
  getInternationalTag,
  NATIONAL_UNIVERSITIES,
  PRESIDENT_CANDIDATES,
  SICHUAN_UNIVERSITIES,
  WORLD_UNIVERSITIES,
} from "./data.js";

const APP_VERSION = "0.3.2";
const CHANGELOG = [
  {
    version: "v0.3.2",
    date: "2026-10-27",
    summary: "手机排行榜紧凑布局",
    items: [
      "手机端四川省、全国、世界排名卡改为同一行水平排列",
      "985、211、双一流标签移到校名下方横向显示",
      "手机榜单隐藏单独标签列与评分条列，降低行高",
      "排行榜页签改为三等分布局，390px 与 694px 宽度无横向溢出",
      "修复中等手机宽度下提示框被拉成长条的问题",
    ],
  },
  {
    version: "v0.3.1",
    date: "2026-10-27",
    summary: "手机端顶栏与全页面适配",
    items: [
      "手机和平板顶栏改为两行，完整显示日期与学期",
      "时间控制、官网入口、帮助按钮重新排布，避免拥挤",
      "首页、招生、金融、榜单和官网完成手机宽度检查",
      "提示框位置跟随新顶栏调整，页面无横向溢出",
    ],
  },
  {
    version: "v0.3.0",
    date: "2026-10-27",
    summary: "自动校历、招生流程、银行与股市正式版",
    items: [
      "时间系统改为自动推进，暂停、1x、2x、4x 速度可调",
      "校历从 1 月 1 日开始，日期逐日推进并正确跨月跨年",
      "招生计划 1–4 月申报，审批随机等待 10–25 个工作日",
      "7 月公布录取结果，9 月新生正式入学",
      "新增寒假、春季开学、军训、毕业和年度事件通知",
      "重要事件以通知卡片呈现，处理、跳过或关闭提醒",
      "新增银行：活期、3/6/12 个月定期、贷款与信用评分",
      "新增虚拟股票市场，民办学校可交易，公办学校锁定",
      "负面校务结果不再进入校园官网新闻",
    ],
  },
  {
    version: "v0.2.2-dev",
    date: "2026-10-27",
    summary: "学校层级与年度排名系统",
    items: [
      "新增民办二本至世界重点本科的 12 级学校层级",
      "省榜与全国榜改为 1000 分制，国际榜改为 10000 分制",
      "排名改为每学年统一更新，NPC 分数也会逐年增长",
      "国内榜叠加显示 985、211、双一流",
      "国际榜显示每所学校对应的最高国际标签",
      "修正密歇根大学安娜堡分校、洛桑联邦理工学院、澳大利亚国立大学的国际标签",
      "层级晋升后自动更新学校标签并发布官网新闻",
      "手机提示框固定在顶栏下方，不再需要滚动查看",
    ],
  },
  {
    version: "v0.2.1",
    date: "2026-10-27",
    summary: "公告与手机官网入口修复",
    items: [
      "修复手机顶栏官网预览按钮显示与点击问题",
      "更新公告改为可关闭的版本弹窗",
    ],
  },
  {
    version: "v0.2.0",
    date: "2026-10-27",
    summary: "学院重构与核心规则修复",
    items: [
      "学院体系重构为 10 个具体学院，专业直接归属学院",
      "修复任何学院都能开设任意专业的问题",
      "修复排名过虚：民办本科开局，省榜每年最多上升 3 名",
      "修复全国榜与世界榜不显示本校位次的问题",
      "招生改为按培养容量分四年自动分配",
      "修复手机端帮助按钮不可见、不可点击的问题",
      "开始页与设置页显示当前版本号",
    ],
  },
];

const LEGACY_COLLEGE_MAP = {
  digital: "computer",
  manufacturing: "manufacturing",
  business: "business",
  health: "medicine",
  creative: "art",
  tourism: "tourism",
};

const SAVE_KEY = "qinghe-university-save-v1";
const SAVED_AT_KEY = "qinghe-university-saved-at";

const LEVEL_BONUS = {
  本科: 0,
  专科: 0,
  职业本科: 90,
  专业硕士授权: 190,
  博士授权: 330,
};

const NAV_ITEMS = [
  { view: "dashboard", label: "校务总览", icon: "◫", group: "DECISION DESK" },
  { view: "academic", label: "学院与学科", icon: "◇", group: "ACADEMY" },
  { view: "admissions", label: "招生与就业", icon: "↗", group: "ACADEMY", urgentKey: "admission" },
  { view: "governance", label: "校务与师资", icon: "◎", group: "ACADEMY" },
  { view: "research", label: "科研与学位", icon: "⌁", group: "ACADEMY" },
  { view: "campus", label: "校园建设", icon: "▦", group: "OPERATIONS" },
  { view: "finance", label: "银行与投资", icon: "¥", group: "OPERATIONS" },
  { view: "life", label: "校园生活", icon: "✦", group: "OPERATIONS" },
  { view: "rankings", label: "大学排行榜", icon: "≋", group: "REPUTATION" },
  { view: "website", label: "校园官网", icon: "▤", group: "REPUTATION" },
];

const TUTORIAL_STEPS = [
  {
    kicker: "01 / 建校",
    title: "先建立一个学院",
    body: "大学不是一次点满的技能树。你的第一所学院会决定首批专业、师资结构和校企资源。进入“学院与学科”，从十所学院方向中选择其一。",
    action: "去建立学院",
    view: "academic",
    art: "院",
  },
  {
    kicker: "02 / 审批",
    title: "招生不是想招多少就招多少",
    body: "先按专业上报年度拟招生人数。教育局会综合办学条件、师资与培养能力审批。批复后才可启动招生投放。",
    action: "去上报计划",
    view: "admissions",
    art: "批",
  },
  {
    kicker: "03 / 招生",
    title: "把批下来的计划招满",
    body: "选择招生策略与覆盖范围。学校声誉、就业质量与投放预算共同决定报到率。录取人数会形成一届真实的学生 cohort，并影响未来四年的收入。",
    action: "启动招生",
    view: "admissions",
    art: "招",
  },
  {
    kicker: "04 / 结算",
    title: "用年度经营检验决定",
    body: "时间会自动推进。学年结束后，会结算学费、师资与运营成本，处理自然流失、生成排名变化和新闻。",
    action: "查看年度工作",
    view: "dashboard",
    art: "年",
  },
  {
    kicker: "05 / 声誉",
    title: "一所大学需要被看见",
    body: "校园官网会自动记录招生、任命、科研与竞赛新闻。后续可通过榜单、科研、赛事和校企合作提高全国与全球声誉。",
    action: "打开校园官网",
    view: "website",
    art: "闻",
  },
];

let state = loadState();
const ui = {
  active: false,
  view: "dashboard",
  sidebarOpen: false,
  startForm: {
    name: "青禾学院",
    difficulty: "steady",
    nature: "private",
    province: "四川省",
  },
  rankingTab: "sichuan",
  lifeTab: "clubs",
  financeTab: "bank",
  modal: null,
  tutorialIndex: 0,
};

const appRoot = document.querySelector("#app");
const modalRoot = document.querySelector("#modal-root");
const toastRoot = document.querySelector("#toast-root");

document.addEventListener("click", handleClick);
document.addEventListener("submit", handleSubmit);
document.addEventListener("change", handleChange);
document.addEventListener("input", handleInput);
document.addEventListener("keydown", handleKeydown);

let clockAccumulatorMs = 0;
let clockLastMs = Date.now();
setInterval(clockTick, 1000);
document.addEventListener("visibilitychange", () => {
  if (document.hidden && state?.time.running) {
    state.time.running = false;
    saveState();
    renderApp();
  }
});

render();

function loadState() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.version === 5) {
      parsed.school.tier = parsed.school.tier || (parsed.school.nature === "public" ? "public2" : "private2");
      parsed.ranking = parsed.ranking || null;
      parsed.tierHistory = parsed.tierHistory || [];
      parsed.bank = parsed.bank || { demand: 0, fixed: [], loans: [], credit: 100, transactions: [] };
      parsed.stock = parsed.stock || { cash: 0, holdings: {}, realized: 0, prices: Object.fromEntries(STOCK_MARKET.map((item) => [item.symbol, item.basePrice])), transactions: [] };
      parsed.notifications = parsed.notifications || { queue: [], muted: {}, resumedSpeed: 1 };
      parsed.admissions = normalizeAdmissionsState(parsed.admissions, parsed.time.year);
      parsed.time.month = parsed.time.month || 9;
      parsed.time.day = parsed.time.day || 1;
      parsed.time.running = false;
      parsed.time.academicYearStarted = Boolean(parsed.time.academicYearStarted);
      parsed.calendarMilestones = parsed.calendarMilestones || [];
      normalizeTimeYear(parsed);
      return parsed;
    }
    const migrated = migrateLegacyState(parsed);
    localStorage.setItem(SAVE_KEY, JSON.stringify(migrated));
    return migrated;
  } catch {
    return null;
  }
}

function migrateLegacyState(legacy) {
  const migrated = {
    ...legacy,
    version: 5,
    school: {
      ...legacy.school,
      level: legacy.school.level === "专科" ? "本科" : legacy.school.level,
      tier: legacy.school.tier || (legacy.school.nature === "public" ? "public2" : "private2"),
    },
    colleges: (legacy.colleges || []).map((college) => {
      const nextId = LEGACY_COLLEGE_MAP[college.id]
        || COLLEGE_TEMPLATES.find((item) => item.id === college.id)?.id
        || COLLEGE_TEMPLATES.find((item) => item.name === college.name)?.id;
      if (!nextId) return null;
      const template = COLLEGE_TEMPLATES.find((item) => item.id === nextId);
      const programs = college.disciplines
        ? college.disciplines.flatMap((discipline) =>
            discipline.programs.map((program) => ({
              id: program.id,
              name: program.name,
              code: program.code || "510000",
            })),
          )
        : (college.programs || []).map((program) => ({
            id: program.id,
            name: program.name,
            code: program.code || "510000",
          }));
      return {
        ...college,
        id: nextId,
        name: template.name,
        code: template.code,
        category: template.category,
        icon: template.icon,
        accent: template.accent,
        summary: template.summary,
        programs,
      };
    }).filter(Boolean),
  };
  migrated.admissions.annualQuota = migrated.admissions.annualQuota || Math.round((migrated.resources.capacity || 1200) / 4);
  migrated.ranking = null;
  migrated.tierHistory = migrated.tierHistory || [];
  migrated.bank = migrated.bank || { demand: 0, fixed: [], loans: [], credit: 100, transactions: [] };
  migrated.stock = migrated.stock || { cash: 0, holdings: {}, realized: 0, prices: Object.fromEntries(STOCK_MARKET.map((item) => [item.symbol, item.basePrice])), transactions: [] };
  migrated.notifications = migrated.notifications || { queue: [], muted: {}, resumedSpeed: 1 };
  migrated.admissions = normalizeAdmissionsState(migrated.admissions, migrated.time.year);
  migrated.time.month = migrated.time.month || 9;
  migrated.time.day = migrated.time.day || 1;
  migrated.time.running = false;
  migrated.time.academicYearStarted = Boolean(migrated.time.academicYearStarted);
  migrated.calendarMilestones = migrated.calendarMilestones || [];
  normalizeTimeYear(migrated);
  return migrated;
}

function normalizeAdmissionsState(admissions = {}, year = 2026) {
  return {
    draft: {},
    annualQuota: 300,
    planStatus: "not_started",
    approvedTotal: 0,
    campaignDone: false,
    lastResult: null,
    cohorts: [],
    ...admissions,
    applicationYear: admissions.applicationYear || year,
    submittedAt: admissions.submittedAt || null,
    reviewStartedAt: admissions.reviewStartedAt || null,
    decisionAt: admissions.decisionAt || null,
    decisionResult: admissions.decisionResult || null,
    resultPublishedAt: admissions.resultPublishedAt || null,
    pendingFreshmen: admissions.pendingFreshmen || 0,
    strategy: admissions.strategy || "steady",
  };
}

function normalizeTimeYear(targetState) {
  if (!targetState?.time || !targetState?.school) return;
  if (targetState.time.year < targetState.school.founded) {
    targetState.time.year = targetState.school.founded;
  }
}

function saveState() {
  if (!state) return;
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    localStorage.setItem(SAVED_AT_KEY, new Date().toISOString());
    document.querySelectorAll("[data-save-state]").forEach((el) => {
      el.textContent = "已自动保存";
    });
  } catch {
    toast("保存失败", "浏览器阻止了本地存储，请检查隐私设置。", "error");
  }
}

function formatNumber(value) {
  return Math.round(Number(value) || 0).toLocaleString("zh-CN");
}

function formatMoney(value, withUnit = true) {
  const sign = Number(value) < 0 ? "−" : "";
  return `${sign}¥${formatNumber(Math.abs(value))}${withUnit ? " 万" : ""}`;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function randomPick(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function dayStamp(year, month = "09", day = "01") {
  return `${year}.${month}.${day}`;
}

function schoolNatureLabel() {
  return state?.school.nature === "public" ? "公办" : "民办";
}

function difficultyData() {
  return DIFFICULTIES.find((item) => item.id === state.difficulty) || DIFFICULTIES[0];
}

function schoolStrength(targetState = state) {
  if (!targetState) return 0;
  const r = targetState.resources;
  return clamp(
    r.quality * 0.28 +
      r.research * 0.24 +
      r.reputation * 0.2 +
      r.employment * 0.16 +
      r.satisfaction * 0.12,
    0,
    100,
  );
}

function getSchoolTier(tierId = state?.school.tier) {
  return SCHOOL_TIERS.find((tier) => tier.id === tierId) || SCHOOL_TIERS[0];
}

function nextSchoolTier(tierId = state?.school.tier) {
  const index = SCHOOL_TIERS.findIndex((tier) => tier.id === tierId);
  return index >= 0 ? SCHOOL_TIERS[index + 1] || null : null;
}

function stableFraction(text) {
  let hash = 2166136261;
  for (const char of text) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) / 4294967295;
}

function npcAnnualGrowth(name, min, max, year) {
  return min + stableFraction(`${name}:${year}`) * (max - min);
}

function baseNpcScores() {
  return {
    sichuan: Object.fromEntries(SICHUAN_UNIVERSITIES.map((item) => [item.name, roundScore(item.score * 10)])),
    national: Object.fromEntries(NATIONAL_UNIVERSITIES.map((item) => [item.name, roundScore(item.score * 10)])),
    world: Object.fromEntries(WORLD_UNIVERSITIES.map((item) => [item.name, roundScore(item.score * 100)])),
  };
}

function roundScore(value) {
  return Math.round(value * 10) / 10;
}

function playerRankingScores(targetState) {
  const tier = getSchoolTier(targetState.school.tier);
  const strength = schoolStrength(targetState);
  return {
    provincial: roundScore(Math.min(tier.provincialCap, strength * 8)),
    national: roundScore(Math.min(tier.nationalCap, strength * 8)),
    world: roundScore(Math.min(tier.internationalCap, strength * 80)),
  };
}

function estimateDomesticNationalRank(scores, playerScore) {
  const sorted = Object.values(scores).sort((a, b) => b - a);
  const above = sorted.filter((score) => score > playerScore).length;
  if (above < sorted.length) return above + 1;
  const floor = sorted[sorted.length - 1] || 600;
  return Math.max(101, 100 + Math.ceil(Math.max(0, floor - playerScore) / 5));
}

function estimateWorldRank(scores, playerScore) {
  const sorted = Object.values(scores).sort((a, b) => b - a);
  const above = sorted.filter((score) => score > playerScore).length;
  if (above < sorted.length) return above + 1;
  const floor = sorted[sorted.length - 1] || 9000;
  return Math.max(31, 30 + Math.ceil(Math.max(0, floor - playerScore) / 8));
}

function rankSnapshotFromScores(npc, playerScores) {
  return {
    provincial: 1 + Object.values(npc.sichuan).filter((score) => score > playerScores.provincial).length,
    national: estimateDomesticNationalRank(npc.national, playerScores.national),
    world: estimateWorldRank(npc.world, playerScores.world),
  };
}

function createRankingSnapshot(targetState) {
  const npc = baseNpcScores();
  const player = playerRankingScores(targetState);
  return {
    updatedYear: targetState.time.year,
    npc,
    player,
    ranks: rankSnapshotFromScores(npc, player),
  };
}

function advanceRankingSnapshot(targetState, year) {
  if (!targetState.ranking) targetState.ranking = createRankingSnapshot(targetState);
  if (targetState.ranking.updatedYear === year) return targetState.ranking;
  const previous = targetState.ranking;
  const npc = {
    sichuan: Object.fromEntries(
      SICHUAN_UNIVERSITIES.map((item) => [
        item.name,
        roundScore(Math.min(1000, previous.npc.sichuan[item.name] + npcAnnualGrowth(item.name, 0.4, 1.2, year))),
      ]),
    ),
    national: Object.fromEntries(
      NATIONAL_UNIVERSITIES.map((item) => [
        item.name,
        roundScore(Math.min(1000, previous.npc.national[item.name] + npcAnnualGrowth(item.name, 0.8, 2.2, year))),
      ]),
    ),
    world: Object.fromEntries(
      WORLD_UNIVERSITIES.map((item) => [
        item.name,
        roundScore(Math.min(10000, previous.npc.world[item.name] + npcAnnualGrowth(item.name, 8, 20, year))),
      ]),
    ),
  };
  const player = playerRankingScores(targetState);
  targetState.ranking = {
    updatedYear: year,
    npc,
    player,
    ranks: rankSnapshotFromScores(npc, player),
  };
  return targetState.ranking;
}

function getRankings() {
  if (!state) {
    return {
      provincial: 41,
      national: 900,
      world: 1200,
      strength: 0,
      updatedYear: 2026,
      player: { provincial: 0, national: 0, world: 0 },
      tier: SCHOOL_TIERS[0],
    };
  }
  if (!state.ranking) state.ranking = createRankingSnapshot(state);
  return {
    provincial: state.ranking.ranks.provincial,
    national: state.ranking.ranks.national,
    world: state.ranking.ranks.world,
    strength: schoolStrength(),
    updatedYear: state.ranking.updatedYear,
    player: state.ranking.player,
    tier: getSchoolTier(state.school.tier),
  };
}

function playerDomesticTags() {
  return getSchoolTier(state.school.tier).domesticTags;
}

function playerInternationalTag() {
  return getSchoolTier(state.school.tier).internationalTag;
}

function approxApprovalChance() {
  if (!state) return 0;
  const total = planTotal();
  const quota = state.admissions.annualQuota || annualAdmissionQuota();
  const programs = getPrograms();
  const programCount = Math.max(1, programs.length);
  const ratio = state.resources.students / Math.max(1, state.resources.faculty);
  const loadPenalty = Math.max(0, total - quota) / Math.max(1, quota);
  const ratioPenalty = Math.max(0, ratio - 22) * 0.008;
  return clamp(
    0.48 +
      state.resources.quality * 0.003 +
      Math.min(state.resources.faculty, programCount * 18) * 0.0035 -
      loadPenalty -
      ratioPenalty +
      difficultyData().approvalBonus,
    0.18,
    0.94,
  );
}

function planTotal() {
  return Object.values(state?.admissions.draft || {}).reduce(
    (sum, value) => sum + (Number(value) || 0),
    0,
  );
}

function getPrograms() {
  return (state?.colleges || []).flatMap((college) =>
    (college.programs || []).map((program) => ({
      ...program,
      collegeId: college.id,
      collegeName: college.name,
      category: college.category,
    })),
  );
}

function annualAdmissionQuota() {
  if (!state) return 0;
  return Math.max(0, Math.round(state.resources.capacity / 4));
}

function redistributeAdmissionDraft() {
  const programs = getPrograms();
  const quota = annualAdmissionQuota();
  state.admissions.annualQuota = quota;
  state.admissions.draft = {};
  if (!programs.length) return;
  const base = Math.floor(quota / programs.length);
  let remainder = quota - base * programs.length;
  programs.forEach((program, index) => {
    state.admissions.draft[program.id] = base + (index < remainder ? 1 : 0);
  });
}

function currentAction() {
  if (!state?.flags.firstCollege) return { view: "academic", label: "建立首个学院" };
  if (state.admissions.planStatus === "not_started" || state.admissions.planStatus === "rejected") {
    return { view: "admissions", label: isAdmissionApplicationWindow() ? "上报招生计划" : "等待下一招生季" };
  }
  if (state.admissions.planStatus === "submitted") return { view: "admissions", label: "等待招生审批" };
  if (state.admissions.planStatus === "approved" && !state.admissions.campaignDone) {
    return { view: "admissions", label: "确认招生策略" };
  }
  if (state.admissions.planStatus === "strategy_confirmed") return { view: "admissions", label: "等待录取公布" };
  if (state.admissions.planStatus === "results_published") return { view: "admissions", label: "等待新生入学" };
  return { view: "dashboard", label: "推进校务日程" };
}

function currentTutorialStep() {
  if (!state?.flags.firstCollege) return 0;
  if (state.admissions.planStatus === "not_started" || state.admissions.planStatus === "rejected") return 1;
  if (!state.admissions.campaignDone) return 2;
  if (!state.history.length) return 3;
  if (!state.flags.visitedWebsite) return 4;
  return 4;
}

function addNews(title, summary, category = "学校要闻", dateOverride = null, publicNews = true) {
  const date = dateOverride || `${state.time.year}-${String(9 + (state.news.length % 3)).padStart(2, "0")}-${String(8 + (state.news.length % 18)).padStart(2, "0")}`;
  state.news.unshift({
    id: `news-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
    title,
    summary,
    category,
    date,
    public: publicNews,
  });
  state.news = state.news.slice(0, 30);
}

function isPublicNews(item) {
  if (item.public === false) return false;
  if (item.public === true) return true;
  return !["未获批准", "未通过", "未获立项", "需进一步完善", "申请完成评议"].some((keyword) =>
    item.title.includes(keyword),
  );
}

function toast(title, detail, kind = "info") {
  const node = document.createElement("div");
  node.className = `toast ${kind}`;
  node.innerHTML = `
    <span class="toast-icon">${kind === "error" ? "!" : kind === "success" ? "✓" : "i"}</span>
    <div><strong>${escapeHtml(title)}</strong>${detail ? `<span>${escapeHtml(detail)}</span>` : ""}</div>
  `;
  toastRoot.appendChild(node);
  window.setTimeout(() => {
    node.style.opacity = "0";
    node.style.transform = "translateY(8px)";
    node.style.transition = "all 180ms ease";
    window.setTimeout(() => node.remove(), 200);
  }, 3300);
}

function commit({ keepModal = false, scrollTop = false } = {}) {
  saveState();
  if (!keepModal) closeModal();
  renderApp();
  if (scrollTop) window.scrollTo({ top: 0, behavior: "smooth" });
}

function render() {
  if (state && ui.active) {
    renderApp();
    if (ui.modal) renderModal();
  } else {
    renderLanding();
  }
}

function renderLanding() {
  const difficulty = DIFFICULTIES.find((item) => item.id === ui.startForm.difficulty) || DIFFICULTIES[0];
  const savedAt = localStorage.getItem(SAVED_AT_KEY);
  const savedTime = savedAt
    ? new Date(savedAt).toLocaleString("zh-CN", {
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  appRoot.innerHTML = `
    <main class="start-page">
      <div class="start-wrap">
        <section class="start-copy">
          <div class="start-brand">
            <div class="brand-seal">禾</div>
            <div class="start-wordmark">青禾计划<small>UNIVERSITY SIMULATOR</small></div>
          </div>
          <div class="start-kicker">2026 · 四川办学试点</div>
          <h1><span>从一纸合同开始，</span><span>办一所<em>真正被人记住</em></span><span>的大学。</span></h1>
          <p>
            你将从一所民办本科起步，决定开设什么专业、招多少学生、聘任怎样的人，
            并在一届届毕业生的去向中，留下这所学校的名字。
          </p>
          <div class="start-points">
            <div class="start-point"><strong>学院生长</strong><span>十所学院 · 各自专业</span></div>
            <div class="start-point"><strong>真实规则</strong><span>审批 · 招生 · 学位点</span></div>
            <div class="start-point"><strong>长期主义</strong><span>从省内榜单走向世界</span></div>
          </div>
          <button class="start-changelog-button" type="button" data-action="open-changelog">
            <span>查看 v${APP_VERSION} 更新内容</span>
            <span aria-hidden="true">→</span>
          </button>
        </section>

        <section class="contract-wrap" aria-label="办学合同">
          <div class="contract-note">四川省教育厅 · 模拟备案</div>
          <div class="contract-paper">
            <header class="contract-head">
              <div class="contract-docket">QH-EDU / AGREEMENT / 2026-01</div>
              <h2>民办普通本科学校设立协议</h2>
              <p>甲方：四川省教育厅（模拟）　乙方：拟设学校举办者</p>
            </header>

            <div class="contract-body">
              ${
                state
                  ? `<div class="resume-bar">
                      <span>检测到 ${escapeHtml(state.school.name)} 的本地档案<br /><b>${savedTime || "上次运行"}自动保存</b></span>
                      <button class="btn btn-dark btn-sm" type="button" data-action="resume-game">继续办学</button>
                    </div>`
                  : ""
              }

              <form id="start-form" class="contract-body" style="padding:0;gap:15px">
                <div class="form-grid">
                  <div class="field span-2">
                    <label for="school-name">拟设学校名称</label>
                    <input class="input" id="school-name" name="name" maxlength="24" required value="${escapeHtml(ui.startForm.name)}" />
                  </div>
                  <div class="field">
                    <label for="province">办学省份</label>
                    <input class="input" id="province" value="四川省 · 成都市" disabled />
                  </div>
                  <div class="field">
                    <label for="level">初始办学层次</label>
                    <input class="input" id="level" value="本科（四年制）" disabled />
                  </div>
                </div>

                <div class="field">
                  <span class="choice-label">办学性质</span>
                  <div class="nature-list">
                    <label class="nature-option ${ui.startForm.nature === "private" ? "selected" : ""}">
                      <input type="radio" name="nature" value="private" ${ui.startForm.nature === "private" ? "checked" : ""} />
                      <span><strong>民办 · 主流程</strong><small>学费自主、机制灵活，后期可申请转公办</small></span>
                    </label>
                    <label class="nature-option ${ui.startForm.nature === "public" ? "selected" : ""}">
                      <input type="radio" name="nature" value="public" ${ui.startForm.nature === "public" ? "checked" : ""} />
                      <span><strong>公办 · 支线</strong><small>学费较低、财政托底，扩张审批更谨慎</small></span>
                    </label>
                  </div>
                </div>

                <div class="field">
                  <span class="choice-label">办学难度</span>
                  <div class="difficulty-list">
                    ${DIFFICULTIES.map(
                      (item) => `
                        <button class="difficulty-card ${ui.startForm.difficulty === item.id ? "selected" : ""}" type="button" data-action="select-difficulty" data-id="${item.id}">
                          <strong>${item.name}</strong>
                          <span>${item.tone}<br />启动资金 ${formatMoney(item.cash)}</span>
                        </button>
                      `,
                    ).join("")}
                  </div>
                </div>

                <div class="contract-clause">
                  第 1 条　学校须先设立一个二级学院并形成完整人才培养方案。首年招生须经教育厅计划审批。<br />
                  第 2 条　学校应逐年接受办学质量、师资配比、学生满意度与就业质量评估。
                </div>

                <div class="contract-actions">
                  <span class="remaining">签订后可随时导出或重置本地存档</span>
                  <button class="btn btn-primary btn-lg" type="submit">签署并开始办学 <span aria-hidden="true">→</span></button>
                </div>
                <input type="hidden" name="difficulty" value="${escapeHtml(ui.startForm.difficulty)}" />
              </form>
            </div>
            <div class="contract-seal" style="position:absolute;right:26px;bottom:-17px">教育厅<br />备案专用</div>
          </div>
        </section>
      </div>
      <div class="start-version">v${APP_VERSION}</div>
    </main>
  `;

  document.querySelectorAll("[data-action='select-difficulty']").forEach((button) => {
    button.setAttribute("aria-pressed", button.classList.contains("selected") ? "true" : "false");
  });
  document.title = `青禾计划 · ${ui.startForm.name}`;
  window.__difficulty = difficulty;
}

function startNewGame(formData) {
  const difficulty = DIFFICULTIES.find((item) => item.id === formData.get("difficulty")) || DIFFICULTIES[0];
  const name = String(formData.get("name") || "").trim().slice(0, 24);
  const nature = formData.get("nature") === "public" ? "public" : "private";
  if (name.length < 2) {
    toast("学校名称太短", "至少需要两个汉字或字符。", "error");
    return;
  }

  state = createInitialState({ name, nature, difficulty });
  state.ranking = createRankingSnapshot(state);
  state.calendarMilestones.push(`${state.time.year}-admissions-open`);
  ui.active = true;
  ui.view = "dashboard";
  saveState();
  renderApp();
  ui.modal = { type: "tutorial", index: currentTutorialStep() };
  renderModal();
  toast("办学合同已备案", `${name}正式进入筹建期。`);
}

function createInitialState({ name, nature, difficulty }) {
  const year = 2026;
  return {
    version: 5,
    createdAt: Date.now(),
    difficulty: difficulty.id,
    school: {
      name,
      shortName: name.length > 8 ? name.slice(0, 8) : name,
      nature,
      level: "本科",
      tier: nature === "public" ? "public2" : "private2",
      province: "四川省",
      city: "成都市",
      founded: year,
      motto: "厚德 · 笃学 · 力行 · 致远",
      badge: name.slice(0, 2),
    },
    time: {
      year,
      month: 1,
      day: 1,
      term: "秋季学期",
      turn: 0,
      running: true,
      speed: 1,
      academicYearStarted: false,
    },
    resources: {
      cash: difficulty.cash,
      reputation: nature === "public" ? 16 : 10,
      quality: 13,
      research: 6,
      satisfaction: 30,
      employment: 28,
      faculty: 32,
      students: 0,
      capacity: 1200,
      land: 3,
      alumni: 0,
    },
    colleges: [],
    admissions: {
      draft: {},
      annualQuota: 300,
      planStatus: "not_started",
      approvedTotal: 0,
      campaignDone: false,
      lastResult: null,
      cohorts: [],
      applicationYear: year,
      submittedAt: null,
      reviewStartedAt: null,
      decisionAt: null,
      decisionResult: null,
      resultPublishedAt: null,
      pendingFreshmen: 0,
      strategy: "steady",
    },
    campus: {
      plots: CAMPUS_PLOTS.map((plot) => ({
        ...plot,
        owned: Boolean(plot.owned),
        built: plot.existing || null,
      })),
    },
    clubs: [
      {
        id: "volunteer",
        name: "青年志愿者协会",
        icon: "心",
        category: "公益实践",
        members: 86,
        satisfaction: 2,
        description: "社区服务与大型赛会志愿活动。",
      },
      {
        id: "media",
        name: "校园融媒体中心",
        icon: "闻",
        category: "媒体创作",
        members: 48,
        satisfaction: 2,
        description: "负责校园新闻、短视频与官网内容。",
      },
    ],
    competitions: { entries: {} },
    partnerships: [],
    research: { projects: [], platforms: [] },
    bank: {
      demand: 0,
      fixed: [],
      loans: [],
      credit: 100,
      transactions: [],
    },
    stock: {
      cash: 0,
      holdings: {},
      realized: 0,
      prices: Object.fromEntries(STOCK_MARKET.map((item) => [item.symbol, item.basePrice])),
      transactions: [],
    },
    notifications: {
      queue: [],
      muted: {},
      resumedSpeed: 1,
    },
    governance: {
      president: null,
      interim: true,
      facultyHires: 0,
      lastInspection: null,
    },
    site: {
      headline: "把课堂办在产业现场，把成长写进城市未来",
      notices: [
        "关于做好新生入学资格复查工作的通知",
        "2026—2027 学年校历与教学安排",
        "校园服务热线与办事大厅指南",
      ],
    },
    news: [],
    history: [],
    calendarMilestones: [],
    ranking: null,
    tierHistory: [],
    lastAnnualReport: null,
    flags: {
      firstCollege: false,
      visitedWebsite: false,
      publicConversionAttempted: false,
    },
  };
}

function renderApp() {
  if (!state) return;
  normalizeTimeYear(state);
  if (!state.ranking) state.ranking = createRankingSnapshot(state);
  const ranks = getRankings();
  const urgent = {
    admission:
      state.admissions.planStatus === "not_started" || state.admissions.planStatus === "rejected" ? 1 : 0,
  };
  const groups = [...new Set(NAV_ITEMS.map((item) => item.group))];
  const viewContent = renderCurrentView(ranks);

  appRoot.innerHTML = `
    <div class="app-shell">
      <aside class="sidebar ${ui.sidebarOpen ? "open" : ""}" id="sidebar">
        <div class="sidebar-brand">
          <div class="brand-seal">禾</div>
          <div><strong>青禾计划</strong><small>UNIVERSITY SIMULATOR</small></div>
        </div>
        <div class="school-chip">
          <strong title="${escapeHtml(state.school.name)}">${escapeHtml(state.school.name)}</strong>
          <span>${schoolNatureLabel()} · ${escapeHtml(getSchoolTier().name)} · 四川省</span>
        </div>
        <div class="nav-scroll">
          ${groups
            .map(
              (group) => `
                <div class="nav-group">
                  <div class="nav-label">${group}</div>
                  ${NAV_ITEMS.filter((item) => item.group === group)
                    .map(
                      (item) => `
                        <button class="nav-item ${ui.view === item.view ? "active" : ""}" type="button" data-action="navigate" data-view="${item.view}">
                          <span class="nav-icon" aria-hidden="true">${item.icon}</span>
                          <span>${item.label}</span>
                          ${item.urgentKey && urgent[item.urgentKey] ? `<span class="nav-count">${urgent[item.urgentKey]}</span>` : ""}
                        </button>
                      `,
                    )
                    .join("")}
                </div>
              `,
            )
            .join("")}
        </div>
        <div class="sidebar-foot">
          <button type="button" data-action="open-tutorial"><span aria-hidden="true">?</span> 新手教程与办校目标</button>
          <button type="button" data-action="open-save-menu"><span aria-hidden="true">⌑</span> 存档与设置</button>
        </div>
      </aside>

      <div class="main-shell">
        <header class="topbar">
          <div class="topbar-left">
            <button class="icon-btn mobile-menu" type="button" data-action="toggle-sidebar" aria-label="打开导航">☰</button>
            <div class="topbar-meta">
              <span class="topbar-date mono">${state.time.year} 年 ${String(state.time.month).padStart(2, "0")} 月 ${String(state.time.day).padStart(2, "0")} 日</span>
              <span class="topbar-divider"></span>
              <span class="topbar-term">${escapeHtml(state.time.term)}</span>
            </div>
          </div>
          <div class="topbar-right">
            <span class="save-state" data-save-state>已自动保存</span>
            <div class="topbar-actions">
              <button class="icon-btn" type="button" data-action="open-tutorial" aria-label="打开教程">?</button>
              <button class="btn btn-outline btn-sm site-preview-btn" type="button" data-action="open-site" title="打开校园官网" aria-label="打开校园官网"><span class="site-preview-icon" aria-hidden="true">▤</span><span class="site-preview-label">官网预览</span></button>
            </div>
            <button class="btn btn-dark btn-sm end-year-btn" type="button" data-action="toggle-clock">${state.time.running ? "暂停" : "继续"}时间</button>
            <div class="segmented time-speed">
              ${[1, 2, 4].map((speed) => `<button class="${state.time.speed === speed ? "active" : ""}" type="button" data-action="set-speed" data-speed="${speed}">${speed}x</button>`).join("")}
            </div>
          </div>
        </header>
        <main class="content">${viewContent}</main>
      </div>
    </div>
  `;
  document.title = `${state.school.name} · 青禾计划`;
}

function renderCurrentView(ranks) {
  const renderers = {
    dashboard: renderDashboard,
    academic: renderAcademic,
    admissions: renderAdmissions,
    governance: renderGovernance,
    research: renderResearch,
    campus: renderCampus,
    life: renderLife,
    finance: renderFinance,
    rankings: renderRankings,
    website: renderWebsite,
  };
  return (renderers[ui.view] || renderDashboard)(ranks);
}

function getTerm(month, day = 1) {
  if (month === 1) return day >= 20 ? "寒假" : "寒假准备期";
  if (month === 2) return "寒假";
  if (month >= 3 && month <= 6) return "春季学期";
  if (month === 7 || month === 8) return "暑假";
  return "秋季学期";
}

function daysInMonth(month, year) {
  const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (month === 2 && ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0)) return 29;
  return days[month - 1];
}

function clockTick() {
  const now = Date.now();
  const elapsed = now - clockLastMs;
  clockLastMs = now;
  if (!state || !state.time.running || ui.modal || document.hidden) return;
  clockAccumulatorMs += elapsed;
  const interval = 60000 / state.time.speed;
  const dayInterval = interval / daysInMonth(state.time.month, state.time.year);
  let advanced = false;
  while (clockAccumulatorMs >= dayInterval) {
    clockAccumulatorMs -= dayInterval;
    advanceDay();
    advanced = true;
  }
  if (advanced) {
    saveState();
    renderApp();
    if (state.notifications.queue.length) openModal("notification");
  }
}

function advanceDay() {
  state.time.day += 1;
  const days = daysInMonth(state.time.month, state.time.year);
  if (state.time.day > days) {
    state.time.day = 1;
    advanceMonth();
  } else {
    state.time.term = getTerm(state.time.month, state.time.day);
  }
  processCalendarDay();
}

function advanceMonth() {
  processBankMonthly();
  processStocksMonthly();
  if (state.time.month === 12) {
    state.time.month = 1;
    state.time.year += 1;
  } else if (state.time.month === 8) {
    state.time.month = 9;
  } else {
    state.time.month += 1;
  }
  state.time.day = 1;
  state.time.term = getTerm(state.time.month, state.time.day);
}

function enqueueNotification(notification) {
  if (state.notifications.muted[notification.type]) return;
  state.notifications.resumedSpeed = state.time.speed || 1;
  state.time.running = false;
  state.notifications.queue.push(notification);
}

function notificationTypeLabel(type) {
  return {
    settlement: "学年结算",
    admissions: "招生计划",
    graduation: "毕业季",
    fixed_deposit: "定期存款到期",
    loan_due: "贷款还款",
    stock_news: "市场动态",
  }[type] || type;
}

function dateNumber(year = state.time.year, month = state.time.month, day = state.time.day) {
  return year * 10000 + month * 100 + day;
}

function isAdmissionApplicationWindow() {
  return dateNumber() >= dateNumber(state.time.year, 1, 1)
    && dateNumber() <= dateNumber(state.time.year, 4, 30);
}

function addWorkingDays(startDate, count) {
  const cursor = new Date(Date.UTC(startDate.year, startDate.month - 1, startDate.day));
  let added = 0;
  while (added < count) {
    cursor.setUTCDate(cursor.getUTCDate() + 1);
    const weekday = cursor.getUTCDay();
    if (weekday !== 0 && weekday !== 6) added += 1;
  }
  return { year: cursor.getUTCFullYear(), month: cursor.getUTCMonth() + 1, day: cursor.getUTCDate() };
}

function formatGameDate(value) {
  if (!value) return "—";
  return `${value.year}.${String(value.month).padStart(2, "0")}.${String(value.day).padStart(2, "0")}`;
}

function milestoneOnce(key) {
  if (state.calendarMilestones.includes(key)) return false;
  state.calendarMilestones.push(key);
  return true;
}

function processCalendarDay() {
  const { year, month, day } = state.time;
  state.time.term = getTerm(month, day);

  if (month === 1 && day === 1 && milestoneOnce(`${year}-admissions-open`)) {
    if (state.admissions.applicationYear < year) resetAdmissionCycle(year);
    enqueueNotification({
      type: "admissions",
      title: `${year} 年招生季开始`,
      detail: "招生计划申报已开放，最晚请于 4 月 30 日前提交。",
      view: "admissions",
    });
  }
  if (month === 1 && day === 20 && milestoneOnce(`${year}-winter`)) {
    enqueueNotification({ type: "winter", title: "寒假开始", detail: "寒假时间为 1 月 20 日至 2 月末。", view: "life" });
  }
  if (month === 3 && day === 1 && milestoneOnce(`${year}-spring`)) {
    enqueueNotification({ type: "semester", title: "春季学期开学", detail: "春季学期教学工作正式开始。", view: "dashboard" });
  }
  if (month === 4 && day === 20 && milestoneOnce(`${year}-deadline-reminder`)) {
    enqueueNotification({ type: "admissions", title: "招生计划即将截止", detail: "招生计划将在 4 月 30 日截止提交。", view: "admissions" });
  }
  if (month === 4 && day === 30 && milestoneOnce(`${year}-admissions-deadline`)) {
    enqueueNotification({ type: "admissions", title: "招生计划申报截止", detail: "本年度招生计划申报窗口已关闭。", view: "admissions" });
  }
  if (month === 5 && day === 31) {
    if (["not_started", "rejected"].includes(state.admissions.planStatus)) {
      state.admissions.planStatus = "missed";
      state.admissions.decisionResult = "missed";
      enqueueNotification({ type: "admission_result", title: "本年度招生申报结束", detail: "学校未在截止日前提交有效招生计划。", view: "admissions" });
    }
    processAdmissionReviews(true);
  }
  if (month === 6 && day === 1 && milestoneOnce(`${year}-graduation`)) processGraduation();
  if (month === 7 && day === 1 && milestoneOnce(`${year}-results`)) publishAdmissionResults();
  if (month === 9 && day === 1 && milestoneOnce(`${year}-opening`)) {
    if (state.time.academicYearStarted) settleYear({ silent: true });
    state.time.academicYearStarted = true;
    enrollPendingFreshmen();
    enqueueNotification({ type: "opening", title: "新学年正式开学", detail: "新生报到完成，秋季学期开始。", view: "dashboard" });
  }
  if (month === 10 && day === 1 && milestoneOnce(`${year}-military`)) {
    state.resources.satisfaction = clamp(state.resources.satisfaction + 1, 0, 100);
    addNews("新生军训圆满结束", "新生完成军训与入学教育，正式进入课程学习阶段。", "校园生活");
    enqueueNotification({ type: "military", title: "新生军训开始", detail: "军训与入学教育本月开展。", view: "life" });
  }
  processAdmissionReviews(false);
}

function resetAdmissionCycle(year) {
  state.admissions.applicationYear = year;
  state.admissions.planStatus = "not_started";
  state.admissions.approvedTotal = 0;
  state.admissions.campaignDone = false;
  state.admissions.submittedAt = null;
  state.admissions.reviewStartedAt = null;
  state.admissions.decisionAt = null;
  state.admissions.decisionResult = null;
  state.admissions.resultPublishedAt = null;
  state.admissions.pendingFreshmen = 0;
  state.admissions.strategy = "steady";
  redistributeAdmissionDraft();
}

function processAdmissionReviews(force = false) {
  if (!["submitted"].includes(state.admissions.planStatus)) return;
  const due = state.admissions.decisionAt && dateNumber() >= dateNumber(state.admissions.decisionAt.year, state.admissions.decisionAt.month, state.admissions.decisionAt.day);
  const forced = force || dateNumber() >= dateNumber(state.time.year, 5, 31);
  if (!due && !forced) return;
  const approved = Math.random() < approxApprovalChance();
  state.admissions.planStatus = approved ? "approved" : "rejected";
  state.admissions.decisionResult = approved ? "approved" : "rejected";
  if (approved) {
    state.admissions.approvedTotal = planTotal();
    addNews(`${state.time.year}年招生计划获批`, `本年度计划招生 ${formatNumber(state.admissions.approvedTotal)} 人。`, "招生就业");
  } else {
    state.admissions.approvedTotal = 0;
    addNews("年度招生计划未获批准", "学校将根据反馈优化培养条件。", "通知公告", null, false);
  }
  enqueueNotification({
    type: "admission_result",
    title: approved ? "招生计划获批" : "招生计划未获批准",
    detail: approved ? `共批复 ${formatNumber(state.admissions.approvedTotal)} 人，可在 6 月 30 日前确认招生策略。` : "本年度招生计划未获批准。",
    view: "admissions",
  });
}

function processGraduation() {
  const remaining = [];
  let graduates = 0;
  state.admissions.cohorts.forEach((cohort) => {
    if (state.time.year - cohort.year >= 4) graduates += cohort.size;
    else remaining.push(cohort);
  });
  if (!graduates) return;
  state.admissions.cohorts = remaining;
  state.resources.students = remaining.reduce((sum, cohort) => sum + cohort.size, 0);
  state.resources.alumni += graduates;
  state.lastGraduationCount = graduates;
  addNews(`${state.time.year}届学生毕业`, `${formatNumber(graduates)} 名学生完成学业，加入校友会。`, "学校要闻");
  enqueueNotification({ type: "graduation", title: "毕业季", detail: `${formatNumber(graduates)} 名学生毕业并加入校友会。`, view: "life" });
}

function publishAdmissionResults() {
  if (!["approved", "strategy_confirmed"].includes(state.admissions.planStatus)) return;
  const strategy = state.admissions.strategy || "steady";
  const bonuses = { steady: 0.58, media: 0.63, scholarship: 0.68 };
  const threshold = state.resources.quality * 0.003 + state.resources.reputation * 0.002 + state.resources.employment * 0.001;
  const yieldRate = clamp((bonuses[strategy] || 0.58) + threshold + randomBetween(-0.05, 0.05), 0.45, 0.96);
  const actual = Math.min(state.admissions.approvedTotal, Math.round(state.admissions.approvedTotal * yieldRate));
  state.admissions.lastResult = {
    year: state.time.year,
    planned: state.admissions.approvedTotal,
    actual,
    yield: actual / Math.max(1, state.admissions.approvedTotal),
    cost: state.admissions.campaignCost || 0,
    cohortQuality: Math.round(clamp(48 + state.resources.quality * 0.3 + state.resources.reputation * 0.2, 35, 96)),
    strategy,
    reach: "四川省内",
  };
  state.admissions.pendingFreshmen = actual;
  state.admissions.resultPublishedAt = { year: state.time.year, month: 7, day: 1 };
  state.admissions.planStatus = "results_published";
  addNews(`${state.time.year}年录取结果公布`, `共录取 ${formatNumber(actual)} 名新生，新生将于 9 月报到。`, "招生就业");
  enqueueNotification({ type: "admission_result", title: "录取结果已公布", detail: `共录取 ${formatNumber(actual)} 名新生，9 月正式入学。`, view: "admissions" });
}

function enrollPendingFreshmen() {
  const count = state.admissions.pendingFreshmen || 0;
  if (count <= 0) return;
  state.admissions.cohorts.push({ year: state.time.year, size: count, initialSize: count, quality: state.admissions.lastResult?.cohortQuality || 55 });
  state.resources.students += count;
  addNews(`${state.time.year}级新生完成报到`, `${formatNumber(count)} 名新生正式入学，学校进入新学年。`, "招生就业");
  state.admissions.pendingFreshmen = 0;
  state.admissions.planStatus = "completed";
}

function processBankMonthly() {
  const bank = state.bank;
  const demandInterest = bank.demand * (BANK_RATES.demand / 12);
  bank.demand = roundScore(bank.demand + demandInterest);
  if (demandInterest > 0) addBankTransaction("利息", roundScore(demandInterest), "活期存款结息");

  bank.fixed = bank.fixed.filter((deposit) => {
    deposit.monthsLeft -= 1;
    if (deposit.monthsLeft > 0) return true;
    const interest = deposit.principal * (deposit.annualRate / 12) * deposit.termMonths;
    bank.demand = roundScore(bank.demand + deposit.principal + interest);
    addBankTransaction("到账", roundScore(deposit.principal + interest), `${deposit.termMonths}个月定期到期`);
    enqueueNotification({
      type: "fixed_deposit",
      title: "定期存款到期",
      detail: `${formatMoney(deposit.principal)}定期存款已到期，本金与利息转入活期。`,
      view: "finance",
    });
    return false;
  });

  bank.loans.forEach((loan) => {
    const interest = loan.remaining * (loan.annualRate / 12);
    const payment = loan.monthlyPrincipal + interest;
    if (state.resources.cash >= payment) {
      state.resources.cash = roundScore(state.resources.cash - payment);
      loan.remaining = roundScore(Math.max(0, loan.remaining - loan.monthlyPrincipal));
      loan.monthsLeft -= 1;
      addBankTransaction("还款", roundScore(payment), `贷款 ${loan.id} 月供`);
      bank.credit = Math.min(100, bank.credit + 1);
    } else {
      loan.overdue += 1;
      loan.penalty += payment * 0.03;
      bank.credit = Math.max(0, bank.credit - 10);
      addBankTransaction("逾期", roundScore(payment), `贷款 ${loan.id} 逾期未还`);
      enqueueNotification({
        type: "loan_due",
        title: "贷款还款不足",
        detail: `贷款 ${loan.id} 本期还款 ${formatMoney(roundScore(payment))}，现金不足已形成逾期。`,
        view: "finance",
      });
    }
  });
  bank.loans = bank.loans.filter((loan) => loan.monthsLeft > 0);
}

function processStocksMonthly() {
  const prices = state.stock.prices;
  STOCK_MARKET.forEach((stock) => {
    const previous = prices[stock.symbol] || stock.basePrice;
    const move = stock.drift + stock.volatility * (stableFraction(`${stock.symbol}:${state.time.year}-${state.time.month}`) * 2 - 1);
    prices[stock.symbol] = roundScore(Math.max(1, previous * (1 + clamp(move, -0.12, 0.12))));
  });
}

function addBankTransaction(type, amount, note) {
  state.bank.transactions.unshift({
    id: `bk-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
    type,
    amount,
    note,
    date: `${state.time.year}.${String(state.time.month).padStart(2, "0")}`,
  });
  state.bank.transactions = state.bank.transactions.slice(0, 60);
}

function pageHead(kicker, title, description, actions = "") {
  return `
    <div class="page-head">
      <div class="page-head-copy">
        <div class="eyebrow">${escapeHtml(kicker)}</div>
        <h1>${escapeHtml(title)}</h1>
        <p>${description}</p>
      </div>
      ${actions ? `<div class="page-head-actions">${actions}</div>` : ""}
    </div>
  `;
}

function renderDashboard(ranks) {
  const next = currentAction();
  const taskItems = [
    {
      done: state.flags.firstCollege,
      urgent: !state.flags.firstCollege,
      title: "建立首个二级学院",
      detail: state.flags.firstCollege
        ? `${state.colleges.length} 个学院 · ${getPrograms().length} 个专业`
        : "从数字技术、智能制造、健康护理等方向中选择办学起点",
      view: "academic",
    },
    {
      done: ["approved", "completed"].includes(state.admissions.planStatus),
      urgent: state.flags.firstCollege && state.admissions.planStatus === "not_started",
      title: "提交年度招生计划",
      detail:
        state.admissions.planStatus === "approved"
          ? `教育厅已批复 ${formatNumber(state.admissions.approvedTotal)} 人`
          : state.admissions.planStatus === "completed"
            ? `本学年实际报到 ${formatNumber(state.admissions.lastResult?.actual || 0)} 人`
            : "按专业上报拟招生数，等待教育厅审批",
      view: "admissions",
    },
    {
      done: state.admissions.campaignDone,
      urgent: state.admissions.planStatus === "approved" && !state.admissions.campaignDone,
      title: "开展招生投放",
      detail: state.admissions.campaignDone
        ? "本年度招生已完成"
        : "选择投放策略与招生范围，形成首届 cohort",
      view: "admissions",
    },
    {
      done: state.history.length > 0,
      urgent: state.admissions.campaignDone && !state.history.length,
      title: "完成学年结算",
      detail: state.history.length
        ? `已完成 ${state.history.length} 个学年`
        : "核算学费与成本，形成首份年度办学报告",
      view: "dashboard",
    },
  ];
  const heroTitle = !state.flags.firstCollege
    ? "为这所学校，找到它的<em>第一个方向</em>。"
    : state.admissions.campaignDone
      ? "把这一届学生，<em>真正教好</em>。"
      : "批复只是开始，<em>招到合适的</em>学生才算开学。";
  const heroDesc = !state.flags.firstCollege
    ? "先设立一所学院。它将带来首批专业、教师与招生计划，也决定学校最早的行业联系。"
    : "第一年是建立规则的窗口。控制成本、关注师资配比，也要让学生感受到这所学校值得选择。";
  const news = state.news.slice(0, 4);

  return `
    ${pageHead(
      `${state.time.year} ACADEMIC YEAR`,
      "校务总览",
      `欢迎回来，${state.governance.president ? escapeHtml(state.governance.president.name) : "代校长"}。今天处理哪些决定？`,
      `<span class="badge badge-gold">${schoolNatureLabel()} · ${escapeHtml(getSchoolTier().name)}</span>`,
    )}

    <section class="dashboard-hero">
      <div class="hero-main">
        <div class="hero-overline">${next.label} · 第 ${state.time.turn + 1} 学年</div>
        <h2>${heroTitle}</h2>
        <p>${heroDesc}</p>
        <div class="hero-actions">
          <button class="btn btn-primary" type="button" data-action="navigate" data-view="${next.view}">${next.label} <span aria-hidden="true">→</span></button>
          <button class="btn btn-outline" type="button" data-action="open-tutorial">查看办校指南</button>
        </div>
      </div>
      <div class="hero-side">
        <div class="rank-display">
          <div class="rank-ring" style="--p:${clamp(ranks.strength, 4, 100)}%">
            <div><strong>${ranks.provincial}</strong><span>省内位次</span></div>
          </div>
          <div class="rank-copy">
            <small>RANKING SNAPSHOT · ${ranks.updatedYear}</small>
            <strong>${escapeHtml(ranks.tier.name)}</strong>
            <span>省榜 ${ranks.player.provincial.toFixed(1)}/1000 · 全国 ${ranks.player.national.toFixed(1)}/1000<br />国际 ${ranks.player.world.toFixed(1)}/10000</span>
          </div>
        </div>
        <div class="hero-quote">“${state.governance.president?.quote || "先把第一届学生教好，再谈宏大的愿景。"}”</div>
      </div>
    </section>

    <section class="metric-grid">
      ${metricCard("可用资金", formatMoney(state.resources.cash), "¥", "资金", "annual", state.history[0] ? `上年度结余变动 ${signedMoney(state.history[0].profit)}` : "启动资金与学费收入", "var(--green-soft)", "var(--green)")}
      ${metricCard("在校学生", `${formatNumber(state.resources.students)}<small>人</small>`, "生", "学生", "capacity", `培养容量 ${formatNumber(state.resources.capacity)} 人`, "var(--blue-soft)", "var(--blue)")}
      ${metricCard("专任教师", `${formatNumber(state.resources.faculty)}<small>人</small>`, "师", "教师", "ratio", `生师比 ${state.resources.faculty ? (state.resources.students / state.resources.faculty).toFixed(1) : "0.0"} : 1`, "var(--amber-soft)", "var(--amber)")}
      ${metricCard("就业质量", `${state.resources.employment}<small>/ 100</small>`, "职", "就业", "employment", "用于招生吸引力与排名", "var(--violet-soft)", "var(--violet)")}
    </section>

    <div class="dashboard-grid">
      <div class="stack">
        <section class="panel">
          <div class="panel-head">
            <div><h3>本学年待办</h3><p>关键决定会改变招生、财务与排名</p></div>
            <span class="status-pill ${taskItems.filter((item) => !item.done).length ? "status-pending" : "status-success"}">${taskItems.filter((item) => !item.done).length} 项未完成</span>
          </div>
          <div class="task-list">
            ${taskItems
              .map(
                (item, index) => `
                  <div class="task-item ${item.done ? "done" : ""} ${item.urgent ? "urgent" : ""}" data-action="navigate" data-view="${item.view}" role="button" tabindex="0">
                    <div class="task-check">${item.done ? "✓" : String(index + 1).padStart(2, "0")}</div>
                    <div class="task-copy"><strong>${item.title}</strong><span>${item.detail}</span></div>
                    ${item.urgent ? `<div class="pulse-dot"></div>` : `<span class="task-arrow">›</span>`}
                  </div>
                `,
              )
              .join("")}
          </div>
        </section>

        <section class="panel">
          <div class="panel-head">
            <div><h3>办学健康度</h3><p>长期指标比单年利润更重要</p></div>
            <button class="btn btn-ghost btn-sm" type="button" data-action="navigate" data-view="rankings">查看排名方法</button>
          </div>
          <div class="panel-body">
            <div class="score-grid">
              ${scoreItem("办学质量", state.resources.quality, "教学、师资与设施共同决定", "gold")}
              ${scoreItem("科研水平", state.resources.research, "项目、平台与学位点建设", "")}
              ${scoreItem("社会声誉", state.resources.reputation, "招生、赛事与公开信息", "gold")}
              ${scoreItem("学生满意度", state.resources.satisfaction, "社团、住宿与校园生活", "")}
            </div>
          </div>
        </section>
      </div>

      <div class="stack">
        <section class="panel">
          <div class="panel-head">
            <div><h3>校园动态</h3><p>最近发布的校务信息</p></div>
            <button class="btn btn-ghost btn-sm" type="button" data-action="navigate" data-view="website">官网</button>
          </div>
          <div class="panel-body">
            <div class="feed-list">
              ${
                news.length
                  ? news
                      .map(
                        (item) => `
                          <div class="feed-item">
                            <div class="feed-date">${escapeHtml(item.date.slice(5).replace("-", "."))}<br />${escapeHtml(item.category)}</div>
                            <div class="feed-copy"><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.summary)}</span></div>
                          </div>
                        `,
                      )
                      .join("")
                  : `<div class="feed-item"><div class="feed-date">待发布</div><div class="feed-copy"><strong>尚无公开新闻</strong><span>建立学院或完成招生后，官网会自动生成第一条消息。</span></div></div>`
              }
            </div>
          </div>
        </section>

        <section class="panel">
          <div class="panel-head">
            <div><h3>办学摘要</h3><p>截至 ${state.time.year} 学年</p></div>
          </div>
          <div class="panel-body">
            <div class="stat-row">
              <div class="mini-stat"><span>二级学院</span><strong>${state.colleges.length}</strong><small>个</small></div>
              <div class="mini-stat"><span>开设专业</span><strong>${getPrograms().length}</strong><small>个</small></div>
              <div class="mini-stat"><span>已开发地块</span><strong>${state.campus.plots.filter((plot) => plot.built).length}</strong><small>块</small></div>
              <div class="mini-stat"><span>校友总数</span><strong>${formatNumber(state.resources.alumni)}</strong><small>人</small></div>
            </div>
          </div>
        </section>
      </div>
    </div>
  `;
}

function metricCard(label, value, icon, glow, foot, footLabel, bg, color) {
  const glowMap = {
    annual: "rgba(58, 111, 91, 0.09)",
    capacity: "rgba(56, 107, 131, 0.09)",
    ratio: "rgba(164, 103, 38, 0.09)",
    employment: "rgba(109, 88, 125, 0.09)",
  };
  return `
    <div class="metric-card">
      <div class="metric-top">
        <span class="metric-label">${label}</span>
        <span class="metric-icon" style="--metric-bg:${bg};--metric-color:${color}">${icon}</span>
      </div>
      <div class="metric-value">${value}</div>
      <div class="metric-foot"><span class="positive">${foot}</span> ${footLabel}</div>
    </div>
  `;
}

function scoreItem(label, value, hint, tone) {
  return `
    <div class="score-item">
      <div class="progress-info"><span>${label}<small class="muted"> · ${hint}</small></span><strong>${value}/100</strong></div>
      <div class="progress-track"><div class="progress-fill ${tone === "gold" ? "gold" : ""}" style="width:${clamp(value, 0, 100)}%"></div></div>
    </div>
  `;
}

function signedMoney(value) {
  const amount = Math.round(value);
  return `${amount >= 0 ? "+" : "−"}¥${formatNumber(Math.abs(amount))} 万`;
}

function renderAcademic() {
  const programs = getPrograms();
  const totalStudents = state.resources.students;
  return `
    ${pageHead(
      "ACADEMIC ARCHITECTURE",
      "学院与学科",
      "按“学院 → 专业”组织培养体系。每所学院只能开设自己名下的专业。",
      `
        <button class="btn btn-dark btn-sm" type="button" data-action="open-add-college">申报新学院</button>
      `,
    )}

    ${
      !state.colleges.length
        ? `<div class="empty-state">
            <div>
              <div class="empty-icon">院</div>
              <h3>还没有一个可以招生的学院</h3>
              <p>十所学院各有固定的专业方向。选定后仍可继续申报其他学院，但第一学院会决定你最早积累的能力。</p>
              <button class="btn btn-primary" type="button" data-action="open-initial-college">建立首个学院</button>
            </div>
          </div>`
        : ""
    }

    <div class="metric-grid">
      ${metricCard("已设学院", `${state.colleges.length}<small>/ 10</small>`, "院", "", "组织结构", "十所学院可逐步设立", "var(--teal-soft)", "var(--green)")}
      ${metricCard("开设专业", `${programs.length}<small>个</small>`, "专", "", "专业布局", "专业直接归属学院", "var(--blue-soft)", "var(--blue)")}
      ${metricCard("生师比", `${state.resources.faculty ? (totalStudents / state.resources.faculty).toFixed(1) : "0.0"}<small>:1</small>`, "比", "", totalStudents > state.resources.faculty * 24 ? "师资偏紧" : "师资结构健康", "建议不高于 22:1", "var(--amber-soft)", "var(--amber)")}
      ${metricCard("办学质量", `${state.resources.quality}<small>/ 100</small>`, "质", "", "人才培养", "影响审批和招生", "var(--violet-soft)", "var(--violet)")}
    </div>

    <div class="college-list">
      ${COLLEGE_TEMPLATES.map((template) => {
        const college = state.colleges.find((item) => item.id === template.id);
        const openedPrograms = college?.programs || [];
        const remaining = template.programs.filter((name) => !openedPrograms.some((program) => program.name === name));
        return `
          <section class="college-card">
            <div class="college-banner">
              <div class="college-mark">${escapeHtml(template.icon)}</div>
              <div class="college-title">
                <h3>${escapeHtml(template.name)}</h3>
                <p>${escapeHtml(template.category)} · 可设专业 ${template.programs.length} 个${college ? ` · 已开设 ${openedPrograms.length} 个` : ""}</p>
              </div>
              <span class="badge">${college ? "已设立" : "未设立"}</span>
            </div>
            <div class="college-body">
              ${
                college
                  ? openedPrograms.length
                    ? `<div class="program-list">${openedPrograms.map((program) => `<span class="program-chip">${escapeHtml(program.name)}</span>`).join("")}</div>`
                    : `<p class="muted small">学院已设立，尚未开设专业。</p>`
                  : `<p class="muted small">${escapeHtml(template.summary)}</p>`
              }
            </div>
            <div class="college-actions">
              ${
                college
                  ? remaining.length
                    ? `<button class="btn btn-outline btn-sm" type="button" data-action="open-add-program" data-college-id="${college.id}">新增专业 · ${remaining.length} 个可选</button>`
                    : `<span class="badge">专业已全部开设</span>`
                  : `<button class="btn btn-outline btn-sm" type="button" data-action="choose-college" data-id="${template.id}" data-initial="false">申报设立</button>`
              }
              ${college ? `<button class="btn btn-ghost btn-sm" type="button" data-action="navigate" data-view="admissions">制定招生计划</button>` : ""}
            </div>
          </section>
        `;
      }).join("")}
    </div>

    ${
      programs.length
        ? `<section class="panel" style="margin-top:17px">
            <div class="panel-head">
              <div><h3>专业目录与招生基础</h3><p>专业代码为示例性培养代码，年度人数可在招生工作台调整</p></div>
              <span class="badge">${programs.length} 个专业</span>
            </div>
            <div class="panel-body flush" style="overflow-x:auto">
              <table class="program-table">
                <thead><tr><th>专业</th><th>所属学院</th><th>专业代码</th><th>培养方向</th></tr></thead>
                <tbody>
                  ${programs
                    .map(
                      (program) => `
                        <tr>
                          <td><span class="table-title">${escapeHtml(program.name)}</span><span class="table-sub">校级备案专业</span></td>
                          <td>${escapeHtml(program.collegeName)}</td>
                          <td class="mono">${escapeHtml(program.code)}</td>
                          <td><span class="badge">技术技能型</span></td>
                        </tr>
                      `,
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
          </section>`
        : ""
    }
  `;
}

function renderAdmissions() {
  const programs = getPrograms();
  if (!programs.length) {
    return `
      ${pageHead("ADMISSIONS OFFICE", "招生与就业", "招生计划必须建立在真实的专业与培养条件之上。")}
      <div class="empty-state"><div><div class="empty-icon">招</div><h3>先建立学院与专业</h3><p>没有专业时，教育局无法受理招生计划。先确定首所学院，再回来制定计划。</p><button class="btn btn-primary" data-action="navigate" data-view="academic">前往学院与学科</button></div></div>
    `;
  }

  const total = planTotal();
  const quota = state.admissions.annualQuota || annualAdmissionQuota();
  const status = state.admissions.planStatus;
  const probability = approxApprovalChance();
  const result = state.admissions.lastResult;
  const ratio = state.resources.faculty ? state.resources.students / state.resources.faculty : 0;
  const statusLabel = {
    not_started: "待上报",
    submitted: "审核中",
    rejected: "未获批准",
    approved: "已批复",
    strategy_confirmed: "招生策略已确认",
    results_published: "录取结果已公布",
    completed: "本年度已完成",
    missed: "错过申报",
  }[status];
  const statusClass = {
    not_started: "status-pending",
    submitted: "status-info",
    rejected: "status-danger",
    approved: "status-info",
    strategy_confirmed: "status-info",
    results_published: "status-success",
    completed: "status-success",
    missed: "status-danger",
  }[status];

  return `
    ${pageHead(
      "ADMISSIONS & OUTCOMES",
      "招生与就业",
      `${state.time.year} 学年计划：先上报、再审批、后投放。报到率取决于学校实力与招生策略，而不是单纯的投放预算。`,
      `<span class="status-pill ${statusClass}">${statusLabel}</span>`,
    )}

    ${
      result
        ? `<div class="result-hero" style="margin-bottom:17px">
            <h3>${result.year} 年招生结果</h3>
            <p>计划批复 ${formatNumber(result.planned)} 人 · 实际报到 ${formatNumber(result.actual)} 人 · 报到率 ${(result.yield * 100).toFixed(1)}%</p>
            <div class="result-stats">
              <div class="result-stat"><span>投放成本</span><strong>${formatMoney(result.cost)}</strong></div>
              <div class="result-stat"><span>报到新生</span><strong>${formatNumber(result.actual)} 人</strong></div>
              <div class="result-stat"><span>生源质量</span><strong>${result.cohortQuality}<small> / 100</small></strong></div>
            </div>
          </div>`
        : ""
    }

    <div class="admission-layout">
      <section class="panel">
        <div class="panel-head">
          <div><h3>${state.admissions.campaignDone ? "本年度计划执行情况" : "年度分校分专业招生计划"}</h3><p>${state.admissions.campaignDone ? "下一学年可重新制定计划" : `本年度新生配额 ${formatNumber(quota)} 人，按总培养容量分四年自动分配`}</p></div>
          <span class="badge">${formatNumber(total)} / ${formatNumber(quota)} 人</span>
        </div>
        <div class="panel-body">
          ${
            status === "submitted"
              ? `<div class="notice" style="margin-bottom:13px"><span class="notice-icon">审</span><span>计划已于 ${formatGameDate(state.admissions.submittedAt)} 提交，预计 ${formatGameDate(state.admissions.decisionAt)} 前答复。</span></div>`
              : ["approved", "strategy_confirmed", "results_published", "completed"].includes(status)
                ? `<div class="notice" style="margin-bottom:13px"><span class="notice-icon">批</span><span>教育厅已批复 ${formatNumber(state.admissions.approvedTotal)} 人。${status === "approved" ? "请在 6 月 30 日前确认招生策略。" : status === "strategy_confirmed" ? "策略已确认，录取结果将在 7 月 1 日公布。" : status === "results_published" ? "录取已公布，新生将在 9 月 1 日报到。" : "本年度招生已完成。"}</span></div>`
                : ""
          }
          <div>
            ${programs
              .map((program) => {
                const value = Number(state.admissions.draft[program.id] ?? 0);
                const disabled = !["not_started", "rejected"].includes(status) || !isAdmissionApplicationWindow();
                return `
                  <div class="plan-row">
                    <div class="plan-program"><strong>${escapeHtml(program.name)}</strong><span>${escapeHtml(program.collegeName)} · ${escapeHtml(program.category)}</span></div>
                    <div class="stepper">
                      <button type="button" data-action="adjust-plan" data-program="${program.id}" data-delta="-10" ${disabled ? "disabled" : ""}>−</button>
                      <input type="number" min="0" max="500" step="10" value="${value}" data-plan-input="${program.id}" aria-label="${escapeHtml(program.name)}计划人数" ${disabled ? "disabled" : ""} />
                      <button type="button" data-action="adjust-plan" data-program="${program.id}" data-delta="10" ${disabled ? "disabled" : ""}>+</button>
                    </div>
                    <div class="plan-total"><strong>${formatNumber(value)}</strong><span>人 / 年</span></div>
                  </div>
                `;
              })
              .join("")}
          </div>
          <div class="progress-block" style="margin-top:16px">
            <div class="progress-info"><span>新生配额使用率</span><strong>${((total / Math.max(1, quota)) * 100).toFixed(1)}%</strong></div>
            <div class="progress-track"><div class="progress-fill" style="width:${clamp((total / Math.max(1, quota)) * 100, 0, 100)}%"></div></div>
          </div>
          <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:17px">
            ${
              (status === "not_started" || status === "rejected") && isAdmissionApplicationWindow()
                ? `<button class="btn btn-primary" type="button" data-action="submit-plan">提交教育厅审批</button>`
                : status === "approved" && !state.admissions.campaignDone
                  ? `<button class="btn btn-primary" type="button" data-action="open-campaign">确认招生策略</button>`
                  : status === "submitted"
                    ? `<span class="badge">等待审批</span>`
                    : `<button class="btn btn-outline" type="button" data-action="navigate" data-view="dashboard">查看校务</button>`
            }
          </div>
        </div>
      </section>

      <aside class="stack">
        <section class="panel">
          <div class="panel-head"><div><h3>审批预判</h3><p>由办学质量与承载能力估算</p></div></div>
          <div class="panel-body">
            <div class="approval-gauge">
              <div class="big-num">${Math.round(probability * 100)}<small>%</small></div>
              <div><strong>预计通过概率</strong><p>达到建议容量、师资配比健康时，审批会更顺利。最终结果存在有限随机性。</p></div>
            </div>
            <div class="check-list">
              <div class="check-row"><span>培养总容量</span><strong>${formatNumber(state.resources.capacity)} 人</strong></div>
              <div class="check-row"><span>本年度新生配额</span><strong>${formatNumber(quota)} 人</strong></div>
              <div class="check-row"><span>预计稳定在校规模</span><strong>${formatNumber(quota * 4)} 人</strong></div>
              <div class="check-row"><span>当前剩余容量</span><strong>${formatNumber(Math.max(0, state.resources.capacity - state.resources.students))} 人</strong></div>
              <div class="check-row"><span>师资承载</span><strong>${ratio > 24 ? "偏紧" : "正常"}</strong></div>
              <div class="check-row"><span>专业均计划</span><strong>${Math.round(total / programs.length)} 人</strong></div>
              <div class="check-row"><span>办学质量</span><strong>${state.resources.quality} / 100</strong></div>
            </div>
          </div>
        </section>

        <section class="panel">
          <div class="panel-head"><div><h3>就业质量</h3><p>招生宣传的核心依据</p></div></div>
          <div class="panel-body">
            ${scoreItem("毕业生就业质量", state.resources.employment, "校企合作会持续提升", "gold")}
            <div class="notice" style="margin-top:14px"><span class="notice-icon">i</span><span>与产业协同中心或企业共建课程，可提高就业与报到率。</span></div>
          </div>
        </section>
      </aside>
    </div>
  `;
}

function renderGovernance() {
  const president = state.governance.president;
  const years = state.time.year - state.school.founded;
  const tier = getSchoolTier();
  const nextTier = nextSchoolTier(tier.id);
  return `
    ${pageHead(
      "INSTITUTION & PEOPLE",
      "校务与师资",
      "聘任、升格与治理方式共同塑造学校。任何一次任命都会进入官网新闻与办学履历。",
      `<span class="badge badge-gold">${schoolNatureLabel()} · ${escapeHtml(tier.name)}</span>`,
    )}

    <div class="dashboard-grid">
      <div class="stack">
        <section class="panel">
          <div class="panel-head">
            <div><h3>校长任命</h3><p>校长的专长会影响每年指标的自然增长</p></div>
            <button class="btn btn-outline btn-sm" type="button" data-action="open-president">${president ? "改选校长" : "任命首任校长"}</button>
          </div>
          <div class="panel-body">
            ${
              president
                ? `<div class="person-card">
                    <div class="avatar">${escapeHtml(president.name.slice(0, 1))}</div>
                    <div class="person-copy"><strong>${escapeHtml(president.name)} · 校长</strong><span>${escapeHtml(president.title)} · ${escapeHtml(president.trait)}型管理者</span></div>
                    <span class="badge badge-gold">年薪 ${president.salary} 万</span>
                  </div>
                  <p class="muted small" style="margin:13px 0 0">“${escapeHtml(president.quote)}”</p>`
                : `<div class="person-card">
                    <div class="avatar soft">代</div>
                    <div class="person-copy"><strong>校董会代管</strong><span>暂时由举办者兼任，治理与外部声誉增长较慢</span></div>
                    <span class="status-pill status-pending">待任命</span>
                  </div>`
            }
          </div>
        </section>

        <section class="panel">
          <div class="panel-head">
            <div><h3>师资队伍</h3><p>建议生师比不高于 22:1</p></div>
            <button class="btn btn-outline btn-sm" type="button" data-action="hire-faculty" ${state.governance.facultyHires >= 2 ? "disabled" : ""}>人才引进 · 180 万</button>
          </div>
          <div class="panel-body">
            <div class="info-grid">
              <div class="info-box"><span>专任教师</span><strong>${state.resources.faculty} 人</strong></div>
              <div class="info-box"><span>在校学生</span><strong>${formatNumber(state.resources.students)} 人</strong></div>
              <div class="info-box"><span>生师比</span><strong>${state.resources.faculty ? (state.resources.students / state.resources.faculty).toFixed(1) : "0.0"}:1</strong></div>
              <div class="info-box"><span>本年度引进</span><strong>${state.governance.facultyHires} / 2 批</strong></div>
            </div>
            <div class="notice" style="margin-top:14px"><span class="notice-icon">引</span><span>每批引进 8 名专任教师，提升办学质量，并缓解扩招后的生师比压力。</span></div>
          </div>
        </section>

        <section class="panel">
          <div class="panel-head"><div><h3>学校章程与办学履历</h3><p>变化会自动写入官网</p></div></div>
          <div class="panel-body">
            <div class="timeline">
              <div class="timeline-item"><span>${state.school.founded}.09</span><strong>学校获批筹建</strong><p>办学性质：${schoolNatureLabel()}；起点层次：本科。</p></div>
              ${
                state.colleges.length
                  ? `<div class="timeline-item"><span>${state.school.founded}.10</span><strong>${escapeHtml(state.colleges[0].name)}揭牌</strong><p>首批设置 ${state.colleges[0].programs.length} 个专业。</p></div>`
                  : ""
              }
              ${
                president
                  ? `<div class="timeline-item"><span>${state.time.year}.09</span><strong>${escapeHtml(president.name)}就任校长</strong><p>${escapeHtml(president.title)}，治校专长：${escapeHtml(president.trait)}。</p></div>`
                  : ""
              }
              ${(state.tierHistory || []).slice(0, 4).map((item) => `<div class="timeline-item"><span>${item.year}</span><strong>学校层级晋升为${escapeHtml(item.tierName)}</strong><p>${(item.domesticTags || []).length ? `国内标签：${item.domesticTags.map(escapeHtml).join("、")}` : "国内专项标签暂未申请"}${item.internationalTag ? ` · 国际标签：${escapeHtml(item.internationalTag)}` : ""}</p></div>`).join("")}
              ${
                state.history[0]
                  ? `<div class="timeline-item"><span>${state.history[0].year}.12</span><strong>完成第 ${state.history.length} 学年结算</strong><p>年度结余 ${signedMoney(state.history[0].profit)}。</p></div>`
                  : ""
              }
            </div>
          </div>
        </section>
      </div>

      <aside class="stack">
        <section class="panel">
          <div class="panel-head"><div><h3>学校层级晋升</h3><p>层级决定学校分数上限与后续发展空间</p></div></div>
          <div class="panel-body">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
              <span class="badge">${escapeHtml(tier.name)}</span>
              ${nextTier ? `<span class="muted">→</span><span class="badge badge-gold">${escapeHtml(nextTier.name)}</span>` : `<span class="badge badge-gold">已达最高层级</span>`}
            </div>
            <div class="check-list">
              <div class="check-row"><span>省/国分数上限</span><strong>${tier.provincialCap} / 1000</strong></div>
              <div class="check-row"><span>国际分数上限</span><strong>${tier.internationalCap} / 10000</strong></div>
            </div>
            ${
              nextTier
                ? `<div class="requirements" style="margin-top:14px">${tierRequirementRows(nextTier.requirements, years)}</div>
                   <button class="btn btn-dark" style="width:100%;margin-top:14px" type="button" data-action="apply-tier-upgrade" data-tier="${nextTier.id}">申请晋升为${escapeHtml(nextTier.name)}</button>`
                : `<div class="notice" style="margin-top:14px"><span class="notice-icon">顶</span><span>学校已经达到世界重点本科院校层级。</span></div>`
            }
          </div>
        </section>

      </aside>
    </div>
  `;
}

function getUpgradeRequirements(target) {
  const map = {
    职业本科: {
      students: { label: "在校学生", value: 1200, unit: "人" },
      quality: { label: "办学质量", value: 55, unit: "/ 100" },
      research: { label: "科研水平", value: 35, unit: "/ 100" },
      cash: { label: "可用资金", value: 3000, unit: "万" },
      colleges: { label: "二级学院", value: 2, unit: "个" },
    },
    专业硕士授权: {
      students: { label: "在校学生", value: 3000, unit: "人" },
      quality: { label: "办学质量", value: 65, unit: "/ 100" },
      research: { label: "科研水平", value: 55, unit: "/ 100" },
      cash: { label: "可用资金", value: 5200, unit: "万" },
    },
    博士授权: {
      students: { label: "在校学生", value: 6000, unit: "人" },
      quality: { label: "办学质量", value: 78, unit: "/ 100" },
      research: { label: "科研水平", value: 75, unit: "/ 100" },
      cash: { label: "可用资金", value: 12000, unit: "万" },
    },
  };
  return map[target] || {};
}

function currentMetricValue(key) {
  if (key === "colleges") return state.colleges.length;
  if (key === "years") return state.time.year - state.school.founded;
  return state.resources[key] ?? 0;
}

function tierRequirementRows(requirements = {}, years = 0) {
  const meta = {
    students: ["在校学生", "人"],
    quality: ["办学质量", " / 100"],
    reputation: ["社会声誉", " / 100"],
    research: ["科研水平", " / 100"],
    cash: ["可用资金", " 万"],
    years: ["连续办学", " 年"],
    colleges: ["二级学院", " 个"],
  };
  return Object.entries(requirements || {})
    .map(([key, required]) => {
      const [label, unit] = meta[key] || [key, ""];
      const current = key === "years" ? years : currentMetricValue(key);
      return requirementRow(label, formatNumber(current), required, unit);
    })
    .join("");
}

function requirementRow(label, current, required, unit) {
  const numeric = Number(String(current).replaceAll(",", ""));
  const ok = Number.isFinite(numeric) && numeric >= required;
  return `<div class="requirement"><span>${escapeHtml(label)}</span><strong class="${ok ? "positive" : "negative"}">${ok ? "✓" : "○"} ${escapeHtml(String(current))}${escapeHtml(unit)} / ${formatNumber(required)}${escapeHtml(unit)}</strong></div>`;
}

function renderResearch() {
  const projects = state.research.projects || [];
  const masterReady = state.school.level === "本科";
  const doctorReady = state.school.level === "专业硕士授权";
  return `
    ${pageHead(
      "RESEARCH & GRADUATE EDUCATION",
      "科研与学位",
      "先做应用型课题，再争取省级、国家级项目。科研不是单独的数字，它会提升人才吸引力、榜单位次和学位点申请能力。",
      `<span class="badge">科研指数 ${state.resources.research} / 100</span>`,
    )}

    <div class="dashboard-grid">
      <div class="stack">
        <section class="panel">
          <div class="panel-head"><div><h3>科研项目阶梯</h3><p>每类项目每年可申报一次</p></div><span class="badge">${projects.length} 项在办</span></div>
          <div class="panel-body">
            ${researchTier("01", "校级培育", [
              { id: "school-teaching", name: "应用型人才培养模式改革", level: "校级", cost: 60, chance: 0.88, research: 3, requires: "无额外门槛" },
              { id: "school-industry", name: "区域产业人才需求调研", level: "校级", cost: 45, chance: 0.9, research: 2, requires: "无额外门槛" },
            ])}
            ${researchTier("02", "省部级项目", [
              { id: "province-digital", name: "四川省职业教育数字化转型研究", level: "厅级", cost: 160, chance: 0.58, research: 6, requires: "科研 ≥ 30" },
              { id: "province-manufacturing", name: "成渝智能制造产教协同机制研究", level: "省级", cost: 220, chance: 0.5, research: 8, requires: "科研 ≥ 45" },
            ])}
            ${researchTier("03", "国家级项目", [
              { id: "national-applied", name: "国家自然科学基金应用基础项目", level: "国家级", cost: 420, chance: 0.26, research: 15, requires: "科研 ≥ 60" },
              { id: "national-social", name: "国家社会科学基金教育学项目", level: "国家级", cost: 360, chance: 0.29, research: 13, requires: "科研 ≥ 60" },
            ])}
          </div>
        </section>

        ${
          projects.length
            ? `<section class="panel">
                <div class="panel-head"><div><h3>在办科研项目</h3><p>项目在年度结算后产生持续学术影响</p></div></div>
                <div class="panel-body flush">
                  ${projects
                    .slice(0, 6)
                    .map(
                      (project) => `<div class="task-item"><div class="task-check">研</div><div class="task-copy"><strong>${escapeHtml(project.name)}</strong><span>${escapeHtml(project.level)} · ${project.year} 年立项 · 科研 +${project.research}</span></div><span class="status-pill status-success">在研</span></div>`,
                    )
                    .join("")}
                </div>
              </section>`
            : ""
        }
      </div>

      <aside class="stack">
        <section class="panel">
          <div class="panel-head"><div><h3>学位点建设</h3><p>从本科走向研究生教育</p></div></div>
          <div class="panel-body">
            <div class="project-item" style="margin-bottom:9px">
              <div class="project-icon">硕</div>
              <div class="project-copy"><strong>专业硕士学位点</strong><span>${masterReady ? "当前可提交申请" : "需先达到本科层次"}</span></div>
              <button class="btn btn-sm ${masterReady ? "btn-outline" : "btn-ghost"}" type="button" data-action="apply-degree" data-degree="master">申请</button>
            </div>
            <div class="project-item">
              <div class="project-icon">博</div>
              <div class="project-copy"><strong>博士学位授权点</strong><span>${doctorReady ? "当前可提交申请" : "需先取得专业硕士授权"}</span></div>
              <button class="btn btn-sm ${doctorReady ? "btn-outline" : "btn-ghost"}" type="button" data-action="apply-degree" data-degree="doctor">申请</button>
            </div>
            <div class="notice" style="margin-top:14px"><span class="notice-icon">i</span><span>申请需要科研与办学质量达到门槛。失败不会扣除资金，但需等待下一学年再试。</span></div>
          </div>
        </section>

        <section class="panel">
          <div class="panel-head"><div><h3>科研平台</h3><p>校园建设可提供实体空间</p></div></div>
          <div class="panel-body">
            ${
              state.campus.plots.some((plot) => plot.built === "lab" || plot.built === "industry")
                ? `<div class="project-item"><div class="project-icon">⌁</div><div class="project-copy"><strong>产教融合实验平台</strong><span>来自校园建设 · 已投入使用</span></div><span class="status-pill status-success">运行中</span></div>`
                : `<div class="empty-state" style="min-height:150px;padding:20px"><div><div class="empty-icon">⌁</div><h3>尚未建设实验平台</h3><p>实验楼或产业协同中心能提高项目申报成功率。</p><button class="btn btn-outline btn-sm" data-action="navigate" data-view="campus">查看校园地块</button></div></div>`
            }
          </div>
        </section>
      </aside>
    </div>
  `;
}

function researchTier(number, title, items) {
  return `
    <div class="research-tier">
      <div class="tier-head"><span class="tier-num">${number}</span><strong>${title}</strong></div>
      <div class="project-list">
        ${items
          .map(
            (item) => `
              <div class="project-item">
                <div class="project-icon">研</div>
                <div class="project-copy"><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(item.level)} · ${item.requires} · 预计科研 +${item.research}</span></div>
                <button class="btn btn-outline btn-sm" type="button" data-action="open-research" data-project="${item.id}">申报 · ${item.cost} 万</button>
              </div>
            `,
          )
          .join("")}
      </div>
    </div>
  `;
}

function renderCampus() {
  const built = state.campus.plots.filter((plot) => plot.built);
  const owned = state.campus.plots.filter((plot) => plot.owned);
  const totalBuildingEffect = built.reduce(
    (acc, plot) => {
      const building = BUILDINGS.find((item) => item.id === plot.built);
      if (building) {
        acc.quality += building.quality;
        acc.research += building.research;
        acc.satisfaction += building.satisfaction;
      }
      return acc;
    },
    { quality: 0, research: 0, satisfaction: 0 },
  );
  return `
    ${pageHead(
      "CAMPUS DEVELOPMENT",
      "校园建设",
      "地块和建筑决定培养容量、学生生活与科研空间。空闲地块可购买，已购地块可建设新设施。",
      `<span class="badge">${owned.length} 块用地 · ${built.length} 座建筑</span>`,
    )}

    <div class="metric-grid">
      ${metricCard("培养容量", `${formatNumber(state.resources.capacity)}<small>人</small>`, "容", "", built.length ? "建筑扩容已生效" : "暂未扩容", "受教学楼与宿舍共同制约", "var(--blue-soft)", "var(--blue)")}
      ${metricCard("校园用地", `${owned.length}<small>块</small>`, "地", "", "含预留用地", "新地块可继续开发", "var(--gold-soft)", "#8a6322")}
      ${metricCard("设施质量", `+${totalBuildingEffect.quality}<small>点</small>`, "质", "", "相对初始校园", "建筑带来的累计加成", "var(--teal-soft)", "var(--green-700)")}
      ${metricCard("学生生活", `${state.resources.satisfaction}<small>/ 100</small>`, "憩", "", "社团与设施共同影响", "住宿、运动与公共空间", "var(--violet-soft)", "var(--violet)")}
    </div>

    <section class="panel">
      <div class="panel-head">
        <div><h3>青禾校区规划图</h3><p>点击地块可购买用地或选择建设项目</p></div>
        <div class="map-legend">
          <span><i class="legend-dot" style="background:var(--green-700)"></i>已开发</span>
          <span><i class="legend-dot" style="background:#c8c5b5"></i>已购空地</span>
          <span><i class="legend-dot" style="background:#a6a29a"></i>待购地块</span>
        </div>
      </div>
      <div class="panel-body">
        <div class="campus-map">
          ${state.campus.plots
            .map((plot, index) => {
              const building = BUILDINGS.find((item) => item.id === plot.built);
              const alt = ["library", "dorm", "sports"].includes(plot.built);
              return `
                <button
                  class="map-plot ${plot.built ? "built " + escapeHtml(plot.built) : plot.owned ? "vacant" : "locked"}"
                  type="button"
                  data-action="open-plot"
                  data-plot="${plot.id}"
                  aria-label="${escapeHtml(plot.label)}，${plot.built ? "已建设" : plot.owned ? "已购空地" : "待购地块"}"
                >
                  <span class="plot-zone">${escapeHtml(plot.zone)}<span class="mono">${String(index + 1).padStart(2, "0")}</span></span>
                  ${plot.built ? `<div class="plot-illustration ${alt ? "alt" : ""}"></div>` : plot.owned ? `<div class="plot-illustration" style="opacity:.18"></div>` : ""}
                  <span class="plot-name">${escapeHtml(building?.name || plot.label)}</span>
                  <span class="plot-status">${plot.built ? `+${building?.capacity || 0} 容量 · ${plot.label}` : plot.owned ? "已购 · 点击开始建设" : "未购 · 点击查看用地"}</span>
                  ${!plot.owned ? `<span class="plot-price">用地 ${plot.price} 万</span>` : ""}
                </button>
              `;
            })
            .join("")}
        </div>
        <div class="method-note">地块和楼宇为模拟资产，价格、容量与效果用于经营决策，不对应现实规划数据。</div>
      </div>
    </section>
  `;
}

function renderLife() {
  const tabs = [
    { id: "clubs", label: "学生社团" },
    { id: "competitions", label: "赛事中心" },
    { id: "partners", label: "校企合作" },
    { id: "alumni", label: "校友会" },
  ];
  return `
    ${pageHead(
      "STUDENT LIFE & EXTENSION",
      "校园生活",
      "一所学校的气质不只来自排名，也来自社团、比赛、合作企业，以及学生毕业多年后是否愿意回来。",
      `<span class="badge">学生满意度 ${state.resources.satisfaction} / 100</span>`,
    )}
    <div class="tabs" role="tablist">
      ${tabs.map((tab) => `<button class="tab ${ui.lifeTab === tab.id ? "active" : ""}" type="button" role="tab" data-action="life-tab" data-tab="${tab.id}">${tab.label}</button>`).join("")}
    </div>
    <div class="tab-panel active">${renderLifeTab()}</div>
  `;
}

function renderLifeTab() {
  if (ui.lifeTab === "competitions") return renderCompetitions();
  if (ui.lifeTab === "partners") return renderPartnerships();
  if (ui.lifeTab === "alumni") return renderAlumni();
  return renderClubs();
}

function renderClubs() {
  return `
    <div class="dashboard-grid">
      <section class="panel">
        <div class="panel-head"><div><h3>在册学生社团</h3><p>社团数量与质量会提升学生满意度</p></div><button class="btn btn-outline btn-sm" data-action="open-add-club">成立新社团</button></div>
        <div class="panel-body">
          <div class="club-grid">
            ${state.clubs
              .map(
                (club) => `
                  <article class="club-card">
                    <div class="club-top"><span class="club-icon">${escapeHtml(club.icon)}</span><span class="badge">${escapeHtml(club.category)}</span></div>
                    <h4>${escapeHtml(club.name)}</h4>
                    <p>${escapeHtml(club.description)}</p>
                    <div class="club-meta"><span>${formatNumber(club.members)} 名成员</span><span>满意度 +${club.satisfaction}</span></div>
                  </article>
                `,
              )
              .join("")}
          </div>
        </div>
      </section>
      <aside class="stack">
        <section class="panel">
          <div class="panel-head"><div><h3>全年校园节奏</h3><p>每年都会发生的学生活动</p></div></div>
          <div class="panel-body">
            <div class="timeline">
              <div class="timeline-item"><span>09 月</span><strong>新生开学季</strong><p>迎新、军训与百团招新。</p></div>
              <div class="timeline-item"><span>10 月</span><strong>校运会与社团文化节</strong><p>提升凝聚力与校园满意度。</p></div>
              <div class="timeline-item"><span>04 月</span><strong>职业教育活动周</strong><p>开放实训室，邀请企业与学生家长。</p></div>
              <div class="timeline-item"><span>06 月</span><strong>毕业季与就业双选会</strong><p>校友数据与就业质量更新。</p></div>
            </div>
          </div>
        </section>
      </aside>
    </div>
  `;
}

function renderCompetitions() {
  const year = state.time.year;
  return `
    <section class="panel">
      <div class="panel-head"><div><h3>${year} 年赛事日历</h3><p>赛事分为校级、省级、国家级与世界级；成绩取决于学校现阶段实力</p></div><span class="badge">${Object.keys(state.competitions.entries).length} 次参赛记录</span></div>
      <div class="panel-body">
        ${COMPETITIONS.map(
          (comp) => {
            const entry = state.competitions.entries[`${year}:${comp.id}`];
            return `
              <div class="competition-card">
                <div class="competition-date"><strong>${escapeHtml(comp.season.slice(0, 2))}</strong><span>${escapeHtml(comp.level)}</span></div>
                <div class="competition-copy"><strong>${escapeHtml(comp.name)}</strong><span>${escapeHtml(comp.requires)} · 参赛投入 ${comp.cost} 万 · 声誉 +${comp.reputation} 上限</span></div>
                <div class="competition-result">
                  ${
                    entry
                      ? `<span class="trophy">${entry.award === "未获奖" ? "○" : "★"}</span><span class="badge">${escapeHtml(entry.award)}</span>`
                      : `<button class="btn btn-outline btn-sm" data-action="register-competition" data-id="${comp.id}">组织参赛</button>`
                  }
                </div>
              </div>
            `;
          },
        ).join("")}
      </div>
    </section>
    <div class="notice" style="margin-top:14px"><span class="notice-icon">赛</span><span>每项赛事每学年只能报名一次。校赛是低风险的实训机会，国赛与世界赛更依赖科研、师资和办学层次。</span></div>
  `;
}

function renderPartnerships() {
  return `
    <div class="dashboard-grid">
      <section class="panel">
        <div class="panel-head"><div><h3>校企合作单位</h3><p>合作提高就业、科研与实训质量</p></div><button class="btn btn-outline btn-sm" data-action="open-partner">拓展合作企业</button></div>
        <div class="panel-body">
          ${
            state.partnerships.length
              ? `<div class="college-list">${state.partnerships
                  .map(
                    (partner) => `<div class="person-card"><div class="avatar soft">企</div><div class="person-copy"><strong>${escapeHtml(partner.name)}</strong><span>${escapeHtml(partner.field)} · ${partner.year} 年签约</span></div><span class="badge badge-gold">就业 +${partner.employment}</span></div>`,
                  )
                  .join("")}</div>`
              : `<div class="empty-state"><div><div class="empty-icon">企</div><h3>尚未建立校企合作</h3><p>第一家企业合作会形成实习基地，并进入校园官网的产教融合新闻。</p><button class="btn btn-primary" data-action="open-partner">寻找合作企业</button></div></div>`
          }
        </div>
      </section>
      <aside class="panel">
        <div class="panel-head"><div><h3>产教融合效益</h3><p>合作不是一次性奖励</p></div></div>
        <div class="panel-body">
          <div class="score-grid">
            <div class="score-item"><div class="progress-info"><span>就业质量</span><strong>${state.resources.employment}</strong></div><div class="progress-track"><div class="progress-fill gold" style="width:${state.resources.employment}%"></div></div></div>
            <div class="score-item"><div class="progress-info"><span>社会声誉</span><strong>${state.resources.reputation}</strong></div><div class="progress-track"><div class="progress-fill" style="width:${state.resources.reputation}%"></div></div></div>
          </div>
          <div class="notice" style="margin-top:14px"><span class="notice-icon">i</span><span>企业合作会提高招生报到率和就业，也会为后续的产业协同中心提供合作基础。</span></div>
        </div>
      </aside>
    </div>
  `;
}

function renderAlumni() {
  const canHold = state.resources.alumni >= 50;
  return `
    <div class="dashboard-grid">
      <section class="panel">
        <div class="panel-head"><div><h3>青禾校友会</h3><p>学生毕业后自动进入校友网络</p></div><span class="badge badge-gold">${formatNumber(state.resources.alumni)} 位校友</span></div>
        <div class="panel-body">
          <div class="info-grid">
            <div class="info-box"><span>校友总数</span><strong>${formatNumber(state.resources.alumni)}</strong></div>
            <div class="info-box"><span>活跃地区</span><strong>成渝</strong></div>
            <div class="info-box"><span>年度捐赠</span><strong>${formatMoney(Math.round(state.resources.alumni * 0.018))}</strong></div>
            <div class="info-box"><span>校友活动</span><strong>${canHold ? "可举办" : "待解锁"}</strong></div>
          </div>
          <div class="notice" style="margin-top:14px"><span class="notice-icon">友</span><span>学生按四年制培养，毕业结算后进入校友网络。校友越多，返校日可募集的发展基金越高。</span></div>
          <button class="btn btn-dark" style="margin-top:15px" data-action="hold-alumni-day" ${canHold ? "" : "disabled"}>举办校友返校日</button>
        </div>
      </section>
      <aside class="panel">
        <div class="panel-head"><div><h3>校友记忆</h3><p>学校的长期资产</p></div></div>
        <div class="panel-body">
          <div class="timeline">
            ${state.history.length ? state.history.slice(0, 5).map((item) => `<div class="timeline-item"><span>${item.year}</span><strong>第 ${item.year - state.school.founded + 1} 届学生成长记录</strong><p>当年在校 ${formatNumber(item.students)} 人，新增校友 ${formatNumber(item.graduates)} 人。</p></div>`).join("") : `<div class="timeline-item"><span>尚未毕业</span><strong>第一批校友正在路上</strong><p>完成四年培养后，第一届学生将回到学校。</p></div>`}
          </div>
        </div>
      </aside>
    </div>
  `;
}

function renderFinance() {
  const tabs = [
    { id: "bank", label: "银行业务" },
    { id: "stock", label: "股票账户" },
  ];
  const totalLoan = roundScore(state.bank.loans.reduce((sum, loan) => sum + loan.remaining, 0));
  return `
    ${pageHead(
      "FINANCE & INVESTMENT",
      "银行与投资",
      "存款、贷款与股票投资都与学校可用资金分开管理，所有流水会写入存档。",
      `<span class="badge badge-gold">信用 ${state.bank.credit}</span>`,
    )}
    <div class="tabs" role="tablist">
      ${tabs.map((tab) => `<button class="tab ${ui.financeTab === tab.id ? "active" : ""}" type="button" data-action="finance-tab" data-tab="${tab.id}">${tab.label}</button>`).join("")}
    </div>
    ${ui.financeTab === "bank" ? renderBankTab(totalLoan) : renderStockTab()}
  `;
}

function renderBankTab(totalLoan) {
  return `
    <div class="metric-grid">
      ${metricCard("活期存款", `${formatMoney(state.bank.demand)}`, "存", "", "银行账户", "可随时存取", "var(--teal-soft)", "var(--green)")}
      ${metricCard("定期存单", `${state.bank.fixed.length}<small>笔</small>`, "定", "", "到期结息", "3 / 6 / 12 个月", "var(--blue-soft)", "var(--blue)")}
      ${metricCard("贷款余额", `${formatMoney(totalLoan)}`, "贷", "", "信用融资", "按月自动还款", "var(--red-soft)", "var(--red)")}
      ${metricCard("信用评分", `${state.bank.credit}<small>/ 100</small>`, "信", "", "影响贷款额度", "按时还款提升", "var(--gold-soft)", "#8a6322")}
    </div>

    <div class="dashboard-grid">
      <div class="stack">
        <section class="panel">
          <div class="panel-head"><div><h3>定期存款</h3><p>到期自动转入活期账户</p></div><button class="btn btn-outline btn-sm" data-action="open-deposit">存入资金</button></div>
          <div class="panel-body">
            ${
              state.bank.fixed.length
                ? state.bank.fixed.map((deposit) => `<div class="person-card" style="margin-bottom:8px"><div class="avatar">定</div><div class="person-copy"><strong>${formatMoney(deposit.principal)}</strong><span>${deposit.termMonths} 个月 · 剩余 ${deposit.monthsLeft} 个月 · 年化 ${(deposit.annualRate * 100).toFixed(2)}%</span></div><span class="status-pill status-info">存续中</span></div>`).join("")
                : `<div class="empty-state" style="min-height:140px;padding:18px"><div><div class="empty-icon">定</div><h3>暂无定期存款</h3><p>定期利率高于活期，但到期前不可支取。</p></div></div>`
            }
          </div>
        </section>

        <section class="panel">
          <div class="panel-head"><div><h3>贷款</h3><p>信用与还款记录影响后续额度</p></div><div style="display:flex;gap:7px"><button class="btn btn-outline btn-sm" data-action="open-repay">提前还款</button><button class="btn btn-dark btn-sm" data-action="open-loan">申请贷款</button></div></div>
          <div class="panel-body">
            ${
              state.bank.loans.length
                ? state.bank.loans.map((loan) => `<div class="person-card" style="margin-bottom:8px"><div class="avatar soft">贷</div><div class="person-copy"><strong>剩余 ${formatMoney(loan.remaining)}</strong><span>${loan.monthsLeft} 个月 · 年化 ${(loan.annualRate * 100).toFixed(2)}% · 逾期 ${loan.overdue} 次</span></div><span class="status-pill ${loan.overdue ? "status-danger" : "status-info"}">${loan.overdue ? "有逾期" : "正常"}</span></div>`).join("")
                : `<div class="notice"><span class="notice-icon">贷</span><span>当前无贷款。贷款资金会立即进入学校可用资金。</span></div>`
            }
          </div>
        </section>
      </div>

      <aside class="stack">
        <section class="panel">
          <div class="panel-head"><div><h3>活期账户</h3><p>按月结息 · 年化 0.35%</p></div></div>
          <div class="panel-body">
            <div class="approval-gauge"><div class="big-num">${formatMoney(state.bank.demand)}</div><div><strong>当前活期余额</strong><p>支取后立即回到学校可用资金。</p></div></div>
            <button class="btn btn-outline" style="width:100%;margin-top:12px" data-action="open-withdraw">支取活期</button>
          </div>
        </section>
        <section class="panel">
          <div class="panel-head"><div><h3>最近流水</h3><p>最近 6 笔</p></div></div>
          <div class="panel-body">
            <div class="feed-list">
              ${state.bank.transactions.slice(0, 6).map((item) => `<div class="feed-item"><div class="feed-date">${escapeHtml(item.date)}<br />${escapeHtml(item.type)}</div><div class="feed-copy"><strong>${escapeHtml(item.note)}</strong><span>${formatMoney(item.amount)}</span></div></div>`).join("") || `<div class="notice">暂无银行流水</div>`}
            </div>
          </div>
        </section>
      </aside>
    </div>
  `;
}

function renderStockTab() {
  const locked = state.school.nature === "public";
  const totalValue = Object.entries(state.stock.holdings).reduce((sum, [symbol, holding]) => {
    return sum + holding.shares * (state.stock.prices[symbol] || 0);
  }, 0);
  return `
    <div class="metric-grid">
      ${metricCard("股票账户", `${formatMoney(state.stock.cash)}`, "股", "", "投资账户", "与学校资金分账", "var(--teal-soft)", "var(--green)")}
      ${metricCard("持仓市值", `${formatMoney(roundScore(totalValue))}`, "持", "", "当前市值", "浮动盈亏", "var(--blue-soft)", "var(--blue)")}
      ${metricCard("已实现盈亏", `${formatMoney(state.stock.realized)}`, "盈", "", "已平仓", "交易手续费已扣", "var(--gold-soft)", "#8a6322")}
      ${metricCard("股票数量", `${STOCK_MARKET.length}<small>只</small>`, "只", "", "虚构标的", "月度更新", "var(--violet-soft)", "var(--violet)")}
    </div>

    <div class="dashboard-grid">
      <section class="panel">
        <div class="panel-head"><div><h3>虚拟市场行情</h3><p>每月自动更新一次，涨跌幅限制 ±12%</p></div><button class="btn btn-outline btn-sm" data-action="open-stock-transfer">账户转账</button></div>
        <div class="panel-body flush">
          <div class="rank-table-wrap">
            <table class="rank-table">
              <thead><tr><th>股票</th><th>行业</th><th>现价</th><th>持仓</th><th>操作</th></tr></thead>
              <tbody>
                ${STOCK_MARKET.map((stock) => {
                  const price = state.stock.prices[stock.symbol] || stock.basePrice;
                  const holding = state.stock.holdings[stock.symbol];
                  return `<tr><td><span class="uni-name">${escapeHtml(stock.name)}</span><span class="mono"> ${stock.symbol}</span></td><td>${escapeHtml(stock.sector)}</td><td class="mono">${price.toFixed(2)}</td><td>${holding ? `${holding.shares} 股` : "—"}</td><td><button class="btn btn-sm btn-outline" data-action="open-stock-order" data-symbol="${stock.symbol}" data-side="buy" ${locked ? "disabled" : ""}>买入</button> <button class="btn btn-sm btn-ghost" data-action="open-stock-order" data-symbol="${stock.symbol}" data-side="sell" ${locked ? "disabled" : ""}>卖出</button></td></tr>`;
                }).join("")}
              </tbody>
            </table>
          </div>
          ${
            locked
              ? `<div class="notice" style="margin:13px"><span class="notice-icon">公</span><span>公办学校资金不得进入股票市场，股票交易已锁定。</span></div>`
              : ""
          }
        </div>
      </section>

      <aside class="stack">
        <section class="panel">
          <div class="panel-head"><div><h3>我的持仓</h3><p>成本与浮动盈亏</p></div></div>
          <div class="panel-body">
            ${
              Object.keys(state.stock.holdings).length
                ? Object.entries(state.stock.holdings).map(([symbol, holding]) => {
                    const stock = STOCK_MARKET.find((item) => item.symbol === symbol);
                    const price = state.stock.prices[symbol] || 0;
                    const avgCost = holding.shares ? holding.cost / holding.shares : 0;
                    return `<div class="person-card" style="margin-bottom:8px"><div class="avatar">股</div><div class="person-copy"><strong>${escapeHtml(stock?.name || symbol)} · ${holding.shares} 股</strong><span>成本 ${avgCost.toFixed(2)} · 现价 ${price.toFixed(2)}</span></div><span class="badge ${price >= avgCost ? "status-success" : "status-danger"}">${price >= avgCost ? "盈利" : "亏损"}</span></div>`;
                  }).join("")
                : `<div class="empty-state" style="min-height:140px;padding:18px"><div><div class="empty-icon">股</div><h3>暂无持仓</h3><p>先转账到股票账户，再买入虚拟股票。</p></div></div>`
            }
          </div>
        </section>
      </aside>
    </div>
  `;
}

function renderRankings(ranks) {
  const tabs = [
    { id: "sichuan", label: "四川省高校榜" },
    { id: "national", label: "全国大学榜" },
    { id: "world", label: "世界大学榜" },
  ];
  let rows = [];
  let title = "";
  let subtitle = "";
  const playerDomestic = playerDomesticTags();
  const playerInternational = playerInternationalTag();
  const scoreScaleMax = ui.rankingTab === "world" ? 10000 : 1000;
  if (ui.rankingTab === "sichuan") {
    rows = [
      ...SICHUAN_UNIVERSITIES.map((item) => ({
        ...item,
        score: state.ranking.npc.sichuan[item.name],
        domesticTags: getDomesticTags(item.name),
      })),
      {
        name: state.school.name,
        city: state.school.city.replace(/市$/, ""),
        score: ranks.player.provincial,
        rank: ranks.provincial,
        you: true,
        domesticTags: playerDomestic,
      },
    ]
      .sort((a, b) => b.score - a.score)
      .map((item, index) => ({ ...item, rank: index + 1 }));
    title = "四川省高校综合榜";
    subtitle = "1000 分制 · 四川高校真实校名 + 模拟办学表现";
  } else if (ui.rankingTab === "national") {
    rows = [
      ...NATIONAL_UNIVERSITIES.map((item) => ({
        ...item,
        score: state.ranking.npc.national[item.name],
        domesticTags: getDomesticTags(item.name),
      }))
        .sort((a, b) => b.score - a.score)
        .map((item, index) => ({ ...item, rank: index + 1 })),
      {
        name: state.school.name,
        city: state.school.city.replace(/市$/, ""),
        score: ranks.player.national,
        rank: ranks.national,
        you: true,
        domesticTags: playerDomestic,
      },
    ];
    title = "中国大学综合榜 · 前 100";
    subtitle = "1000 分制 · 全国名次与 NPC 分数每学年更新一次";
  } else {
    rows = [
      ...WORLD_UNIVERSITIES.map((item) => ({
        ...item,
        score: state.ranking.npc.world[item.name],
        internationalTag: getInternationalTag(item.name),
      }))
        .sort((a, b) => b.score - a.score)
        .map((item, index) => ({ ...item, rank: index + 1 })),
      {
        name: state.school.name,
        country: "中国",
        score: ranks.player.world,
        rank: ranks.world,
        you: true,
        internationalTag: playerInternational,
      },
    ];
    title = "世界大学综合榜";
    subtitle = "10000 分制 · 国际榜只显示最高国际标签";
  }

  return `
    ${pageHead(
      "RANKINGS & BENCHMARKS",
      "大学排行榜",
      `榜单每学年结算更新一次。省榜与全国榜使用 1000 分制，国际榜使用 10000 分制；当前更新于 ${ranks.updatedYear} 年。`,
      `<button class="btn btn-outline btn-sm" type="button" data-action="open-ranking-method">查看计分方法</button>`,
    )}

    <div class="ranking-summary">
      <div class="rank-summary-card ${ui.rankingTab === "sichuan" ? "active" : ""}" data-action="ranking-tab" data-tab="sichuan" role="button" tabindex="0">
        <span>四川省 · 模拟位次</span><strong>第 ${ranks.provincial} 位</strong><small>省榜分数 ${ranks.player.provincial.toFixed(1)} / 1000</small>
      </div>
      <div class="rank-summary-card ${ui.rankingTab === "national" ? "active" : ""}" data-action="ranking-tab" data-tab="national" role="button" tabindex="0">
        <span>全国 · 预估位次</span><strong>第 ${formatNumber(ranks.national)} 位</strong><small>全国分数 ${ranks.player.national.toFixed(1)} / 1000</small>
      </div>
      <div class="rank-summary-card ${ui.rankingTab === "world" ? "active" : ""}" data-action="ranking-tab" data-tab="world" role="button" tabindex="0">
        <span>世界 · 预估位次</span><strong>第 ${formatNumber(ranks.world)} 位</strong><small>国际分数 ${ranks.player.world.toFixed(1)} / 10000</small>
      </div>
    </div>

    <section class="panel rankings-panel">
      <div class="panel-head" style="align-items:center">
            <div>
              <h3>${title}</h3>
              <p>${subtitle}</p>
              <div class="ranking-tier-line">本校：${escapeHtml(ranks.tier.name)} · 省/国上限 ${ranks.tier.provincialCap} · 国际上限 ${ranks.tier.internationalCap}</div>
            </div>
        <div class="segmented">
          ${tabs.map((tab) => `<button class="${ui.rankingTab === tab.id ? "active" : ""}" type="button" data-action="ranking-tab" data-tab="${tab.id}">${tab.label}</button>`).join("")}
        </div>
      </div>
      <div class="panel-body flush">
        <div class="rank-table-wrap">
          <table class="rank-table">
            <thead><tr><th>位次</th><th>高校</th><th class="rank-tag-col">标签</th><th>${ui.rankingTab === "world" ? "国家/地区" : "城市"}</th><th class="rank-score-col">模拟得分 / ${scoreScaleMax}</th><th class="rank-eval-col">评价</th></tr></thead>
            <tbody>
              ${rows
                .map(
                  (item) => `
                    <tr class="${item.you ? "you" : ""}">
                      <td class="rank-number">${String(item.rank).padStart(2, "0")}</td>
                      <td><span class="uni-name">${escapeHtml(item.name)}</span>${item.you ? ` <span class="badge badge-gold">本校</span>` : ""}<div class="uni-mobile-tags">${renderUniversityTags(item)}</div></td>
                      <td class="rank-tag-col">${renderUniversityTags(item)}</td>
                      <td>${escapeHtml(item.country || item.city || "—")}</td>
                      <td class="mono rank-score-col">${Number(item.score).toFixed(1)}</td>
                      <td class="rank-eval-col"><div class="score-bar"><div class="score-bar-track"><div class="score-bar-fill" style="width:${clamp((item.score / scoreScaleMax) * 100, 0, 100)}%"></div></div><span class="mono">${Math.round(item.score)}</span></div></td>
                    </tr>
                  `,
                )
                .join("")}
            </tbody>
          </table>
        </div>
      </div>
    </section>
    <p class="method-note">榜单名次只在年度结算时刷新；NPC 分数也会逐年增长。国内榜叠加展示 985、211、双一流标签，国际榜只展示最高国际标签。所有分数和名次均为游戏模拟。</p>
  `;
}

function renderUniversityTags(item) {
  const tags = Array.isArray(item.domesticTags)
    ? item.domesticTags
    : item.internationalTag
      ? [item.internationalTag]
      : [];
  if (!tags.length) return `<span class="muted">—</span>`;
  return `<span class="university-tags">${tags.map((tag) => `<span class="uni-tag">${escapeHtml(tag)}</span>`).join("")}</span>`;
}

function renderWebsite() {
  if (!state.flags.visitedWebsite) {
    state.flags.visitedWebsite = true;
    saveState();
  }
  const news = state.news.filter(isPublicNews).slice(0, 6);
  const tier = getSchoolTier();
  const domesticTags = playerDomesticTags();
  const internationalTag = playerInternationalTag();
  return `
    ${pageHead(
      "PUBLIC WEBSITE",
      "校园官网",
      "官网是学校向考生、家长、教师与主管部门展示自己的窗口。行动会生成新闻，你也可以主动编辑头条与公告。",
      `<button class="btn btn-outline btn-sm" data-action="edit-headline">编辑首页头条</button><button class="btn btn-dark btn-sm" data-action="publish-notice">发布通知公告</button>`,
    )}
    <div class="browser-frame">
      <div class="browser-bar"><span class="browser-dots"><i></i><i></i><i></i></span><div class="browser-url">https://www.${escapeHtml(state.school.name.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, "").slice(0, 12) || "qinghe")}.edu.cn</div><span class="mono" style="font-size:8px">HTTPS</span></div>
      <div class="university-site">
        <div class="site-utility"><span>${escapeHtml(state.school.name)} · 四川省 · ${schoolNatureLabel()} · ${escapeHtml(tier.name)}</span><span>${state.time.year}年10月26日</span></div>
        <header class="site-header">
          <div class="site-brand"><div class="site-emblem">${escapeHtml(state.school.badge)}</div><div><strong>${escapeHtml(state.school.name)}</strong><small>QINGHE UNIVERSITY · 求真 · 力行</small></div></div>
          <nav class="site-nav"><span>学校概况</span><span>院系设置</span><span>招生就业</span><span>科学研究</span><span>校园生活</span><span>信息公开</span></nav>
        </header>
        <section class="site-hero">
          <div class="site-hero-copy">
            <small>WELCOME TO OUR UNIVERSITY · ${state.time.year}</small>
            <h2>${escapeHtml(state.site.headline)}</h2>
            <p>${state.colleges.length ? `${escapeHtml(state.colleges[0].name)}面向区域产业需求，培养具有实践能力与公共精神的高素质技术技能人才。` : "学校正在筹建首批学院与专业，以开放、务实的方式回应城市与产业的需求。"}</p>
          </div>
          <div class="site-hero-stamp"><strong>${escapeHtml(state.school.badge)}</strong><span>QINGHE · SINCE ${state.school.founded}</span></div>
        </section>
        <div class="site-body">
          <section>
            <div class="site-section-head"><h3>学校要闻</h3><span>更多新闻 ›</span></div>
            <div class="site-news">
              ${
                news.length
                  ? news
                      .map(
                        (item) => {
                          const [, month, day] = item.date.split("-");
                          return `<article class="site-news-item"><div class="site-news-date"><strong>${day}</strong><span>${month} / ${item.category}</span></div><div class="site-news-copy"><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.summary)}</span></div></article>`;
                        },
                      )
                      .join("")
                  : `<article class="site-news-item"><div class="site-news-date"><strong>01</strong><span>09 / 学校要闻</span></div><div class="site-news-copy"><strong>学校筹建工作正式启动</strong><span>学校将坚持应用型办学方向，逐步形成特色学科与人才培养体系。</span></div></article>`
              }
            </div>
          </section>
          <aside>
            <div class="site-side-card">
              <h4>快速服务</h4>
              <div class="quick-links"><span class="quick-link">招生信息网</span><span class="quick-link">人才招聘</span><span class="quick-link">教务系统</span><span class="quick-link">信息公开</span><span class="quick-link">校友之家</span><span class="quick-link">校长信箱</span></div>
            </div>
            <div class="site-side-card">
              <h4>通知公告</h4>
              <div class="notice-list">${state.site.notices.slice(0, 5).map((notice) => `<div class="notice-line">${escapeHtml(notice)}</div>`).join("")}</div>
            </div>
            <div class="site-side-card">
              <h4>学校数据</h4>
              <div class="check-list">
                <div class="check-row"><span>在校学生</span><strong>${formatNumber(state.resources.students)} 人</strong></div>
                <div class="check-row"><span>专任教师</span><strong>${state.resources.faculty} 人</strong></div>
                <div class="check-row"><span>开设专业</span><strong>${getPrograms().length} 个</strong></div>
                <div class="check-row"><span>学校层级</span><strong>${escapeHtml(tier.name)}</strong></div>
                <div class="check-row"><span>国内标签</span><strong>${domesticTags.length ? domesticTags.map(escapeHtml).join(" · ") : "暂未申请"}</strong></div>
                <div class="check-row"><span>国际标签</span><strong>${internationalTag ? escapeHtml(internationalTag) : "暂未获得"}</strong></div>
              </div>
            </div>
          </aside>
        </div>
        <footer class="site-footer">© ${state.time.year} ${escapeHtml(state.school.name)} · 地址：四川省成都市 · 本页面为游戏内模拟官网，不代表真实机构</footer>
      </div>
    </div>
  `;
}

function openModal(type, context = {}) {
  ui.modal = { type, context };
  renderModal();
}

function closeModal() {
  ui.modal = null;
  modalRoot.innerHTML = "";
}

function renderModal() {
  if (!ui.modal || (!state && ui.modal.type !== "changelog")) {
    modalRoot.innerHTML = "";
    return;
  }
  const content = getModalContent(ui.modal.type, ui.modal.context);
  if (!content) {
    closeModal();
    return;
  }
  modalRoot.innerHTML = `
    <div class="modal-backdrop" data-action="modal-backdrop">
      <section class="modal ${content.size || ""}" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        ${content.html}
      </section>
    </div>
  `;
}

function modalHeader(title, subtitle, close = true) {
  return `
    <header class="modal-head">
      <div><h2 id="modal-title">${escapeHtml(title)}</h2><p>${escapeHtml(subtitle)}</p></div>
      ${close ? `<button class="modal-close" type="button" data-action="close-modal" aria-label="关闭">×</button>` : ""}
    </header>
  `;
}

function getModalContent(type, ctx) {
  if (type === "tutorial") return modalTutorial();
  if (type === "save-menu") return modalSaveMenu();
  if (type === "changelog") return modalChangelog();
  if (type === "notification") return modalNotification();
  if (type === "deposit") return modalDeposit();
  if (type === "withdraw") return modalWithdraw();
  if (type === "loan") return modalLoan();
  if (type === "repay") return modalRepay();
  if (type === "stock-transfer") return modalStockTransfer();
  if (type === "stock-order") return modalStockOrder(ctx);
  if (type === "initial-college") return modalCollegeChoice(true);
  if (type === "add-college") return modalCollegeChoice(false);
  if (type === "add-program") return modalAddProgram(ctx);
  if (type === "approval-result") return modalApprovalResult(ctx);
  if (type === "campaign") return modalCampaign();
  if (type === "admission-result") return modalAdmissionResult();
  if (type === "plot") return modalPlot(ctx.plotId);
  if (type === "president") return modalPresident();
  if (type === "research") return modalResearch(ctx.projectId);
  if (type === "degree") return modalDegree(ctx.degree);
  if (type === "public-conversion") return modalPublicConversion();
  if (type === "ranking-method") return modalRankingMethod();
  if (type === "headline") return modalHeadline();
  if (type === "notice") return modalNotice();
  if (type === "add-club") return modalAddClub();
  if (type === "partner") return modalPartner();
  if (type === "advance") return modalAdvance();
  if (type === "annual-report") return modalAnnualReport();
  if (type === "reset-confirm") return modalResetConfirm();
  if (type === "upgrade-result") return modalUpgradeResult(ctx);
  return null;
}

function modalTutorial() {
  const index = clamp(currentTutorialStep(), 0, TUTORIAL_STEPS.length - 1);
  const step = TUTORIAL_STEPS[index];
  return {
    size: "narrow tutorial",
    html: `
      <div class="tutorial-head">
        <small>${escapeHtml(step.kicker)}</small>
        <h2>办校第一课</h2>
        <p>从民办本科到一所被记住的大学</p>
      </div>
      <div class="tutorial-body">
        <div class="tutorial-progress">${TUTORIAL_STEPS.map((_, i) => `<i class="${i <= index ? "active" : ""}"></i>`).join("")}</div>
        <div class="tutorial-illustration">${escapeHtml(step.art)}</div>
        <h3>${escapeHtml(step.title)}</h3>
        <p>${escapeHtml(step.body)}</p>
      </div>
      <div class="tutorial-foot">
        <span class="step-count">${String(index + 1).padStart(2, "0")} / ${String(TUTORIAL_STEPS.length).padStart(2, "0")}</span>
        <div style="display:flex;gap:7px">
          <button class="btn btn-ghost btn-sm" type="button" data-action="close-modal">稍后再说</button>
          <button class="btn btn-primary btn-sm" type="button" data-action="tutorial-go" data-view="${step.view}">${escapeHtml(step.action)}</button>
        </div>
      </div>
    `,
  };
}

function modalSaveMenu() {
  const mutedTypes = Object.entries(state.notifications.muted).filter(([, value]) => value);
  return {
    size: "narrow",
    html: `
      ${modalHeader("存档与设置", "数据仅保存在当前浏览器本地")}
      <div class="modal-body">
        <div class="person-card" style="margin-bottom:12px">
          <div class="avatar">档</div>
          <div class="person-copy"><strong>${escapeHtml(state.school.name)}</strong><span>${state.time.year} 学年 · 第 ${state.history.length + 1} 个经营年度</span></div>
          <span class="status-pill status-success">自动保存</span>
        </div>
        <div class="notice" style="margin-bottom:12px"><span class="notice-icon">版</span><span>当前版本 v${APP_VERSION} · 数据仅保存在当前浏览器本地。</span></div>
        <button class="btn btn-outline" style="width:100%;margin-bottom:12px" type="button" data-action="open-changelog">查看 v${APP_VERSION} 更新内容</button>
        <div class="notice" style="margin-bottom:12px"><span class="notice-icon">铃</span><span>已关闭的通知类型可在此重新开启。</span></div>
        ${
          mutedTypes.length
            ? mutedTypes.map(([type]) => `<div class="check-row" style="margin-bottom:8px"><span>${notificationTypeLabel(type)}</span><button class="btn btn-outline btn-sm" type="button" data-action="unmute-notification" data-type="${type}">重新开启</button></div>`).join("")
            : `<div class="check-row"><span>通知状态</span><strong>全部开启</strong></div>`
        }
        <div class="form-grid">
          <button class="btn btn-outline" type="button" data-action="export-save">导出存档</button>
          <button class="btn btn-outline" type="button" data-action="return-title">返回标题页</button>
        </div>
        <div class="modal-callout danger" style="margin-top:15px">新开一局会覆盖当前自动存档。建议先导出备份。</div>
        <button class="btn btn-danger-soft" style="width:100%" type="button" data-action="reset-game">重新开始一局</button>
      </div>
    `,
  };
}

function modalChangelog() {
  return {
    size: "narrow",
    html: `
      ${modalHeader(`v${APP_VERSION} 更新如下`, "2026-10-27 · 青禾计划版本公告")}
      <div class="modal-body">
        <div class="notice" style="margin-bottom:15px">
          <span class="notice-icon">版</span>
          <span>按版本查看更新记录，最新版本默认展开。</span>
        </div>
        <div class="changelog-versions">
          ${CHANGELOG.map(
            (release, index) => `
              <details class="changelog-version" ${index === 0 ? "open" : ""}>
                <summary>
                  <span class="changelog-version-name">${escapeHtml(release.version)}</span>
                  <span class="changelog-version-meta">${escapeHtml(release.date)} · ${escapeHtml(release.summary)}</span>
                </summary>
                <ul class="changelog-list">
                  ${release.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
                </ul>
              </details>
            `,
          ).join("")}
        </div>
      </div>
      <div class="modal-foot">
        <button class="btn btn-dark" type="button" data-action="close-modal">知道了</button>
      </div>
    `,
  };
}

function modalNotification() {
  const notification = state.notifications.queue[0];
  if (!notification) return null;
  return {
    size: "narrow",
    html: `
      ${modalHeader(notification.title, "重要校务通知 · 时间已自动暂停")}
      <div class="modal-body">
        <div class="modal-callout info">${escapeHtml(notification.detail)}</div>
        <label class="notice-line" style="align-items:center">
          <input type="checkbox" id="notification-mute" /> 不再通知此类消息
        </label>
      </div>
      <div class="modal-foot">
        <button class="btn btn-outline" type="button" data-action="notification-skip">跳过</button>
        <button class="btn btn-primary" type="button" data-action="notification-handle">去处理</button>
      </div>
    `,
  };
}

function handleNotification(action) {
  const notification = state.notifications.queue.shift();
  if (!notification) return;
  const mute = document.querySelector("#notification-mute")?.checked;
  if (mute) state.notifications.muted[notification.type] = true;
  if (notification.type === "settlement") settleYear();
  closeModal();
  if (action === "handle") {
    ui.view = notification.view || "dashboard";
    saveState();
    renderApp();
    return;
  }
  if (state.notifications.queue.length) {
    saveState();
    renderApp();
    openModal("notification");
    return;
  }
  state.time.running = true;
  state.time.speed = state.notifications.resumedSpeed || 1;
  clockAccumulatorMs = 0;
  clockLastMs = Date.now();
  saveState();
  renderApp();
}

function modalDeposit() {
  return {
    size: "narrow",
    html: `
      ${modalHeader("银行存款", "存入的定期存款在到期前不可使用")}
      <form id="finance-deposit-form">
        <div class="modal-body">
          <div class="form-grid">
            <div class="field"><label>存款金额（万元）</label><input class="input" type="number" name="amount" min="1" required /></div>
            <div class="field">
              <label>存款类型</label>
              <select class="select" name="type">
                <option value="demand">活期 · 年化 0.35%</option>
                <option value="3">3 个月定期 · 年化 1.10%</option>
                <option value="6">6 个月定期 · 年化 1.30%</option>
                <option value="12">12 个月定期 · 年化 1.55%</option>
              </select>
            </div>
          </div>
          <div class="modal-callout" style="margin-top:14px">存款资金从学校可用资金转入，支出时需提前支取或等待到期。</div>
        </div>
        <div class="modal-foot"><button class="btn btn-ghost" type="button" data-action="close-modal">取消</button><button class="btn btn-primary" type="submit">确认存入</button></div>
      </form>
    `,
  };
}

function modalWithdraw() {
  return {
    size: "narrow",
    html: `
      ${modalHeader("支取活期存款", `当前活期余额 ${formatMoney(state.bank.demand)}`)}
      <form id="finance-withdraw-form">
        <div class="modal-body">
          <div class="field"><label>支取金额（万元）</label><input class="input" type="number" name="amount" min="1" required /></div>
        </div>
        <div class="modal-foot"><button class="btn btn-ghost" type="button" data-action="close-modal">取消</button><button class="btn btn-primary" type="submit">确认支取</button></div>
      </form>
    `,
  };
}

function modalLoan() {
  return {
    size: "narrow",
    html: `
      ${modalHeader("申请贷款", `信用评分 ${state.bank.credit} · 基准年化 ${(BANK_RATES.loanBaseRate * 100).toFixed(1)}%`)}
      <form id="finance-loan-form">
        <div class="modal-body">
          <div class="form-grid">
            <div class="field"><label>贷款金额（万元）</label><input class="input" type="number" name="amount" min="1" required /></div>
            <div class="field"><label>贷款期限</label><select class="select" name="months"><option value="3">3 个月</option><option value="6">6 个月</option><option value="12">12 个月</option><option value="24">24 个月</option></select></div>
          </div>
          <div class="modal-callout danger" style="margin-top:14px">贷款按月自动还款；现金不足会形成逾期并降低信用。</div>
        </div>
        <div class="modal-foot"><button class="btn btn-ghost" type="button" data-action="close-modal">取消</button><button class="btn btn-primary" type="submit">确认贷款</button></div>
      </form>
    `,
  };
}

function modalRepay() {
  const total = state.bank.loans.reduce((sum, loan) => sum + loan.remaining, 0);
  return {
    size: "narrow",
    html: `
      ${modalHeader("提前还款", `剩余贷款本金 ${formatMoney(roundScore(total))}`)}
      <form id="finance-repay-form">
        <div class="modal-body">
          <div class="field"><label>还款金额（万元）</label><input class="input" type="number" name="amount" min="1" required /></div>
        </div>
        <div class="modal-foot"><button class="btn btn-ghost" type="button" data-action="close-modal">取消</button><button class="btn btn-primary" type="submit">确认还款</button></div>
      </form>
    `,
  };
}

function modalStockTransfer() {
  return {
    size: "narrow",
    html: `
      ${modalHeader("股票账户资金", `股票账户 ${formatMoney(state.stock.cash)} · 学校可用 ${formatMoney(state.resources.cash)}`)}
      <form id="stock-transfer-form">
        <div class="modal-body">
          <div class="field"><label>方向</label><select class="select" name="direction"><option value="in">学校资金转入股票账户</option><option value="out">股票账户转回学校</option></select></div>
          <div class="field" style="margin-top:12px"><label>金额（万元）</label><input class="input" type="number" name="amount" min="1" required /></div>
        </div>
        <div class="modal-foot"><button class="btn btn-ghost" type="button" data-action="close-modal">取消</button><button class="btn btn-primary" type="submit">确认转账</button></div>
      </form>
    `,
  };
}

function modalStockOrder(ctx) {
  const stock = STOCK_MARKET.find((item) => item.symbol === ctx.symbol);
  if (!stock) return null;
  const price = state.stock.prices[stock.symbol] || stock.basePrice;
  return {
    size: "narrow",
    html: `
      ${modalHeader(`${ctx.side === "buy" ? "买入" : "卖出"} ${escapeHtml(stock.name)}`, `当前价格 ${price.toFixed(2)} 万元 / 股`)}
      <form id="stock-order-form">
        <input type="hidden" name="symbol" value="${stock.symbol}" />
        <input type="hidden" name="side" value="${ctx.side}" />
        <div class="modal-body">
          <div class="field"><label>股数</label><input class="input" type="number" name="shares" min="1" required /></div>
          <div class="modal-callout info" style="margin-top:14px">交易手续费为成交额的 0.1%。</div>
        </div>
        <div class="modal-foot"><button class="btn btn-ghost" type="button" data-action="close-modal">取消</button><button class="btn btn-primary" type="submit">确认${ctx.side === "buy" ? "买入" : "卖出"}</button></div>
      </form>
    `,
  };
}

function financeDeposit(formData) {
  const amount = Math.round(Number(formData.get("amount")) || 0);
  const type = formData.get("type");
  if (amount <= 0 || state.resources.cash < amount) {
    toast("资金不足", "学校可用资金不足。", "error");
    return;
  }
  state.resources.cash = roundScore(state.resources.cash - amount);
  if (type === "demand") {
    state.bank.demand = roundScore(state.bank.demand + amount);
    addBankTransaction("存入", amount, "活期存款");
  } else {
    const term = BANK_RATES.fixed.find((item) => String(item.months) === type);
    state.bank.fixed.push({
      id: `fd-${Date.now()}`,
      principal: amount,
      annualRate: term.annualRate,
      termMonths: term.months,
      monthsLeft: term.months,
    });
    addBankTransaction("存入", amount, `${term.months}个月定期`);
  }
  commit();
  toast("存款完成", "资金已转入银行。", "success");
}

function financeWithdraw(formData) {
  const amount = Math.round(Number(formData.get("amount")) || 0);
  if (amount <= 0 || state.bank.demand < amount) {
    toast("余额不足", "活期余额不足。", "error");
    return;
  }
  state.bank.demand = roundScore(state.bank.demand - amount);
  state.resources.cash = roundScore(state.resources.cash + amount);
  addBankTransaction("支取", amount, "活期支取");
  commit();
  toast("支取完成", "资金已转回学校账户。", "success");
}

function financeLoan(formData) {
  const amount = Math.round(Number(formData.get("amount")) || 0);
  const months = Number(formData.get("months"));
  if (amount <= 0) {
    toast("金额无效", "请输入贷款金额。", "error");
    return;
  }
  const spread = BANK_RATES.loanSpreadMin + (1 - state.bank.credit / 100) * (BANK_RATES.loanSpreadMax - BANK_RATES.loanSpreadMin);
  const annualRate = BANK_RATES.loanBaseRate + spread;
  state.resources.cash = roundScore(state.resources.cash + amount);
  state.bank.loans.push({
    id: `loan-${Date.now()}`,
    remaining: amount,
    monthsLeft: months,
    monthlyPrincipal: amount / months,
    annualRate,
    overdue: 0,
    penalty: 0,
  });
  addBankTransaction("放款", amount, `贷款 ${months} 个月`);
  commit();
  toast("贷款到账", `年化利率 ${(annualRate * 100).toFixed(2)}%。`, "success");
}

function financeRepay(formData) {
  let amount = Math.round(Number(formData.get("amount")) || 0);
  if (amount <= 0 || state.resources.cash < amount) {
    toast("资金不足", "学校可用资金不足。", "error");
    return;
  }
  state.resources.cash = roundScore(state.resources.cash - amount);
  state.bank.loans.forEach((loan) => {
    if (amount <= 0 || loan.remaining <= 0) return;
    const paid = Math.min(amount, loan.remaining);
    loan.remaining = roundScore(loan.remaining - paid);
    amount -= paid;
  });
  state.bank.loans = state.bank.loans.filter((loan) => loan.remaining > 0);
  addBankTransaction("还款", Math.round(Number(formData.get("amount"))), "提前还款");
  commit();
  toast("还款完成", "贷款余额已更新。", "success");
}

function stockTransfer(formData) {
  const amount = Math.round(Number(formData.get("amount")) || 0);
  const direction = formData.get("direction");
  if (direction === "in") {
    if (amount <= 0 || state.resources.cash < amount) {
      toast("资金不足", "学校可用资金不足。", "error");
      return;
    }
    state.resources.cash = roundScore(state.resources.cash - amount);
    state.stock.cash = roundScore(state.stock.cash + amount);
  } else {
    if (amount <= 0 || state.stock.cash < amount) {
      toast("余额不足", "股票账户余额不足。", "error");
      return;
    }
    state.stock.cash = roundScore(state.stock.cash - amount);
    state.resources.cash = roundScore(state.resources.cash + amount);
  }
  state.stock.transactions.unshift({ id: `st-${Date.now()}`, type: direction === "in" ? "转入" : "转出", amount, date: `${state.time.year}-${state.time.month}` });
  commit();
  toast("转账完成", direction === "in" ? "资金已转入股票账户。" : "资金已转回学校。", "success");
}

function stockOrder(formData) {
  if (state.school.nature === "public") {
    toast("公办学校不可炒股", "公办资金不得进入股票市场。", "error");
    return;
  }
  const symbol = formData.get("symbol");
  const side = formData.get("side");
  const shares = Math.floor(Number(formData.get("shares")) || 0);
  const stock = STOCK_MARKET.find((item) => item.symbol === symbol);
  if (!stock || shares <= 0) return;
  const price = state.stock.prices[symbol] || stock.basePrice;
  if (side === "buy") {
    const cost = roundScore(shares * price * 1.001);
    if (state.stock.cash < cost) {
      toast("余额不足", "股票账户资金不足。", "error");
      return;
    }
    state.stock.cash = roundScore(state.stock.cash - cost);
    const holding = state.stock.holdings[symbol] || { shares: 0, cost: 0 };
    const totalCost = holding.cost + cost;
    const totalShares = holding.shares + shares;
    state.stock.holdings[symbol] = { shares: totalShares, cost: roundScore(totalCost) };
  } else {
    const holding = state.stock.holdings[symbol] || { shares: 0, cost: 0 };
    if (holding.shares < shares) {
      toast("持仓不足", "可卖股数不足。", "error");
      return;
    }
    const proceeds = roundScore(shares * price * 0.999);
    const avgCost = holding.shares ? holding.cost / holding.shares : 0;
    state.stock.cash = roundScore(state.stock.cash + proceeds);
    state.stock.realized = roundScore(state.stock.realized + (price - avgCost) * shares);
    holding.shares -= shares;
    holding.cost = roundScore(holding.shares * avgCost);
    if (holding.shares <= 0) delete state.stock.holdings[symbol];
  }
  state.stock.transactions.unshift({ id: `st-${Date.now()}`, type: side === "buy" ? "买入" : "卖出", symbol, shares, price, date: `${state.time.year}-${state.time.month}` });
  commit();
  toast(side === "buy" ? "买入完成" : "卖出完成", `${stock.name} ${shares} 股已成交。`, "success");
}

function modalCollegeChoice(initial) {
  const currentIds = state.colleges.map((college) => college.id);
  const available = COLLEGE_TEMPLATES.filter((item) => !currentIds.includes(item.id));
  const cost = initial ? 620 : 980;
  return {
    size: "wide",
    html: `
      ${modalHeader(
        initial ? "选择首所学院" : "申报新学院",
        initial ? "学院方向会决定首批专业和早期资源优势" : `设立投入 ${cost} 万元，需具备足够资金与办学基础`,
      )}
      <div class="modal-body">
        ${
          available.length
            ? `<div class="card-grid three">
                ${available
                  .map(
                    (item) => `
                      <button class="choice-card" type="button" data-action="choose-college" data-id="${item.id}" data-initial="${initial ? "true" : "false"}">
                        <span class="choice-icon">${escapeHtml(item.icon)}</span>
                        <strong>${escapeHtml(item.name)}</strong>
                        <p>${escapeHtml(item.summary)}</p>
                        <span class="card-foot"><span>可设 ${item.programs.length} 个专业</span><span>${cost} 万</span></span>
                      </button>
                    `,
                  )
                  .join("")}
              </div>`
            : `<div class="empty-state"><div><div class="empty-icon">全</div><h3>十所学院均已设立</h3><p>目前版本已覆盖全部学院模板，可继续为各学院增加专业。</p></div></div>`
        }
        <div class="notice" style="margin-top:15px"><span class="notice-icon">i</span><span>首所学院自动开设前三个专业，后续新学院先设立再逐个开设专业。点击后立即扣除建设投入。</span></div>
      </div>
    `,
  };
}

function modalAddProgram(ctx) {
  const colleges = state.colleges;
  if (!colleges.length) return modalCollegeChoice(true);
  const college = state.colleges.find((item) => item.id === ctx.collegeId) || colleges[0];
  const template = COLLEGE_TEMPLATES.find((item) => item.id === college.id);
  const openedNames = new Set(college.programs.map((program) => program.name));
  const remaining = (template?.programs || []).filter((name) => !openedNames.has(name));
  if (!remaining.length) {
    return {
      size: "narrow",
      html: `
        ${modalHeader("专业已全部开设", `${college.name}的固定专业池已经用完`)}
        <div class="modal-body">
          <div class="empty-state"><div><div class="empty-icon">专</div><h3>无可新增专业</h3><p>该学院名下专业已经全部开设，可以继续申报其他学院。</p></div></div>
        </div>
        <div class="modal-foot"><button class="btn btn-dark" type="button" data-action="close-modal">知道了</button></div>
      `,
    };
  }
  return {
    size: "narrow",
    html: `
      ${modalHeader("新增专业", `${college.name} · 建设投入 120 万元`)}
      <form id="add-program-form">
        <div class="modal-body">
          <input type="hidden" name="collegeId" value="${college.id}" />
          <div class="field">
            <label>专业</label>
            <select class="select" name="major" required>
              ${remaining.map((name) => `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`).join("")}
            </select>
          </div>
          <div class="modal-callout info" style="margin:15px 0 0">只能开设本学院固定专业池内的专业，不再允许跨学院选择。</div>
        </div>
        <div class="modal-foot">
          <button class="btn btn-ghost" type="button" data-action="close-modal">取消</button>
          <button class="btn btn-primary" type="submit">开设专业 · 120 万</button>
        </div>
      </form>
    `,
  };
}

function modalApprovalResult(ctx) {
  const approved = ctx.approved;
  return {
    size: "narrow",
    html: `
      <div class="annual-banner" style="border-radius:13px 13px 0 0">
        <small>ADMISSION PLAN REVIEW</small>
        <h2>${approved ? "招生计划获批" : "审批未通过"}</h2>
        <p>${approved ? `教育厅批复 ${formatNumber(ctx.total)} 人，可进入招生投放阶段。` : escapeHtml(ctx.reason || "培养条件尚未达到本年度申报要求。")}</p>
      </div>
      <div class="modal-body">
        <div class="check-list">
          <div class="check-row"><span>申报专业</span><strong>${ctx.programCount} 个</strong></div>
          <div class="check-row"><span>申报总人数</span><strong>${formatNumber(ctx.total)} 人</strong></div>
          <div class="check-row"><span>审批结果</span><strong class="${approved ? "positive" : "negative"}">${approved ? "予以批复" : "退回修改"}</strong></div>
        </div>
        <div class="modal-callout ${approved ? "info" : "danger"}" style="margin:15px 0 0">${approved ? "下一步选择招生策略与招生覆盖范围，实际报到人数会受学校声誉和就业质量影响。" : "调整计划人数或先改善办学条件，随后可重新提交。"}</div>
      </div>
      <div class="modal-foot">
        <button class="btn btn-ghost" type="button" data-action="close-modal">关闭</button>
        ${approved ? `<button class="btn btn-primary" type="button" data-action="open-campaign">进入招生投放</button>` : `<button class="btn btn-primary" type="button" data-action="close-modal">调整计划</button>`}
      </div>
    `,
  };
}

function modalCampaign() {
  return {
    size: "wide",
    html: `
      ${modalHeader("确认招生策略", `批复计划 ${formatNumber(state.admissions.approvedTotal)} 人。策略确认后，录取结果将在 7 月 1 日公布。`)}
      <form id="campaign-form">
        <div class="modal-body">
          <div class="field" style="margin-bottom:16px">
            <label>招生宣传策略</label>
            <div class="strategy-list">
              <label class="strategy">
                <input type="radio" name="strategy" value="steady" />
                <span class="strategy-copy"><strong>稳健备案</strong><span>依靠官网、中学走访与自然咨询，风险低</span></span>
                <span class="strategy-cost">80 万</span>
              </label>
              <label class="strategy">
                <input type="radio" name="strategy" value="media" checked />
                <span class="strategy-copy"><strong>新媒体破圈</strong><span>短视频、校园开放日与专业直播，覆盖更广</span></span>
                <span class="strategy-cost">150 万</span>
              </label>
              <label class="strategy">
                <input type="radio" name="strategy" value="scholarship" />
                <span class="strategy-copy"><strong>奖学金抢人</strong><span>以新生奖学金和承诺吸引高分考生</span></span>
                <span class="strategy-cost">260 万</span>
              </label>
            </div>
          </div>
          <div class="form-grid">
            <div class="field">
              <label>招生覆盖范围</label>
              <select class="select" name="reach">
                <option value="local">成都市及周边 · +0 万</option>
                <option value="regional" selected>四川省内 · +60 万</option>
                <option value="national">面向全国 · +180 万</option>
              </select>
            </div>
            <div class="field">
              <label>录取策略</label>
              <select class="select" name="threshold">
                <option value="balanced" selected>稳健匹配 · 招生与生源质量平衡</option>
                <option value="quality">质量优先 · 报到率略低、生源质量更高</option>
                <option value="volume">规模优先 · 报到率略高、生源质量下降</option>
              </select>
            </div>
          </div>
          <div class="modal-callout info" style="margin:15px 0 0">当前学校实力指数 ${schoolStrength().toFixed(1)}。全国投放会扩大池子，但县域考生更看重就业与专业匹配；过度依赖高额奖学金会压缩年度利润。</div>
        </div>
        <div class="modal-foot">
          <button class="btn btn-ghost" type="button" data-action="close-modal">取消</button>
          <button class="btn btn-primary" type="submit">确认招生策略</button>
        </div>
      </form>
    `,
  };
}

function modalAdmissionResult() {
  const result = state.admissions.lastResult;
  if (!result) return null;
  return {
    size: "narrow",
    html: `
      <div class="annual-banner" style="border-radius:13px 13px 0 0">
        <small>${result.year} ADMISSION RESULT</small>
        <h2>${formatNumber(result.actual)} 名新生报到</h2>
        <p>计划 ${formatNumber(result.planned)} 人，报到率 ${(result.yield * 100).toFixed(1)}%。校园将从这一届正式开始。</p>
      </div>
      <div class="modal-body">
        <div class="annual-stats" style="margin-top:0">
          <div class="annual-stat"><span>投放成本</span><strong>${formatMoney(result.cost)}</strong></div>
          <div class="annual-stat"><span>新生质量</span><strong>${result.cohortQuality}</strong></div>
        </div>
        <div class="modal-callout info">第一学期开始。时间会自动推进，学年结束时将结算学费、成本、排名并生成官网报道。</div>
      </div>
      <div class="modal-foot">
        <button class="btn btn-ghost" type="button" data-action="close-modal">继续整理校务</button>
        <button class="btn btn-primary" type="button" data-action="navigate" data-view="dashboard">回到校务</button>
      </div>
    `,
  };
}

function modalPlot(plotId) {
  const plot = state.campus.plots.find((item) => item.id === plotId);
  if (!plot) return null;
  const building = BUILDINGS.find((item) => item.id === plot.built);
  if (!plot.owned) {
    return {
      size: "narrow",
      html: `
        ${modalHeader(plot.label, `${plot.zone} · 校园二期规划用地`)}
        <div class="modal-body">
          <div class="approval-gauge">
            <div class="big-num">${plot.price}<small>万</small></div>
            <div><strong>用地购置价</strong><p>购地后仍需选择建筑项目。用地本身不会增加培养容量。</p></div>
          </div>
          <div class="check-list">
            <div class="check-row"><span>当前可用资金</span><strong>${formatMoney(state.resources.cash)}</strong></div>
            <div class="check-row"><span>购地后资金</span><strong class="${state.resources.cash - plot.price < 0 ? "negative" : "positive"}">${formatMoney(state.resources.cash - plot.price)}</strong></div>
          </div>
        </div>
        <div class="modal-foot">
          <button class="btn btn-ghost" type="button" data-action="close-modal">暂不购买</button>
          <button class="btn btn-primary" type="button" data-action="buy-plot" data-plot="${plot.id}" ${state.resources.cash < plot.price ? "disabled" : ""}>购入用地</button>
        </div>
      `,
    };
  }
  if (plot.built && building) {
    return {
      size: "narrow",
      html: `
        ${modalHeader(building.name, `${plot.label} · ${plot.zone}`)}
        <div class="modal-body">
          <div class="person-card">
            <div class="avatar">${escapeHtml(building.icon)}</div>
            <div class="person-copy"><strong>${escapeHtml(building.name)}</strong><span>${escapeHtml(building.description)}</span></div>
            <span class="status-pill status-success">使用中</span>
          </div>
          <div class="info-grid" style="grid-template-columns:1fr 1fr;margin-top:14px">
            <div class="info-box"><span>培养容量</span><strong>+${building.capacity}</strong></div>
            <div class="info-box"><span>办学质量</span><strong>+${building.quality}</strong></div>
            <div class="info-box"><span>科研加成</span><strong>+${building.research}</strong></div>
            <div class="info-box"><span>学生满意度</span><strong>+${building.satisfaction}</strong></div>
          </div>
        </div>
        <div class="modal-foot"><button class="btn btn-dark" type="button" data-action="close-modal">完成查看</button></div>
      `,
    };
  }
  return {
    size: "wide",
    html: `
      ${modalHeader(`建设 ${plot.label}`, "已购用地 · 选择一个校园建设项目")}
      <div class="modal-body">
        <div class="build-grid">
          ${BUILDINGS.map(
            (item) => `
              <button class="build-option" type="button" data-action="build-plot" data-plot="${plot.id}" data-building="${item.id}" ${state.resources.cash < item.cost ? "disabled" : ""}>
                <span class="build-option-icon">${escapeHtml(item.icon)}</span>
                <span><strong>${escapeHtml(item.name)} · ${item.cost} 万</strong><span>${escapeHtml(item.description)}</span><span style="margin-top:5px">容量 +${item.capacity} · 质量 +${item.quality} · 科研 +${item.research}</span></span>
              </button>
            `,
          ).join("")}
        </div>
      </div>
    `,
  };
}

function modalPresident() {
  return {
    size: "wide",
    html: `
      ${modalHeader("校长遴选", "任命会扣除一年薪酬；不同履历会改变年度指标成长方向")}
      <div class="modal-body">
        <div class="card-grid three">
          ${PRESIDENT_CANDIDATES.map(
            (candidate) => `
              <button class="choice-card" type="button" data-action="choose-president" data-id="${candidate.id}">
                <div class="avatar">${escapeHtml(candidate.name.slice(0, 1))}</div>
                <strong>${escapeHtml(candidate.name)}</strong>
                <p>${escapeHtml(candidate.title)}<br />${escapeHtml(candidate.quote)}</p>
                <span class="card-foot"><span>${escapeHtml(candidate.trait)} · ${candidate.age} 岁</span><span>年薪 ${candidate.salary} 万</span></span>
              </button>
            `,
          ).join("")}
        </div>
      </div>
    `,
  };
}

function allResearchProjects() {
  return [
    { id: "school-teaching", name: "应用型人才培养模式改革", level: "校级", cost: 60, chance: 0.88, research: 3, minResearch: 0 },
    { id: "school-industry", name: "区域产业人才需求调研", level: "校级", cost: 45, chance: 0.9, research: 2, minResearch: 0 },
    { id: "province-digital", name: "四川省职业教育数字化转型研究", level: "厅级", cost: 160, chance: 0.58, research: 6, minResearch: 30 },
    { id: "province-manufacturing", name: "成渝智能制造产教协同机制研究", level: "省级", cost: 220, chance: 0.5, research: 8, minResearch: 45 },
    { id: "national-applied", name: "国家自然科学基金应用基础项目", level: "国家级", cost: 420, chance: 0.26, research: 15, minResearch: 60 },
    { id: "national-social", name: "国家社会科学基金教育学项目", level: "国家级", cost: 360, chance: 0.29, research: 13, minResearch: 60 },
  ];
}

function modalResearch(projectId) {
  const project = allResearchProjects().find((item) => item.id === projectId);
  if (!project) return null;
  const canApply =
    state.resources.cash >= project.cost &&
    state.resources.research >= project.minResearch &&
    !state.research.projects.some((item) => item.id === project.id && item.year === state.time.year);
  const platformBonus = state.campus.plots.some((plot) => plot.built === "lab" || plot.built === "industry") ? 0.06 : 0;
  return {
    size: "narrow",
    html: `
      ${modalHeader(project.name, `${project.level}项目申报`)}
      <div class="modal-body">
        <div class="approval-gauge">
          <div class="big-num">${Math.round((project.chance + platformBonus) * 100)}<small>%</small></div>
          <div><strong>预计立项概率</strong><p>科研水平越高、实验平台越完善，立项概率越高。</p></div>
        </div>
        <div class="check-list">
          <div class="check-row"><span>申报投入</span><strong>${project.cost} 万</strong></div>
          <div class="check-row"><span>科研门槛</span><strong class="${state.resources.research >= project.minResearch ? "positive" : "negative"}">${state.resources.research} / ${project.minResearch}</strong></div>
          <div class="check-row"><span>立项科研收益</span><strong>+${project.research}</strong></div>
        </div>
        ${
          !canApply
            ? `<div class="modal-callout danger" style="margin-top:14px">资金不足、科研门槛未达到，或本年度已经申报过该项目。</div>`
            : `<div class="modal-callout" style="margin-top:14px">申报失败仍会消耗投入。校级项目风险较低，国家级项目更适合科研实力较强的学校。</div>`
        }
      </div>
      <div class="modal-foot">
        <button class="btn btn-ghost" type="button" data-action="close-modal">取消</button>
        <button class="btn btn-primary" type="button" data-action="submit-research" data-project="${project.id}" ${canApply ? "" : "disabled"}>提交申报</button>
      </div>
    `,
  };
}

function modalDegree(degree) {
  const isMaster = degree === "master";
  const requirements = isMaster
    ? [
        ["办学层次", state.school.level === "本科", "本科"],
        ["科研水平", state.resources.research >= 50, "≥ 50"],
        ["办学质量", state.resources.quality >= 65, "≥ 65"],
        ["在校学生", state.resources.students >= 2500, "≥ 2,500"],
      ]
    : [
        ["办学层次", state.school.level === "专业硕士授权", "专业硕士授权"],
        ["科研水平", state.resources.research >= 72, "≥ 72"],
        ["办学质量", state.resources.quality >= 76, "≥ 76"],
        ["在校学生", state.resources.students >= 5000, "≥ 5,000"],
      ];
  const ready = requirements.every((item) => item[1]);
  return {
    size: "narrow",
    html: `
      ${modalHeader(isMaster ? "申请专业硕士学位点" : "申请博士学位授权点", "学位点审核会参考长期办学质量，而非单年数据")}
      <div class="modal-body">
        <div class="requirements">
          ${requirements.map(([label, ok, value]) => `<div class="requirement"><span>${label}</span><strong class="${ok ? "positive" : "negative"}">${ok ? "✓" : "○"} ${value}</strong></div>`).join("")}
        </div>
        <div class="modal-callout ${ready ? "info" : "danger"}" style="margin:15px 0 0">${ready ? "条件已满足。提交后由评审委员会表决，首次申请成功率与办学声誉相关。" : "尚未达到全部前置条件，建议继续提升科研、办学质量与在校生规模。"}</div>
      </div>
      <div class="modal-foot">
        <button class="btn btn-ghost" type="button" data-action="close-modal">暂不申请</button>
        <button class="btn btn-primary" type="button" data-action="confirm-degree" data-degree="${degree}" ${ready ? "" : "disabled"}>提交评审</button>
      </div>
    `,
  };
}

function modalPublicConversion() {
  const success = clamp(0.45 + (state.resources.quality - 62) * 0.008 + (state.resources.reputation - 70) * 0.006, 0.45, 0.75);
  return {
    size: "narrow",
    html: `
      ${modalHeader("申请民办转公办", "这是一次涉及举办者权益、财政与招生计划的重大变更")}
      <div class="modal-body">
        <div class="approval-gauge">
          <div class="big-num">${Math.round(success * 100)}<small>%</small></div>
          <div><strong>综合评议预估通过率</strong><p>由教育厅、财政与行业专家综合评议，转公办后学费下降，但获得稳定财政补助。</p></div>
        </div>
        <div class="check-list">
          <div class="check-row"><span>社会声誉</span><strong>${state.resources.reputation} / 100</strong></div>
          <div class="check-row"><span>办学质量</span><strong>${state.resources.quality} / 100</strong></div>
          <div class="check-row"><span>在校规模</span><strong>${formatNumber(state.resources.students)} 人</strong></div>
        </div>
      </div>
      <div class="modal-foot">
        <button class="btn btn-ghost" type="button" data-action="close-modal">维持民办</button>
        <button class="btn btn-primary" type="button" data-action="confirm-public-conversion">正式提交申请</button>
      </div>
    `,
  };
}

function modalRankingMethod() {
  return {
    size: "narrow",
    html: `
      ${modalHeader("模拟计分方法", "用于游戏反馈，不对应任何官方排名规则")}
      <div class="modal-body">
        <div class="requirements">
          <div class="requirement"><span>办学质量</span><strong>28%</strong></div>
          <div class="requirement"><span>科研水平</span><strong>24%</strong></div>
          <div class="requirement"><span>社会声誉</span><strong>20%</strong></div>
          <div class="requirement"><span>就业质量</span><strong>16%</strong></div>
          <div class="requirement"><span>学生满意度</span><strong>12%</strong></div>
        </div>
        <p class="method-note" style="margin-top:13px">省榜与全国榜使用 1000 分制，国际榜使用 10000 分制。玩家与 NPC 分数每学年结算更新一次，NPC 也会逐年增长。真实高校名称仅用于参照，分数、位次与标签以游戏数据为准。</p>
      </div>
      <div class="modal-foot"><button class="btn btn-dark" type="button" data-action="close-modal">了解</button></div>
    `,
  };
}

function modalHeadline() {
  return {
    size: "narrow",
    html: `
      ${modalHeader("编辑官网头条", "标题会立即显示在校园官网首页")}
      <form id="headline-form">
        <div class="modal-body">
          <div class="field"><label for="headline-text">首页头条</label><textarea class="textarea" id="headline-text" name="headline" maxlength="60" required>${escapeHtml(state.site.headline)}</textarea></div>
        </div>
        <div class="modal-foot"><button class="btn btn-ghost" type="button" data-action="close-modal">取消</button><button class="btn btn-primary" type="submit">发布头条</button></div>
      </form>
    `,
  };
}

function modalNotice() {
  return {
    size: "narrow",
    html: `
      ${modalHeader("发布通知公告", "公告会进入官网通知栏与最新新闻")}
      <form id="notice-form">
        <div class="modal-body">
          <div class="field"><label for="notice-text">公告内容</label><textarea class="textarea" id="notice-text" name="notice" maxlength="100" required placeholder="例如：关于开展 2026 年校园开放日活动的通知"></textarea></div>
        </div>
        <div class="modal-foot"><button class="btn btn-ghost" type="button" data-action="close-modal">取消</button><button class="btn btn-primary" type="submit">发布公告</button></div>
      </form>
    `,
  };
}

function modalAddClub() {
  const choices = [
    { id: "robotics", name: "机器人创新社", icon: "机", category: "科技实践", members: 36, satisfaction: 3, description: "参加机器人、智能制造与工程实践赛事。" },
    { id: "drama", name: "青禾话剧社", icon: "戏", category: "文艺表演", members: 42, satisfaction: 2, description: "原创校园戏剧与公共演出。" },
    { id: "sports", name: "城市跑团", icon: "跑", category: "体育运动", members: 67, satisfaction: 2, description: "校园夜跑与城市马拉松志愿服务。" },
  ].filter((item) => !state.clubs.some((club) => club.id === item.id));
  return {
    size: "wide",
    html: `
      ${modalHeader("成立新学生社团", "每个社团投入 20 万，提升学生满意度与校园活力")}
      <div class="modal-body">
        ${
          choices.length
            ? `<div class="card-grid three">${choices.map((item) => `<button class="choice-card" type="button" data-action="choose-club" data-id="${item.id}"><span class="choice-icon">${item.icon}</span><strong>${item.name}</strong><p>${item.description}</p><span class="card-foot"><span>${item.category} · ${item.members} 人</span><span>20 万</span></span></button>`).join("")}</div>`
            : `<div class="empty-state"><div><div class="empty-icon">社</div><h3>当前模板社团均已成立</h3><p>你仍可通过校园活动持续提高学生满意度。</p></div></div>`
        }
      </div>
    `,
  };
}

function modalPartner() {
  const choices = [
    { id: "cloud", name: "川云智能科技", field: "人工智能 / 软件服务", cost: 120, employment: 3, research: 2 },
    { id: "manufacture", name: "锦城精密制造", field: "智能制造 / 工业机器人", cost: 150, employment: 4, research: 2 },
    { id: "logistics", name: "蜀道现代物流", field: "供应链 / 现代物流", cost: 100, employment: 3, research: 1 },
  ].filter((item) => !state.partnerships.some((partner) => partner.id === item.id));
  return {
    size: "wide",
    html: `
      ${modalHeader("拓展校企合作", "签约投入用于共建课程、实习基地与联合项目")}
      <div class="modal-body">
        ${
          choices.length
            ? `<div class="card-grid three">${choices.map((item) => `<button class="choice-card" type="button" data-action="choose-partner" data-id="${item.id}" ${state.resources.cash < item.cost ? "disabled" : ""}><span class="choice-icon">企</span><strong>${item.name}</strong><p>${item.field}<br />共建课程与实习基地，形成稳定人才通道。</p><span class="card-foot"><span>就业 +${item.employment} · 科研 +${item.research}</span><span>${item.cost} 万</span></span></button>`).join("")}</div>`
            : `<div class="empty-state"><div><div class="empty-icon">企</div><h3>当前合作模板均已签约</h3><p>后续企业合作可继续在数据中扩展。</p></div></div>`
        }
      </div>
    `,
  };
}

function modalAdvance() {
  const incomplete = state.admissions.planStatus !== "completed";
  const students = state.resources.students;
  const privateTuition = 1.65;
  const publicIncome = state.school.nature === "public" ? 0.88 : 0.12;
  const estimatedIncome = Math.round(students * (privateTuition + publicIncome));
  return {
    size: "narrow",
    html: `
      ${modalHeader(`结束 ${state.time.year} 学年`, "确认后进入下一学年，并生成年度办学报告")}
      <div class="modal-body">
        <div class="approval-gauge">
          <div class="big-num">${formatNumber(students)}<small>人</small></div>
          <div><strong>当前在校学生</strong><p>预计学费与财政补助收入约 ${formatMoney(estimatedIncome)}，年度成本将在结算时精确计算。</p></div>
        </div>
        ${
          incomplete
            ? `<div class="modal-callout danger">本年度招生流程尚未完成。现在结束学年将跳过剩余招生机会，可能让首年经营更加困难。</div>`
            : `<div class="modal-callout info">本年度招生已完成。结算后会处理学生流失、师资成本、校园维护、年度事件和排名变化。</div>`
        }
      </div>
      <div class="modal-foot">
        <button class="btn btn-ghost" type="button" data-action="close-modal">返回处理</button>
        <button class="btn ${incomplete ? "btn-outline" : "btn-primary"}" type="button" data-action="confirm-advance">确认结束学年</button>
      </div>
    `,
  };
}

function modalAnnualReport() {
  const report = state.lastAnnualReport;
  if (!report) return null;
  return {
    size: "wide",
    html: `
      <div class="annual-banner" style="border-radius:13px 13px 0 0">
        <small>${report.year} ANNUAL OPERATING REPORT</small>
        <h2>第 ${report.edition} 学年办学报告</h2>
        <p>${report.overview}</p>
      </div>
      <div class="modal-body">
        <div class="annual-stats">
          <div class="annual-stat"><span>学费与补助收入</span><strong>${formatMoney(report.income)}</strong></div>
          <div class="annual-stat"><span>年度办学成本</span><strong>${formatMoney(report.costs)}</strong></div>
          <div class="annual-stat"><span>年度结余</span><strong class="${report.profit >= 0 ? "positive" : "negative"}">${signedMoney(report.profit)}</strong></div>
          <div class="annual-stat"><span>在校学生</span><strong>${formatNumber(report.students)} 人</strong></div>
        </div>
        <div class="form-grid">
          <div class="person-card">
            <div class="avatar">事</div>
            <div class="person-copy"><strong>年度事件 · ${escapeHtml(report.event.title)}</strong><span>${escapeHtml(report.event.detail)}</span></div>
          </div>
          <div class="person-card">
            <div class="avatar soft">榜</div>
            <div class="person-copy"><strong>综合指数 ${report.strength.toFixed(1)}</strong><span>省内第 ${report.provincial} · 全国约第 ${formatNumber(report.national)}</span></div>
          </div>
        </div>
        <div class="modal-callout ${report.profit >= 0 ? "info" : "danger"}" style="margin:15px 0 0">
          ${report.profit >= 0 ? `本年度形成结余 ${formatMoney(report.profit)}，可持续投入师资、科研或校园建设。` : `本年度出现资金缺口。建议控制扩招节奏，提升报到率和就业质量，或争取科研与校企资源。`}
        </div>
      </div>
      <div class="modal-foot">
        <button class="btn btn-ghost" type="button" data-action="navigate" data-view="campus">查看校园</button>
        <button class="btn btn-primary" type="button" data-action="new-year-plan">制定新学年计划</button>
      </div>
    `,
  };
}

function modalResetConfirm() {
  return {
    size: "narrow",
    html: `
      ${modalHeader("重新开始一局？", "当前学校的本地自动存档将被永久覆盖")}
      <div class="modal-body">
        <div class="modal-callout danger">${escapeHtml(state.school.name)} 已经经营 ${state.history.length} 个完整学年。此操作不可撤销，建议先导出存档。</div>
        <div class="form-grid">
          <button class="btn btn-outline" type="button" data-action="export-save">先导出存档</button>
          <button class="btn btn-danger-soft" type="button" data-action="confirm-reset">确认重新开始</button>
        </div>
      </div>
      <div class="modal-foot"><button class="btn btn-dark" type="button" data-action="close-modal">继续当前学校</button></div>
    `,
  };
}

function modalUpgradeResult(ctx) {
  const success = ctx.success;
  return {
    size: "narrow",
    html: `
      <div class="annual-banner" style="border-radius:13px 13px 0 0">
        <small>INSTITUTIONAL REVIEW</small>
        <h2>${success ? "层级晋升通过" : "本轮评估未通过"}</h2>
        <p>${success ? `学校正式晋升为“${escapeHtml(ctx.target)}”。` : escapeHtml(ctx.reason || "评审认为部分办学指标仍需巩固。")}</p>
      </div>
      <div class="modal-body">
        <div class="modal-callout ${success ? "info" : "danger"}">${success ? "学校层级与官网标签已更新；榜单分数和名次将在下一次年度结算时刷新。" : "保留现有层级，继续提升师资、科研、办学质量与毕业生去向。"}</div>
      </div>
      <div class="modal-foot"><button class="btn btn-primary" type="button" data-action="close-modal">知道了</button></div>
    `,
  };
}

function handleClick(event) {
  const actionNode = event.target.closest("[data-action]");
  if (!actionNode) return;
  const action = actionNode.dataset.action;

  if (action === "modal-backdrop") {
    if (event.target === actionNode) closeModal();
    return;
  }

  event.preventDefault();
  switch (action) {
    case "resume-game":
      ui.active = true;
      ui.view = "dashboard";
      renderApp();
      break;
    case "select-difficulty":
      ui.startForm.difficulty = actionNode.dataset.id;
      document.querySelectorAll("[data-action='select-difficulty']").forEach((button) => {
        const selected = button.dataset.id === actionNode.dataset.id;
        button.classList.toggle("selected", selected);
        button.setAttribute("aria-pressed", selected ? "true" : "false");
      });
      document.querySelector("#start-form [name='difficulty']").value = actionNode.dataset.id;
      break;
    case "toggle-sidebar":
      ui.sidebarOpen = !ui.sidebarOpen;
      renderApp();
      break;
    case "navigate":
      ui.view = actionNode.dataset.view || "dashboard";
      ui.sidebarOpen = false;
      closeModal();
      renderApp();
      window.scrollTo({ top: 0, behavior: "smooth" });
      break;
    case "open-site":
      ui.view = "website";
      ui.sidebarOpen = false;
      renderApp();
      break;
    case "open-tutorial":
      openModal("tutorial");
      break;
    case "open-changelog":
      openModal("changelog");
      break;
    case "tutorial-go":
      ui.view = actionNode.dataset.view || "dashboard";
      closeModal();
      renderApp();
      window.scrollTo({ top: 0, behavior: "smooth" });
      break;
    case "open-save-menu":
      openModal("save-menu");
      break;
    case "close-modal":
      closeModal();
      break;
    case "return-title":
      closeModal();
      ui.active = false;
      renderLanding();
      break;
    case "export-save":
      exportSave();
      break;
    case "reset-game":
      openModal("reset-confirm");
      break;
    case "confirm-reset":
      resetGame();
      break;
    case "open-initial-college":
      openModal("initial-college");
      break;
    case "open-add-college":
      openModal("add-college");
      break;
    case "choose-college":
      chooseCollege(actionNode.dataset.id, actionNode.dataset.initial === "true");
      break;
    case "open-add-program":
      openModal("add-program", { collegeId: actionNode.dataset.collegeId });
      break;
    case "adjust-plan":
      adjustPlan(actionNode.dataset.program, Number(actionNode.dataset.delta));
      break;
    case "submit-plan":
      submitAdmissionPlan();
      break;
    case "open-campaign":
      openModal("campaign");
      break;
    case "open-advance":
      openModal("advance");
      break;
    case "toggle-clock":
      state.time.running = !state.time.running;
      clockAccumulatorMs = 0;
      clockLastMs = Date.now();
      saveState();
      renderApp();
      break;
    case "set-speed":
      state.time.speed = Number(actionNode.dataset.speed) || 1;
      clockAccumulatorMs = 0;
      clockLastMs = Date.now();
      saveState();
      renderApp();
      break;
    case "finance-tab":
      ui.financeTab = actionNode.dataset.tab || "bank";
      renderApp();
      break;
    case "notification-handle":
      handleNotification("handle");
      break;
    case "notification-skip":
      handleNotification("skip");
      break;
    case "unmute-notification":
      delete state.notifications.muted[actionNode.dataset.type];
      saveState();
      renderApp();
      toast("通知已开启", `${notificationTypeLabel(actionNode.dataset.type)}将重新提醒。`, "success");
      break;
    case "open-deposit":
      openModal("deposit");
      break;
    case "open-withdraw":
      openModal("withdraw");
      break;
    case "open-loan":
      openModal("loan");
      break;
    case "open-repay":
      openModal("repay");
      break;
    case "open-stock-transfer":
      openModal("stock-transfer");
      break;
    case "open-stock-order":
      openModal("stock-order", { symbol: actionNode.dataset.symbol, side: actionNode.dataset.side });
      break;
    case "confirm-advance":
      settleYear();
      break;
    case "new-year-plan":
      closeModal();
      ui.view = "admissions";
      renderApp();
      break;
    case "open-president":
      openModal("president");
      break;
    case "choose-president":
      choosePresident(actionNode.dataset.id);
      break;
    case "hire-faculty":
      hireFaculty();
      break;
    case "apply-upgrade":
      applyUpgrade(actionNode.dataset.target);
      break;
    case "apply-tier-upgrade":
      applyTierUpgrade(actionNode.dataset.tier);
      break;
    case "apply-public-conversion":
      openModal("public-conversion");
      break;
    case "confirm-public-conversion":
      applyPublicConversion();
      break;
    case "open-research":
      openModal("research", { projectId: actionNode.dataset.project });
      break;
    case "submit-research":
      submitResearch(actionNode.dataset.project);
      break;
    case "apply-degree":
      openModal("degree", { degree: actionNode.dataset.degree });
      break;
    case "confirm-degree":
      applyDegree(actionNode.dataset.degree);
      break;
    case "open-plot":
      openModal("plot", { plotId: actionNode.dataset.plot });
      break;
    case "buy-plot":
      buyPlot(actionNode.dataset.plot);
      break;
    case "build-plot":
      buildPlot(actionNode.dataset.plot, actionNode.dataset.building);
      break;
    case "life-tab":
      ui.lifeTab = actionNode.dataset.tab;
      renderApp();
      break;
    case "open-add-club":
      openModal("add-club");
      break;
    case "choose-club":
      chooseClub(actionNode.dataset.id);
      break;
    case "register-competition":
      registerCompetition(actionNode.dataset.id);
      break;
    case "open-partner":
      openModal("partner");
      break;
    case "choose-partner":
      choosePartner(actionNode.dataset.id);
      break;
    case "hold-alumni-day":
      holdAlumniDay();
      break;
    case "ranking-tab":
      ui.rankingTab = actionNode.dataset.tab;
      renderApp();
      break;
    case "open-ranking-method":
      openModal("ranking-method");
      break;
    case "edit-headline":
      openModal("headline");
      break;
    case "publish-notice":
      openModal("notice");
      break;
    default:
      break;
  }
}

function handleSubmit(event) {
  const form = event.target;
  if (form.id === "start-form") {
    event.preventDefault();
    startNewGame(new FormData(form));
    return;
  }
  if (form.id === "add-program-form") {
    event.preventDefault();
    addProgram(new FormData(form));
    return;
  }
  if (form.id === "campaign-form") {
    event.preventDefault();
    runCampaign(new FormData(form));
    return;
  }
  if (form.id === "finance-deposit-form") {
    event.preventDefault();
    financeDeposit(new FormData(form));
    return;
  }
  if (form.id === "finance-withdraw-form") {
    event.preventDefault();
    financeWithdraw(new FormData(form));
    return;
  }
  if (form.id === "finance-loan-form") {
    event.preventDefault();
    financeLoan(new FormData(form));
    return;
  }
  if (form.id === "finance-repay-form") {
    event.preventDefault();
    financeRepay(new FormData(form));
    return;
  }
  if (form.id === "stock-transfer-form") {
    event.preventDefault();
    stockTransfer(new FormData(form));
    return;
  }
  if (form.id === "stock-order-form") {
    event.preventDefault();
    stockOrder(new FormData(form));
    return;
  }
  if (form.id === "headline-form") {
    event.preventDefault();
    const headline = String(new FormData(form).get("headline") || "").trim();
    if (!headline) return;
    state.site.headline = headline.slice(0, 60);
    addNews("学校官网首页头条更新", state.site.headline, "校园公告");
    commit();
    toast("头条已发布", "校园官网首页已更新。", "success");
    return;
  }
  if (form.id === "notice-form") {
    event.preventDefault();
    const notice = String(new FormData(form).get("notice") || "").trim();
    if (!notice) return;
    state.site.notices.unshift(notice.slice(0, 100));
    state.site.notices = state.site.notices.slice(0, 12);
    addNews(notice.slice(0, 100), "该通知已通过学校官网正式发布，请相关师生及时关注。", "通知公告");
    commit();
    toast("通知已发布", "公告已进入官网通知栏。", "success");
  }
}

function handleChange(event) {
  const target = event.target;
  if (target.name === "nature") {
    ui.startForm.nature = target.value;
    document.querySelectorAll(".nature-option").forEach((label) => {
      label.classList.toggle("selected", label.querySelector("input")?.value === target.value);
    });
    return;
  }
  if (target.matches("[data-plan-input]")) {
    const programId = target.dataset.planInput;
    const next = clamp(Number(target.value) || 0, 0, 500);
    state.admissions.draft[programId] = Math.round(next / 10) * 10;
    saveState();
    renderApp();
  }
}

function handleInput(event) {
  const target = event.target;
  if (target.id === "school-name") {
    ui.startForm.name = target.value;
  }
}

function handleKeydown(event) {
  if (event.key === "Escape" && ui.modal) closeModal();
  if ((event.key === "Enter" || event.key === " ") && event.target.matches("[role='button'][data-action]")) {
    event.preventDefault();
    event.target.click();
  }
}

function exportSave() {
  if (!state) return;
  const payload = JSON.stringify(state, null, 2);
  const blob = new Blob([payload], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${state.school.name}-${state.time.year}-存档.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  toast("存档已导出", "可用文本编辑器打开查看或备份。", "success");
}

function resetGame() {
  try {
    localStorage.removeItem(SAVE_KEY);
    localStorage.removeItem(SAVED_AT_KEY);
  } catch {
    // A fresh game can still start if storage is unavailable for this request.
  }
  state = null;
  ui.active = false;
  ui.modal = null;
  ui.view = "dashboard";
  ui.startForm = {
    name: "青禾学院",
    difficulty: "steady",
    nature: "private",
    province: "四川省",
  };
  modalRoot.innerHTML = "";
  renderLanding();
  toast("已建立空白档案", "可以开始新的办学合同。");
}

function chooseCollege(templateId, initial) {
  const template = COLLEGE_TEMPLATES.find((item) => item.id === templateId);
  if (!template) return;
  if (state.colleges.some((college) => college.id === templateId)) {
    toast("该学院已经设立", "请选择其他学院方向。", "error");
    return;
  }
  const cost = initial ? 620 : 980;
  if (state.resources.cash < cost) {
    toast("资金不足", `设立学院需要 ${formatMoney(cost)}。`, "error");
    return;
  }
  state.resources.cash -= cost;
  state.resources.faculty += initial ? 12 : 8;
  state.resources.quality += 1;
  const initialPrograms = initial ? template.programs.slice(0, 3) : [];
  const programs = initialPrograms.map((name, index) => ({
    id: `${template.id}-${index + 1}`,
    name,
    code: `${template.id === "medicine" ? "520" : "510"}${String(201 + index * 3).padStart(3, "0")}`,
  }));
  state.colleges.push({
    id: template.id,
    name: template.name,
    code: template.code,
    category: template.category,
    icon: template.icon,
    accent: template.accent,
    summary: template.summary,
    programs,
  });
  if (initial) {
    state.flags.firstCollege = true;
    addNews(
      `${template.name}正式揭牌成立`,
      `学校首批设置${programs.map((item) => item.name).join("、")}等专业，开启应用型人才培养。`,
      "学校要闻",
    );
    toast("首所学院已建立", `${template.name}投入 ${formatMoney(cost)} 完成建设。`, "success");
  } else {
    addNews(
      `${template.name}获准设立`,
      `学校新增${template.name}，下一步可在该学院名下开设对应专业。`,
      "教学科研",
    );
    toast("新学院已设立", `${template.name}进入建设阶段。`, "success");
  }
  if (state.admissions.planStatus !== "approved" && !state.admissions.campaignDone) {
    redistributeAdmissionDraft();
  }
  saveState();
  closeModal();
  renderApp();
  if (initial) {
    window.setTimeout(() => openModal("tutorial"), 250);
  }
}

function addProgram(formData) {
  const college = state.colleges.find((item) => item.id === formData.get("collegeId"));
  const majorName = String(formData.get("major") || "");
  if (!college || !majorName) {
    toast("专业信息不完整", "请选择专业。", "error");
    return;
  }
  if (state.resources.cash < 120) {
    toast("资金不足", "新增专业需要 120 万元。", "error");
    return;
  }
  if (getPrograms().some((program) => program.name === majorName && program.collegeId === college.id)) {
    toast("该专业已存在", "同一学院不可重复开设同一专业。", "error");
    return;
  }
  const template = COLLEGE_TEMPLATES.find((item) => item.id === college.id);
  if (!template?.programs.includes(majorName)) {
    toast("专业不属于该学院", "只能开设本学院固定专业池内的专业。", "error");
    return;
  }
  const program = {
    id: `${college.id}-${Date.now().toString(36)}`,
    name: majorName,
    code: `5${String(10000 + Math.floor(Math.random() * 49999))}`,
  };
  college.programs.push(program);
  state.resources.cash -= 120;
  state.resources.quality += 1;
  addNews(
    `${majorName}专业获批备案`,
    `${college.name}新增${majorName}专业，纳入学校人才培养体系。`,
    "教学科研",
  );
  if (state.admissions.planStatus !== "approved" && !state.admissions.campaignDone) {
    redistributeAdmissionDraft();
  }
  commit();
  toast("专业开设完成", `${college.name}已新增${majorName}。`, "success");
}

function adjustPlan(programId, delta) {
  if (state.admissions.planStatus === "approved" || state.admissions.campaignDone) return;
  const current = Number(state.admissions.draft[programId] || 0);
  state.admissions.draft[programId] = clamp(current + delta, 0, 500);
  saveState();
  renderApp();
}

function submitAdmissionPlan() {
  const programs = getPrograms();
  const total = planTotal();
  if (!isAdmissionApplicationWindow()) {
    toast("招生计划申报已关闭", "本年度申报时间为 1 月 1 日至 4 月 30 日。", "error");
    return;
  }
  if (state.admissions.planStatus === "submitted") {
    toast("计划正在审核", "当前招生计划已提交，请等待教育局答复。", "info");
    return;
  }
  if (!programs.length) {
    toast("没有可申报专业", "请先建立学院与专业。", "error");
    return;
  }
  if (total < 60) {
    toast("计划人数过少", "本年度申报总人数至少为 60 人。", "error");
    return;
  }
  if (total > (state.admissions.annualQuota || annualAdmissionQuota())) {
    toast("超出本年度新生配额", `本年度最多可招 ${formatNumber(state.admissions.annualQuota || annualAdmissionQuota())} 名新生。`, "error");
    return;
  }
  const submittedAt = { year: state.time.year, month: state.time.month, day: state.time.day };
  const reviewStartedAt = state.time.month === 1 ? { year: state.time.year, month: 2, day: 1 } : submittedAt;
  const workdays = Math.floor(randomBetween(10, 26));
  let decisionAt = addWorkingDays(reviewStartedAt, workdays);
  if (dateNumber(decisionAt.year, decisionAt.month, decisionAt.day) > dateNumber(state.time.year, 5, 31)) {
    decisionAt = { year: state.time.year, month: 5, day: 31 };
  }
  state.admissions.submittedAt = submittedAt;
  state.admissions.reviewStartedAt = reviewStartedAt;
  state.admissions.decisionAt = decisionAt;
  state.admissions.planStatus = "submitted";
  state.admissions.approvedTotal = 0;
  state.admissions.campaignDone = false;
  saveState();
  renderApp();
  toast("招生计划已提交", `预计在 ${formatGameDate(decisionAt)} 前答复。`, "success");
}

function runCampaign(formData) {
  if (state.admissions.planStatus !== "approved" || state.admissions.campaignDone) {
    toast("当前无法启动招生", "需要先获得本年度计划批复。", "error");
    return;
  }
  const strategies = {
    steady: { name: "稳健备案", cost: 80, bonus: -0.015, qualityBonus: 1, reputation: 1 },
    media: { name: "新媒体破圈", cost: 150, bonus: 0.045, qualityBonus: 0, reputation: 2 },
    scholarship: { name: "奖学金抢人", cost: 260, bonus: 0.085, qualityBonus: 3, reputation: 3 },
  };
  const reaches = {
    local: { name: "成都市及周边", cost: 0, bonus: -0.025, quality: -1 },
    regional: { name: "四川省内", cost: 60, bonus: 0.015, quality: 0 },
    national: { name: "面向全国", cost: 180, bonus: 0.03, quality: 2 },
  };
  const thresholds = {
    balanced: { name: "稳健匹配", bonus: 0, quality: 0 },
    quality: { name: "质量优先", bonus: -0.035, quality: 6 },
    volume: { name: "规模优先", bonus: 0.05, quality: -5 },
  };
  const strategy = strategies[formData.get("strategy")] || strategies.media;
  const reach = reaches[formData.get("reach")] || reaches.regional;
  const threshold = thresholds[formData.get("threshold")] || thresholds.balanced;
  const cost = strategy.cost + reach.cost;
  if (state.resources.cash < cost) {
    toast("投放预算不足", `当前方案需要 ${formatMoney(cost)}。`, "error");
    return;
  }
  state.resources.cash -= cost;
  state.admissions.campaignDone = true;
  state.admissions.strategy = formData.get("strategy") || "steady";
  state.admissions.strategyName = strategy.name;
  state.admissions.reach = reach.name;
  state.admissions.threshold = threshold.name;
  state.admissions.campaignCost = cost;
  state.admissions.planStatus = "strategy_confirmed";
  saveState();
  renderApp();
  closeModal();
  toast("招生策略已确认", "录取结果将在 7 月 1 日统一公布。", "success");
}

function choosePresident(candidateId) {
  const candidate = PRESIDENT_CANDIDATES.find((item) => item.id === candidateId);
  if (!candidate) return;
  if (state.governance.president?.id === candidate.id) {
    toast("该校长已在任", "无需重复任命。", "info");
    return;
  }
  if (state.resources.cash < candidate.salary) {
    toast("资金不足", `首年薪酬需要 ${formatMoney(candidate.salary)}。`, "error");
    return;
  }
  state.resources.cash -= candidate.salary;
  state.governance.president = { ...candidate };
  state.governance.interim = false;
  state.resources.reputation = clamp(state.resources.reputation + candidate.reputation, 0, 100);
  state.resources.quality = clamp(state.resources.quality + candidate.quality, 0, 100);
  state.resources.research = clamp(state.resources.research + candidate.research, 0, 100);
  addNews(
    `${candidate.name}就任${state.school.name}校长`,
    `学校董事会审议通过聘任决定。${candidate.name}长期从事${candidate.title}相关工作，将以“${candidate.trait}”为治校重点。`,
    "学校要闻",
  );
  commit();
  toast("校长任命已发布", `${candidate.name}正式就任。`, "success");
}

function hireFaculty() {
  if (state.governance.facultyHires >= 2) {
    toast("年度引进额度已用完", "每学年最多可集中引进两批师资。", "info");
    return;
  }
  if (state.resources.cash < 180) {
    toast("资金不足", "人才引进需要 180 万元。", "error");
    return;
  }
  state.resources.cash -= 180;
  state.resources.faculty += 8;
  state.resources.quality = clamp(state.resources.quality + 2, 0, 100);
  state.governance.facultyHires += 1;
  toast("师资引进完成", "新增 8 名专任教师，办学质量提升。", "success");
  saveState();
  renderApp();
}

function applyUpgrade(target) {
  const requirements = getUpgradeRequirements(target);
  const missing = Object.entries(requirements).filter(([key, req]) => currentMetricValue(key) < req.value);
  if (missing.length) {
    toast("升格条件未满足", `还有 ${missing.length} 项关键指标未达标。`, "error");
    return;
  }
  if (state.resources.cash < 150) {
    toast("评估费用不足", "升格评估需预留 150 万元。", "error");
    return;
  }
  state.resources.cash -= 150;
  const chance = clamp(
    0.7 +
      (state.resources.quality - (requirements.quality?.value || 50)) * 0.01 +
      (state.resources.reputation - 50) * 0.004,
    0.55,
    0.92,
  );
  const success = Math.random() < chance;
  if (success) {
    const oldLevel = state.school.level;
    state.school.level = target;
    state.resources.reputation = clamp(state.resources.reputation + 6, 0, 100);
    state.resources.quality = clamp(state.resources.quality + 3, 0, 100);
    addNews(
      `学校获批升格为${target}`,
      `经省级高校设置评议委员会审议，学校由${oldLevel}升格为${target}，办学空间与人才培养层次进一步拓展。`,
      "学校要闻",
    );
  } else {
    state.resources.reputation = clamp(state.resources.reputation - 1, 0, 100);
  }
  saveState();
  renderApp();
  openModal("upgrade-result", {
    success,
    target,
    reason: success ? "" : "专家评议认为学校仍需进一步夯实师资结构、科研产出与毕业生发展质量。",
  });
}

function applyTierUpgrade(targetTierId) {
  const currentTier = getSchoolTier();
  const expectedTier = nextSchoolTier(currentTier.id);
  const targetTier = SCHOOL_TIERS.find((tier) => tier.id === targetTierId);
  if (!targetTier || !expectedTier || targetTier.id !== expectedTier.id) {
    toast("层级申请无效", "只能按顺序申请下一层级。", "error");
    return;
  }
  const missing = Object.entries(targetTier.requirements || {}).filter(
    ([key, required]) => currentMetricValue(key) < required,
  );
  if (missing.length) {
    toast("层级条件未满足", `还有 ${missing.length} 项关键指标未达标。`, "error");
    return;
  }
  if (state.resources.cash < 200) {
    toast("资金不足", "层级评估需要预留 200 万元。", "error");
    return;
  }
  state.resources.cash -= 200;
  const chance = clamp(
    0.62 +
      (state.resources.quality - 50) * 0.006 +
      (state.resources.reputation - 50) * 0.004 +
      schoolStrength() * 0.002,
    0.5,
    0.92,
  );
  const success = Math.random() < chance;
  if (success) {
    const oldTier = currentTier.name;
    state.school.tier = targetTier.id;
    state.school.nature = targetTier.nature;
    state.resources.reputation = clamp(state.resources.reputation + 4, 0, 100);
    state.tierHistory = state.tierHistory || [];
    state.tierHistory.unshift({
      year: state.time.year,
      tierName: targetTier.name,
      domesticTags: targetTier.domesticTags,
      internationalTag: targetTier.internationalTag,
    });
    const transfer = currentTier.nature === "private" && targetTier.nature === "public";
    addNews(
      transfer ? `${state.school.name}转设为${targetTier.name}` : `学校获批晋升为${targetTier.name}`,
      `学校由${oldTier}晋升为${targetTier.name}，省/国分数上限提升至${targetTier.provincialCap}，国际分数上限提升至${targetTier.internationalCap}。`,
      "学校要闻",
    );
  } else {
    state.resources.reputation = clamp(state.resources.reputation - 2, 0, 100);
  }
  saveState();
  renderApp();
  openModal("upgrade-result", {
    success,
    target: targetTier.name,
    reason: success ? "" : "评议认为学校仍需进一步夯实师资、科研与毕业生发展质量。",
  });
}

function applyPublicConversion() {
  if (state.school.nature === "public") return;
  if (
    state.time.year - state.school.founded < 3 ||
    state.resources.reputation < 70 ||
    state.resources.quality < 62 ||
    state.resources.students < 2000
  ) {
    toast("尚不满足申请条件", "请先核查办学年限、声誉、质量与在校生规模。", "error");
    return;
  }
  const chance = clamp(
    0.45 +
      (state.resources.quality - 62) * 0.008 +
      (state.resources.reputation - 70) * 0.006,
    0.45,
    0.75,
  );
  const success = Math.random() < chance;
  state.flags.publicConversionAttempted = true;
  if (success) {
    state.school.nature = "public";
    state.resources.reputation = clamp(state.resources.reputation + 10, 0, 100);
    state.resources.quality = clamp(state.resources.quality + 3, 0, 100);
    addNews(
      `${state.school.name}转设为公办普通高等学校`,
      "经省政府批准，学校办学体制由民办转设为公办，纳入省属高校管理体系，继续承担应用型人才培养任务。",
      "学校要闻",
    );
    commit();
    toast("转设申请获批", "学校正式进入公办序列。", "success");
  } else {
    state.resources.reputation = clamp(state.resources.reputation - 3, 0, 100);
    addNews("学校公办转设申请完成评议", "综合评议认为办学质量已有基础，仍需进一步优化治理结构与学位建设。", "通知公告", null, false);
    commit();
    toast("本轮评议未获批准", "可继续积累办学质量，下一学年再次申请。", "error");
  }
}

function submitResearch(projectId) {
  const project = allResearchProjects().find((item) => item.id === projectId);
  if (!project) return;
  if (state.research.projects.some((item) => item.id === project.id && item.year === state.time.year)) {
    toast("本年度已申报", "同一项目每学年只能申报一次。", "info");
    return;
  }
  if (state.resources.cash < project.cost || state.resources.research < project.minResearch) {
    toast("无法申报", "请检查资金与科研门槛。", "error");
    return;
  }
  const platformBonus = state.campus.plots.some((plot) => plot.built === "lab" || plot.built === "industry") ? 0.06 : 0;
  state.resources.cash -= project.cost;
  const success = Math.random() < project.chance + platformBonus;
  const entry = {
    id: project.id,
    name: project.name,
    level: project.level,
    year: state.time.year,
    research: success ? project.research : 0,
    status: success ? "在研" : "未立项",
  };
  state.research.projects.unshift(entry);
  if (success) {
    state.resources.research = clamp(state.resources.research + project.research, 0, 100);
    state.resources.reputation = clamp(state.resources.reputation + (project.level === "国家级" ? 6 : 2), 0, 100);
    addNews(
      `学校获批${project.level}科研项目`,
      `“${project.name}”正式立项，将围绕区域产业与应用型人才培养开展研究。`,
      "教学科研",
    );
    toast("项目成功立项", `科研水平提升 ${project.research} 点。`, "success");
  } else {
    toast("本轮项目未获立项", "申报投入已用于材料与评审，下一学年可再试。", "error");
  }
  saveState();
  renderApp();
}

function applyDegree(degree) {
  const isMaster = degree === "master";
  const successChance = clamp(
    0.52 +
      (state.resources.research - (isMaster ? 50 : 72)) * 0.009 +
      (state.resources.reputation - 60) * 0.004,
    0.42,
    0.8,
  );
  const success = Math.random() < successChance;
  if (success) {
    state.school.level = isMaster ? "专业硕士授权" : "博士授权";
    state.resources.research = clamp(state.resources.research + (isMaster ? 6 : 10), 0, 100);
    state.resources.reputation = clamp(state.resources.reputation + (isMaster ? 7 : 12), 0, 100);
    addNews(
      `学校获批${isMaster ? "专业硕士" : "博士"}学位授予权`,
      `学校研究生教育与学位点建设取得重要进展，首批${isMaster ? "专业硕士" : "博士"}培养方案正式启动。`,
      "教学科研",
    );
    toast("学位点申请通过", `学校进入${state.school.level}阶段。`, "success");
  } else {
    state.resources.reputation = clamp(state.resources.reputation - 1, 0, 100);
    addNews("学位点评审结果公布", "本轮学位点评审未获通过，学校将根据专家意见继续加强师资与科研平台建设。", "通知公告", null, false);
    toast("本轮学位点评审未通过", "保持现有办学层次，继续积累科研能力。", "error");
  }
  commit({ scrollTop: true });
}

function buyPlot(plotId) {
  const plot = state.campus.plots.find((item) => item.id === plotId);
  if (!plot || plot.owned) return;
  if (state.resources.cash < plot.price) {
    toast("资金不足", "可用资金不足以购买该地块。", "error");
    return;
  }
  state.resources.cash -= plot.price;
  plot.owned = true;
  state.resources.land += 1;
  addNews(`学校完成${plot.label}用地购置`, "新用地将用于校园二期建设，具体项目将根据学校发展需要逐步实施。", "校园生活");
  saveState();
  renderApp();
  openModal("plot", { plotId });
  toast("用地购置完成", "可以继续选择校园建设项目。", "success");
}

function buildPlot(plotId, buildingId) {
  const plot = state.campus.plots.find((item) => item.id === plotId);
  const building = BUILDINGS.find((item) => item.id === buildingId);
  if (!plot || !plot.owned || plot.built || !building) return;
  if (state.resources.cash < building.cost) {
    toast("建设资金不足", `${building.name}需要 ${formatMoney(building.cost)}。`, "error");
    return;
  }
  state.resources.cash -= building.cost;
  plot.built = building.id;
  state.resources.capacity += building.capacity;
  state.resources.quality = clamp(state.resources.quality + building.quality, 0, 100);
  state.resources.research = clamp(state.resources.research + building.research, 0, 100);
  state.resources.satisfaction = clamp(state.resources.satisfaction + building.satisfaction, 0, 100);
  addNews(
    `${building.name}竣工启用`,
    `学校在${plot.label}建成${building.name}，新增培养容量${building.capacity}人，进一步改善办学条件。`,
    "校园生活",
  );
  commit();
  toast("建设项目竣工", `${building.name}已加入校园地图。`, "success");
}

function chooseClub(clubId) {
  const choices = {
    robotics: { id: "robotics", name: "机器人创新社", icon: "机", category: "科技实践", members: 36, satisfaction: 3, description: "参加机器人、智能制造与工程实践赛事。" },
    drama: { id: "drama", name: "青禾话剧社", icon: "戏", category: "文艺表演", members: 42, satisfaction: 2, description: "原创校园戏剧与公共演出。" },
    sports: { id: "sports", name: "城市跑团", icon: "跑", category: "体育运动", members: 67, satisfaction: 2, description: "校园夜跑与城市马拉松志愿服务。" },
  };
  const club = choices[clubId];
  if (!club || state.clubs.some((item) => item.id === clubId)) return;
  if (state.resources.cash < 20) {
    toast("资金不足", "成立社团需要 20 万元。", "error");
    return;
  }
  state.resources.cash -= 20;
  state.clubs.push(club);
  state.resources.satisfaction = clamp(state.resources.satisfaction + club.satisfaction, 0, 100);
  addNews(`${club.name}正式成立`, `学校新增${club.category}类学生社团，为校园文化注入新活力。`, "校园生活");
  commit();
  toast("社团已成立", `${club.name}现有 ${club.members} 名发起成员。`, "success");
}

function registerCompetition(competitionId) {
  const comp = COMPETITIONS.find((item) => item.id === competitionId);
  if (!comp) return;
  const entryKey = `${state.time.year}:${comp.id}`;
  if (state.competitions.entries[entryKey]) {
    toast("本学年已参赛", "同一赛事每学年只能组织一次。", "info");
    return;
  }
  if (state.resources.cash < comp.cost) {
    toast("参赛经费不足", `组织参赛需要 ${formatMoney(comp.cost)}。`, "error");
    return;
  }
  const levelPenalty = { 校级: 0, 省级: 8, 国家级: 18, 国际级: 22, 世界级: 30 }[comp.level] || 0;
  const minimumSchoolPenalty = comp.requires === "职业本科及以上" && state.school.level === "本科" ? 8 : 0;
  const performance =
    schoolStrength() +
    state.resources.research * 0.13 +
    randomBetween(-11, 11) -
    levelPenalty -
    minimumSchoolPenalty;
  let award = "未获奖";
  let factor = 0;
  if (performance >= 78) {
    award = "一等奖 / 金奖";
    factor = 1;
  } else if (performance >= 64) {
    award = "二等奖";
    factor = 0.68;
  } else if (performance >= 51) {
    award = "三等奖";
    factor = 0.42;
  } else if (performance >= 40) {
    award = "优秀奖";
    factor = 0.18;
  }
  state.resources.cash -= comp.cost;
  const reputationGain = Math.round(comp.reputation * factor);
  const researchGain = Math.round(comp.research * factor);
  state.resources.reputation = clamp(state.resources.reputation + reputationGain, 0, 100);
  state.resources.research = clamp(state.resources.research + researchGain, 0, 100);
  if (award !== "未获奖") {
    state.resources.satisfaction = clamp(state.resources.satisfaction + 1, 0, 100);
  }
  state.competitions.entries[entryKey] = {
    award,
    reputation: reputationGain,
    research: researchGain,
    year: state.time.year,
  };
  addNews(
    award === "未获奖" ? `学校组织参加${comp.short}` : `学生在${comp.short}中获${award}`,
    award === "未获奖"
      ? "参赛团队完成阶段性实训与项目复盘，为下一届赛事积累经验。"
      : `参赛项目展现了学校在实践教学与创新训练方面的阶段性成果，学校声誉提升${reputationGain}点。`,
    "校园生活",
  );
  commit();
  toast(award === "未获奖" ? "参赛完成" : `获得${award}`, award === "未获奖" ? "本轮未获奖项，参赛经验已保留。" : `声誉 +${reputationGain} · 科研 +${researchGain}`, award === "未获奖" ? "info" : "success");
}

function choosePartner(partnerId) {
  const options = {
    cloud: { id: "cloud", name: "川云智能科技", field: "人工智能 / 软件服务", cost: 120, employment: 3, research: 2 },
    manufacture: { id: "manufacture", name: "锦城精密制造", field: "智能制造 / 工业机器人", cost: 150, employment: 4, research: 2 },
    logistics: { id: "logistics", name: "蜀道现代物流", field: "供应链 / 现代物流", cost: 100, employment: 3, research: 1 },
  };
  const partner = options[partnerId];
  if (!partner || state.partnerships.some((item) => item.id === partnerId)) return;
  if (state.resources.cash < partner.cost) {
    toast("签约资金不足", "请先调整年度预算。", "error");
    return;
  }
  state.resources.cash -= partner.cost;
  state.resources.employment = clamp(state.resources.employment + partner.employment, 0, 100);
  state.resources.research = clamp(state.resources.research + partner.research, 0, 100);
  state.partnerships.push({ ...partner, year: state.time.year });
  addNews(
    `学校与${partner.name}签署战略合作协议`,
    `双方将围绕${partner.field}共建课程、实习实训基地与联合项目，进一步提高人才培养与产业需求的匹配度。`,
    "教学科研",
  );
  commit();
  toast("校企合作达成", `就业 +${partner.employment} · 科研 +${partner.research}`, "success");
}

function holdAlumniDay() {
  if (state.resources.alumni < 50) return;
  if (state.flags.alumniDayYear === state.time.year) {
    toast("今年已经举办", "校友返校日每年只能举办一次。", "info");
    return;
  }
  const donation = Math.min(800, Math.max(30, Math.round(state.resources.alumni * randomBetween(0.035, 0.065))));
  state.resources.cash += donation;
  state.resources.reputation = clamp(state.resources.reputation + 2, 0, 100);
  state.flags.alumniDayYear = state.time.year;
  addNews(
    "校友返校日暨学校发展基金捐赠仪式举行",
    `来自各行业的校友返校交流，共同见证学校发展，并募集发展基金${formatMoney(donation)}。`,
    "校园生活",
  );
  commit();
  toast("校友返校日成功举办", `募集发展基金 ${formatMoney(donation)}。`, "success");
}

function settleYear({ silent = false } = {}) {
  closeModal();
  const year = state.time.year;
  const diff = difficultyData();
  const cohortNotes = [];
  state.admissions.cohorts.forEach((cohort) => {
    const age = year - cohort.year;
    const attrition = age >= 1 ? Math.max(1, Math.round(cohort.size * 0.035)) : 0;
    cohort.size = Math.max(0, cohort.size - attrition);
    if (attrition) cohortNotes.push(`${cohort.year}级自然流失 ${formatNumber(attrition)} 人`);
  });
  const students = state.admissions.cohorts.reduce((sum, cohort) => sum + cohort.size, 0);
  state.resources.students = students;

  const tuition = state.school.nature === "public" ? 0.72 : 1.65;
  const publicGrant = state.school.nature === "public" ? 0.9 : 0.12;
  const income = Math.round(students * (tuition + publicGrant));
  const builtCount = state.campus.plots.filter((plot) => plot.built).length;
  const programCount = getPrograms().length;
  const costs = Math.round(
    (state.resources.faculty * 5.5 +
      students * 0.2 +
      builtCount * 35 +
      programCount * 10) *
      diff.costFactor,
  );
  const profit = income - costs;
  state.resources.cash += profit;

  const ratio = students / Math.max(1, state.resources.faculty);
  if (ratio > 26) {
    state.resources.quality = clamp(state.resources.quality - 2, 0, 100);
    state.resources.satisfaction = clamp(state.resources.satisfaction - 2, 0, 100);
  } else if (ratio > 0 && ratio <= 22) {
    state.resources.quality = clamp(state.resources.quality + 1, 0, 100);
  }
  if (state.governance.president) {
    const president = state.governance.president;
    state.resources.quality = clamp(state.resources.quality + 1 + president.quality * 0.5, 0, 100);
    state.resources.research = clamp(state.resources.research + president.research, 0, 100);
    state.resources.reputation = clamp(state.resources.reputation + president.reputation * 0.35, 0, 100);
  }
  const inYearProjects = state.research.projects.filter((project) => project.year === year && project.status === "在研");
  state.resources.research = clamp(state.resources.research + Math.min(4, inYearProjects.length * 0.7), 0, 100);
  state.resources.satisfaction = clamp(state.resources.satisfaction + Math.min(4, state.clubs.length * 0.4) - 0.5, 0, 100);
  state.resources.reputation = clamp(
    state.resources.reputation + (state.resources.employment > 70 ? 1 : 0.2),
    0,
    100,
  );

  const events = [
    {
      title: "教育厅完成年度办学检查",
      detail: "检查组肯定了学校的基础办学规范，同时要求继续完善师资结构。",
      cash: -Math.round(45 * diff.eventFactor),
      quality: 1,
    },
    {
      title: "合作企业捐赠实训设备",
      detail: "区域企业向学校捐赠一批数字化实训设备，改善了实践教学条件。",
      cash: Math.round(130 / diff.eventFactor),
      research: 2,
      satisfaction: 1,
    },
    {
      title: "区域职教联盟发布联合招生方案",
      detail: "学校加入区域招生宣传联盟，扩大了在川内中学的品牌覆盖面。",
      reputation: 3,
      cash: -35,
    },
    {
      title: "强降雨造成校园设施维修",
      detail: "部分室外设施受天气影响，后勤部门完成抢修并加强防汛检查。",
      cash: -Math.round(80 * diff.eventFactor),
      satisfaction: -1,
    },
    {
      title: "学生项目获得省级创新训练立项",
      detail: "跨专业学生团队的项目获得省级创新训练计划支持，带动实践教学改革。",
      research: 3,
      reputation: 2,
      satisfaction: 2,
    },
    {
      title: "就业质量跟踪报告发布",
      detail: "毕业生雇主满意度持续改善，更多企业愿意提前进入校园选才。",
      employment: 2,
      reputation: 1,
    },
  ];
  const annualEvent = randomPick(events);
  state.resources.cash += annualEvent.cash || 0;
  state.resources.quality = clamp(state.resources.quality + (annualEvent.quality || 0), 0, 100);
  state.resources.research = clamp(state.resources.research + (annualEvent.research || 0), 0, 100);
  state.resources.satisfaction = clamp(state.resources.satisfaction + (annualEvent.satisfaction || 0), 0, 100);
  state.resources.reputation = clamp(state.resources.reputation + (annualEvent.reputation || 0), 0, 100);
  state.resources.employment = clamp(state.resources.employment + (annualEvent.employment || 0), 0, 100);

  advanceRankingSnapshot(state, year);
  const ranks = getRankings();
  const report = {
    year,
    edition: state.history.length + 1,
    income,
    costs,
    profit,
    students,
    graduates: state.lastGraduationCount || 0,
    event: annualEvent,
    strength: ranks.strength,
    provincial: ranks.provincial,
    national: ranks.national,
    overview:
      (state.lastGraduationCount || 0) > 0
        ? `首届毕业生离开校园，学校完成了从招生、培养到就业的完整育人周期。`
        : `学校完成第${state.history.length + 1}个学年的教学与经营工作，新的办学数据已经进入评分模型。`,
    cohortNotes,
  };
  state.lastAnnualReport = report;
  state.history.unshift({
    year,
    students,
    graduates: state.lastGraduationCount || 0,
    income,
    costs,
    profit,
    cash: state.resources.cash,
  });
  addNews(
    `学校完成${year}学年年度工作总结`,
    `本年度在校学生${formatNumber(students)}人，学费与补助收入${formatMoney(income)}，年度办学结余${signedMoney(profit)}。`,
    "学校要闻",
    `${year}-12-28`,
  );
  addNews(
    annualEvent.title,
    annualEvent.detail,
    "校园生活",
    `${year}-12-20`,
  );

  state.time.turn += 1;
  state.governance.facultyHires = 0;
  state.lastGraduationCount = 0;
  addNews(
    `${state.time.year}年新学期工作部署会召开`,
    "会议围绕人才培养、招生就业、科研平台和校园建设部署新一年重点任务。",
    "学校要闻",
    `${state.time.year}-01-05`,
  );

  saveState();
  renderApp();
  if (!silent) openModal("annual-report");
  window.scrollTo({ top: 0, behavior: "smooth" });
}





