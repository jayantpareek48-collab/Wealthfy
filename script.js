// FIREBASE CONFIG (UNCHANGED)
const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "wealthfy-59f90.firebaseapp.com",
  projectId: "wealthfy-59f90"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// MODAL
function openModal(){
  document.getElementById("authModal").style.display="block";
}
function closeModal(){
  document.getElementById("authModal").style.display="none";
}

// AUTH (UNCHANGED)
function signup(){
  auth.createUserWithEmailAndPassword(email.value,password.value)
  .then(()=>userStatus.innerText="Signup Success");
}

function login(){
  auth.signInWithEmailAndPassword(email.value,password.value)
  .then(()=>userStatus.innerText="Login Success");
}

function logout(){
  auth.signOut();
}

// TOOL
function showSIP(){
  document.getElementById("toolArea").innerHTML=`
    <div class="glass" style="padding:20px;max-width:400px;margin:auto;">
      <h3>SIP Calculator</h3>
      <input id="amount" placeholder="Monthly ₹">
      <input id="rate" placeholder="Return %">
      <input id="years" placeholder="Years">
      <button onclick="calc()">Calculate</button>
      <p id="result"></p>
    </div>
  `;
}

function calc(){
  let P=+amount.value;
  let r=+rate.value/100/12;
  let n=+years.value*12;

  let FV=P*((Math.pow(1+r,n)-1)/r)*(1+r);
  result.innerText="₹ "+Math.round(FV);
}

// QUIZ (10 QUESTIONS)
let qIndex=0, score=0;

const questions=[
{q:"What is saving?",o:["Spending","Keeping money","Borrowing","Losing"],a:1},
{q:"Inflation means?",o:["Price rise","Discount","Tax","Salary"],a:0},
{q:"Bank interest gives?",o:["Loss","Growth","Tax","Fine"],a:1},
{q:"Safe investment?",o:["Casino","Savings account","Betting","Gambling"],a:1},
{q:"Emergency fund?",o:["Luxury","Backup money","Loan","Tax"],a:1},
{q:"SIP means?",o:["Monthly investing","Loan","Tax","Expense"],a:0},
{q:"Higher risk means?",o:["Higher return","No return","Safe","None"],a:0},
{q:"Budget helps?",o:["Overspending","Planning","Loss","Loan"],a:1},
{q:"Stock market?",o:["Shopping","Investment","Loan","Tax"],a:1},
{q:"Diversification?",o:["One asset","Multiple assets","No assets","Debt"],a:1}
];

function startQuiz(){
  qIndex=0; score=0;
  renderQ();
}

function renderQ(){
  let q=questions[qIndex];
  document.getElementById("quizArea").innerHTML=`
    <div class="glass" style="padding:20px;">
      <h3>${q.q}</h3>
      ${q.o.map((opt,i)=>`<div onclick="answer(${i})">${opt}</div>`).join("")}
    </div>
  `;
}

function answer(i){
  if(i===questions[qIndex].a) score++;
  qIndex++;

  if(qIndex<questions.length){
    renderQ();
  }else{
    document.getElementById("quizArea").innerHTML=`
      <h2>Score: ${score}/10</h2>
    `;
  }
}
