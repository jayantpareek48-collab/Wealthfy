const STARTING_BALANCE = 100000;
const TICK_MS = 1800;
const MAX_POINTS = 40;

const riskSettings = {
  easy: { volatility: 0.012, challengeTarget: 0.03 },
  medium: { volatility: 0.024, challengeTarget: 0.05 },
  hard: { volatility: 0.04, challengeTarget: 0.08 }
};

const stocks = [
  { symbol: "AAPL", name: "Apple", price: 186 },
  { symbol: "TSLA", name: "Tesla", price: 211 },
  { symbol: "RELIANCE", name: "Reliance", price: 2900 },
  { symbol: "INFY", name: "Infosys", price: 1460 },
  { symbol: "TCS", name: "TCS", price: 3880 },
  { symbol: "HDFCBANK", name: "HDFC Bank", price: 1655 }
].map((stock) => ({ ...stock, history: Array.from({ length: 20 }, () => stock.price) }));

const state = {
  playerName: "Guest Trader",
  mode: "practice",
  risk: "medium",
  cash: STARTING_BALANCE,
  holdings: {},
  initialBalance: STARTING_BALANCE,
  tradeCount: 0,
  newsImpact: null,
  challenge: null
};

const ui = {
  playerName: document.getElementById("playerName"),
  gameMode: document.getElementById("gameMode"),
  riskLevel: document.getElementById("riskLevel"),
  startGameBtn: document.getElementById("startGameBtn"),
  totalBalance: document.getElementById("totalBalance"),
  cashBalance: document.getElementById("cashBalance"),
  profitLoss: document.getElementById("profitLoss"),
  gameStateLabel: document.getElementById("gameStateLabel"),
  tickText: document.getElementById("tickText"),
  marketList: document.getElementById("marketList"),
  stockSelect: document.getElementById("stockSelect"),
  qtyInput: document.getElementById("qtyInput"),
  selectedStockPrice: document.getElementById("selectedStockPrice"),
  buyBtn: document.getElementById("buyBtn"),
  sellBtn: document.getElementById("sellBtn"),
  tradeMessage: document.getElementById("tradeMessage"),
  holdings: document.getElementById("holdings"),
  challengeText: document.getElementById("challengeText"),
  challengeProgress: document.getElementById("challengeProgress"),
  achievementWrap: document.getElementById("achievementWrap"),
  leaderboard: document.getElementById("leaderboard"),
  newsFeed: document.getElementById("newsFeed"),
  assistantChat: document.getElementById("assistantChat"),
  assistantInput: document.getElementById("assistantInput"),
  askAssistantBtn: document.getElementById("askAssistantBtn"),
  chart: document.getElementById("priceChart")
};

const achievements = [
  { id: "first_trade", label: "First Trade", unlocked: false },
  { id: "profit_5", label: "5% Profit Club", unlocked: false },
  { id: "diversified", label: "Diversifier", unlocked: false },
  { id: "quick_hands", label: "5 Trades Completed", unlocked: false }
];

const newsTemplates = [
  { text: "AI chip demand spikes globally", direction: "up" },
  { text: "EV subsidy cut announced", direction: "down" },
  { text: "Strong quarterly earnings season", direction: "up" },
  { text: "Interest rate fears hit markets", direction: "down" },
  { text: "Government infra push boosts sentiment", direction: "up" },
  { text: "Supply chain bottlenecks return", direction: "down" }
];

function formatINR(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);
}

function getSelectedStock() {
  return stocks.find((stock) => stock.symbol === ui.stockSelect.value) || stocks[0];
}

function computeHoldingsValue() {
  return Object.entries(state.holdings).reduce((total, [symbol, holding]) => {
    const stock = stocks.find((item) => item.symbol === symbol);
    if (!stock) return total;
    return total + holding.qty * stock.price;
  }, 0);
}

function getTotalBalance() {
  return state.cash + computeHoldingsValue();
}

function playTradeSound(type) {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;
  const context = new AudioCtx();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = "triangle";
  oscillator.frequency.value = type === "buy" ? 680 : 420;
  gain.gain.value = 0.06;
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.12);
}

function addMessage(text, isUser = false) {
  const div = document.createElement("div");
  div.className = isUser ? "user-msg" : "bot-msg";
  div.textContent = text;
  ui.assistantChat.appendChild(div);
  ui.assistantChat.scrollTop = ui.assistantChat.scrollHeight;
}

function updateAssistantReply(inputText) {
  const q = inputText.toLowerCase();
  const stock = getSelectedStock();
  const riskHint =
    state.risk === "easy"
      ? "Focus on smaller position sizes and steady moves."
      : state.risk === "medium"
      ? "Diversify across 2-3 stocks and set simple targets."
      : "Hard mode is volatile, so avoid overtrading.";

  if (q.includes("buy")) {
    return `For beginners: buy only if you understand why. ${stock.name} is currently ${formatINR(
      stock.price
    )}. Start with small quantity and review news first.`;
  }
  if (q.includes("sell")) {
    return "Sell when your thesis changes, not just because of one red tick. Lock profits gradually.";
  }
  if (q.includes("risk")) {
    return riskHint;
  }
  if (q.includes("first")) {
    return "Step 1: Pick practice mode. Step 2: Buy 1-2 stocks. Step 3: Watch how news impacts prices.";
  }
  return "Keep it simple: diversify, avoid panic trades, and track profit/loss after every move.";
}

function renderMarket() {
  ui.marketList.innerHTML = "";
  stocks.forEach((stock) => {
    const previous = stock.history[stock.history.length - 2] ?? stock.price;
    const changePct = ((stock.price - previous) / previous) * 100;
    const row = document.createElement("div");
    row.className = "market-row";
    row.innerHTML = `
      <strong>${stock.symbol}</strong>
      <span>${formatINR(stock.price)}</span>
      <span class="${changePct >= 0 ? "gain" : "loss"}">${changePct >= 0 ? "+" : ""}${changePct.toFixed(2)}%</span>
    `;
    ui.marketList.appendChild(row);
  });
}

function renderStockSelect() {
  ui.stockSelect.innerHTML = stocks
    .map((stock) => `<option value="${stock.symbol}">${stock.symbol} - ${stock.name}</option>`)
    .join("");
  refreshSelectedStockPrice();
}

function refreshSelectedStockPrice() {
  const stock = getSelectedStock();
  ui.selectedStockPrice.textContent = formatINR(stock.price);
}

function renderHoldings() {
  const entries = Object.entries(state.holdings).filter(([, holding]) => holding.qty > 0);
  if (!entries.length) {
    ui.holdings.innerHTML = `<p class="muted">No holdings yet. Place your first trade.</p>`;
    return;
  }
  ui.holdings.innerHTML = "";
  entries.forEach(([symbol, holding]) => {
    const stock = stocks.find((item) => item.symbol === symbol);
    const currentValue = stock.price * holding.qty;
    const pnl = currentValue - holding.avgPrice * holding.qty;
    const row = document.createElement("div");
    row.className = "holding-row";
    row.innerHTML = `
      <strong>${symbol}</strong>
      <span>Qty: ${holding.qty}</span>
      <span>Avg: ${formatINR(holding.avgPrice)}</span>
      <span>Value: ${formatINR(currentValue)}</span>
      <span class="${pnl >= 0 ? "gain" : "loss"}">P/L: ${formatINR(pnl)}</span>
    `;
    ui.holdings.appendChild(row);
  });
}

function renderStats() {
  const totalBalance = getTotalBalance();
  const pnl = totalBalance - state.initialBalance;
  ui.totalBalance.textContent = formatINR(totalBalance);
  ui.cashBalance.textContent = formatINR(state.cash);
  ui.profitLoss.textContent = formatINR(pnl);
  ui.profitLoss.className = `value ${pnl >= 0 ? "gain" : "loss"}`;
  ui.gameStateLabel.textContent = `${state.risk.toUpperCase()} | ${state.mode.toUpperCase()}`;
}

function drawChart() {
  const stock = getSelectedStock();
  const ctx = ui.chart.getContext("2d");
  if (!ctx) return;
  const w = ui.chart.width;
  const h = ui.chart.height;
  const values = stock.history.slice(-MAX_POINTS);
  const min = Math.min(...values) * 0.98;
  const max = Math.max(...values) * 1.02;
  const range = max - min || 1;

  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#f8fbff";
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = "#d5e6fb";
  ctx.lineWidth = 1;
  for (let i = 0; i < 4; i += 1) {
    const y = (h / 4) * i;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  ctx.beginPath();
  values.forEach((price, idx) => {
    const x = (idx / (values.length - 1 || 1)) * (w - 30) + 15;
    const y = h - ((price - min) / range) * (h - 30) - 15;
    if (idx === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.strokeStyle = "#1a73e8";
  ctx.lineWidth = 2.4;
  ctx.stroke();
}

function renderLeaderboard() {
  const baseScore = getTotalBalance();
  const bots = [
    { name: "BullRider", score: Math.round(baseScore * (0.94 + Math.random() * 0.08)) },
    { name: "ValueSeeker", score: Math.round(baseScore * (0.92 + Math.random() * 0.1)) },
    { name: "MomentumMax", score: Math.round(baseScore * (0.9 + Math.random() * 0.13)) },
    { name: "SafeHands", score: Math.round(baseScore * (0.93 + Math.random() * 0.09)) }
  ];
  const list = [{ name: state.playerName, score: Math.round(baseScore) }, ...bots].sort(
    (a, b) => b.score - a.score
  );

  ui.leaderboard.innerHTML = "";
  list.forEach((entry) => {
    const li = document.createElement("li");
    li.className = "board-row";
    li.innerHTML = `<strong>${entry.name}</strong><span>${formatINR(entry.score)}</span>`;
    ui.leaderboard.appendChild(li);
  });
}

function renderAchievements() {
  ui.achievementWrap.innerHTML = "";
  achievements.forEach((item) => {
    const span = document.createElement("span");
    span.className = `badge ${item.unlocked ? "unlocked" : ""}`;
    span.textContent = item.label;
    ui.achievementWrap.appendChild(span);
  });
}

function refreshAchievements() {
  const pnlPct = (getTotalBalance() - state.initialBalance) / state.initialBalance;
  const activeHoldings = Object.values(state.holdings).filter((holding) => holding.qty > 0).length;
  achievements.find((a) => a.id === "first_trade").unlocked = state.tradeCount >= 1;
  achievements.find((a) => a.id === "quick_hands").unlocked = state.tradeCount >= 5;
  achievements.find((a) => a.id === "diversified").unlocked = activeHoldings >= 3;
  achievements.find((a) => a.id === "profit_5").unlocked = pnlPct >= 0.05;
  renderAchievements();
}

function setChallenge() {
  const target = riskSettings[state.risk].challengeTarget;
  state.challenge = {
    target,
    text: `Mission: Make ${(target * 100).toFixed(0)}% profit today.`,
    done: false
  };
  ui.challengeText.textContent = state.challenge.text;
}

function refreshChallenge() {
  const progress = ((getTotalBalance() - state.initialBalance) / state.initialBalance) * 100;
  ui.challengeProgress.textContent = `Progress: ${progress.toFixed(2)}%`;
  if (!state.challenge.done && progress >= state.challenge.target * 100) {
    state.challenge.done = true;
    ui.challengeProgress.textContent = `Completed! Progress: ${progress.toFixed(2)}%`;
    ui.tradeMessage.textContent = "Daily mission complete! Badge momentum boosted.";
  }
}

function addNewsEvent() {
  const template = newsTemplates[Math.floor(Math.random() * newsTemplates.length)];
  const target = stocks[Math.floor(Math.random() * stocks.length)];
  const impactMagnitude = 0.018 + Math.random() * 0.03;
  const signedImpact = template.direction === "up" ? impactMagnitude : -impactMagnitude;
  state.newsImpact = { symbol: target.symbol, drift: signedImpact, ticksLeft: 3 };
  const item = document.createElement("div");
  item.className = "news-item";
  item.innerHTML = `<strong>${target.symbol}</strong>: ${template.text} (${signedImpact > 0 ? "+" : ""}${(
    signedImpact * 100
  ).toFixed(1)}%)`;
  ui.newsFeed.prepend(item);
  while (ui.newsFeed.children.length > 6) {
    ui.newsFeed.removeChild(ui.newsFeed.lastChild);
  }
}

function tickPrices() {
  const volatility = riskSettings[state.risk].volatility;
  stocks.forEach((stock) => {
    const randomMove = (Math.random() - 0.5) * volatility;
    let drift = 0;
    if (state.newsImpact && state.newsImpact.symbol === stock.symbol && state.newsImpact.ticksLeft > 0) {
      drift = state.newsImpact.drift;
    }
    const change = randomMove + drift;
    stock.price = Math.max(5, stock.price * (1 + change));
    stock.history.push(stock.price);
    if (stock.history.length > MAX_POINTS) stock.history.shift();
  });
  if (state.newsImpact && state.newsImpact.ticksLeft > 0) {
    state.newsImpact.ticksLeft -= 1;
  }
  if (Math.random() < 0.22) {
    addNewsEvent();
  }
  ui.tickText.textContent = `Live tick: ${new Date().toLocaleTimeString()}`;
  renderMarket();
  refreshSelectedStockPrice();
  renderHoldings();
  renderStats();
  refreshChallenge();
  refreshAchievements();
  drawChart();
  if (state.mode === "competitive") {
    renderLeaderboard();
  }
}

function handleTrade(type) {
  const stock = getSelectedStock();
  const qty = Number(ui.qtyInput.value);
  if (!Number.isInteger(qty) || qty <= 0) {
    ui.tradeMessage.textContent = "Enter a valid quantity.";
    return;
  }
  const cost = stock.price * qty;
  const currentHolding = state.holdings[stock.symbol] || { qty: 0, avgPrice: 0 };

  if (type === "buy") {
    if (cost > state.cash) {
      ui.tradeMessage.textContent = "Not enough cash for this order.";
      return;
    }
    const newQty = currentHolding.qty + qty;
    const newAvg = (currentHolding.qty * currentHolding.avgPrice + cost) / newQty;
    state.holdings[stock.symbol] = { qty: newQty, avgPrice: newAvg };
    state.cash -= cost;
    ui.tradeMessage.textContent = `Bought ${qty} ${stock.symbol} at ${formatINR(stock.price)}.`;
  } else {
    if (currentHolding.qty < qty) {
      ui.tradeMessage.textContent = "You do not have enough shares to sell.";
      return;
    }
    currentHolding.qty -= qty;
    state.cash += cost;
    state.holdings[stock.symbol] = currentHolding;
    ui.tradeMessage.textContent = `Sold ${qty} ${stock.symbol} at ${formatINR(stock.price)}.`;
  }

  state.tradeCount += 1;
  playTradeSound(type);
  renderHoldings();
  renderStats();
  refreshChallenge();
  refreshAchievements();
  if (state.mode === "competitive") {
    renderLeaderboard();
  }
}

function resetGame() {
  state.playerName = ui.playerName.value.trim() || "Guest Trader";
  state.mode = ui.gameMode.value;
  state.risk = ui.riskLevel.value;
  state.cash = STARTING_BALANCE;
  state.holdings = {};
  state.initialBalance = STARTING_BALANCE;
  state.tradeCount = 0;
  achievements.forEach((a) => {
    a.unlocked = false;
  });
  setChallenge();
  ui.newsFeed.innerHTML = "";
  ui.tradeMessage.textContent = "New game started. Analyze first, then trade.";
  renderStats();
  renderHoldings();
  renderAchievements();
  renderLeaderboard();
  addMessage(
    `New ${state.mode} session started on ${state.risk} risk. You have ${formatINR(
      STARTING_BALANCE
    )}.`,
    false
  );
}

ui.stockSelect.addEventListener("change", () => {
  refreshSelectedStockPrice();
  drawChart();
});
ui.buyBtn.addEventListener("click", () => handleTrade("buy"));
ui.sellBtn.addEventListener("click", () => handleTrade("sell"));
ui.startGameBtn.addEventListener("click", resetGame);
ui.askAssistantBtn.addEventListener("click", () => {
  const question = ui.assistantInput.value.trim();
  if (!question) return;
  addMessage(question, true);
  ui.assistantInput.value = "";
  setTimeout(() => {
    addMessage(updateAssistantReply(question), false);
  }, 350);
});
ui.assistantInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    ui.askAssistantBtn.click();
  }
});

renderStockSelect();
setChallenge();
renderMarket();
renderHoldings();
renderStats();
renderAchievements();
renderLeaderboard();
drawChart();
setInterval(tickPrices, TICK_MS);
