// 🔥 YOUR REAL FIREBASE CONFIG (CORRECT)
const firebaseConfig = {
  apiKey: "AIzaSyAGuTnP1UVnOFF8yRD3_4TUF8tqjWaaVcI",
  authDomain: "wealthfy-59f90.firebaseapp.com",
  projectId: "wealthfy-59f90",
  storageBucket: "wealthfy-59f90.firebasestorage.app",
  messagingSenderId: "940910768179",
  appId: "1:940910768179:web:821b3734b71cb3fec3f346",
  measurementId: "G-49B6K014E8"
};

// 🔥 INITIALIZE FIREBASE
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

// ✅ SIGNUP
function signup(){
  auth.createUserWithEmailAndPassword(email.value, password.value)
    .then(()=>userStatus.innerText="Signup Successful ✅")
    .catch(err=>userStatus.innerText=err.message);
}

// ✅ LOGIN
function login(){
  auth.signInWithEmailAndPassword(email.value, password.value)
    .then(()=>userStatus.innerText="Login Successful 🚀")
    .catch(err=>userStatus.innerText=err.message);
}

// ✅ LOGOUT
function logout(){
  auth.signOut();
  userStatus.innerText="Logged Out";
}

// ✅ SIP CALCULATOR
function calc(){
  let P = +amount.value;
  let r = +rate.value/100/12;
  let n = +years.value*12;

  if(!P || !r || !n){
    result.innerText="Enter valid values";
    return;
  }

  let FV = P*((Math.pow(1+r,n)-1)/r)*(1+r);
  result.innerText = "Future Value ₹ " + Math.round(FV);
}

// ✅ POPUP
setTimeout(()=>{
  document.getElementById("popup").classList.add("show");
},3000);

function closePopup(){
  document.getElementById("popup").classList.remove("show");
}
