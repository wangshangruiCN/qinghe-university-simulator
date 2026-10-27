import {
  BUILDINGS,
  CAMPUS_PLOTS,
  COLLEGE_TEMPLATES_V2 as COLLEGE_TEMPLATES,
  COMPETITIONS,
  DIFFICULTIES,
  NATIONAL_UNIVERSITIES,
  PRESIDENT_CANDIDATES,
  SICHUAN_UNIVERSITIES,
  WORLD_UNIVERSITIES,
} from "./data.js";

const APP_VERSION = "0.2.0";
const CHANGELOG = [
  "学院体系重构：10 个具体学院，专业直接归属学院",
  "修复任何学院都能开设任意专业的问题",
  "修复排名过虚：民办本科开局，省榜每年最多上升 3 名",
  "修复全国榜与世界榜不显示本校位次的问题",
  "招生改为按培养容量分四年自动分配",
  "修复手机端帮助按钮不可见、不可点击的问题",
  "修复手机顶栏官网预览按钮显示与点击问题",
  "开始页与设置页显示当前版本号",
  "更新公告改为可关闭的版本弹窗",
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
    body: "结束本学年后，会结算学费、师资与运营成本，处理自然流失、生成排名变化和新闻。有盈利才能继续扩张。",
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

render();

function loadState() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed.version === 2 ? parsed : migrateLegacyState(parsed);
  } catch {
    return null;
  }
}

function migrateLegacyState(legacy) {
  const migrated = {
    ...legacy,
    version: 2,
    school: {
      ...legacy.school,
      level: legacy.school.level === "专科" ? "本科" : legacy.school.level,
    },
    colleges: (legacy.colleges || []).map((college) => {
      const nextId = LEGACY_COLLEGE_MAP[college.id];
      if (!nextId) return null;
      const template = COLLEGE_TEMPLATES.find((item) => item.id === nextId);
      const programs = (college.disciplines || []).flatMap((discipline) =>
        discipline.programs.map((program) => ({
          id: program.id,
          name: program.name,
          code: program.code || "510000",
        })),
      );
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
  if (!migrated.rank) {
    migrated.rank = {
      provincial: 41,
      national: 1000,
      world: 9200,
      strength: 16,
    };
  }
  return migrated;
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

function schoolStrength() {
  if (!state) return 0;
  const r = state.resources;
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

function computeRawRankings() {
  if (!state) return { provincial: 41, national: 1000, world: 9200, strength: 0 };
  const strength = schoolStrength();
  const bonus = LEVEL_BONUS[state.school.level] || 0;
  const provincial = SICHUAN_UNIVERSITIES.filter((item) => item.score > strength).length + 1;
  return {
    provincial,
    national: clamp(Math.round(1180 - strength * 11 - bonus), 1, 2000),
    world: clamp(Math.round(9800 - strength * 40 - bonus * 8), 1, 12000),
    strength,
  };
}

function getRankings() {
  if (!state) return { provincial: 41, national: 1000, world: 9200, strength: 0 };
  const raw = computeRawRankings();
  const previous = state.rank?.provincial ?? raw.provincial;
  const provincial = raw.provincial < previous
    ? Math.max(raw.provincial, previous - 3)
    : raw.provincial;
  return {
    ...raw,
    provincial,
  };
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
    return { view: "admissions", label: "上报招生计划" };
  }
  if (state.admissions.planStatus === "approved" && !state.admissions.campaignDone) {
    return { view: "admissions", label: "启动年度招生" };
  }
  if (!state.history.length) return { view: "dashboard", label: "结束本学年" };
  return { view: "dashboard", label: "规划新学年" };
}

function currentTutorialStep() {
  if (!state?.flags.firstCollege) return 0;
  if (state.admissions.planStatus === "not_started" || state.admissions.planStatus === "rejected") return 1;
  if (!state.admissions.campaignDone) return 2;
  if (!state.history.length) return 3;
  if (!state.flags.visitedWebsite) return 4;
  return 4;
}

function addNews(title, summary, category = "学校要闻", dateOverride = null) {
  const date = dateOverride || `${state.time.year}-${String(9 + (state.news.length % 3)).padStart(2, "0")}-${String(8 + (state.news.length % 18)).padStart(2, "0")}`;
  state.news.unshift({
    id: `news-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
    title,
    summary,
    category,
    date,
  });
  state.news = state.news.slice(0, 30);
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
    version: 2,
    createdAt: Date.now(),
    difficulty: difficulty.id,
    school: {
      name,
      shortName: name.length > 8 ? name.slice(0, 8) : name,
      nature,
      level: "本科",
      province: "四川省",
      city: "成都市",
      founded: year,
      motto: "厚德 · 笃学 · 力行 · 致远",
      badge: name.slice(0, 2),
    },
    time: {
      year,
      term: "秋季学期",
      turn: 0,
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
    rank: {
      provincial: 41,
      national: 1000,
      world: 9200,
      strength: 15,
    },
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
          <span>${schoolNatureLabel()} · ${escapeHtml(state.school.level)} · 四川省</span>
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
              <span class="topbar-date mono">${state.time.year} / 学年</span>
              <span class="topbar-divider"></span>
              <span class="topbar-term">${escapeHtml(state.time.term)} · 规划期</span>
            </div>
          </div>
          <div class="topbar-right">
            <span class="save-state" data-save-state>已自动保存</span>
            <div class="topbar-actions">
              <button class="icon-btn" type="button" data-action="open-tutorial" aria-label="打开教程">?</button>
              <button class="btn btn-outline btn-sm site-preview-btn" type="button" data-action="open-site" title="打开校园官网" aria-label="打开校园官网"><span class="site-preview-icon" aria-hidden="true">▤</span><span class="site-preview-label">官网预览</span></button>
            </div>
            <button class="btn btn-dark btn-sm end-year-btn" type="button" data-action="open-advance">结束本学年 <span class="end-year-arrow" aria-hidden="true">→</span></button>
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
    rankings: renderRankings,
    website: renderWebsite,
  };
  return (renderers[ui.view] || renderDashboard)(ranks);
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
      `<span class="badge badge-gold">${schoolNatureLabel()} · ${state.school.level}</span>`,
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
            <small>COMPREHENSIVE INDEX</small>
            <strong>综合实力 ${ranks.strength.toFixed(1)}</strong>
            <span>全国约第 ${formatNumber(ranks.national)} 位<br />世界约第 ${formatNumber(ranks.world)} 位</span>
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
    rejected: "未获批准",
    approved: "已批复",
    completed: "本年度已完成",
  }[status];
  const statusClass = {
    not_started: "status-pending",
    rejected: "status-danger",
    approved: "status-info",
    completed: "status-success",
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
            state.admissions.campaignDone || status === "approved"
              ? `<div class="notice" style="margin-bottom:13px"><span class="notice-icon">批</span><span>教育厅已批复 ${formatNumber(state.admissions.approvedTotal)} 人。${status === "approved" ? "招生计划已锁定，接下来需要开展招生投放。" : "本年度招生已结束，计划将在新学年重置。"}</span></div>`
              : ""
          }
          <div>
            ${programs
              .map((program) => {
                const value = Number(state.admissions.draft[program.id] ?? 0);
                const disabled = status === "approved" || state.admissions.campaignDone;
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
              status === "not_started" || status === "rejected"
                ? `<button class="btn btn-primary" type="button" data-action="submit-plan">提交教育厅审批</button>`
                : status === "approved"
                  ? `<button class="btn btn-primary" type="button" data-action="open-campaign">启动招生投放</button>`
                  : `<button class="btn btn-outline" type="button" data-action="open-advance">结束学年</button>`
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
  const upgradeTarget = state.school.level === "专科" ? "职业本科" : null;
  const upgradeRequirements = getUpgradeRequirements(upgradeTarget);
  const publicRequirements = {
    years,
    reputation: state.resources.reputation,
    quality: state.resources.quality,
    students: state.resources.students,
  };
  return `
    ${pageHead(
      "INSTITUTION & PEOPLE",
      "校务与师资",
      "聘任、升格与治理方式共同塑造学校。任何一次任命都会进入官网新闻与办学履历。",
      `<span class="badge badge-gold">${schoolNatureLabel()} · ${state.school.level}</span>`,
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
          <div class="panel-head"><div><h3>办学层次升格</h3><p>更名、扩权与学位授予能力</p></div></div>
          <div class="panel-body">
            ${
              upgradeTarget
                ? `<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
                    <span class="badge">${escapeHtml(state.school.level)}</span>
                    <span class="muted">→</span>
                    <span class="badge badge-gold">${escapeHtml(upgradeTarget)}</span>
                  </div>
                  <div class="requirements">
                    ${Object.entries(upgradeRequirements).map(([key, req]) => requirementRow(req.label, currentMetricValue(key), req.value, req.unit)).join("")}
                  </div>
                  <button class="btn btn-dark" style="width:100%;margin-top:14px" type="button" data-action="apply-upgrade" data-target="${upgradeTarget}">提交升格评估</button>`
                : `<div class="notice"><span class="notice-icon">研</span><span>${state.school.level === "博士授权" ? "学校已具备博士授予能力，继续通过科研与全球声誉提升榜单位次。" : "学校已完成本科层次升格。硕士、博士学位点请前往“科研与学位”申请。"}</span></div>`
            }
          </div>
        </section>

        <section class="panel">
          <div class="panel-head"><div><h3>民办转公办申请</h3><p>办学质量足够高时，教育厅可能收编</p></div></div>
          <div class="panel-body">
            ${
              state.school.nature === "public"
                ? `<div class="notice"><span class="notice-icon">公</span><span>学校已转为公办。学费收入降低，但获得稳定财政补助，公众信任更高。</span></div>`
                : `<div class="requirements">
                    ${requirementRow("连续办学年限", years, 3, "年")}
                    ${requirementRow("社会声誉", state.resources.reputation, 70, "/ 100")}
                    ${requirementRow("办学质量", state.resources.quality, 62, "/ 100")}
                    ${requirementRow("在校学生", formatNumber(state.resources.students), 2000, "人")}
                  </div>
                  <button class="btn btn-outline" style="width:100%;margin-top:14px" type="button" data-action="apply-public-conversion">申请转为公办</button>
                  <p class="method-note">满足条件后仍需接受综合评议，成功率约 45%—75%。可重复申请，但每次失败会影响声誉。</p>`
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
  return state.resources[key] ?? 0;
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

function renderRankings(ranks) {
  const tabs = [
    { id: "sichuan", label: "四川省高校榜" },
    { id: "national", label: "全国大学榜" },
    { id: "world", label: "世界大学榜" },
  ];
  let rows = [];
  let title = "";
  let subtitle = "";
  if (ui.rankingTab === "sichuan") {
    rows = [
      ...SICHUAN_UNIVERSITIES.map((item) => ({ ...item })),
      {
        name: state.school.name,
        city: state.school.city,
        score: schoolStrength(),
        rank: ranks.provincial,
        you: true,
      },
    ]
      .sort((a, b) => b.score - a.score)
      .map((item, index) => ({ ...item, rank: index + 1 }));
    title = "四川省高校综合榜";
    subtitle = "四川高校真实校名 + 模拟办学表现，本校会自动插入榜单";
  } else if (ui.rankingTab === "national") {
    rows = [
      ...NATIONAL_UNIVERSITIES.map((item) => ({ ...item })),
      {
        name: state.school.name,
        city: state.school.city,
        score: schoolStrength(),
        rank: ranks.national,
        you: true,
      },
    ];
    title = "中国大学综合榜 · 前 100";
    subtitle = "使用真实高校名称与模拟评价分数；本校未进入前 100 时显示预估全国位次";
  } else {
    rows = [
      ...WORLD_UNIVERSITIES.map((item) => ({ ...item })),
      {
        name: state.school.name,
        country: "中国",
        score: schoolStrength(),
        rank: ranks.world,
        you: true,
      },
    ];
    title = "世界大学综合榜";
    subtitle = "世界名校名称 + 模拟评价维度，本校以预估世界位次呈现";
  }

  return `
    ${pageHead(
      "RANKINGS & BENCHMARKS",
      "大学排行榜",
      "排名中心将省榜、全国榜与世界榜放在同一套办学数据下观察。所有位次与分数均为游戏模拟，不代表任何官方榜单。",
      `<button class="btn btn-outline btn-sm" type="button" data-action="open-ranking-method">查看计分方法</button>`,
    )}

    <div class="ranking-summary">
      <div class="rank-summary-card ${ui.rankingTab === "sichuan" ? "active" : ""}" data-action="ranking-tab" data-tab="sichuan" role="button" tabindex="0">
        <span>四川省 · 模拟位次</span><strong>第 ${ranks.provincial} 位</strong><small>省内本科与职业院校综合观察</small>
      </div>
      <div class="rank-summary-card ${ui.rankingTab === "national" ? "active" : ""}" data-action="ranking-tab" data-tab="national" role="button" tabindex="0">
        <span>全国 · 预估位次</span><strong>第 ${formatNumber(ranks.national)} 位</strong><small>综合实力 ${ranks.strength.toFixed(1)} / 100</small>
      </div>
      <div class="rank-summary-card ${ui.rankingTab === "world" ? "active" : ""}" data-action="ranking-tab" data-tab="world" role="button" tabindex="0">
        <span>世界 · 预估位次</span><strong>第 ${formatNumber(ranks.world)} 位</strong><small>声誉与科研的国际映射</small>
      </div>
    </div>

    <section class="panel">
      <div class="panel-head" style="align-items:center">
        <div><h3>${title}</h3><p>${subtitle}</p></div>
        <div class="segmented">
          ${tabs.map((tab) => `<button class="${ui.rankingTab === tab.id ? "active" : ""}" type="button" data-action="ranking-tab" data-tab="${tab.id}">${tab.label}</button>`).join("")}
        </div>
      </div>
      <div class="panel-body flush">
        <div class="rank-table-wrap">
          <table class="rank-table">
            <thead><tr><th>位次</th><th>高校</th><th>${ui.rankingTab === "world" ? "国家/地区" : "城市"}</th><th>模拟得分</th><th>评价</th></tr></thead>
            <tbody>
              ${rows
                .map(
                  (item) => `
                    <tr class="${item.you ? "you" : ""}">
                      <td class="rank-number">${String(item.rank).padStart(2, "0")}</td>
                      <td><span class="uni-name">${escapeHtml(item.name)}</span>${item.you ? ` <span class="badge badge-gold">本校</span>` : ""}</td>
                      <td>${escapeHtml(item.country || item.city || "—")}</td>
                      <td class="mono">${Number(item.score).toFixed(1)}</td>
                      <td><div class="score-bar"><div class="score-bar-track"><div class="score-bar-fill" style="width:${item.score}%"></div></div><span class="mono">${Math.round(item.score)}</span></div></td>
                    </tr>
                  `,
                )
                .join("")}
            </tbody>
          </table>
        </div>
      </div>
    </section>
    <p class="method-note">榜单仅用于本游戏的模拟经营反馈。真实大学的名称用于建立参照感，分数、名次和评价均为虚构。本校省榜位次会随“办学质量、科研、声誉、就业、学生满意度”变化。</p>
  `;
}

function renderWebsite() {
  if (!state.flags.visitedWebsite) {
    state.flags.visitedWebsite = true;
    saveState();
  }
  const news = state.news.slice(0, 6);
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
        <div class="site-utility"><span>${escapeHtml(state.school.name)} · 四川省 · ${schoolNatureLabel()}全日制普通高等学校</span><span>${state.time.year}年10月26日</span></div>
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
                <div class="check-row"><span>办学层次</span><strong>${escapeHtml(state.school.level)}</strong></div>
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
          <span>本次更新重点修复学院专业归属、招生配额、排名与手机端操作问题。</span>
        </div>
        <ul class="changelog-list">
          ${CHANGELOG.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
        </ul>
      </div>
      <div class="modal-foot">
        <button class="btn btn-dark" type="button" data-action="close-modal">知道了</button>
      </div>
    `,
  };
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
      ${modalHeader("招生投放", `批复计划 ${formatNumber(state.admissions.approvedTotal)} 人。投多少预算，不一定就招到多少人。`)}
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
          <button class="btn btn-primary" type="submit">确认投放并公布结果</button>
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
        <div class="modal-callout info">第一学期开始。下一步结束本学年，结算学费收入、师资成本与运营支出，并生成首份排名和官网报道。</div>
      </div>
      <div class="modal-foot">
        <button class="btn btn-ghost" type="button" data-action="close-modal">继续整理校务</button>
        <button class="btn btn-primary" type="button" data-action="open-advance">结束本学年</button>
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
        <p class="method-note" style="margin-top:13px">全国、四川省与世界位次由综合指数、办学层次加成换算。真实高校名称用于参照，分数、位次与评价均为虚构。</p>
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
        <h2>${success ? "升格评估通过" : "本轮评估未通过"}</h2>
        <p>${success ? `学校正式进入“${escapeHtml(ctx.target)}”建设阶段。` : escapeHtml(ctx.reason || "评审认为部分办学指标仍需巩固。")}</p>
      </div>
      <div class="modal-body">
        <div class="modal-callout ${success ? "info" : "danger"}">${success ? "新的办学层次会影响全国与全球排名换算，并解锁新的科研和学位点目标。" : "保留现有办学层次，继续提升师资、科研、办学质量与毕业生去向。"}</div>
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
  const chance = approxApprovalChance();
  const approved = Math.random() < chance;
  if (approved) {
    state.admissions.planStatus = "approved";
    state.admissions.approvedTotal = total;
    state.resources.reputation = clamp(state.resources.reputation + 1, 0, 100);
    addNews(
      `学校${state.time.year}年招生计划获教育厅批复`,
      `本年度获批招生 ${formatNumber(total)} 人，覆盖${programs.length}个专业，招生工作正式启动。`,
      "招生就业",
    );
    toast("计划获批", `共批复 ${formatNumber(total)} 人。`, "success");
  } else {
    state.admissions.planStatus = "rejected";
    state.resources.reputation = clamp(state.resources.reputation - 1, 0, 100);
    addNews(
      "年度招生计划需进一步完善",
      "教育厅建议学校优化师资配比与专业结构后重新申报。",
      "通知公告",
    );
    toast("计划未获批准", "可调整人数与办学条件后重新提交。", "error");
  }
  saveState();
  renderApp();
  openModal("approval-result", {
    approved,
    total,
    programCount: programs.length,
    reason: approved ? "" : "培养方案、师资承载或招生规模与办学条件匹配度不足。",
  });
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
  const strength = schoolStrength();
  const yieldRate = clamp(
    0.54 +
      strength * 0.0043 +
      strategy.bonus +
      reach.bonus +
      threshold.bonus +
      randomBetween(-0.055, 0.055),
    0.45,
    0.97,
  );
  const actual = Math.min(
    state.admissions.approvedTotal,
    Math.max(30, Math.round(state.admissions.approvedTotal * yieldRate)),
  );
  const cohortQuality = Math.round(
    clamp(
      48 +
        state.resources.quality * 0.28 +
        state.resources.reputation * 0.2 +
        strategy.qualityBonus +
        reach.quality +
        threshold.quality +
        randomBetween(-4, 4),
      34,
      96,
    ),
  );
  state.resources.cash -= cost;
  state.resources.reputation = clamp(
    state.resources.reputation + strategy.reputation + (yieldRate > 0.8 ? 2 : 0),
    0,
    100,
  );
  state.admissions.cohorts.push({
    year: state.time.year,
    size: actual,
    initialSize: actual,
    quality: cohortQuality,
  });
  state.resources.students += actual;
  state.admissions.campaignDone = true;
  state.admissions.planStatus = "completed";
  state.admissions.lastResult = {
    year: state.time.year,
    planned: state.admissions.approvedTotal,
    actual,
    yield: actual / Math.max(1, state.admissions.approvedTotal),
    cost,
    cohortQuality,
    strategy: strategy.name,
    reach: reach.name,
  };
  addNews(
    `${state.time.year}级新生完成报到`,
    `学校通过${strategy.name}与${reach.name}招生，实际报到${formatNumber(actual)}人，新生质量指数${cohortQuality}。`,
    "招生就业",
  );
  saveState();
  renderApp();
  openModal("admission-result");
  toast("招生投放完成", `${formatNumber(actual)} 名新生报到。`, "success");
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
    addNews("学校公办转设申请完成评议", "综合评议认为办学质量已有基础，仍需进一步优化治理结构与学位建设。", "通知公告");
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
    addNews("学位点评审结果公布", "本轮学位点评审未获通过，学校将根据专家意见继续加强师资与科研平台建设。", "通知公告");
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

function settleYear() {
  closeModal();
  const year = state.time.year;
  const diff = difficultyData();
  let graduated = 0;
  const cohortNotes = [];
  const nextCohorts = [];
  state.admissions.cohorts.forEach((cohort) => {
    const age = year - cohort.year;
    if (age >= 4) {
      graduated += cohort.size;
      cohortNotes.push(`${cohort.year}级 ${formatNumber(cohort.size)} 人毕业`);
    } else {
      const attrition = age >= 1 ? Math.max(1, Math.round(cohort.size * 0.035)) : 0;
      const size = Math.max(0, cohort.size - attrition);
      nextCohorts.push({ ...cohort, size });
      if (attrition) cohortNotes.push(`${cohort.year}级自然流失 ${formatNumber(attrition)} 人`);
    }
  });
  state.admissions.cohorts = nextCohorts;
  const students = state.admissions.cohorts.reduce((sum, cohort) => sum + cohort.size, 0);
  state.resources.students = students;
  state.resources.alumni += graduated;

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

  state.rank = computeRawRankings();
  const ranks = getRankings();
  const report = {
    year,
    edition: state.history.length + 1,
    income,
    costs,
    profit,
    students,
    graduates: graduated,
    event: annualEvent,
    strength: ranks.strength,
    provincial: ranks.provincial,
    national: ranks.national,
    overview:
      graduated > 0
        ? `首届毕业生离开校园，学校完成了从招生、培养到就业的完整育人周期。`
        : `学校完成第${state.history.length + 1}个学年的教学与经营工作，新的办学数据已经进入评分模型。`,
    cohortNotes,
  };
  state.lastAnnualReport = report;
  state.history.unshift({
    year,
    students,
    graduates: graduated,
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
  state.time.year += 1;
  state.governance.facultyHires = 0;
  state.admissions.planStatus = "not_started";
  state.admissions.approvedTotal = 0;
  state.admissions.campaignDone = false;
  redistributeAdmissionDraft();
  addNews(
    `${state.time.year}年新学期工作部署会召开`,
    "会议围绕人才培养、招生就业、科研平台和校园建设部署新一年重点任务。",
    "学校要闻",
    `${state.time.year}-01-05`,
  );

  saveState();
  renderApp();
  openModal("annual-report");
  window.scrollTo({ top: 0, behavior: "smooth" });
}





