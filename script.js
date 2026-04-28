// Replace with your Firebase project config.
const firebaseConfig = {
  apiKey: "PASTE_API_KEY_HERE",
  authDomain: "PASTE_AUTH_DOMAIN_HERE",
  projectId: "PASTE_PROJECT_ID_HERE",
  storageBucket: "PASTE_STORAGE_BUCKET_HERE",
  messagingSenderId: "PASTE_SENDER_ID_HERE",
  appId: "PASTE_APP_ID_HERE"
};

if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "PASTE_API_KEY_HERE") {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.apps.length ? firebase.auth() : null;

const el = {
  email: document.getElementById("email"),
  password: document.getElementById("password"),
  userStatus: document.getElementById("userStatus"),
  signupBtn: document.getElementById("signupBtn"),
  loginBtn: document.getElementById("loginBtn"),
  logoutBtn: document.getElementById("logoutBtn"),
  amount: document.getElementById("amount"),
  rate: document.getElementById("rate"),
  years: document.getElementById("years"),
  calcBtn: document.getElementById("calcBtn"),
  result: document.getElementById("result"),
  popup: document.getElementById("popup"),
  closePopupBtn: document.getElementById("closePopupBtn"),
  toast: document.getElementById("toast"),
  discountModal: document.getElementById("discountModal"),
  closeModalBtn: document.getElementById("closeModalBtn"),
  claimOfferBtn: document.getElementById("claimOfferBtn"),
  levelsGrid: document.getElementById("levelsGrid"),
  quizMeta: document.getElementById("quizMeta"),
  quizSection: document.getElementById("quizSection"),
  progressFill: document.getElementById("progressFill"),
  progressText: document.getElementById("progressText"),
  questionText: document.getElementById("questionText"),
  optionsWrap: document.getElementById("optionsWrap"),
  nextBtn: document.getElementById("nextBtn"),
  quitBtn: document.getElementById("quitBtn")
};

const QUESTION_BANK = {
  1: {
    name: "Level 1 - Foundation",
    topic: "Savings, Budgeting, Inflation",
    passThreshold: 8,
    questions: [
      {
        question: "What is a practical first step in budgeting?",
        options: ["Track income and expenses", "Buy stocks first", "Take a loan", "Ignore small spending"],
        answer: 0
      },
      {
        question: "Emergency fund is ideally kept for:",
        options: ["1 month", "3-6 months", "10 years", "No need"],
        answer: 1
      },
      {
        question: "Inflation means:",
        options: ["Prices generally rise over time", "Prices always fall", "Salary always doubles", "Interest rates become zero"],
        answer: 0
      },
      {
        question: "A simple way to reduce impulse spending is:",
        options: ["Use a planned shopping list", "Check out immediately", "Spend full salary", "Avoid tracking"],
        answer: 0
      },
      {
        question: "Which is a need, not a want?",
        options: ["Luxury watch", "Essential groceries", "Premium headphones", "Gaming chair"],
        answer: 1
      },
      {
        question: "Savings account is mainly used for:",
        options: ["Daily liquidity and safety", "High-risk returns", "Tax evasion", "Crypto leverage"],
        answer: 0
      },
      {
        question: "If inflation is 6%, money in cash typically:",
        options: ["Gains purchasing power", "Loses purchasing power", "Stays identical forever", "Becomes tax-free"],
        answer: 1
      },
      {
        question: "50/30/20 rule allocates 20% to:",
        options: ["Needs", "Wants", "Savings/investing", "Travel"],
        answer: 2
      },
      {
        question: "Budgeting helps you:",
        options: ["Spend randomly", "Avoid all taxes", "Control cash flow", "Guarantee profit"],
        answer: 2
      },
      {
        question: "The safest place for short-term goals is usually:",
        options: ["Speculative options", "Savings or low-risk instruments", "Penny stocks only", "Unsecured lending"],
        answer: 1
      }
    ]
  },
  2: {
    name: "Level 2 - Markets",
    topic: "ETFs, Stocks, Fixed Deposits",
    passThreshold: 8,
    questions: [
      {
        question: "ETF mainly provides:",
        options: ["Diversified market exposure", "Guaranteed 50% return", "Only one stock access", "No risk at all"],
        answer: 0
      },
      {
        question: "A stock represents:",
        options: ["Debt to government", "Ownership in a company", "Gold certificate only", "Tax payment receipt"],
        answer: 1
      },
      {
        question: "Fixed Deposit is known for:",
        options: ["Higher volatility", "Predictable return", "Zero lock-in", "Direct equity voting"],
        answer: 1
      },
      {
        question: "Diversification in investing means:",
        options: ["Put all money in one stock", "Spread risk across assets", "Never invest", "Borrow to invest heavily"],
        answer: 1
      },
      {
        question: "Index funds usually track:",
        options: ["A market index", "Lottery numbers", "Only startup debt", "Crypto wallet keys"],
        answer: 0
      },
      {
        question: "A long-term equity investor should focus on:",
        options: ["Business fundamentals", "Hourly rumors", "Only tips groups", "Short-term panic"],
        answer: 0
      },
      {
        question: "Dividend is:",
        options: ["Penalty fee", "Profit share to shareholders", "Broker charge", "Tax refund only"],
        answer: 1
      },
      {
        question: "FD compared to equity usually has:",
        options: ["Lower risk, lower return potential", "Higher risk, higher volatility", "No lock-in ever", "No issuer"],
        answer: 0
      },
      {
        question: "SIP in mutual funds is useful for:",
        options: ["Timing every market top", "Disciplined periodic investing", "Zero paperwork always", "Guaranteed multibagger"],
        answer: 1
      },
      {
        question: "Blue-chip stocks are generally:",
        options: ["Small unknown companies", "Established large companies", "Illegal securities", "No listed entity"],
        answer: 1
      }
    ]
  },
  3: {
    name: "Level 3 - Pro",
    topic: "Options, Tax Harvesting, Rebalancing",
    passThreshold: 8,
    questions: [
      {
        question: "Portfolio rebalancing means:",
        options: ["Reset asset allocation to target", "Sell all assets monthly", "Avoid diversification", "Only buy one sector"],
        answer: 0
      },
      {
        question: "A call option gives right to:",
        options: ["Sell asset at strike", "Buy asset at strike", "Receive dividend", "Avoid premium"],
        answer: 1
      },
      {
        question: "Tax-loss harvesting is used to:",
        options: ["Increase brokerage fees", "Offset taxable gains", "Hide income", "Double inflation"],
        answer: 1
      },
      {
        question: "Why rebalance periodically?",
        options: ["Keep risk aligned with goals", "Maximize random bets", "Avoid all asset classes", "Eliminate volatility entirely"],
        answer: 0
      },
      {
        question: "Options are generally considered:",
        options: ["Always risk-free", "Complex and risk-sensitive", "Simple savings product", "Equivalent to FD"],
        answer: 1
      },
      {
        question: "Asset allocation is most related to:",
        options: ["Risk profile and horizon", "Daily horoscope", "Phone battery", "Shopping preference"],
        answer: 0
      },
      {
        question: "Tax planning should ideally be:",
        options: ["Done once in life", "Integrated with yearly investing", "Ignored completely", "Only rumor-based"],
        answer: 1
      },
      {
        question: "Overexposure to one sector can:",
        options: ["Reduce concentration risk", "Increase concentration risk", "Guarantee outperformance", "Remove correlation"],
        answer: 1
      },
      {
        question: "A protective put is commonly used to:",
        options: ["Hedge downside risk", "Increase leverage only", "Eliminate all cost", "Create FD return"],
        answer: 0
      },
      {
        question: "Best rebalancing trigger can be:",
        options: ["Allocation drift threshold", "Every market rumor", "Never check portfolio", "Only when markets crash"],
        answer: 0
      }
    ]
  }
};

const QUIZ_STATE = {
  currentLevel: null,
  currentQuestionIndex: 0,
  selectedOption: null,
  levelScore: 0,
  unlockedLevels: { 1: true, 2: false, 3: false },
  completedLevels: { 1: false, 2: false, 3: false },
  lastScores: { 1: 0, 2: 0, 3: 0 },
  offerShown: false
};

const STORAGE_KEY = "wealthfyQuizStateV1";

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(QUIZ_STATE));
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  try {
    const data = JSON.parse(raw);
    if (data && data.unlockedLevels && data.completedLevels && data.lastScores) {
      QUIZ_STATE.unlockedLevels = data.unlockedLevels;
      QUIZ_STATE.completedLevels = data.completedLevels;
      QUIZ_STATE.lastScores = data.lastScores;
      QUIZ_STATE.offerShown = Boolean(data.offerShown);
    }
  } catch (err) {
    console.warn("State load failed:", err);
  }
}

function showToast(message, type) {
  el.toast.textContent = message;
  el.toast.className = `toast ${type} show`;
  setTimeout(() => {
    el.toast.classList.remove("show");
  }, 2100);
}

function renderLevels() {
  el.levelsGrid.innerHTML = "";
  Object.keys(QUESTION_BANK).forEach((key) => {
    const level = Number(key);
    const config = QUESTION_BANK[level];
    const locked = !QUIZ_STATE.unlockedLevels[level];
    const card = document.createElement("article");
    card.className = `level-card${locked ? " locked" : ""}`;
    card.innerHTML = `
      <h3 class="level-name">${config.name}</h3>
      <p class="muted">${config.topic}</p>
      <p class="muted">Score: ${QUIZ_STATE.lastScores[level]}/10</p>
      <span class="badge">${locked ? "Locked" : "Unlocked"}</span>
      <div class="btn-row" style="margin-top:0.6rem">
        <button class="btn btn-primary start-level-btn" data-level="${level}" ${locked ? "disabled" : ""}>
          Start
        </button>
      </div>
    `;
    el.levelsGrid.appendChild(card);
  });

  document.querySelectorAll(".start-level-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      startLevel(Number(btn.dataset.level));
    });
  });
}

function startLevel(level) {
  QUIZ_STATE.currentLevel = level;
  QUIZ_STATE.currentQuestionIndex = 0;
  QUIZ_STATE.selectedOption = null;
  QUIZ_STATE.levelScore = 0;
  el.quizMeta.textContent = `${QUESTION_BANK[level].name} started`;
  el.quizSection.classList.remove("hidden");
  renderQuestion();
}

function renderQuestion() {
  const levelData = QUESTION_BANK[QUIZ_STATE.currentLevel];
  const current = levelData.questions[QUIZ_STATE.currentQuestionIndex];
  const total = levelData.questions.length;
  const currentNum = QUIZ_STATE.currentQuestionIndex + 1;
  const progressPercent = Math.round((QUIZ_STATE.currentQuestionIndex / total) * 100);

  el.progressFill.style.width = `${progressPercent}%`;
  el.progressText.textContent = `Question ${currentNum} of ${total}`;
  el.questionText.textContent = current.question;
  el.optionsWrap.innerHTML = "";
  el.nextBtn.disabled = true;

  current.options.forEach((option, index) => {
    const b = document.createElement("button");
    b.className = "option-btn";
    b.textContent = option;
    b.addEventListener("click", () => selectOption(index, b));
    el.optionsWrap.appendChild(b);
  });
}

function selectOption(index, button) {
  const levelData = QUESTION_BANK[QUIZ_STATE.currentLevel];
  const q = levelData.questions[QUIZ_STATE.currentQuestionIndex];
  const optionButtons = el.optionsWrap.querySelectorAll(".option-btn");
  optionButtons.forEach((btn) => (btn.disabled = true));

  QUIZ_STATE.selectedOption = index;
  if (index === q.answer) {
    QUIZ_STATE.levelScore += 1;
    button.classList.add("correct");
    showToast("Correct answer", "success");
  } else {
    button.classList.add("wrong");
    optionButtons[q.answer].classList.add("correct");
    showToast("Wrong answer", "error");
  }

  el.nextBtn.disabled = false;
}

function nextQuestion() {
  const levelData = QUESTION_BANK[QUIZ_STATE.currentLevel];
  const total = levelData.questions.length;

  if (QUIZ_STATE.currentQuestionIndex < total - 1) {
    QUIZ_STATE.currentQuestionIndex += 1;
    renderQuestion();
    return;
  }

  finishLevel();
}

function finishLevel() {
  const level = QUIZ_STATE.currentLevel;
  const levelData = QUESTION_BANK[level];
  const score = QUIZ_STATE.levelScore;
  const passed = score >= levelData.passThreshold;

  QUIZ_STATE.lastScores[level] = score;
  QUIZ_STATE.completedLevels[level] = true;

  if (passed && level < 3) {
    QUIZ_STATE.unlockedLevels[level + 1] = true;
  }

  if (level === 2 && QUIZ_STATE.unlockedLevels[2] && !QUIZ_STATE.offerShown) {
    openModal();
    QUIZ_STATE.offerShown = true;
  }

  saveState();
  renderLevels();
  el.quizSection.classList.add("hidden");
  el.progressFill.style.width = "100%";
  el.quizMeta.textContent = `${levelData.name} finished: ${score}/10 (${passed ? "Pass" : "Fail"})`;

  if (passed) {
    showToast(`Passed ${levelData.name} with ${score}/10`, "success");
  } else {
    showToast(`Scored ${score}/10. Need ${levelData.passThreshold}/10 to pass`, "error");
  }
}

function quitLevel() {
  QUIZ_STATE.currentLevel = null;
  QUIZ_STATE.currentQuestionIndex = 0;
  QUIZ_STATE.selectedOption = null;
  QUIZ_STATE.levelScore = 0;
  el.quizSection.classList.add("hidden");
  el.quizMeta.textContent = "Choose a level to begin.";
}

function openModal() {
  el.discountModal.classList.remove("hidden");
  el.discountModal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  el.discountModal.classList.add("hidden");
  el.discountModal.setAttribute("aria-hidden", "true");
}

function calculateSip() {
  const P = Number(el.amount.value);
  const annualRate = Number(el.rate.value);
  const years = Number(el.years.value);

  if (!Number.isFinite(P) || !Number.isFinite(annualRate) || !Number.isFinite(years) || P <= 0 || annualRate <= 0 || years <= 0) {
    el.result.textContent = "Enter valid positive values for all fields.";
    showToast("Invalid SIP inputs", "error");
    return;
  }

  const r = annualRate / 100 / 12;
  const n = years * 12;
  const fv = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  el.result.textContent = `Future Value: INR ${Math.round(fv).toLocaleString("en-IN")}`;
  showToast("SIP calculated successfully", "success");
}

function signup() {
  if (!auth) {
    showToast("Firebase config missing", "error");
    return;
  }
  auth
    .createUserWithEmailAndPassword(el.email.value.trim(), el.password.value)
    .then(() => {
      el.userStatus.textContent = "Signup successful";
      showToast("Signup successful", "success");
    })
    .catch((err) => {
      el.userStatus.textContent = err.message;
      showToast("Signup failed", "error");
    });
}

function login() {
  if (!auth) {
    showToast("Firebase config missing", "error");
    return;
  }
  auth
    .signInWithEmailAndPassword(el.email.value.trim(), el.password.value)
    .then(() => {
      showToast("Login successful", "success");
    })
    .catch((err) => {
      el.userStatus.textContent = err.message;
      showToast("Login failed", "error");
    });
}

function logout() {
  if (!auth) {
    showToast("Firebase config missing", "error");
    return;
  }
  auth
    .signOut()
    .then(() => {
      el.userStatus.textContent = "Logged out";
      showToast("Logged out", "success");
    })
    .catch((err) => {
      el.userStatus.textContent = err.message;
      showToast("Logout failed", "error");
    });
}

function bindEvents() {
  el.signupBtn.addEventListener("click", signup);
  el.loginBtn.addEventListener("click", login);
  el.logoutBtn.addEventListener("click", logout);
  el.calcBtn.addEventListener("click", calculateSip);
  el.nextBtn.addEventListener("click", nextQuestion);
  el.quitBtn.addEventListener("click", quitLevel);
  el.closePopupBtn.addEventListener("click", () => el.popup.classList.remove("show"));
  el.closeModalBtn.addEventListener("click", closeModal);
  el.claimOfferBtn.addEventListener("click", () => {
    closeModal();
    showToast("Offer claimed. Check your email.", "success");
  });
}

function setupAuthListener() {
  if (!auth) {
    el.userStatus.textContent = "Auth disabled until Firebase config is added.";
    return;
  }
  auth.onAuthStateChanged((user) => {
    if (user) {
      el.userStatus.textContent = `Logged in: ${user.email}`;
    } else {
      el.userStatus.textContent = "Not logged in";
    }
  });
}

function init() {
  loadState();
  bindEvents();
  renderLevels();
  setupAuthListener();
  setTimeout(() => el.popup.classList.add("show"), 2000);
}

init();
