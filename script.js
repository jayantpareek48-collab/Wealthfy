// Lottie Animation
lottie.loadAnimation({
  container: document.getElementById("animation"),
  renderer: "svg",
  loop: true,
  autoplay: true,
  path: "https://assets2.lottiefiles.com/packages/lf20_qp1q7mct.json"
});

// Scroll
function scrollToTools() {
  document.getElementById("tools").scrollIntoView({ behavior: "smooth" });
}

// Open Tool
function openTool(id) {
  document.getElementById("toolSection").style.display = "block";

  document.querySelectorAll(".tool").forEach(t => t.style.display = "none");

  document.getElementById(id).style.display = "block";
}

// Close Tool
function closeTool() {
  document.getElementById("toolSection").style.display = "none";
}

// Chart
let chart = new Chart(document.getElementById("chart"), {
  type: "line",
  data: { labels: [], datasets: [{ label: "₹ Growth", data: [] }] }
});

// SIP
function calcSIP() {
  let P = +sipAmount.value;
  let r = +sipRate.value / 100 / 12;
  let n = +sipYears.value * 12;

  let total = 0, data = [];

  for (let i = 1; i <= n; i++) {
    total = (total + P) * (1 + r);
    data.push(Math.round(total));
  }

  chart.data.labels = data.map((_, i) => i + 1);
  chart.data.datasets[0].data = data;
  chart.update();

  sipResult.innerText = "Future Value: ₹ " + Math.round(total);
}

// Goal
function calcGoal() {
  let goal = +goalAmount.value;
  let years = +goalYears.value;

  let monthly = goal / (years * 12);

  goalResult.innerText = "Monthly SIP Needed: ₹ " + Math.round(monthly);

  chart.data.labels = ["Goal"];
  chart.data.datasets[0].data = [goal];
  chart.update();
}

// Saving
function calcSaving() {
  let save = income.value - expense.value;

  savingResult.innerText = "Monthly Saving: ₹ " + save;

  chart.data.labels = ["Saving"];
  chart.data.datasets[0].data = [save];
  chart.update();
}
