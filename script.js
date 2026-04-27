// ===== FIREBASE SETUP =====
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

const auth = firebase.auth();
const db = firebase.firestore();

console.log("Firebase Connected ✅");


// ===== AUTH SYSTEM =====

// SIGN UP
function signup(){
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      document.getElementById("userStatus").innerText = "Signup Successful ✅";
    })
    .catch(err => {
      document.getElementById("userStatus").innerText = err.message;
    });
}

// LOGIN
function login(){
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      document.getElementById("userStatus").innerText = "Login Successful 🚀";
    })
    .catch(err => {
      document.getElementById("userStatus").innerText = err.message;
    });
}

// LOGOUT
function logout(){
  auth.signOut().then(() => {
    document.getElementById("userStatus").innerText = "Logged Out";
  });
}

// AUTO USER DETECT
auth.onAuthStateChanged(user => {
  if(user && document.getElementById("userStatus")){
    document.getElementById("userStatus").innerText = "Logged in as: " + user.email;
  }
});


// ===== ROUTING =====
function navigate(page){
  const app = document.getElementById("app");

  if(page==="home"){
    app.innerHTML = `
      <section class="hero">
        <h1>Future of Finance Learning</h1>
        <p>Interactive tools + gamified investing education</p>

        <div class="auth-box glass">
          <h3>Login / Signup</h3>

          <input id="email" placeholder="Email">
          <input id="password" type="password" placeholder="Password">

          <button onclick="signup()">Sign Up</button>
          <button onclick="login()">Login</button>
          <button onclick="logout()">Logout</button>

          <p id="userStatus"></p>
        </div>
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

  if(page==="dashboard"){
    loadDashboard();
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


// ===== SIP CALCULATOR =====
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

  // SAVE USER SCORE (FINAL VERSION)
  const user = auth.currentUser;

  if(user){
    db.collection("users")
      .doc(user.uid)
      .collection("scores")
      .add({
        email: user.email,
        score: percent,
        level: level,
        time: new Date()
      });
  } else {
    alert("Login to save your progress");
  }
}


// ===== DASHBOARD =====
function loadDashboard(){
  const user = auth.currentUser;

  if(!user){
    document.getElementById("app").innerHTML = `
      <div class="tool-box glass">
        <h2>Please login first</h2>
      </div>
    `;
    return;
  }

  db.collection("users")
    .doc(user.uid)
    .collection("scores")
    .orderBy("time", "desc")
    .get()
    .then(snapshot => {

      let html = `
        <div class="tool-box glass">
          <h2>Your Quiz History</h2>
      `;

      if(snapshot.empty){
        html += `<p>No data yet. Take a quiz!</p>`;
      }

      snapshot.forEach(doc => {
        let d = doc.data();
        html += `
          <p>📊 Score: ${d.score}% | Level: ${d.level}</p>
        `;
      });

      html += `</div>`;

      document.getElementById("app").innerHTML = html;
    });
}


// INIT
navigate('home');
