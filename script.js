// ==============================
// SCROLL TO TOOLS
// ==============================
function scrollToTools() {
  const section = document.getElementById("tools");
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
}


// ==============================
// OPEN MODALS
// ==============================
function openModal(type) {
  closeModal(); // close any open modal first

  if (type === "sip") {
    document.getElementById("sipModal").style.display = "block";
  } 
  else if (type === "goal") {
    document.getElementById("goalModal").style.display = "block";
  } 
  else if (type === "save") {
    document.getElementById("saveModal").style.display = "block";
  }
}


// ==============================
// CLOSE MODALS
// ==============================
function closeModal() {
  const modals = document.querySelectorAll(".modal");
  modals.forEach(modal => {
    modal.style.display = "none";
  });
}


// ==============================
// CLOSE MODAL ON OUTSIDE CLICK
// ==============================
window.onclick = function(event) {
  const modals = document.querySelectorAll(".modal");
  modals.forEach(modal => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
};


// ==============================
// SIP CALCULATOR
// ==============================
function calculateSIP() {
  let P = parseFloat(document.getElementById("amount").value);
  let r = parseFloat(document.getElementById("rate").value) / 100 / 12;
  let n = parseFloat(document.getElementById("years").value) * 12;

  if (!P || !r || !n) {
    document.getElementById("result").innerText = "Please fill all fields";
    return;
  }

  let future = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);

  animateText("result", "Future Value: ₹" + Math.round(future));
}


// ==============================
// GOAL PLANNER
// ==============================
function calculateGoal() {
  let amount = parseFloat(document.getElementById("goalAmount").value);
  let years = parseFloat(document.getElementById("goalYears").value);

  if (!amount || !years) {
    document.getElementById("goalResult").innerText = "Fill all fields";
    return;
  }

  let monthly = amount / (years * 12);

  animateText("goalResult", "Save ₹" + Math.round(monthly) + " per month");
}


// ==============================
// SAVING TRACKER
// ==============================
function calculateSaving() {
  let income = parseFloat(document.getElementById("income").value);
  let expenses = parseFloat(document.getElementById("expenses").value);

  if (!income || !expenses) {
    document.getElementById("saveResult").innerText = "Fill all fields";
    return;
  }

  let saving = income - expenses;

  animateText("saveResult", "Monthly Saving: ₹" + saving);
}


// ==============================
// TEXT ANIMATION (TYPING EFFECT)
// ==============================
function animateText(elementId, text) {
  let el = document.getElementById(elementId);
  el.innerText = "";

  let i = 0;
  let speed = 20;

  let interval = setInterval(() => {
    el.innerText += text[i];
    i++;
    if (i >= text.length) clearInterval(interval);
  }, speed);
}
