// ===== FIREBASE CONFIG =====
const firebaseConfig = {
  apiKey: "AIzaSyAGuTnP1UVnOFF8yRD3_4TUF8tqjWaaVcI",
  authDomain: "wealthfy-59f90.firebaseapp.com",
  projectId: "wealthfy-59f90",
  storageBucket: "wealthfy-59f90.firebasestorage.app",
  messagingSenderId: "940910768179",
  appId: "1:940910768179:web:821645289a507078c3f346",
  measurementId: "G-BG0J6007BS"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// ===== ELEMENTS =====
const el = {
  email: document.getElementById("email"),
  password: document.getElementById("password"),
  userStatus: document.getElementById("userStatus"),

  amount: document.getElementById("amount"),
  rate: document.getElementById("rate"),
  years: document.getElementById("years"),
  result: document.getElementById("result"),

  calcBtn: document.getElementById("calcBtn"),
  signupBtn: document.getElementById("signupBtn"),
  loginBtn: document.getElementById("loginBtn"),
  logoutBtn: document.getElementById("logoutBtn"),

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

// ===== TOAST =====
function showToast(msg, type = "success") {
  el.toast.textContent = msg;
  el.toast.className = `toast ${type} show`;
  setTimeout(() => (el.toast.className = "toast"), 2000);
}

// ===== AUTH =====
el.signupBtn.onclick = () => {
  auth.createUserWithEmailAndPassword(el.email.value, el.password.value)
    .then(() => showToast("Signup success"))
    .catch(err => showToast(err.message, "error"));
};

el.loginBtn.onclick = () => {
  auth.signInWithEmailAndPassword(el.email.value, el.password.value)
    .then(() => showToast("Login success"))
    .catch(err => showToast(err.message, "error"));
};

el.logoutBtn.onclick = () => {
  auth.signOut();
};

// Optional: Track user state
auth.onAuthStateChanged(user => {
  el.userStatus.innerText = user ? `Logged in: ${user.email}` : "Logged out";
});

// ===== SIP CALCULATOR =====
el.calcBtn.onclick = () => {
  const P = +el.amount.value;
  const r = +el.rate.value / 100 / 12;
  const n = +el.years.value * 12;

  if (!P || !r || !n) return showToast("Fill all fields", "error");

  const fv = P * ((1 + r) ** n - 1) / r * (1 + r);
  el.result.innerText = "₹" + Math.round(fv);
};

// ===== QUIZ =====
const quiz = [
  { q: "What is SIP?", o: ["Stock", "Investment method", "Loan"], a: 1 },
  { q: "ROI means?", o: ["Return on Investment", "Risk", "Rate"], a: 0 }
];

let i = 0, score = 0;

el.levelsGrid.innerHTML = `
<div class="level-card">
<h3>Level 1</h3>
<button class="btn btn-primary" onclick="startQuiz()">Start</button>
</div>
`;

window.startQuiz = () => {
  el.quizSection.classList.remove("hidden");
  i = 0;
  score = 0;
  loadQ();
};

function loadQ() {
  const q = quiz[i];
  el.questionText.innerText = q.q;
  el.optionsWrap.innerHTML = "";

  q.o.forEach((opt, index) => {
    const b = document.createElement("button");
    b.className = "option-btn";
    b.innerText = opt;

    b.onclick = () => {
      document.querySelectorAll(".option-btn").forEach(x => x.disabled = true);

      if (index === q.a) {
        b.classList.add("correct");
        score++;
        showToast("Correct");
      } else {
        b.classList.add("wrong");
        showToast("Wrong", "error");
      }

      el.nextBtn.disabled = false;
    };

    el.optionsWrap.appendChild(b);
  });

  el.progressFill.style.width = ((i + 1) / quiz.length) * 100 + "%";
  el.progressText.innerText = `${i + 1}/${quiz.length}`;
  el.nextBtn.disabled = true;
}

el.nextBtn.onclick = () => {
  i++;
  if (i < quiz.length) {
    loadQ();
  } else {
    showToast("Score: " + score);
    el.quizSection.classList.add("hidden");
    el.discountModal.classList.remove("hidden");
  }
};

el.quitBtn.onclick = () => {
  el.quizSection.classList.add("hidden");
};

// ===== POPUP =====
setTimeout(() => el.popup.classList.add("show"), 2000);
el.closePopupBtn.onclick = () => el.popup.classList.remove("show");

// ===== MODAL =====
el.closeModalBtn.onclick = () => el.discountModal.classList.add("hidden");

el.claimOfferBtn.onclick = () => {
  showToast("Offer claimed 🎉");
  el.discountModal.classList.add("hidden");
};
