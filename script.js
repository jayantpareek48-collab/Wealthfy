// ===== SAFE ELEMENT GETTER =====
const get = (id) => document.getElementById(id);

// ===== ELEMENTS =====
const el = {
  email: get("email"),
  password: get("password"),
  userStatus: get("userStatus"),
  amount: get("amount"),
  rate: get("rate"),
  years: get("years"),
  result: get("result"),
  calcBtn: get("calcBtn"),
  signupBtn: get("signupBtn"),
  loginBtn: get("loginBtn"),
  logoutBtn: get("logoutBtn"),
  popup: get("popup"),
  closePopupBtn: get("closePopupBtn"),
  toast: get("toast"),
  levelsGrid: get("levelsGrid"),
  quizMeta: get("quizMeta"),
  quizSection: get("quizSection"),
  progressFill: get("progressFill"),
  progressText: get("progressText"),
  questionText: get("questionText"),
  optionsWrap: get("optionsWrap"),
  nextBtn: get("nextBtn"),
  quitBtn: get("quitBtn")
};

let sipChart = null;
let currentQuestions = [];
let currentIndex = 0;
let score = 0;
let currentLevel = "";

// ===== TOAST =====
function showToast(msg, type = "success") {
  if (!el.toast) return;
  el.toast.textContent = msg;
  el.toast.className = `toast ${type} show`;
  setTimeout(() => { el.toast.className = "toast"; }, 2500);
}

// ===== FAKE AUTH =====
el.signupBtn?.addEventListener("click", () => {
  const email = el.email.value.trim() || "demo@wealthfy.in";
  showToast(`Account created: ${email}`, "success");
  el.userStatus.innerText = `✅ ${email}`;
});

el.loginBtn?.addEventListener("click", () => {
  const email = el.email.value.trim() || "demo@wealthfy.in";
  showToast("Login successful", "success");
  el.userStatus.innerText = `👤 ${email}`;
});

el.logoutBtn?.addEventListener("click", () => {
  showToast("Logged out", "info");
  el.userStatus.innerText = "Demo mode";
});

// ===== RICH QUIZ DATA =====
const quizLevels = {
  beginner: [
    { q: "What does SIP stand for?", o: ["Systematic Investment Plan", "Single Income Plan", "Smart Income Portfolio"], a: 0 },
    { q: "Which is generally the safest investment?", o: ["Stocks", "Fixed Deposit", "Cryptocurrency"], a: 1 },
    { q: "What is the power of compounding?", o: ["Earning interest on interest", "Losing money fast", "Government scheme"], a: 0 },
    { q: "Mutual funds are managed by?", o: ["RBI", "SEBI", "Fund Manager"], a: 2 },
    { q: "What is inflation?", o: ["Rise in prices over time", "Fall in prices", "Stable prices"], a: 0 }
  ],
  intermediate: [
    { q: "What is rupee cost averaging?", o: ["Buying when market is high", "Investing fixed amount regularly", "Timing the market"], a: 1 },
    { q: "Ideal Emergency Fund size?", o: ["1 month expenses", "3-6 months expenses", "1 year expenses"], a: 1 },
    { q: "ELSS funds help save tax under which section?", o: ["80C", "80D", "80G"], a: 0 },
    { q: "What does NAV stand for?", o: ["Net Asset Value", "New Asset Value", "National Average"], a: 0 }
  ]
};

// ===== LOAD QUIZ LEVELS =====
function loadLevels() {
  if (!el.levelsGrid) return;
  el.levelsGrid.innerHTML = `
    <button onclick="startLevel('beginner')" class="btn btn-primary">Beginner</button>
    <button onclick="startLevel('intermediate')" class="btn btn-blue">Intermediate</button>
  `;
}

window.startLevel = function(level) {
  currentLevel = level;
  currentQuestions = quizLevels[level];
  currentIndex = 0;
  score = 0;

  el.levelsGrid.classList.add("hidden");
  el.quizSection.classList.remove("hidden");
  el.quizMeta.textContent = `${level.toUpperCase()} LEVEL`;

  loadQuestion();
};

function loadQuestion() {
  if (currentIndex >= currentQuestions.length) {
    showQuizResult();
    return;
  }

  const q = currentQuestions[currentIndex];
  el.questionText.textContent = q.q;
  el.optionsWrap.innerHTML = "";

  q.o.forEach((option, index) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = option;
    btn.onclick = () => selectAnswer(index, btn);
    el.optionsWrap.appendChild(btn);
  });

  const progress = ((currentIndex) / currentQuestions.length) * 100;
  el.progressFill.style.width = `${progress}%`;
  el.progressText.textContent = `${currentIndex + 1} / ${currentQuestions.length}`;
  el.nextBtn.disabled = true;
}

function selectAnswer(selectedIndex, btn) {
  document.querySelectorAll('.option-btn').forEach(b => b.disabled = true);
  const correct = currentQuestions[currentIndex].a;

  if (selectedIndex === correct) {
    btn.classList.add("correct");
    score++;
    showToast("Correct! 🎉", "success");
  } else {
    btn.classList.add("wrong");
    showToast("Wrong answer", "error");
  }
  el.nextBtn.disabled = false;
}

el.nextBtn?.addEventListener("click", () => {
  currentIndex++;
  loadQuestion();
});

el.quitBtn?.addEventListener("click", () => {
  el.quizSection.classList.add("hidden");
  el.levelsGrid.classList.remove("hidden");
});

function showQuizResult() {
  const percentage = Math.round((score / currentQuestions.length) * 100);
  showToast(`Quiz Complete! Score: ${percentage}%`, "success");

  el.quizSection.innerHTML = `
    <div class="text-center py-10">
      <h2 class="text-3xl font-bold mb-4">Quiz Completed!</h2>
      <p class="text-6xl font-bold text-emerald-500 mb-2">${percentage}%</p>
      <p class="text-xl mb-8">You got ${score} out of ${currentQuestions.length}</p>
      <button onclick="restartQuiz()" class="btn btn-primary">Play Again</button>
    </div>
  `;
}

window.restartQuiz = () => {
  el.quizSection.classList.add("hidden");
  el.levelsGrid.classList.remove("hidden");
  loadLevels();
};

// ===== SIP CALCULATOR WITH CHART =====
el.calcBtn?.addEventListener("click", () => {
  const P = parseFloat(el.amount.value);
  const annualRate = parseFloat(el.rate.value);
  const years = parseFloat(el.years.value);

  if (!P || !annualRate || !years) {
    showToast("Please fill all fields", "error");
    return;
  }

  const r = annualRate / 12 / 100;
  const n = years * 12;
  const maturity = P * (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
  const invested = P * n;
  const gains = maturity - invested;

  el.result.innerHTML = `
    <strong>Maturity Amount:</strong> ₹${Math.round(maturity).toLocaleString('en-IN')}<br>
    <strong>Total Invested:</strong> ₹${invested.toLocaleString('en-IN')}<br>
    <strong>Gains:</strong> <span class="text-emerald-400">₹${Math.round(gains).toLocaleString('en-IN')}</span>
  `;

  // Chart
  const ctx = document.getElementById("sipChart");
  if (sipChart) sipChart.destroy();

  sipChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Amount Invested', 'Wealth Gained'],
      datasets: [{
        data: [invested, gains],
        backgroundColor: ['#3b82f6', '#10b981'],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'bottom', labels: { color: '#e5efff' } } }
    }
  });
});

// ===== POPUP =====
setTimeout(() => {
  el.popup?.classList.add("show");
}, 1500);

el.closePopupBtn?.addEventListener("click", () => {
  el.popup.classList.remove("show");
});

// ===== INITIALIZE =====
document.addEventListener("DOMContentLoaded", () => {
  loadLevels();
  showToast("Welcome to Wealthfy Elite!", "success");
});
