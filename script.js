// ===== NAV =====
function scrollToTools() {
  document.getElementById("tools").scrollIntoView({behavior:"smooth"});
}

function openTool(id){
  document.getElementById("toolSection").style.display="block";
  document.querySelectorAll(".tool").forEach(t=>t.style.display="none");
  document.getElementById(id).style.display="block";
}

function closeTool(){
  document.getElementById("toolSection").style.display="none";
}

// ===== LOTTIE =====
lottie.loadAnimation({
  container: document.getElementById("lottie-animation"),
  renderer: "svg",
  loop: true,
  autoplay: true,
  path: "https://assets2.lottiefiles.com/packages/lf20_qp1q7mct.json"
});

// ===== CHART =====
let chart;

function generateGraph(){
  let amount = +saveAmount.value;
  let years = +saveYears.value;

  let data=[], labels=[], total=0;

  for(let i=1;i<=years*12;i++){
    total+=amount;
    data.push(total);
    labels.push(i);
  }

  if(chart) chart.destroy();

  let ctx = document.getElementById("chart").getContext("2d");

  let gradient = ctx.createLinearGradient(0,0,0,400);
  gradient.addColorStop(0,"#00F5FF");
  gradient.addColorStop(1,"#007BFF");

  chart = new Chart(ctx,{
    type:"line",
    data:{
      labels,
      datasets:[{
        data,
        borderColor:gradient,
        tension:0.4
      }]
    }
  });
}

// ===== SIP =====
function calcSIP(){
  let P=+sipAmount.value;
  let r=+sipRate.value/100/12;
  let n=+sipYears.value*12;

  let FV=P*((Math.pow(1+r,n)-1)/r)*(1+r);

  sipResult.innerText="Future Value ₹ "+Math.round(FV);
}

// ===== QUIZ SYSTEM =====

let level=1;
let currentQuestions=[];
let score=0;

const quizData = {
  1:[
    {q:"What is investing?", options:["Saving","Growing money","Spending","Borrowing"], answer:1},
    {q:"What is saving?", options:["Investing","Keeping money aside","Trading","Loan"], answer:1},
    {q:"What is risk?", options:["Profit","Loss chance","Saving","Income"], answer:1},
    {q:"Inflation?", options:["Price increase","Decrease","Tax","Loan"], answer:0},
    {q:"Asset?", options:["Liability","Ownership","Expense","Debt"], answer:1}
  ],
  2:[
    {q:"Stock represents?", options:["Debt","Ownership","Loan","Saving"], answer:1},
    {q:"ETF is?", options:["Fund","Loan","Stock","Crypto"], answer:0},
    {q:"Bond is?", options:["Ownership","Debt","Crypto","ETF"], answer:1},
    {q:"Dividend?", options:["Tax","Profit share","Loan","Expense"], answer:1},
    {q:"Market?", options:["Shop","Trading place","Bank","Gov"], answer:1}
  ],
  3:[
    {q:"Diversification?", options:["Risk spread","Loss","Profit","Tax"], answer:0},
    {q:"Liquidity?", options:["Ease of selling","Loan","Saving","Tax"], answer:0},
    {q:"Volatility?", options:["Stable","Fluctuation","Profit","Loss"], answer:1},
    {q:"Hedging?", options:["Risk protection","Profit","Loan","Saving"], answer:0},
    {q:"Compound interest?", options:["Simple","Interest on interest","Tax","Loan"], answer:1}
  ]
};

function loadQuiz(){
  currentQuestions = quizData[level];
  let container = document.getElementById("quizContainer");
  container.innerHTML="";

  currentQuestions.forEach((q,i)=>{
    let html = `<p>${i+1}. ${q.q}</p>`;
    q.options.forEach((opt,j)=>{
      html+=`<div class="option">
        <input type="radio" name="q${i}" value="${j}"> ${opt}
      </div>`;
    });
    container.innerHTML+=html;
  });

  updateProgress();
}

function submitQuiz(){
  score=0;

  currentQuestions.forEach((q,i)=>{
    let selected = document.querySelector(`input[name=q${i}]:checked`);
    if(selected && +selected.value===q.answer) score++;
  });

  let percent = (score/currentQuestions.length)*100;

  if(level===1 && percent>=70){
    level=2;
    nextLevel("Level 2 Unlocked 🚀");
  }
  else if(level===2 && percent>=71){
    level=3;
    nextLevel("Level 3 Unlocked 🔥");
  }
  else if(level===3 && percent>=80){
    nextLevel("You Mastered Finance 🎉");
  }
  else{
    document.getElementById("quizResult").innerText="Try Again ❌";
  }
}

function nextLevel(msg){
  document.getElementById("quizResult").innerText=msg;
  confetti();
  loadQuiz();
}

function updateProgress(){
  document.getElementById("progress").style.width = (level*33)+"%";
}

// CONFETTI
function confetti(){
  for(let i=0;i<60;i++){
    let d=document.createElement("div");
    d.style.position="fixed";
    d.style.width="6px";
    d.style.height="6px";
    d.style.background="#00F5FF";
    d.style.top=Math.random()*window.innerHeight+"px";
    d.style.left=Math.random()*window.innerWidth+"px";
    document.body.appendChild(d);
    setTimeout(()=>d.remove(),2000);
  }
}

// INIT
loadQuiz();
