// 🔥 ADD YOUR FIREBASE CONFIG HERE
const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_DOMAIN"
};

if(firebaseConfig.apiKey !== "YOUR_KEY"){
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.apps.length ? firebase.auth() : null;

// ELEMENTS
const el = {
  email: email,
  password: password,
  userStatus: userStatus,
  calcBtn: calcBtn,
  amount: amount,
  rate: rate,
  years: years,
  result: result,
  nextBtn: nextBtn,
  quitBtn: quitBtn,
  questionText: questionText,
  optionsWrap: optionsWrap,
  progressFill: progressFill,
  progressText: progressText,
  quizSection: quizSection,
  levelsGrid: levelsGrid,
  toast: toast
};

// TOAST
function showToast(msg){
  el.toast.innerText = msg;
  el.toast.className = "toast show";
  setTimeout(()=> el.toast.className="toast",2000);
}

// AUTH
signupBtn.onclick = () => {
  if(!auth) return showToast("Add Firebase");
  auth.createUserWithEmailAndPassword(email.value,password.value)
  .then(()=>showToast("Signup Success"))
  .catch(()=>showToast("Error"));
};

loginBtn.onclick = () => {
  if(!auth) return showToast("Add Firebase");
  auth.signInWithEmailAndPassword(email.value,password.value)
  .then(()=>showToast("Login Success"))
  .catch(()=>showToast("Error"));
};

logoutBtn.onclick = () => {
  if(!auth) return;
  auth.signOut();
};

// SIP
calcBtn.onclick = () => {
  const P = +amount.value;
  const r = +rate.value/100/12;
  const n = +years.value*12;

  if(!P||!r||!n) return showToast("Fill all");

  const fv = P*((1+r)**n-1)/r*(1+r);
  result.innerText = "₹"+Math.round(fv);
};

// QUIZ
const quiz = [
  {q:"What is SIP?", o:["Stock","Investment","Loan"], a:1},
  {q:"ROI means?", o:["Return","Risk","Rate"], a:0}
];

let i=0, score=0;

levelsGrid.innerHTML = `<button class="btn btn-primary" onclick="startQuiz()">Start Quiz</button>`;

window.startQuiz = () => {
  quizSection.classList.remove("hidden");
  i=0; score=0;
  loadQ();
};

function loadQ(){
  const q = quiz[i];
  questionText.innerText = q.q;
  optionsWrap.innerHTML = "";

  q.o.forEach((opt,index)=>{
    const btn=document.createElement("button");
    btn.className="option-btn";
    btn.innerText=opt;

    btn.onclick=()=>{
      if(index===q.a){
        btn.classList.add("correct");
        score++;
      } else {
        btn.classList.add("wrong");
      }
      nextBtn.disabled=false;
    };

    optionsWrap.appendChild(btn);
  });

  progressFill.style.width = ((i+1)/quiz.length)*100+"%";
  progressText.innerText = (i+1)+"/"+quiz.length;
  nextBtn.disabled=true;
}

nextBtn.onclick = ()=>{
  i++;
  if(i<quiz.length){
    loadQ();
  } else {
    showToast("Score "+score);
    quizSection.classList.add("hidden");
  }
};

quitBtn.onclick = ()=>{
  quizSection.classList.add("hidden");
};
