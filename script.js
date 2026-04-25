// Scroll to tools
function scrollToTools() {
  document.getElementById("tools").scrollIntoView({ behavior: "smooth" });
}

// Open modal
function openModal(type) {
  if (type === "sip") {
    document.getElementById("sipModal").style.display = "block";
  } else {
    alert("Coming Soon 🚀");
  }
}

// Close modal
function closeModal() {
  document.getElementById("sipModal").style.display = "none";
}

// SIP Calculation
function calculateSIP() {
  let P = parseFloat(document.getElementById("amount").value);
  let r = parseFloat(document.getElementById("rate").value) / 100 / 12;
  let n = parseFloat(document.getElementById("years").value) * 12;

  if (!P || !r || !n) {
    document.getElementById("result").innerText = "Please fill all fields";
    return;
  }

  let future = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);

  let resultText = "Future Value: ₹" + Math.round(future);

  animateResult(resultText);
}

// Animate result
function animateResult(text) {
  let el = document.getElementById("result");
  el.innerText = "";
  let i = 0;

  let interval = setInterval(() => {
    el.innerText += text[i];
    i++;
    if (i >= text.length) clearInterval(interval);
  }, 20);
}
