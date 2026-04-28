// ===== FIREBASE CONFIG =====
const firebaseConfig = {
  apiKey: "// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAGuTnP1UVnOFF8yRD3_4TUF8tqjWaaVcI",
  authDomain: "wealthfy-59f90.firebaseapp.com",
  projectId: "wealthfy-59f90",
  storageBucket: "wealthfy-59f90.firebasestorage.app",
  messagingSenderId: "940910768179",
  appId: "1:940910768179:web:821645289a507078c3f346",
  measurementId: "G-BG0J6007BS"
 {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.apps.length ? firebase.auth() : null;

// ===== ELEMENTS =====
const el = {
  email, password, userStatus,
  amount, rate, years, result,
  calcBtn, signupBtn, loginBtn, logoutBtn,
  popup, closePopupBtn,
  toast,
  discountModal, closeModalBtn, claimOfferBtn,
  levelsGrid, quizMeta, quizSection,
  progressFill, progressText,
  questionText, optionsWrap,
  nextBtn, quitBtn
};

// ===== TOAST =====
function showToast(msg, type="success"){
  el.toast.textContent = msg;
  el.toast.className = `toast ${type} show`;
  setTimeout(()=> el.toast.className="toast",2000);
}

// ===== AUTH =====
signupBtn.onclick = () => {
  if(!auth) return showToast("Add Firebase","error");
  auth.createUserWithEmailAndPassword(email.value,password.value)
  .then(()=> showToast("Signup success"))
  .catch(()=> showToast("Error","error"));
};

loginBtn.onclick = () => {
  if(!auth) return showToast("Add Firebase","error");
  auth.signInWithEmailAndPassword(email.value,password.value)
  .then(()=> showToast("Login success"))
  .catch(()=> showToast("Error","error"));
};

logoutBtn.onclick = () => {
  if(auth) auth.signOut();
};

// ===== SIP =====
calcBtn.onclick = () => {
  const P = +amount.value;
  const r = +rate.value/100/12;
  const n = +years.value*12;

  if(!P||!r||!n) return showToast("Fill all","error");

  const fv = P*((1+r)**n-1)/r*(1+r);
  result.innerText = "₹"+Math.round(fv);
};

// ===== QUIZ =====
const quiz = [
  {q:"What is SIP?", o:["Stock","Investment method","Loan"], a:1},
  {q:"ROI means?", o:["Return on Investment","Risk","Rate"], a:0}
];

let i=0, score=0;

levelsGrid.innerHTML = `
<div class="level-card">
<h3>Level 1</h3>
<button class="btn btn-primary" onclick="startQuiz()">Start</button>
</div>
`;

window.startQuiz = ()=>{
  quizSection.classList.remove("hidden");
  i=0; score=0;
  loadQ();
};

function loadQ(){
  const q = quiz[i];
  questionText.innerText = q.q;
  optionsWrap.innerHTML="";

  q.o.forEach((opt,index)=>{
    const b=document.createElement("button");
    b.className="option-btn";
    b.innerText=opt;

    b.onclick=()=>{
      document.querySelectorAll(".option-btn").forEach(x=>x.disabled=true);

      if(index===q.a){
        b.classList.add("correct");
        score++;
        showToast("Correct");
      } else {
        b.classList.add("wrong");
        showToast("Wrong","error");
      }
      nextBtn.disabled=false;
    };

    optionsWrap.appendChild(b);
  });

  progressFill.style.width=((i+1)/quiz.length)*100+"%";
  progressText.innerText=`${i+1}/${quiz.length}`;
  nextBtn.disabled=true;
}

nextBtn.onclick=()=>{
  i++;
  if(i<quiz.length){
    loadQ();
  } else {
    showToast("Score "+score);
    quizSection.classList.add("hidden");
    discountModal.classList.remove("hidden");
  }
};

quitBtn.onclick=()=>{
  quizSection.classList.add("hidden");
};

// ===== POPUP =====
setTimeout(()=> popup.classList.add("show"),2000);
closePopupBtn.onclick=()=> popup.classList.remove("show");

// ===== MODAL =====
closeModalBtn.onclick=()=> discountModal.classList.add("hidden");
claimOfferBtn.onclick=()=>{
  showToast("Offer claimed");
  discountModal.classList.add("hidden");
};
