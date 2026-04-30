// ===== SAFE FIREBASE INIT =====
let auth = null;

try {
  if (typeof firebase !== "undefined") {
    const firebaseConfig = {
      apiKey: "AIzaSyAGuTnP1UVnOFF8yRD3_4TUF8tqjWaaVcI",
      authDomain: "wealthfy-59f90.firebaseapp.com",
      projectId: "wealthfy-59f90",
      storageBucket: "wealthfy-59f90.firebasestorage.app",
      messagingSenderId: "940910768179",
      appId: "1:940910768179:web:821645289a507078c3f346",
      measurementId: "G-BG0J6007BS"
    };

    firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
  } else {
    console.error("Firebase not loaded");
  }
} catch (e) {
  console.error("Firebase error:", e);
}

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

  discountModal: get("discountModal"),
  closeModalBtn: get("closeModalBtn"),
  claimOfferBtn: get("claimOfferBtn"),

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

// ===== TOAST =====
function showToast(msg, type = "success") {
  if (!el.toast) return;
  el.toast.textContent = msg;
  el.toast.className = `toast ${type} show`;
  setTimeout(() => (el.toast.className = "toast"), 2000);
}

// ===== AUTH =====
if (auth) {
  el.signupBtn?.addEventListener("click", () => {
    auth.createUserWithEmailAndPassword(el.email.value, el.password.value)
      .then(() => showToast("Signup success"))
      .catch(err => showToast(err.message, "error"));
  });

  el.loginBtn?.addEventListener("click", () => {
    auth.signInWithEmailAndPassword(el.email.value, el.password.value)
      .then(() => showToast("Login success"))
      .catch(err => showToast(err.message, "error"));
  });

  el.logoutBtn?.addEventListener("click", () => auth.signOut());

  auth.onAuthStateChanged(user => {
    if (el.userStatus) {
      el.userStatus.innerText = user ? `Logged in: ${user.email}` : "Logged out";
    }
  });
}

// ===== SIP =====
el.calcBtn?.addEventListener("click", () => {
  const P = +el.amount.value;
  const r = +el.rate.value / 100 / 12;
  const n = +el.years.value * 12;

  if (!P || !r || !n) return showToast("Fill all fields", "error");

  const fv = P * ((1 + r) ** n - 1) / r * (1 + r);
  el.result.innerText = "₹" + Math.round(fv);
});

// ===== QUIZ =====
const quiz = [
  { q: "What is SIP?", o: ["Stock", "Investment method", "Loan"], a: 1 },
  { q: "ROI means?", o: ["Return on Investment", "Risk", "Rate"], a: 0 }
];

let i = 0, score = 0;

if (el.levelsGrid) {
  el.levelsGrid.innerHTML = `
  <div class="level-card">
    <h3>Level 1</h3>
    <button class="btn btn-primary" onclick="startQuiz()">Start</button>
  </div>`;
}

window.startQuiz = () => {
  if (!el.quizSection) return;
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

el.nextBtn?.addEventListener("click", () => {
  i++;
  if (i < quiz.length) {
    loadQ();
  } else {
    showToast("Score: " + score);
    el.quizSection.classList.add("hidden");
    el.discountModal.classList.remove("hidden");
  }
});

el.quitBtn?.addEventListener("click", () => {
  el.quizSection.classList.add("hidden");
});

// ===== POPUP =====
setTimeout(() => el.popup?.classList.add("show"), 2000);
el.closePopupBtn?.addEventListener("click", () => el.popup.classList.remove("show"));

// ===== MODAL =====
el.closeModalBtn?.addEventListener("click", () => el.discountModal.classList.add("hidden"));

el.claimOfferBtn?.addEventListener("click", () => {
  showToast("Offer claimed 🎉");
  el.discountModal.classList.add("hidden");
});
