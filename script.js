/* =============================================
   WEALTHFY — script.js
   ============================================= */

// ─── STATE ───────────────────────────────────
let currentUser = null;
let users = JSON.parse(localStorage.getItem('wf_users') || '{}');
let sipChart = null;
let sipCount = 0;
let bestScore = null;
let currentLevel = 'beginner';
let currentQIndex = 0;
let score = 0;
let answered = false;
const qs = {};  // shuffled questions for session

// ─── QUESTIONS ───────────────────────────────
const questions = {
  beginner: [
    { q: "What is the full form of SIP?", opts: ["Systematic Investment Plan","Simple Interest Plan","Savings and Interest Program","Structured Income Plan"], ans: 0, exp: "SIP stands for Systematic Investment Plan — investing a fixed amount regularly in mutual funds." },
    { q: "What does inflation mean?", opts: ["Rise in stock prices","General rise in prices over time","Decrease in bank interest","Increase in government taxes"], ans: 1, exp: "Inflation refers to the general increase in prices of goods and services over time, reducing purchasing power." },
    { q: "Which of these is the safest investment?", opts: ["Penny stocks","Government bonds","Cryptocurrency","Small-cap mutual funds"], ans: 1, exp: "Government bonds are considered among the safest investments as they are backed by the government." },
    { q: "What does EMI stand for?", opts: ["Easy Money Installment","Equated Monthly Installment","Effective Monthly Interest","Estimated Monthly Income"], ans: 1, exp: "EMI = Equated Monthly Installment — a fixed payment made to a lender at a fixed date each calendar month." },
    { q: "The 50-30-20 rule is related to:", opts: ["Stock allocation","Personal budgeting","Tax calculation","Loan repayment"], ans: 1, exp: "The 50-30-20 budgeting rule suggests: 50% needs, 30% wants, 20% savings or debt repayment." },
    { q: "What is a credit score used for?", opts: ["Tracking market prices","Calculating SIP returns","Assessing creditworthiness","Measuring inflation rate"], ans: 2, exp: "A credit score measures how likely you are to repay debt — lenders use it to decide whether to give you credit." },
    { q: "Fixed deposits in India are insured up to:", opts: ["₹1 Lakh","₹5 Lakh","₹10 Lakh","₹50,000"], ans: 1, exp: "DICGC insures bank deposits up to ₹5 lakh per depositor per bank in India." },
    { q: "Which is NOT a savings account feature?", opts: ["Earns interest","Easy withdrawal","Guaranteed high returns","Debit card access"], ans: 2, exp: "Savings accounts earn moderate interest but do not offer guaranteed high returns — that's a misconception." },
    { q: "Compound interest means:", opts: ["Interest on principal only","Interest on both principal and accumulated interest","Fixed interest every year","Interest paid only at maturity"], ans: 1, exp: "Compound interest is calculated on both the principal and the interest that accumulates — wealth grows exponentially." },
    { q: "A budget deficit means a government:", opts: ["Has surplus funds","Spends more than it earns","Has no debt","Reduced taxes"], ans: 1, exp: "A budget deficit occurs when expenditure exceeds revenue in a given period." },
  ],
  intermediate: [
    { q: "What does NAV stand for in mutual funds?", opts: ["Net Asset Value","New Annual Valuation","Nominal Asset Volume","Net Accrued Value"], ans: 0, exp: "NAV (Net Asset Value) is the per-unit price of a mutual fund, calculated daily after market close." },
    { q: "ELSS stands for:", opts: ["Equity Linked Savings Scheme","Equal Load Savings System","Equity Linked Security Scheme","Earned Leave Savings Scheme"], ans: 0, exp: "ELSS (Equity Linked Savings Scheme) is a tax-saving mutual fund with a 3-year lock-in eligible under Section 80C." },
    { q: "What is the lock-in period for ELSS mutual funds?", opts: ["1 year","5 years","3 years","No lock-in"], ans: 2, exp: "ELSS funds have a mandatory 3-year lock-in period — the shortest among all 80C tax-saving instruments." },
    { q: "In mutual funds, 'expense ratio' refers to:", opts: ["Commission paid to broker","Annual fee charged to manage the fund","Exit load on redemption","GST on investments"], ans: 1, exp: "The expense ratio is the annual cost of running a fund, expressed as a percentage of AUM, deducted from returns." },
    { q: "Which index tracks the top 50 companies listed on NSE?", opts: ["SENSEX","BSE 100","NIFTY 50","NIFTY Next 50"], ans: 2, exp: "The NIFTY 50 is the flagship benchmark index of NSE, tracking the top 50 large-cap companies by free-float market cap." },
    { q: "What is rupee cost averaging in SIP?", opts: ["Fixed returns guaranteed","Buying more units when prices fall","Selling when market is high","Investing in foreign currency"], ans: 1, exp: "Rupee cost averaging means that when markets fall, your fixed SIP amount buys more units — lowering your average cost over time." },
    { q: "A bond is essentially:", opts: ["Ownership in a company","A loan given to a company or government","A type of mutual fund","An insurance policy"], ans: 1, exp: "When you buy a bond, you're lending money to an issuer (company/government) who promises periodic interest + principal repayment." },
    { q: "What does P/E ratio measure?", opts: ["Profit earned per share","How much investors pay per rupee of earnings","Percentage of equity in a company","Price drop in bear market"], ans: 1, exp: "P/E (Price-to-Earnings) ratio = Share Price ÷ EPS. A high P/E may indicate overvaluation or high growth expectations." },
    { q: "What is a Debt Mutual Fund primarily invested in?", opts: ["Stocks and equity","Fixed income securities like bonds","Real estate","Gold and commodities"], ans: 1, exp: "Debt mutual funds invest in fixed-income instruments like government securities, bonds, and money market instruments." },
    { q: "SEBI's primary role is to:", opts: ["Collect taxes on investments","Regulate and protect investors in securities market","Set repo rates","Issue currency notes"], ans: 1, exp: "SEBI (Securities and Exchange Board of India) regulates the securities market, protecting investors and ensuring fair practices." },
  ]
};

// ─── AUTH ─────────────────────────────────────
function switchTab(tab) {
  document.getElementById('loginForm').classList.toggle('hidden', tab !== 'login');
  document.getElementById('signupForm').classList.toggle('hidden', tab !== 'signup');
  document.getElementById('tabLogin').classList.toggle('active', tab === 'login');
  document.getElementById('tabSignup').classList.toggle('active', tab === 'signup');
  clearErrors();
}

function clearErrors() {
  ['loginError','signupError'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = '';
  });
}

function signup() {
  const name  = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim().toLowerCase();
  const pass  = document.getElementById('signupPass').value;
  const errEl = document.getElementById('signupError');

  if (!name || !email || !pass) return errEl.textContent = 'Please fill all fields.';
  if (!email.includes('@')) return errEl.textContent = 'Enter a valid email.';
  if (pass.length < 6) return errEl.textContent = 'Password must be 6+ characters.';
  if (users[email]) return errEl.textContent = 'Account already exists. Login instead.';

  users[email] = { name, pass, sipCount: 0, bestScore: null };
  localStorage.setItem('wf_users', JSON.stringify(users));
  loginUser(email);
}

function login() {
  const email = document.getElementById('loginEmail').value.trim().toLowerCase();
  const pass  = document.getElementById('loginPass').value;
  const errEl = document.getElementById('loginError');

  if (!email || !pass) return errEl.textContent = 'Please fill all fields.';
  if (!users[email]) return errEl.textContent = 'Account not found. Sign up first.';
  if (users[email].pass !== pass) return errEl.textContent = 'Incorrect password.';

  loginUser(email);
}

function loginUser(email) {
  currentUser = email;
  const u = users[email];
  sipCount = u.sipCount || 0;
  bestScore = u.bestScore || null;

  document.getElementById('heroView').classList.add('hidden');
  document.getElementById('dashboardView').classList.remove('hidden');
  document.getElementById('dashboardView').classList.add('fade-up');
  document.getElementById('toolNav').classList.remove('hidden');
  document.getElementById('toolNav').classList.add('fade-in');

  document.getElementById('welcomeName').textContent = u.name;
  document.getElementById('statSip').textContent = sipCount;
  document.getElementById('statScore').textContent = bestScore !== null ? `${bestScore}/10` : '—';

  // Header logout
  document.getElementById('headerAuth').innerHTML =
    `<button class="logout-btn" onclick="logout()">Logout</button>`;

  showTool('sip');
}

function logout() {
  currentUser = null;
  sipCount = 0; bestScore = null;

  document.getElementById('heroView').classList.remove('hidden');
  document.getElementById('dashboardView').classList.add('hidden');
  document.getElementById('toolNav').classList.add('hidden');
  document.getElementById('sipTool').classList.add('hidden');
  document.getElementById('quizTool').classList.add('hidden');
  document.getElementById('headerAuth').innerHTML = '';

  // Reset forms
  ['loginEmail','loginPass','signupName','signupEmail','signupPass'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  clearErrors();
  switchTab('login');

  if (sipChart) { sipChart.destroy(); sipChart = null; }
}

// ─── TOOL NAVIGATION ──────────────────────────
function showTool(tool) {
  document.getElementById('sipTool').classList.toggle('hidden', tool !== 'sip');
  document.getElementById('quizTool').classList.toggle('hidden', tool !== 'quiz');
  document.getElementById('btnSip').classList.toggle('active', tool === 'sip');
  document.getElementById('btnQuiz').classList.toggle('active', tool === 'quiz');

  if (tool === 'sip') {
    setTimeout(calcSIP, 50);
  }
  if (tool === 'quiz') {
    showQuizHome();
  }
}

// ─── SIP CALCULATOR ───────────────────────────
function syncToRange(inputId, rangeId) {
  const val = parseFloat(document.getElementById(inputId).value);
  const range = document.getElementById(rangeId);
  if (!isNaN(val)) range.value = Math.min(Math.max(val, range.min), range.max);
}
function syncToInput(rangeId, inputId) {
  document.getElementById(inputId).value = document.getElementById(rangeId).value;
}

function formatINR(n) {
  if (n >= 1e7) return '₹' + (n / 1e7).toFixed(2) + ' Cr';
  if (n >= 1e5) return '₹' + (n / 1e5).toFixed(2) + ' L';
  return '₹' + Math.round(n).toLocaleString('en-IN');
}

function calcSIP() {
  const P = parseFloat(document.getElementById('sipAmount').value) || 0;
  const r = (parseFloat(document.getElementById('sipRate').value) || 0) / 12 / 100;
  const n = (parseInt(document.getElementById('sipYears').value) || 0) * 12;

  if (P <= 0 || r <= 0 || n <= 0) return;

  const maturity = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  const invested = P * n;
  const gains    = maturity - invested;

  document.getElementById('resInvested').textContent = formatINR(invested);
  document.getElementById('resGains').textContent    = formatINR(gains);
  document.getElementById('resMaturity').textContent = formatINR(maturity);
  document.getElementById('chartMaturity').textContent = formatINR(maturity);

  drawChart(invested, gains);
}

function drawChart(invested, gains) {
  const ctx = document.getElementById('sipChart').getContext('2d');
  const data = {
    datasets: [{
      data: [invested, gains],
      backgroundColor: ['rgba(147,197,253,0.85)', 'rgba(52,211,153,0.85)'],
      borderColor: ['rgba(147,197,253,0.2)', 'rgba(52,211,153,0.2)'],
      borderWidth: 2,
      hoverOffset: 6,
    }],
    labels: ['Invested', 'Gains']
  };

  if (sipChart) {
    sipChart.data = data;
    sipChart.update('active');
  } else {
    sipChart = new Chart(ctx, {
      type: 'doughnut',
      data,
      options: {
        cutout: '72%',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => ` ${ctx.label}: ${formatINR(ctx.raw)}`
            },
            backgroundColor: 'rgba(14,18,32,0.92)',
            titleColor: '#F0F2F8',
            bodyColor: '#F5C518',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
            padding: 10,
          }
        },
        animation: { animateRotate: true, duration: 700 }
      }
    });
  }
}

function saveSIP() {
  if (!currentUser) return;
  sipCount++;
  users[currentUser].sipCount = sipCount;
  localStorage.setItem('wf_users', JSON.stringify(users));
  document.getElementById('statSip').textContent = sipCount;
  const msg = document.getElementById('sipSaveMsg');
  msg.textContent = '✓ Plan saved successfully!';
  setTimeout(() => msg.textContent = '', 3000);
}

// ─── QUIZ ─────────────────────────────────────
function showQuizHome() {
  document.getElementById('quizHome').classList.remove('hidden');
  document.getElementById('quizPlay').classList.add('hidden');
  document.getElementById('quizResult').classList.add('hidden');
}

function startQuiz(level) {
  currentLevel = level;
  currentQIndex = 0;
  score = 0;
  answered = false;

  // Shuffle questions
  qs[level] = [...questions[level]].sort(() => Math.random() - 0.5);

  document.getElementById('quizHome').classList.add('hidden');
  document.getElementById('quizPlay').classList.remove('hidden');
  document.getElementById('quizResult').classList.add('hidden');

  document.getElementById('quizLevelLabel').textContent = level === 'beginner' ? '🌱 Beginner' : '🚀 Intermediate';

  renderQuestion();
}

function renderQuestion() {
  const q = qs[currentLevel][currentQIndex];
  answered = false;

  document.getElementById('quizQNum').textContent = `Q${currentQIndex + 1} of 10`;
  document.getElementById('progressFill').style.width = `${(currentQIndex / 10) * 100}%`;
  document.getElementById('quizQuestion').textContent = q.q;
  document.getElementById('nextWrap').classList.add('hidden');
  document.getElementById('explanationBox').textContent = '';

  const grid = document.getElementById('optionsGrid');
  grid.innerHTML = '';
  // Shuffle options display
  const indices = [0,1,2,3].sort(() => Math.random() - 0.5);
  indices.forEach(i => {
    const btn = document.createElement('button');
    btn.className = 'opt-btn fade-up';
    btn.textContent = q.opts[i];
    btn.dataset.idx = i;
    btn.onclick = () => selectAnswer(btn, i, q);
    grid.appendChild(btn);
  });
}

function selectAnswer(btn, idx, q) {
  if (answered) return;
  answered = true;

  const allBtns = document.querySelectorAll('.opt-btn');
  allBtns.forEach(b => {
    b.disabled = true;
    const bi = parseInt(b.dataset.idx);
    if (bi === q.ans) b.classList.add('correct');
    else if (bi === idx && idx !== q.ans) b.classList.add('wrong');
  });

  if (idx === q.ans) score++;

  document.getElementById('explanationBox').textContent = '💡 ' + q.exp;
  document.getElementById('nextWrap').classList.remove('hidden');

  const nextBtn = document.getElementById('nextWrap').querySelector('.btn-gold');
  if (currentQIndex === 9) nextBtn.textContent = 'See Results →';
}

function nextQuestion() {
  currentQIndex++;
  if (currentQIndex >= 10) {
    showResult();
  } else {
    renderQuestion();
  }
}

function showResult() {
  document.getElementById('quizPlay').classList.add('hidden');
  document.getElementById('quizResult').classList.remove('hidden');

  const pct = Math.round((score / 10) * 100);

  // Save best score
  if (currentUser) {
    if (bestScore === null || score > bestScore) {
      bestScore = score;
      users[currentUser].bestScore = bestScore;
      localStorage.setItem('wf_users', JSON.stringify(users));
      document.getElementById('statScore').textContent = `${bestScore}/10`;
    }
  }

  let emoji, title, sub;
  if (pct === 100) { emoji = '🏆'; title = 'Perfect Score!'; sub = 'You\'re a finance genius. Absolutely flawless!'; }
  else if (pct >= 80) { emoji = '🌟'; title = 'Outstanding!'; sub = `${pct}% correct — you really know your finance!`; }
  else if (pct >= 60) { emoji = '👍'; title = 'Good Job!'; sub = `${pct}% correct — solid knowledge, keep learning!`; }
  else if (pct >= 40) { emoji = '📚'; title = 'Keep Going!'; sub = `${pct}% correct — review the concepts and try again.`; }
  else { emoji = '💪'; title = 'Keep Practicing!'; sub = `${pct}% correct — don't give up, you'll improve!`; }

  document.getElementById('resultEmoji').textContent = emoji;
  document.getElementById('resultTitle').textContent = title;
  document.getElementById('resultSub').textContent = sub;
  document.getElementById('scoreBig').textContent = score;

  // Animate ring
  const circumference = 314;
  const offset = circumference - (score / 10) * circumference;
  const arc = document.getElementById('scoreArc');
  arc.style.strokeDashoffset = circumference;
  setTimeout(() => {
    arc.style.transition = 'stroke-dashoffset 1.1s cubic-bezier(0.4,0,0.2,1)';
    arc.style.strokeDashoffset = offset;
  }, 100);

  document.getElementById('progressFill').style.width = '100%';
}

function retryQuiz() {
  startQuiz(currentLevel);
}

function quitQuiz() {
  showQuizHome();
}

// ─── INIT ─────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  // Nothing auto-logged in — fresh start
  calcSIP(); // precompute silently
});
