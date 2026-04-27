// ===== ROUTING =====
function navigate(page){
  const app = document.getElementById("app");

  if(page==="home"){
    app.innerHTML = `
      <section class="hero">
        <h1>Future of Finance Learning</h1>
        <p>Interactive tools + gamified investing education</p>
      </section>
    `;
  }

  if(page==="tools"){
    app.innerHTML = `
      <div class="tool-box glass">
        <h2>SIP Calculator</h2>
        <input id="amount" placeholder="Monthly ₹">
        <input id="rate" placeholder="Return %">
        <input id="years" placeholder="Years">
        <button onclick="calc()">Calculate</button>
        <p id="result"></p>
      </div>

      <canvas id="chart"></canvas>
    `;
  }

  if(page==="quiz"){
    startQuiz();
  }

  if(page==="about"){
    app.innerHTML = `
      <div class="tool-box glass">
        <h2>Founder’s Corner</h2>
        <p>
        Wealthfy was founded by a 16-year-old entrepreneur and student at Euro School.
        Driven by a mission to bridge the financial literacy gap, this platform was built
        to provide free, high-quality financial tools and gamified awareness to everyone.
        </p>
      </div>
    `;
  }
}

// ===== SIP =====
function calc(){
  let P=+amount.value;
  let r=+rate.value/100/12;
  let n=+years.value*12;

  let FV=P*((Math.pow(1+r,n)-1)/r)*(1+r);
  result.innerText="Future Value ₹ "+Math.round(FV);
}

// ===== QUIZ ENGINE =====
let currentQ=0, level=1, score=0;

const quiz = {
  1:[
    {q:"What is investing?",o:["Saving","Growing money","Spending","Borrowing"],a:1,exp:"Investing grows wealth over time."},
    {q:"Inflation?",o:["Price rise","Tax","Saving","Loan"],a:0,exp:"Inflation reduces purchasing power."}
  ],
  2:[
    {q:"ETF?",o:["Loan","Fund","Crypto","Bond"],a:1,exp:"ETF is low-cost index fund."}
  ],
  3:[
    {q:"Expense ratio impact?",o:["No effect","Reduces returns","Increase","Tax"],a:1,exp:"Small fees compound into big losses."}
  ]
};

function startQuiz(){
  currentQ=0;
  score=0;
  renderQ();
}

function renderQ(){
  let q=quiz[level][currentQ];
  document.getElementById("app").innerHTML = `
    <div class="quiz-box glass">
      <h3>${q.q}</h3>
      ${q.o.map((opt,i)=>`<div class="option" onclick="answer(${i})">${opt}</div>`).join("")}
      <div id="exp"></div>
    </div>
  `;
}

function answer(i){
  let q=quiz[level][currentQ];
  if(i===q.a) score++;

  document.getElementById("exp").innerHTML = `
    <div class="explanation">${q.exp}</div>
    <button onclick="next()">Next</button>
  `;
}

function next(){
  currentQ++;
  if(currentQ < quiz[level].length){
    renderQ();
  } else {
    finish();
  }
}

function finish(){
  let percent=(score/quiz[level].length)*100;
  let msg=`Score ${percent}%`;

  if(level===1 && percent>=70){level=2; msg+="<br>Level 2 🚀";}
  else if(level===2 && percent>=70){level=3; msg+="<br>Level 3 🔥";}
  else if(level===3){msg+="<br>Master 🎉";}

  document.getElementById("app").innerHTML = `
    <div class="quiz-box glass">
      <h2>${msg}</h2>
      <button onclick="startQuiz()">Continue</button>
    </div>
  `;
}

// INIT
navigate('home');
