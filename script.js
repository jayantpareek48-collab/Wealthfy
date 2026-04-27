// ================= SIP CALCULATOR =================
function calculateSIP() {
    let P = parseFloat(document.getElementById("sipAmount").value);
    let r = parseFloat(document.getElementById("sipRate").value) / 100 / 12;
    let n = parseFloat(document.getElementById("sipTime").value) * 12;

    if (!P || !r || !n) {
        alert("Please enter valid inputs");
        return;
    }

    let futureValue = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    let invested = P * n;
    let gain = futureValue - invested;

    document.getElementById("sipResult").innerText =
        `Invested: ₹${invested.toFixed(0)} | Wealth: ₹${futureValue.toFixed(0)} | Gain: ₹${gain.toFixed(0)}`;
}

// ================= SAVINGS GRAPH =================
let chart;

function generateGraph() {
    let amount = parseFloat(document.getElementById("saveAmount").value);
    let years = parseFloat(document.getElementById("saveYears").value);

    if (!amount || !years) {
        alert("Enter valid data");
        return;
    }

    let data = [];
    let labels = [];
    let total = 0;

    for (let i = 1; i <= years * 12; i++) {
        total += amount;
        data.push(total);
        labels.push(`M${i}`);
    }

    if (chart) chart.destroy();

    let ctx = document.getElementById("chartCanvas").getContext("2d");

    chart = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: "Savings Growth",
                data: data,
                borderWidth: 3,
                tension: 0.4
            }]
        },
        options: {
            responsive: true
        }
    });
}

// ================= QUIZ =================
const questions = [
    { q: "What is SIP?", a: "investment" },
    { q: "Inflation means?", a: "price increase" },
    { q: "FD stands for?", a: "fixed deposit" },
    { q: "Stock market is?", a: "trading" },
    { q: "Risk means?", a: "uncertainty" }
];

function loadQuiz() {
    let container = document.getElementById("quizContainer");
    container.innerHTML = "";

    questions.forEach((q, i) => {
        container.innerHTML += `
            <p>${i+1}. ${q.q}</p>
            <input type="text" id="q${i}" class="input">
        `;
    });
}

function submitQuiz() {
    let score = 0;

    questions.forEach((q, i) => {
        let ans = document.getElementById(`q${i}`).value.toLowerCase();
        if (ans.includes(q.a)) score++;
    });

    let percent = (score / questions.length) * 100;

    let result = document.getElementById("quizResult");

    if (percent > 70) {
        result.innerText = `Passed 🎉 (${percent}%)`;
        confetti();
    } else {
        result.innerText = `Try Again ❌ (${percent}%)`;
    }
}

// ================= CONFETTI =================
function confetti() {
    for (let i = 0; i < 50; i++) {
        let div = document.createElement("div");
        div.style.position = "fixed";
        div.style.width = "5px";
        div.style.height = "5px";
        div.style.background = "#00F5FF";
        div.style.top = Math.random() * window.innerHeight + "px";
        div.style.left = Math.random() * window.innerWidth + "px";
        document.body.appendChild(div);

        setTimeout(() => div.remove(), 2000);
    }
}

// INIT
loadQuiz();
