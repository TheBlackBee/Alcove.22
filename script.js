// Default chore points
const DEFAULT_CHORES = {
  "Make bed": 5,
  "Feed pet": 5,
  "Take out trash": 10,
  "Clean bathroom": 20,
  "Wash dishes": 15,
  "Clean kitchen": 20,
  "Wipe counters": 5,
  "Clean refrigerator": 15,
  "Organize pantry": 10,
  "Vacuum": 15,
  "Laundry": 20,
  "Mow lawn": 30,
  "Dust furniture": 10,
  "Clean windows": 15,
  "Sweep floors": 10,
  "Mop floors": 15,
  "Clean microwave": 10,
  "Water plants": 5,
  "Sort recycling": 10,
  "Clean doorknobs": 5,
  "Organize closet": 20,
  "Clean mirrors": 10,
  "Empty dishwasher": 10,
  "Change bedsheets": 15
};

// Default rewards
const DEFAULT_REWARDS = [
  { name: "30 minutes of screen time", cost: 20 },
  { name: "Choose dinner", cost: 50 },
  { name: "Movie night", cost: 100 },
  { name: "New small toy", cost: 200 },
  { name: "Trip to ice cream shop", cost: 150 }
];

// Default stocks
const DEFAULT_STOCKS = [
  {
    symbol: "KIDY", 
    name: "Kiddy Toys Inc.", 
    description: "Toy manufacturer for children",
    price: 10,
    history: [],
    volatility: 0.15 // 15% price fluctuation
  },
  {
    symbol: "GAMR", 
    name: "Game World", 
    description: "Video game development company",
    price: 25,
    history: [],
    volatility: 0.3 // 30% price fluctuation (higher risk, higher reward)
  },
  {
    symbol: "CHOC", 
    name: "Chocolate Factory", 
    description: "Premium chocolate producer",
    price: 8,
    history: [],
    volatility: 0.1 // 10% price fluctuation (stable)
  },
  {
    symbol: "TECH", 
    name: "Tech Innovators", 
    description: "Technology and gadget company",
    price: 50,
    history: [],
    volatility: 0.25 // 25% price fluctuation
  },
  {
    symbol: "PETS", 
    name: "Happy Pets", 
    description: "Pet food and supplies retailer",
    price: 15,
    history: [],
    volatility: 0.12 // 12% price fluctuation
  },
  {
    symbol: "BOOK", 
    name: "Book Worms Ltd", 
    description: "Book publisher and retailer",
    price: 12,
    history: [],
    volatility: 0.08 // 8% price fluctuation (very stable)
  }
];

// Market status options
const MARKET_STATUSES = [
  { status: "bullish", trendMin: 0.05, trendMax: 0.15 },
  { status: "stable", trendMin: -0.03, trendMax: 0.03 },
  { status: "volatile", trendMin: -0.1, trendMax: 0.1 },
  { status: "bearish", trendMin: -0.15, trendMax: -0.05 }
];

// Initialize app data from localStorage or with defaults
let appData = JSON.parse(localStorage.getItem('homeManagementApp')) || {
  users: {},
  chores: DEFAULT_CHORES,
  rewards: DEFAULT_REWARDS,
  stocks: DEFAULT_STOCKS.map(stock => ({ 
    ...stock, 
    history: [{ price: stock.price, timestamp: new Date().toISOString() }]
  })),
  market: {
    status: "stable",
    trend: 0,
    lastUpdate: new Date().toISOString()
  },
  teams: [],
  teamChores: {},
  teamChat: {}
};

// Current selected user
let currentUser = null;

// Function to update localStorage with current app data
function saveData() {
  localStorage.setItem('homeManagementApp', JSON.stringify(appData));
}

// Function to format date as readable string
function formatDate(date) {
  return new Date(date).toLocaleString();
}

// Function to show a specific tab
function showTab(tabId) {
  // Hide all tabs
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Show selected tab
  document.getElementById(tabId).classList.add('active');
  
  // Update active tab button
  document.querySelectorAll('.tab-button').forEach(button => {
    button.classList.remove('active');
    if (button.dataset.tab === tabId) {
      button.classList.add('active');
    }
  });
}

// Function to toggle modal visibility
function toggleModal(modalId, show = true) {
  const modal = document.getElementById(modalId);
  const backdrop = document.getElementById('modal-backdrop');
  
  if (show) {
    modal.classList.remove('hidden');
    modal.classList.add('active');
    backdrop.classList.remove('hidden');
  } else {
    modal.classList.add('hidden');
    modal.classList.remove('active');
    backdrop.classList.add('hidden');
  }
}

// Function to update the list of users in dropdown
function updateUserDropdown() {
  const userSelect = document.getElementById('username');
  const users = Object.keys(appData.users);
  
  // Remember selected user
  const selectedUser = userSelect.value;
  
  // Clear dropdown
  userSelect.innerHTML = '<option value="">Select your name</option>';
  
  // Add users to dropdown
  users.forEach(user => {
    const option = document.createElement('option');
    option.value = user;
    option.textContent = user;
    userSelect.appendChild(option);
  });
  
  // Restore selected user if still exists
  if (users.includes(selectedUser)) {
    userSelect.value = selectedUser;
  }
}

// Function to update chore select dropdown
function updateChoreDropdown() {
  const choreSelect = document.getElementById('chore-select');
  
  // Clear dropdown
  choreSelect.innerHTML = '';
  
  // Add chores to dropdown
  Object.entries(appData.chores).forEach(([chore, points]) => {
    const option = document.createElement('option');
    option.value = chore;
    option.textContent = `${chore} (${points} pts)`;
    choreSelect.appendChild(option);
  });
}

// Function to submit a completed chore
function submitChore() {
  const username = document.getElementById('username').value;
  const chore = document.getElementById('chore-select').value;
  
  if (!username) {
    alert('Please select a user first!');
    return;
  }
  
  if (!chore) {
    alert('Please select a chore!');
    return;
  }
  
  currentUser = username;
  const points = appData.chores[chore];
  const timestamp = new Date().toISOString();
  
  // Update user data
  if (!appData.users[username]) {
    appData.users[username] = {
      points: 0,
      bank: 0,
      chores: [],
      rewards: [],
      transactions: [],
      portfolio: [],
      trades: [],
      teams: [] // Teams the user belongs to
    };
  }
  
  // Add chore to user's history
  appData.users[username].chores.push({
    chore,
    points,
    timestamp
  });
  
  // Add points to user's balance
  appData.users[username].points += points;
  
  // Add transaction record
  appData.users[username].transactions.push({
    type: 'chore',
    description: `Completed: ${chore}`,
    amount: points,
    timestamp
  });
  
  // Save data
  saveData();
  
  // Update UI
  addToChoreLog(username, chore, points, timestamp);
  updateUserStats(username);
  updateLeaderboard();
  updateBankAccount(username);
}

// Function to add entry to the chore log
function addToChoreLog(user, chore, points, timestamp) {
  const log = document.getElementById('chore-log');
  const li = document.createElement('li');
  li.textContent = `${user} did "${chore}" for ${points} points - ${formatDate(timestamp)}`;
  
  // Add new entries at the top
  if (log.firstChild) {
    log.insertBefore(li, log.firstChild);
  } else {
    log.appendChild(li);
  }
}

// Function to update specific user's stats
function updateUserStats(username) {
  const statsDiv = document.getElementById('user-stats');
  const userData = appData.users[username];
  
  if (!userData) {
    statsDiv.innerHTML = '<p>Select a user to see their stats</p>';
    return;
  }
  
  let recentChores = '';
  const lastThreeChores = [...userData.chores].reverse().slice(0, 3);
  
  if (lastThreeChores.length === 0) {
    recentChores = '<p>No chores completed yet</p>';
  } else {
    recentChores = '<ul>';
    lastThreeChores.forEach(c => {
      recentChores += `<li>${c.chore} (${c.points} pts) - ${formatDate(c.timestamp)}</li>`;
    });
    recentChores += '</ul>';
  }
  
  statsDiv.innerHTML = `
    <h3>${username}'s Stats</h3>
    <p>Available Points: <strong>${userData.points}</strong></p>
    <p>Bank Balance: <strong>${userData.bank}</strong></p>
    <p>Total Chores: <strong>${userData.chores.length}</strong></p>
    <p>Rewards Redeemed: <strong>${userData.rewards.length}</strong></p>
    <h4>Recent Chores:</h4>
    ${recentChores}
    <div class="actions">
      <button id="deposit-btn">Deposit to Bank</button>
      <button id="withdraw-btn">Withdraw from Bank</button>
    </div>
  `;
  
  // Add event listeners for bank actions
  document.getElementById('deposit-btn').addEventListener('click', () => {
    const amount = prompt(`How many points would you like to deposit? (Available: ${userData.points})`);
    if (amount) {
      depositToBank(username, parseInt(amount, 10));
    }
  });
  
  document.getElementById('withdraw-btn').addEventListener('click', () => {
    const amount = prompt(`How many points would you like to withdraw? (Available: ${userData.bank})`);
    if (amount) {
      withdrawFromBank(username, parseInt(amount, 10));
    }
  });
}

// Function to update the leaderboard
function updateLeaderboard() {
  const leaderboard = document.getElementById('leaderboard');
  leaderboard.innerHTML = '';
  
  // Convert users object to array and sort by total points
  const sortedUsers = Object.entries(appData.users)
    .map(([name, data]) => ({ 
      name, 
      totalPoints: data.points + data.bank,
      bankPoints: data.bank,
      spendablePoints: data.points
    }))
    .sort((a, b) => b.totalPoints - a.totalPoints);
  
  if (sortedUsers.length === 0) {
    leaderboard.innerHTML = '<p>No users yet</p>';
    return;
  }
  
  sortedUsers.forEach((user, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${user.name}</strong> - ${user.totalPoints} total points 
      <span class="details">(${user.spendablePoints} available, ${user.bankPoints} in bank)</span>
    `;
    leaderboard.appendChild(li);
  });
}

// Function to update rewards display
function updateRewards() {
  const rewardsContainer = document.getElementById('rewards-container');
  const purchasedRewards = document.getElementById('purchased-rewards');
  
  // Clear containers
  rewardsContainer.innerHTML = '';
  
  if (!currentUser || !appData.users[currentUser]) {
    rewardsContainer.innerHTML = '<p>Select a user first to see available rewards</p>';
    purchasedRewards.innerHTML = '<p>No rewards purchased yet</p>';
    return;
  }
  
  const userData = appData.users[currentUser];
  
  // Display available rewards
  appData.rewards.forEach(reward => {
    const rewardCard = document.createElement('div');
    rewardCard.className = 'reward-card';
    rewardCard.innerHTML = `
      <div>
        <h3>${reward.name}</h3>
      </div>
      <div class="reward-actions">
        <span class="reward-points">${reward.cost} pts</span>
        <button class="purchase-btn" data-reward="${reward.name}" data-cost="${reward.cost}">
          Purchase
        </button>
      </div>
    `;
    rewardsContainer.appendChild(rewardCard);
  });
  
  // Add event listeners to purchase buttons
  document.querySelectorAll('.purchase-btn').forEach(button => {
    button.addEventListener('click', () => {
      const rewardName = button.dataset.reward;
      const cost = parseInt(button.dataset.cost, 10);
      purchaseReward(currentUser, rewardName, cost);
    });
  });
  
  // Display user's purchased rewards
  if (userData.rewards && userData.rewards.length > 0) {
    purchasedRewards.innerHTML = '<ul>';
    userData.rewards.forEach(reward => {
      purchasedRewards.innerHTML += `
        <li>
          <div class="transaction">
            <div>
              <strong>${reward.name}</strong>
              <p>${formatDate(reward.timestamp)}</p>
            </div>
            <div class="transaction-amount negative">-${reward.cost} pts</div>
          </div>
        </li>
      `;
    });
    purchasedRewards.innerHTML += '</ul>';
  } else {
    purchasedRewards.innerHTML = '<p>No rewards purchased yet</p>';
  }
}

// Function to purchase a reward
function purchaseReward(username, rewardName, cost) {
  const userData = appData.users[username];
  
  if (userData.points < cost) {
    alert(`Not enough points! You have ${userData.points} but need ${cost}.`);
    return;
  }
  
  // Deduct points
  userData.points -= cost;
  
  // Record the purchase
  userData.rewards.push({
    name: rewardName,
    cost,
    timestamp: new Date().toISOString()
  });
  
  // Add transaction record
  userData.transactions.push({
    type: 'purchase',
    description: `Purchased: ${rewardName}`,
    amount: -cost,
    timestamp: new Date().toISOString()
  });
  
  // Save data
  saveData();
  
  // Update UI
  updateUserStats(username);
  updateRewards();
  alert(`You purchased "${rewardName}" for ${cost} points!`);
}

// Function to update bank account display
function updateBankAccount(username) {
  const bankAccountDiv = document.getElementById('bank-account');
  const transactionsDiv = document.getElementById('transactions');
  
  if (!username || !appData.users[username]) {
    bankAccountDiv.innerHTML = '<p>Select a user to see their bank account</p>';
    transactionsDiv.innerHTML = '<p>No transactions yet</p>';
    return;
  }
  
  const userData = appData.users[username];
  
  // Display account balance
  bankAccountDiv.innerHTML = `
    <div class="balance">${userData.bank} points</div>
    <p>Available for spending: ${userData.points} points</p>
    <div class="interest-info">
      <p>Interest rate: 5% per week</p>
      <p>Next interest payment: Sunday</p>
    </div>
  `;
  
  // Display transactions
  if (userData.transactions && userData.transactions.length > 0) {
    transactionsDiv.innerHTML = '';
    
    // Sort transactions by date (newest first)
    const sortedTransactions = [...userData.transactions]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    sortedTransactions.forEach(transaction => {
      const isPositive = transaction.amount > 0;
      
      transactionsDiv.innerHTML += `
        <div class="transaction">
          <div>
            <strong>${transaction.description}</strong>
            <p>${formatDate(transaction.timestamp)}</p>
          </div>
          <div class="transaction-amount ${isPositive ? 'positive' : 'negative'}">
            ${isPositive ? '+' : ''}${transaction.amount} pts
          </div>
        </div>
      `;
    });
  } else {
    transactionsDiv.innerHTML = '<p>No transactions yet</p>';
  }
}

// Function to deposit points to bank
function depositToBank(username, amount) {
  const userData = appData.users[username];
  
  if (isNaN(amount) || amount <= 0) {
    alert('Please enter a valid amount');
    return;
  }
  
  if (amount > userData.points) {
    alert(`Not enough points. You only have ${userData.points} available.`);
    return;
  }
  
  // Transfer points from available to bank
  userData.points -= amount;
  userData.bank += amount;
  
  // Record transaction
  userData.transactions.push({
    type: 'deposit',
    description: 'Deposit to bank',
    amount: amount,
    timestamp: new Date().toISOString()
  });
  
  // Save data
  saveData();
  
  // Update UI
  updateUserStats(username);
  updateBankAccount(username);
  updateLeaderboard();
  
  alert(`Successfully deposited ${amount} points to your bank!`);
}

// Function to withdraw points from bank
function withdrawFromBank(username, amount) {
  const userData = appData.users[username];
  
  if (isNaN(amount) || amount <= 0) {
    alert('Please enter a valid amount');
    return;
  }
  
  if (amount > userData.bank) {
    alert(`Not enough points in bank. You only have ${userData.bank} in your bank.`);
    return;
  }
  
  // Transfer points from bank to available
  userData.bank -= amount;
  userData.points += amount;
  
  // Record transaction
  userData.transactions.push({
    type: 'withdrawal',
    description: 'Withdraw from bank',
    amount: amount,
    timestamp: new Date().toISOString()
  });
  
  // Save data
  saveData();
  
  // Update UI
  updateUserStats(username);
  updateBankAccount(username);
  updateLeaderboard();
  
  alert(`Successfully withdrew ${amount} points from your bank!`);
}

// Function to add a new user
function addNewUser() {
  const newUserName = document.getElementById('new-user-name').value.trim();
  
  if (!newUserName) {
    alert('Please enter a name');
    return;
  }
  
  if (appData.users[newUserName]) {
    alert('This user already exists');
    return;
  }
  
  // Create new user
  appData.users[newUserName] = {
    points: 0,
    bank: 0,
    chores: [],
    rewards: [],
    transactions: [],
    portfolio: [],
    trades: [],
    teams: []
  };
  
  // Save data
  saveData();
  
  // Update UI
  updateUserDropdown();
  document.getElementById('username').value = newUserName;
  currentUser = newUserName;
  updateUserStats(newUserName);
  updateBankAccount(newUserName);
  updateRewards();
  
  // Close modal
  toggleModal('add-user-modal', false);
  document.getElementById('new-user-name').value = '';
}

// Function to add a custom chore
function addCustomChore() {
  const choreName = document.getElementById('new-chore-name').value.trim();
  const chorePoints = parseInt(document.getElementById('new-chore-points').value, 10);
  
  if (!choreName) {
    alert('Please enter a chore name');
    return;
  }
  
  if (isNaN(chorePoints) || chorePoints <= 0) {
    alert('Please enter a valid point value');
    return;
  }
  
  // Add new chore
  appData.chores[choreName] = chorePoints;
  
  // Save data
  saveData();
  
  // Update UI
  updateChoreDropdown();
  
  // Close modal
  toggleModal('add-chore-modal', false);
  document.getElementById('new-chore-name').value = '';
  document.getElementById('new-chore-points').value = '';
}

// Function to add a new reward
function addNewReward() {
  const rewardName = document.getElementById('new-reward-name').value.trim();
  const rewardCost = parseInt(document.getElementById('new-reward-cost').value, 10);
  
  if (!rewardName) {
    alert('Please enter a reward name');
    return;
  }
  
  if (isNaN(rewardCost) || rewardCost <= 0) {
    alert('Please enter a valid cost');
    return;
  }
  
  // Add new reward
  appData.rewards.push({
    name: rewardName,
    cost: rewardCost
  });
  
  // Save data
  saveData();
  
  // Update UI
  updateRewards();
  
  // Close modal
  toggleModal('add-reward-modal', false);
  document.getElementById('new-reward-name').value = '';
  document.getElementById('new-reward-cost').value = '';
}

// Initialize the app with all data and event listeners
function initApp() {
  // Initialize UI components
  updateUserDropdown();
  updateChoreDropdown();
  updateTeamDisplay();
  updateTeamDropdown();
  
  // Set up tab navigation
  document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
      showTab(button.dataset.tab);
      
      // When navigating to team tab, refresh team displays
      if (button.dataset.tab === 'team-tab') {
        updateTeamDisplay();
      }
    });
  });
  
  // Set up modal close buttons
  document.querySelectorAll('.close-modal').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
      closeBtn.closest('.modal').classList.add('hidden');
      document.getElementById('modal-backdrop').classList.add('hidden');
    });
  });
  
  // Add user button
  document.getElementById('add-user-btn').addEventListener('click', () => {
    toggleModal('add-user-modal');
  });
  
  // Add chore button
  document.getElementById('add-chore-btn').addEventListener('click', () => {
    toggleModal('add-chore-modal');
  });
  
  // Add reward button
  document.getElementById('add-reward-btn').addEventListener('click', () => {
    toggleModal('add-reward-modal');
  });
  
  // Create team button
  document.getElementById('create-team-btn').addEventListener('click', () => {
    // Populate available team members first
    populateTeamMemberSelection();
    toggleModal('create-team-modal');
  });
  
  // Assign team chore button
  document.getElementById('assign-team-chore-btn')?.addEventListener('click', () => {
    const teamId = document.getElementById('team-select').value;
    if (!teamId) {
      alert('Please select a team first');
      return;
    }
    populateTeamChoreSelection(teamId);
    toggleModal('assign-team-chore-modal');
  });
  
  // Save new team button
  document.getElementById('save-new-team')?.addEventListener('click', createNewTeam);
  
  // Save team chore button
  document.getElementById('save-team-chore')?.addEventListener('click', assignTeamChore);
  
  // Team select change
  document.getElementById('team-select')?.addEventListener('change', function() {
    const teamId = this.value;
    if (teamId) {
      document.getElementById('team-chore-list').classList.remove('hidden');
      document.getElementById('chat-input').classList.remove('hidden');
      loadTeamChores(teamId);
      loadTeamChat(teamId);
      updateTeamProgress(teamId);
    } else {
      document.getElementById('team-chore-list').classList.add('hidden');
      document.getElementById('chat-input').classList.add('hidden');
      document.getElementById('chat-messages').innerHTML = '<p>Select a team to see messages</p>';
      document.getElementById('team-progress').innerHTML = '<p>Select a team to see progress</p>';
    }
  });
  
  // Send chat message button
  document.getElementById('send-message-btn')?.addEventListener('click', sendTeamMessage);
  
  // Submit chore button
  document.getElementById('submit-chore-btn').addEventListener('click', submitChore);
  
  // Save new user
  document.getElementById('save-new-user').addEventListener('click', addNewUser);
  
  // Save new chore
  document.getElementById('save-new-chore').addEventListener('click', addCustomChore);
  
  // Save new reward
  document.getElementById('save-new-reward').addEventListener('click', addNewReward);
  
  // Username change
  document.getElementById('username').addEventListener('change', function() {
    const username = this.value;
    currentUser = username;
    updateUserStats(username);
    updateBankAccount(username);
    updateRewards();
  });

// script.js

import './components/chores.js';

function loadView(view) {
  document.querySelectorAll("section").forEach(s => s.style.display = "none");
  document.getElementById(`${view}-section`).style.display = "block";

  if (view === "chores") renderChores();
}

function switchUser() {
  currentUser = document.getElementById("userDropdown").value;
  document.getElementById("currentUserDisplay").textContent = `🧕 ${users[currentUser]}`;
}

window.loadView = loadView;
window.switchUser = switchUser;

  
  // Populate chore log from all users' chore history
  const allChores = [];
  
  Object.entries(appData.users).forEach(([username, userData]) => {
    userData.chores.forEach(chore => {
      allChores.push({
        username,
        chore: chore.chore,
        points: chore.points,
        timestamp: chore.timestamp
      });
    });
  });
  
  // Sort by timestamp (most recent first, assuming timestamps are stored in a comparable format)
  allChores.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  // Add to log
  const log = document.getElementById('chore-log');
  log.innerHTML = '';
  allChores.forEach(choreData => {
    const li = document.createElement('li');
    li.textContent = `${choreData.username} did "${choreData.chore}" for ${choreData.points} points - ${formatDate(choreData.timestamp)}`;
    log.appendChild(li);
  });
  
  // Update leaderboard
  updateLeaderboard();
}

// Function to update stock market
function updateStockMarket() {
  // Check if it's time to update (once per hour)
  const now = new Date();
  const lastUpdate = new Date(appData.market.lastUpdate);
  const hoursSinceLastUpdate = (now - lastUpdate) / (1000 * 60 * 60);
  
  // If it's been more than 1 hour since last update (or if running the first time)
  if (hoursSinceLastUpdate >= 1 || !appData.market.status) {
    // Choose a random market status
    const randomStatusIndex = Math.floor(Math.random() * MARKET_STATUSES.length);
    const newStatus = MARKET_STATUSES[randomStatusIndex];
    
    // Set market trend
    const range = newStatus.trendMax - newStatus.trendMin;
    const trend = newStatus.trendMin + (Math.random() * range);
    
    // Update market data
    appData.market = {
      status: newStatus.status,
      trend: trend,
      lastUpdate: now.toISOString()
    };
    
    // Update all stock prices based on market trend and their volatility
    appData.stocks.forEach(stock => {
      // Calculate new price based on market trend and individual stock volatility
      const marketImpact = trend; // Overall market trend
      const stockSpecificChange = (Math.random() * 2 - 1) * stock.volatility; // Random factor based on volatility
      const totalChangePercent = marketImpact + stockSpecificChange;
      
      // Calculate new price (ensure it doesn't go below 1)
      const oldPrice = stock.price;
      const newPrice = Math.max(1, oldPrice * (1 + totalChangePercent));
      
      // Update stock price and history
      stock.price = Math.round(newPrice * 100) / 100; // Round to 2 decimal places
      stock.history.push({
        price: stock.price,
        timestamp: now.toISOString()
      });
      
      // Keep only the last 30 price points in history
      if (stock.history.length > 30) {
        stock.history = stock.history.slice(-30);
      }
    });
    
    // Save updated market data
    saveData();
  }
  
  // Update market UI
  updateMarketUI();
}

// Function to update market UI
function updateMarketUI() {
  const marketStatus = document.getElementById('market-status');
  const marketTrend = document.getElementById('market-trend');
  
  // Update market status text and color
  marketStatus.textContent = appData.market.status;
  marketStatus.className = ''; // Clear existing classes
  
  // Format trend percentage and determine class
  const trendValue = Math.round(appData.market.trend * 100);
  const trendText = (trendValue >= 0 ? '+' : '') + trendValue + '%';
  marketTrend.textContent = trendText;
  marketTrend.className = ''; // Clear existing classes
  
  // Set appropriate classes based on trend
  if (trendValue > 0) {
    marketStatus.classList.add('up');
    marketTrend.classList.add('up');
  } else if (trendValue < 0) {
    marketStatus.classList.add('down');
    marketTrend.classList.add('down');
  }
  
  // Update available stocks display
  updateAvailableStocks();
  
  // Update portfolio if a user is selected
  if (currentUser) {
    updatePortfolio(currentUser);
  }
}

// Function to update available stocks display
function updateAvailableStocks() {
  const stocksContainer = document.getElementById('available-stocks');
  
  // Clear container
  stocksContainer.innerHTML = '';
  
  // Add all stocks
  appData.stocks.forEach(stock => {
    // Calculate price change from previous price
    const previousPrice = stock.history.length > 1 
      ? stock.history[stock.history.length - 2].price 
      : stock.price;
    const priceChange = ((stock.price - previousPrice) / previousPrice) * 100;
    const changeText = (priceChange >= 0 ? '+' : '') + priceChange.toFixed(2) + '%';
    const changeClass = priceChange >= 0 ? 'up' : 'down';
    
    // Create stock card
    const stockCard = document.createElement('div');
    stockCard.className = 'stock-card';
    stockCard.innerHTML = `
      <div class="stock-info">
        <div>
          <span class="stock-symbol">${stock.symbol}</span>
          <span class="stock-name">${stock.name}</span>
        </div>
        <div class="stock-description">${stock.description}</div>
      </div>
      <div>
        <span class="stock-price">${stock.price} pts</span>
        <span class="stock-change ${changeClass}">${changeText}</span>
      </div>
      <div class="stock-actions">
        <button class="buy-stock-btn" data-symbol="${stock.symbol}">Buy</button>
      </div>
    `;
    stocksContainer.appendChild(stockCard);
  });
  
  // Add event listeners to buy buttons
  document.querySelectorAll('.buy-stock-btn').forEach(button => {
    button.addEventListener('click', () => {
      const symbol = button.dataset.symbol;
      openBuyStockModal(symbol);
    });
  });
}

// Function to update user portfolio
function updatePortfolio(username) {
  const portfolioContainer = document.getElementById('user-portfolio');
  const portfolioValueDiv = document.getElementById('portfolio-value');
  
  // Check if user exists
  if (!username || !appData.users[username]) {
    portfolioContainer.innerHTML = '<p>Select a user to see their portfolio</p>';
    portfolioValueDiv.classList.add('hidden');
    return;
  }
  
  const userData = appData.users[username];
  
  // If user has no portfolio or empty portfolio
  if (!userData.portfolio || userData.portfolio.length === 0) {
    portfolioContainer.innerHTML = '<p>No stocks owned yet. Start investing!</p>';
    portfolioValueDiv.classList.add('hidden');
    return;
  }
  
  // Display portfolio
  portfolioContainer.innerHTML = '';
  
  // Calculate total portfolio value
  let totalValue = 0;
  
  // Create portfolio item for each stock owned
  userData.portfolio.forEach(item => {
    // Find the stock data
    const stock = appData.stocks.find(s => s.symbol === item.symbol);
    
    if (!stock) return; // Skip if stock not found
    
    // Calculate current value
    const currentValue = stock.price * item.shares;
    totalValue += currentValue;
    
    // Calculate profit/loss
    const originalValue = item.purchasePrice * item.shares;
    const profitLoss = currentValue - originalValue;
    const profitLossPercent = (profitLoss / originalValue) * 100;
    const profitLossText = (profitLoss >= 0 ? '+' : '') + profitLoss.toFixed(2) + ' pts (' + 
                          (profitLossPercent >= 0 ? '+' : '') + profitLossPercent.toFixed(2) + '%)';
    const profitLossClass = profitLoss >= 0 ? 'up' : 'down';
    
    // Create portfolio item
    const portfolioItem = document.createElement('div');
    portfolioItem.className = 'portfolio-item';
    portfolioItem.innerHTML = `
      <div class="portfolio-stock-info">
        <span class="stock-symbol">${item.symbol}</span>
        <span class="stock-name">${stock.name}</span>
        <span class="portfolio-shares">${item.shares} shares</span>
      </div>
      <div>
        <span class="portfolio-value">${currentValue.toFixed(2)} pts</span>
        <span class="portfolio-profit ${profitLossClass}">${profitLossText}</span>
      </div>
      <div class="portfolio-actions">
        <button class="sell-stock-btn" data-symbol="${item.symbol}">Sell</button>
      </div>
    `;
    
    portfolioContainer.appendChild(portfolioItem);
  });
  
  // Show total portfolio value
  portfolioValueDiv.classList.remove('hidden');
  document.getElementById('portfolio-total').textContent = totalValue.toFixed(2);
  
  // Add event listeners to sell buttons
  document.querySelectorAll('.sell-stock-btn').forEach(button => {
    button.addEventListener('click', () => {
      const symbol = button.dataset.symbol;
      openSellStockModal(symbol);
    });
  });
  
  // Update trading history
  updateTradingHistory(username);
}

// Function to update trading history
function updateTradingHistory(username) {
  const historyContainer = document.getElementById('trading-history');
  
  // Check if user exists
  if (!username || !appData.users[username]) {
    historyContainer.innerHTML = '<p>Select a user to see their trading history</p>';
    return;
  }
  
  const userData = appData.users[username];
  
  // If user has no trades
  if (!userData.trades || userData.trades.length === 0) {
    historyContainer.innerHTML = '<p>No trading activity yet</p>';
    return;
  }
  
  // Sort trades by date (newest first)
  const sortedTrades = [...userData.trades]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  // Display trading history
  historyContainer.innerHTML = '';
  
  sortedTrades.forEach(trade => {
    const historyItem = document.createElement('div');
    historyItem.className = 'trade-history-item';
    historyItem.innerHTML = `
      <div>
        <span class="trade-type ${trade.type}">${trade.type.toUpperCase()}</span>
        <strong>${trade.symbol}</strong> - ${trade.shares} shares @ ${trade.price} pts
        <p>${formatDate(trade.timestamp)}</p>
      </div>
      <div class="transaction-amount ${trade.type === 'buy' ? 'negative' : 'positive'}">
        ${trade.type === 'buy' ? '-' : '+'}${trade.totalAmount} pts
      </div>
    `;
    
    historyContainer.appendChild(historyItem);
  });
}

// Function to open buy stock modal
function openBuyStockModal(symbol) {
  // Check if user is selected
  if (!currentUser || !appData.users[currentUser]) {
    alert('Please select a user first!');
    return;
  }
  
  const userData = appData.users[currentUser];
  const stock = appData.stocks.find(s => s.symbol === symbol);
  
  if (!stock) return;
  
  // Set modal content
  document.getElementById('buy-stock-info').innerHTML = `
    <h3><span class="stock-symbol">${stock.symbol}</span> ${stock.name}</h3>
    <p>${stock.description}</p>
  `;
  
  document.getElementById('buy-stock-price').textContent = stock.price;
  document.getElementById('buy-available-points').textContent = userData.points;
  
  // Set up the shares input with an event listener to update total cost
  const sharesInput = document.getElementById('buy-stock-shares');
  sharesInput.value = 1;
  sharesInput.max = Math.floor(userData.points / stock.price);
  
  const updateTotalCost = () => {
    const shares = parseInt(sharesInput.value, 10) || 0;
    const totalCost = shares * stock.price;
    document.getElementById('buy-total-cost').textContent = totalCost.toFixed(2);
  };
  
  sharesInput.addEventListener('input', updateTotalCost);
  updateTotalCost();
  
  // Set up buy button
  document.getElementById('confirm-buy-stock').onclick = () => {
    const shares = parseInt(sharesInput.value, 10);
    
    if (isNaN(shares) || shares <= 0) {
      alert('Please enter a valid number of shares');
      return;
    }
    
    const totalCost = shares * stock.price;
    
    if (totalCost > userData.points) {
      alert('Not enough points to complete this purchase');
      return;
    }
    
    // Process the purchase
    buyStock(currentUser, symbol, shares, stock.price, totalCost);
    
    // Close modal
    toggleModal('buy-stock-modal', false);
  };
  
  // Show modal
  toggleModal('buy-stock-modal', true);
}

// Function to open sell stock modal
function openSellStockModal(symbol) {
  // Check if user is selected
  if (!currentUser || !appData.users[currentUser]) {
    alert('Please select a user first!');
    return;
  }
  
  const userData = appData.users[currentUser];
  const stock = appData.stocks.find(s => s.symbol === symbol);
  const portfolioItem = userData.portfolio.find(item => item.symbol === symbol);
  
  if (!stock || !portfolioItem) return;
  
  // Set modal content
  document.getElementById('sell-stock-info').innerHTML = `
    <h3><span class="stock-symbol">${stock.symbol}</span> ${stock.name}</h3>
    <p>${stock.description}</p>
  `;
  
  document.getElementById('sell-stock-price').textContent = stock.price;
  document.getElementById('sell-owned-shares').textContent = portfolioItem.shares;
  
  // Set up the shares input with an event listener to update total value
  const sharesInput = document.getElementById('sell-stock-shares');
  sharesInput.value = 1;
  sharesInput.max = portfolioItem.shares;
  
  const updateTotalValue = () => {
    const shares = parseInt(sharesInput.value, 10) || 0;
    const totalValue = shares * stock.price;
    document.getElementById('sell-total-value').textContent = totalValue.toFixed(2);
  };
  
  sharesInput.addEventListener('input', updateTotalValue);
  updateTotalValue();
  
  // Set up sell button
  document.getElementById('confirm-sell-stock').onclick = () => {
    const shares = parseInt(sharesInput.value, 10);
    
    if (isNaN(shares) || shares <= 0) {
      alert('Please enter a valid number of shares');
      return;
    }
    
    if (shares > portfolioItem.shares) {
      alert(`You only own ${portfolioItem.shares} shares`);
      return;
    }
    
    const totalValue = shares * stock.price;
    
    // Process the sale
    sellStock(currentUser, symbol, shares, stock.price, totalValue);
    
    // Close modal
    toggleModal('sell-stock-modal', false);
  };
  
  // Show modal
  toggleModal('sell-stock-modal', true);
}

// Function to buy stock
function buyStock(username, symbol, shares, price, totalCost) {
  const userData = appData.users[username];
  
  // Verify user has enough points
  if (userData.points < totalCost) {
    alert('Not enough points!');
    return;
  }
  
  // Deduct points from user
  userData.points -= totalCost;
  
  // Add to portfolio or update existing holdings
  const existingPosition = userData.portfolio.find(item => item.symbol === symbol);
  
  if (existingPosition) {
    // Update existing position
    const newTotalShares = existingPosition.shares + shares;
    const newTotalCost = (existingPosition.shares * existingPosition.purchasePrice) + (shares * price);
    const newAveragePrice = newTotalCost / newTotalShares;
    
    existingPosition.shares = newTotalShares;
    existingPosition.purchasePrice = newAveragePrice;
  } else {
    // Add new position
    userData.portfolio.push({
      symbol,
      shares,
      purchasePrice: price
    });
  }
  
  // Record the trade
  userData.trades.push({
    type: 'buy',
    symbol,
    shares,
    price,
    totalAmount: totalCost,
    timestamp: new Date().toISOString()
  });
  
  // Add transaction record
  userData.transactions.push({
    type: 'investment',
    description: `Bought ${shares} shares of ${symbol}`,
    amount: -totalCost,
    timestamp: new Date().toISOString()
  });
  
  // Save data
  saveData();
  
  // Update UI
  updateUserStats(username);
  updatePortfolio(username);
  updateBankAccount(username);
  
  alert(`Successfully bought ${shares} shares of ${symbol} for ${totalCost.toFixed(2)} points!`);
}

// Function to sell stock
function sellStock(username, symbol, shares, price, totalValue) {
  const userData = appData.users[username];
  
  // Find the stock in user's portfolio
  const portfolioIndex = userData.portfolio.findIndex(item => item.symbol === symbol);
  
  if (portfolioIndex === -1) {
    alert(`You don't own any shares of ${symbol}`);
    return;
  }
  
  const portfolioItem = userData.portfolio[portfolioIndex];
  
  // Verify user has enough shares
  if (portfolioItem.shares < shares) {
    alert(`You only own ${portfolioItem.shares} shares of ${symbol}`);
    return;
  }
  
  // Add points to user
  userData.points += totalValue;
  
  // Update portfolio
  if (portfolioItem.shares === shares) {
    // Remove the stock from portfolio if selling all shares
    userData.portfolio.splice(portfolioIndex, 1);
  } else {
    // Update shares count if selling partial position
    portfolioItem.shares -= shares;
  }
  
  // Record the trade
  userData.trades.push({
    type: 'sell',
    symbol,
    shares,
    price,
    totalAmount: totalValue,
    timestamp: new Date().toISOString()
  });
  
  // Add transaction record
  userData.transactions.push({
    type: 'investment',
    description: `Sold ${shares} shares of ${symbol}`,
    amount: totalValue,
    timestamp: new Date().toISOString()
  });
  
  // Save data
  saveData();
  
  // Update UI
  updateUserStats(username);
  updatePortfolio(username);
  updateBankAccount(username);
  
  alert(`Successfully sold ${shares} shares of ${symbol} for ${totalValue.toFixed(2)} points!`);
}

// Function to apply theme
function applyTheme(themeName) {
  // Remove all theme attributes
  document.body.removeAttribute('data-theme');
  
  // Add selected theme attribute if not default
  if (themeName !== 'default') {
    document.body.setAttribute('data-theme', themeName);
  }
  
  // Save theme preference to user data if a user is selected
  if (currentUser && appData.users[currentUser]) {
    // Initialize theme settings if not already there
    if (!appData.users[currentUser].settings) {
      appData.users[currentUser].settings = {};
    }
    
    appData.users[currentUser].settings.theme = themeName;
    saveData();
  }
}

// Function to show/hide theme selector
function toggleThemeSelector() {
  const themeOptions = document.querySelector('.theme-options');
  themeOptions.classList.toggle('hidden');
}

// TEAM COLLABORATION FUNCTIONS

// Function to update team display
function updateTeamDisplay() {
  const teamsContainer = document.getElementById('teams-container');
  
  if (!teamsContainer) return;
  
  if (!appData.teams || appData.teams.length === 0) {
    teamsContainer.innerHTML = '<p>No teams created yet. Create a team to start collaborating!</p>';
    return;
  }
  
  teamsContainer.innerHTML = '';
  
  appData.teams.forEach(team => {
    const teamCard = document.createElement('div');
    teamCard.className = 'team-card';
    
    // Build member names HTML
    let membersHtml = '';
    team.members.forEach(member => {
      membersHtml += `<span class="team-member">${member}</span>`;
    });
    
    // Calculate team stats
    const teamChores = appData.teamChores[team.id] || [];
    const completedChores = teamChores.filter(chore => chore.status === 'completed').length;
    const pendingChores = teamChores.filter(chore => chore.status === 'pending').length;
    const inProgressChores = teamChores.filter(chore => chore.status === 'in-progress').length;
    
    teamCard.innerHTML = `
      <div class="team-header">
        <div class="team-name">${team.name}</div>
        <div>${team.members.length} members</div>
      </div>
      <div class="team-members">
        ${membersHtml}
      </div>
      <div class="team-stats">
        <p>Chores: ${teamChores.length} total (${completedChores} completed, ${pendingChores} pending, ${inProgressChores} in progress)</p>
      </div>
    `;
    
    teamsContainer.appendChild(teamCard);
  });
}

// Function to update team dropdown
function updateTeamDropdown() {
  const teamSelect = document.getElementById('team-select');
  
  if (!teamSelect) return;
  
  // Clear dropdown
  teamSelect.innerHTML = '<option value="">Select a team</option>';
  
  // No teams case
  if (!appData.teams || appData.teams.length === 0) {
    return;
  }
  
  // If current user not set, show all teams
  if (!currentUser) {
    appData.teams.forEach(team => {
      const option = document.createElement('option');
      option.value = team.id;
      option.textContent = team.name;
      teamSelect.appendChild(option);
    });
    return;
  }

  // users.js
const users = [
  { id: 'bracelet_001', name: 'Imara', avatar: '🧕', vitals: { heartRate: 78, temp: 36.5 } },
  { id: 'bracelet_002', name: 'Warren', avatar: '👨🏾‍🦳', vitals: { heartRate: 82, temp: 36.7 } },
  { id: 'bracelet_003', name: 'Nia', avatar: '👵🏿', vitals: { heartRate: 70, temp: 36.6 } }
];
let currentUser = users[0]; // default active user
  function switchUser() {
  const index = document.getElementById('userDropdown').value;
  currentUser = users[index];
  document.getElementById('currentUserDisplay').innerText = 
    `${currentUser.avatar} ${currentUser.name} | HR: ${currentUser.vitals.heartRate} bpm`;
}
  
  // Filter teams to only show teams the current user belongs to
  const userTeams = appData.teams.filter(team => 
    team.members.includes(currentUser)
  );
  
  userTeams.forEach(team => {
    const option = document.createElement('option');
    option.value = team.id;
    option.textContent = team.name;
    teamSelect.appendChild(option);
  });
}

// Function to populate team member selection in modal
function populateTeamMemberSelection() {
  const memberSelectionDiv = document.getElementById('available-team-members');
  
  if (!memberSelectionDiv) return;
  
  memberSelectionDiv.innerHTML = '';
  
  // Get all users
  const users = Object.keys(appData.users);
  
  if (users.length === 0) {
    memberSelectionDiv.innerHTML = '<p>No users available. Please add users first.</p>';
    return;
  }
  
  // Add checkboxes for each user
  users.forEach(user => {
    const div = document.createElement('div');
    div.className = 'team-member-checkbox';
    div.innerHTML = `
      <input type="checkbox" id="member-${user}" data-username="${user}">
      <label for="member-${user}">${user}</label>
    `;
    memberSelectionDiv.appendChild(div);
  });
}

// Function to create a new team
function createNewTeam() {
  const teamName = document.getElementById('new-team-name').value.trim();
  
  if (!teamName) {
    alert('Please enter a team name');
    return;
  }
  
  // Get selected members
  const selectedMembers = [];
  document.querySelectorAll('#available-team-members input[type="checkbox"]:checked').forEach(checkbox => {
    selectedMembers.push(checkbox.dataset.username);
  });
  
  if (selectedMembers.length === 0) {
    alert('Please select at least one team member');
    return;
  }
  
  // Generate unique team ID
  const teamId = 'team_' + new Date().getTime();
  
  // Create team
  const newTeam = {
    id: teamId,
    name: teamName,
    members: selectedMembers,
    createdAt: new Date().toISOString(),
    createdBy: currentUser || 'Admin'
  };
  
  // Add to teams list
  if (!appData.teams) {
    appData.teams = [];
  }
  appData.teams.push(newTeam);
  
  // Initialize team chores
  if (!appData.teamChores) {
    appData.teamChores = {};
  }
  appData.teamChores[teamId] = [];
  
  // Initialize team chat
  if (!appData.teamChat) {
    appData.teamChat = {};
  }
  appData.teamChat[teamId] = [];
  
  // Update user team memberships
  selectedMembers.forEach(member => {
    if (!appData.users[member].teams) {
      appData.users[member].teams = [];
    }
    appData.users[member].teams.push(teamId);
  });
  
  // Save data
  saveData();
  
  // Update UI
  updateTeamDisplay();
  updateTeamDropdown();
  
  // Close modal
  toggleModal('create-team-modal', false);
  document.getElementById('new-team-name').value = '';
  
  alert(`Team "${teamName}" has been created!`);
}

// Function to populate team chore selection
function populateTeamChoreSelection(teamId) {
  const teamChoreSelect = document.getElementById('team-chore-select');
  const teamMembersList = document.getElementById('team-members-list');
  
  if (!teamChoreSelect || !teamMembersList) return;
  
  // Clear previous selections
  teamChoreSelect.innerHTML = '';
  teamMembersList.innerHTML = '';
  
  // Add all available chores to dropdown
  Object.entries(appData.chores).forEach(([chore, points]) => {
    const option = document.createElement('option');
    option.value = chore;
    option.textContent = `${chore} (${points} pts)`;
    option.dataset.points = points;
    teamChoreSelect.appendChild(option);
  });
  
  // Add event listener to update points when chore changes
  teamChoreSelect.addEventListener('change', function() {
    const selectedOption = this.options[this.selectedIndex];
    const points = selectedOption.dataset.points;
    document.getElementById('team-chore-points').textContent = points * 2; // Double points for team chores
  });
  
  // Set initial points value
  if (teamChoreSelect.options.length > 0) {
    const initialPoints = teamChoreSelect.options[0].dataset.points;
    document.getElementById('team-chore-points').textContent = initialPoints * 2;
  }
  
  // Add team members with role assignments
  const team = appData.teams.find(t => t.id === teamId);
  if (team) {
    team.members.forEach(member => {
      const div = document.createElement('div');
      div.className = 'team-member-checkbox';
      div.innerHTML = `
        <input type="checkbox" id="assign-${member}" data-username="${member}" checked>
        <label for="assign-${member}">${member}</label>
        <select data-username="${member}">
          <option value="coordinator">Coordinator</option>
          <option value="helper">Helper</option>
          <option value="verifier">Verifier</option>
        </select>
      `;
      teamMembersList.appendChild(div);
    });
  }
  
  // Set today's date as minimum date for deadline
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('team-chore-deadline').min = today;
  document.getElementById('team-chore-deadline').value = today;
}

// Function to assign a team chore
function assignTeamChore() {
  const teamId = document.getElementById('team-select').value;
  const choreName = document.getElementById('team-chore-select').value;
  const deadline = document.getElementById('team-chore-deadline').value;
  
  if (!teamId || !choreName || !deadline) {
    alert('Please fill out all required fields');
    return;
  }
  
  // Get points value
  const selectedOption = document.getElementById('team-chore-select').options[document.getElementById('team-chore-select').selectedIndex];
  const basePoints = parseInt(selectedOption.dataset.points, 10);
  const teamPoints = basePoints * 2; // Double points for team collaboration
  
  // Get assigned members and roles
  const assignments = [];
  document.querySelectorAll('#team-members-list input[type="checkbox"]:checked').forEach(checkbox => {
    const username = checkbox.dataset.username;
    const role = checkbox.parentElement.querySelector('select').value;
    assignments.push({
      username,
      role,
      completed: false
    });
  });
  
  if (assignments.length === 0) {
    alert('Please assign at least one team member to this chore');
    return;
  }
  
  // Create team chore
  const choreId = 'chore_' + new Date().getTime();
  const newChore = {
    id: choreId,
    name: choreName,
    basePoints: basePoints,
    teamPoints: teamPoints,
    deadline: deadline,
    status: 'pending',
    assignments: assignments,
    createdAt: new Date().toISOString(),
    completedAt: null
  };
  
  // Add to team chores
  if (!appData.teamChores[teamId]) {
    appData.teamChores[teamId] = [];
  }
  appData.teamChores[teamId].push(newChore);
  
  // Save data
  saveData();
  
  // Update UI
  loadTeamChores(teamId);
  
  // Add system message to team chat
  addSystemMessageToTeamChat(teamId, `Team chore "${choreName}" has been assigned. Complete it together to earn ${teamPoints} points!`);
  
  // Close modal
  toggleModal('assign-team-chore-modal', false);
  
  alert(`Team chore "${choreName}" has been assigned!`);
}

// Function to load team chores
function loadTeamChores(teamId) {
  const teamChoresList = document.getElementById('assigned-team-chores');
  
  if (!teamChoresList) return;
  
  teamChoresList.innerHTML = '';
  
  // No chores case
  if (!appData.teamChores[teamId] || appData.teamChores[teamId].length === 0) {
    teamChoresList.innerHTML = '<p>No chores assigned to this team yet.</p>';
    return;
  }
  
  // Sort by deadline (closest first)
  const sortedChores = [...appData.teamChores[teamId]].sort((a, b) => 
    new Date(a.deadline) - new Date(b.deadline)
  );
  
  // Add chores to list
  sortedChores.forEach(chore => {
    const li = document.createElement('li');
    li.className = 'team-chore-item';
    
    // Calculate days until deadline
    const deadlineDate = new Date(chore.deadline);
    const today = new Date();
    const daysUntilDeadline = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
    const deadlineText = daysUntilDeadline <= 0 
      ? 'Due today!' 
      : `Due in ${daysUntilDeadline} day${daysUntilDeadline === 1 ? '' : 's'}`;
    
    li.innerHTML = `
      <div>
        <div><strong>${chore.name}</strong> <span class="team-bonus-badge">+${chore.teamPoints} pts</span></div>
        <div class="team-chore-deadline">${deadlineText} (${chore.deadline})</div>
        <div>Assigned to: ${chore.assignments.map(a => a.username).join(', ')}</div>
      </div>
      <div>
        <span class="team-chore-status ${chore.status}">${chore.status}</span>
        ${chore.status !== 'completed' ? 
          `<button class="update-status-btn" data-chore-id="${chore.id}">Update Status</button>` : ''}
      </div>
    `;
    
    teamChoresList.appendChild(li);
  });
  
  // Add event listeners to status update buttons
  document.querySelectorAll('.update-status-btn').forEach(button => {
    button.addEventListener('click', () => {
      const choreId = button.dataset.choreId;
      updateTeamChoreStatus(teamId, choreId);
    });
  });
}

// Function to update team chore status
function updateTeamChoreStatus(teamId, choreId) {
  const chore = appData.teamChores[teamId].find(c => c.id === choreId);
  
  if (!chore) return;
  
  // If no current user is selected, show an error
  if (!currentUser) {
    alert('Please select a user first');
    return;
  }
  
  // Make sure current user is assigned to this chore
  const userAssignment = chore.assignments.find(a => a.username === currentUser);
  if (!userAssignment) {
    alert('You are not assigned to this chore');
    return;
  }
  
  // If chore is pending, change to in-progress
  if (chore.status === 'pending') {
    chore.status = 'in-progress';
    addSystemMessageToTeamChat(teamId, `${currentUser} has started working on the chore "${chore.name}".`);
  } 
  // If chore is in-progress, mark user's assignment as completed
  else if (chore.status === 'in-progress') {
    userAssignment.completed = true;
    
    // Check if all assignments are complete
    const allCompleted = chore.assignments.every(a => a.completed);
    
    if (allCompleted) {
      chore.status = 'completed';
      chore.completedAt = new Date().toISOString();
      
      // Award points to all team members
      chore.assignments.forEach(assignment => {
        const user = appData.users[assignment.username];
        if (user) {
          // Add points
          user.points += chore.teamPoints;
          
          // Add to chore history
          user.chores.push({
            chore: `[TEAM] ${chore.name}`,
            points: chore.teamPoints,
            timestamp: chore.completedAt
          });
          
          // Add transaction record
          user.transactions.push({
            type: 'team-chore',
            description: `Completed team chore: ${chore.name}`,
            amount: chore.teamPoints,
            timestamp: chore.completedAt
          });
        }
      });
      
      addSystemMessageToTeamChat(teamId, `The team has completed the chore "${chore.name}" and earned ${chore.teamPoints} points each!`);
    } else {
      addSystemMessageToTeamChat(teamId, `${currentUser} has completed their part of the chore "${chore.name}".`);
    }
  }
  
  // Save data
  saveData();
  
  // Update UI
  loadTeamChores(teamId);
  updateTeamProgress(teamId);
  
  // Update personal stats if needed
  if (chore.status === 'completed') {
    updateUserStats(currentUser);
    updateLeaderboard();
  }
}

// Function to update team progress
function updateTeamProgress(teamId) {
  const progressDiv = document.getElementById('team-progress');
  
  if (!progressDiv) return;
  
  if (!appData.teamChores[teamId] || appData.teamChores[teamId].length === 0) {
    progressDiv.innerHTML = '<p>No chores assigned to this team yet.</p>';
    return;
  }
  
  const chores = appData.teamChores[teamId];
  const totalChores = chores.length;
  const completedChores = chores.filter(c => c.status === 'completed').length;
  const inProgressChores = chores.filter(c => c.status === 'in-progress').length;
  const pendingChores = chores.filter(c => c.status === 'pending').length;
  
  const completionPercentage = Math.round((completedChores / totalChores) * 100);
  
  progressDiv.innerHTML = `
    <h3>Team Progress Overview</h3>
    <p>Completed: ${completedChores} of ${totalChores} chores (${completionPercentage}%)</p>
    <div class="team-progress-bar">
      <div class="team-progress-fill" style="width: ${completionPercentage}%"></div>
    </div>
    <div class="progress-stats">
      <div><strong>Completed:</strong> ${completedChores}</div>
      <div><strong>In Progress:</strong> ${inProgressChores}</div>
      <div><strong>Pending:</strong> ${pendingChores}</div>
    </div>
  `;
}

// Function to load team chat
function loadTeamChat(teamId) {
  const chatMessages = document.getElementById('chat-messages');
  
  if (!chatMessages) return;
  
  if (!appData.teamChat[teamId] || appData.teamChat[teamId].length === 0) {
    chatMessages.innerHTML = '<p>No messages yet. Be the first to say something!</p>';
    return;
  }
  
  chatMessages.innerHTML = '';
  
  // Display messages
  appData.teamChat[teamId].forEach(message => {
    const messageDiv = document.createElement('div');
    
    if (message.type === 'system') {
      messageDiv.className = 'system-message';
      messageDiv.innerHTML = `
        <p>${message.content}</p>
        <div class="message-time">${formatDate(message.timestamp)}</div>
      `;
    } else {
      const isCurrentUser = currentUser && message.sender === currentUser;
      messageDiv.className = `chat-message ${isCurrentUser ? 'sent' : 'received'}`;
      messageDiv.innerHTML = `
        <div class="message-sender">${message.sender}</div>
        <p>${message.content}</p>
        <div class="message-time">${formatDate(message.timestamp)}</div>
      `;
    }
    
    chatMessages.appendChild(messageDiv);
  });
  
  // Scroll to bottom
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function to send team message
function sendTeamMessage() {
  const teamId = document.getElementById('team-select').value;
  const messageInput = document.getElementById('message-input');
  const content = messageInput.value.trim();
  
  if (!teamId) {
    alert('Please select a team first');
    return;
  }
  
  if (!content) {
    alert('Please enter a message');
    return;
  }
  
  if (!currentUser) {
    alert('Please select a user first');
    return;
  }
  
  // Create message
  const newMessage = {
    type: 'user',
    sender: currentUser,
    content: content,
    timestamp: new Date().toISOString()
  };
  
  // Add to team chat
  if (!appData.teamChat[teamId]) {
    appData.teamChat[teamId] = [];
  }
  appData.teamChat[teamId].push(newMessage);
  
  // Save data
  saveData();
  
  // Update UI
  loadTeamChat(teamId);
  
  // Clear input
  messageInput.value = '';
}

// Function to add system message to team chat
function addSystemMessageToTeamChat(teamId, content) {
  // Create system message
  const systemMessage = {
    type: 'system',
    content: content,
    timestamp: new Date().toISOString()
  };
  
  // Add to team chat
  if (!appData.teamChat[teamId]) {
    appData.teamChat[teamId] = [];
  }
  appData.teamChat[teamId].push(systemMessage);
  
  // Save data
  saveData();
  
  // Update UI if the team chat is currently open
  const selectedTeamId = document.getElementById('team-select')?.value;
  if (selectedTeamId === teamId) {
    loadTeamChat(teamId);
  }
}

// Function to calculate interest
function calculateInterest(username, interestRate = 0.05) {
  const userData = appData.users[username];
  
  if (!userData) return 0;
  
  // Get bank balance
  const balance = userData.bank;
  
  // Calculate daily interest (annual rate / 365)
  const dailyRate = interestRate / 365;
  const dailyInterest = balance * dailyRate;
  
  return dailyInterest;
}

// Function to apply interest payment
function applyInterestPayment(username) {
  const userData = appData.users[username];
  
  if (!userData) return;
  
  // Get interest settings
  const interestRate = userData.settings?.interestRate || 0.05;
  const taxRate = userData.settings?.taxRate || 0.1;
  
  // Calculate weekly interest (5% annual, divided by 52 weeks)
  const weeklyRate = interestRate / 52;
  const weeklyInterest = userData.bank * weeklyRate;
  
  // Apply tax if enabled
  let taxAmount = 0;
  if (taxRate > 0) {
    taxAmount = weeklyInterest * taxRate;
  }
  
  // Apply interest after tax
  const netInterest = weeklyInterest - taxAmount;
  
  // Update bank balance
  userData.bank += netInterest;
  
  // Record transaction
  userData.transactions.push({
    type: 'interest',
    description: 'Weekly interest payment',
    amount: netInterest,
    timestamp: new Date().toISOString()
  });
  
  // Record tax payment if applicable
  if (taxAmount > 0) {
    // Initialize taxes paid if not already there
    if (!userData.taxes) {
      userData.taxes = {
        totalPaid: 0,
        history: []
      };
    }
    
    userData.taxes.totalPaid += taxAmount;
    userData.taxes.history.push({
      type: 'interest',
      amount: taxAmount,
      timestamp: new Date().toISOString()
    });
    
    userData.transactions.push({
      type: 'tax',
      description: 'Tax on interest',
      amount: -taxAmount,
      timestamp: new Date().toISOString()
    });
  }
  
  // Save data
  saveData();
  
  // Update UI
  updateBankAccount(username);
  
  return {
    grossInterest: weeklyInterest,
    tax: taxAmount,
    netInterest: netInterest
  };
}

// Function to update the projected interest display
function updateProjectedInterest(username) {
  const userData = appData.users[username];
  const projectedDiv = document.querySelector('.projected-interest');
  const projectedAmount = document.getElementById('projected-interest-amount');
  
  if (!userData || userData.bank <= 0) {
    projectedDiv.classList.add('hidden');
    return;
  }
  
  // Get interest settings
  const interestRate = userData.settings?.interestRate || 0.05;
  
  // Calculate weekly interest
  const dailyInterest = calculateInterest(username, interestRate);
  const weeklyInterest = dailyInterest * 7;
  
  // Get tax settings
  const taxRate = userData.settings?.taxRate || 0.1;
  const taxAmount = weeklyInterest * taxRate;
  const netInterest = weeklyInterest - taxAmount;
  
  // Display projected interest
  projectedDiv.classList.remove('hidden');
  projectedAmount.textContent = netInterest.toFixed(2);
}

// Function to update financial settings and UI
function updateFinancialSettings(username) {
  if (!username || !appData.users[username]) return;
  
  const userData = appData.users[username];
  
  // Initialize settings if not already there
  if (!userData.settings) {
    userData.settings = {
      interestRate: 0.05,
      taxRate: 0.1
    };
  }
  
  // Update UI elements
  document.getElementById('interest-rate').textContent = `${(userData.settings.interestRate * 100).toFixed(0)}%`;
  document.getElementById('tax-rate').textContent = `${(userData.settings.taxRate * 100).toFixed(0)}%`;
  
  // Set the select options
  const interestSelect = document.getElementById('interest-rate-setting');
  const taxSelect = document.getElementById('tax-rate-setting');
  
  interestSelect.value = userData.settings.interestRate;
  taxSelect.value = userData.settings.taxRate;
  
  // Show tax stats if applicable
  const taxStatsDiv = document.querySelector('.tax-stats');
  const totalTaxesPaid = document.getElementById('total-taxes-paid');
  
  if (userData.taxes && userData.taxes.totalPaid > 0) {
    taxStatsDiv.classList.remove('hidden');
    totalTaxesPaid.textContent = userData.taxes.totalPaid.toFixed(2);
  } else {
    taxStatsDiv.classList.add('hidden');
  }
  
  // Update projected interest
  updateProjectedInterest(username);
}

// Function to handle interest rate change
function handleInterestRateChange(username, newRate) {
  if (!username || !appData.users[username]) return;
  
  const userData = appData.users[username];
  
  // Initialize settings if not already there
  if (!userData.settings) {
    userData.settings = {
      interestRate: 0.05,
      taxRate: 0.1
    };
  }
  
  // Update interest rate
  userData.settings.interestRate = newRate;
  
  // Save data
  saveData();
  
  // Update UI
  updateFinancialSettings(username);
}

// Function to handle tax rate change
function handleTaxRateChange(username, newRate) {
  if (!username || !appData.users[username]) return;
  
  const userData = appData.users[username];
  
  // Initialize settings if not already there
  if (!userData.settings) {
    userData.settings = {
      interestRate: 0.05,
      taxRate: 0.1
    };
  }
  
  // Update tax rate
  userData.settings.taxRate = newRate;
  
  // Save data
  saveData();
  
  // Update UI
  updateFinancialSettings(username);
}

// Initialize app when page loads
window.onload = function() {
  // Initialize the app
  initApp();
  
  // Update stock market
  updateStockMarket();
  
  // Set up stock market refresh (every 30 seconds for simulation purposes)
  setInterval(updateStockMarket, 30000);
  
  // Update username change handler to also update portfolio
  document.getElementById('username').addEventListener('change', function() {
    const username = this.value;
    currentUser = username;
    updateUserStats(username);
    updateBankAccount(username);
    updateRewards();
    updatePortfolio(username);
    
    // Apply user theme if set
    if (appData.users[username]?.settings?.theme) {
      applyTheme(appData.users[username].settings.theme);
    } else {
      applyTheme('default');
    }
    
    // Update financial settings
    updateFinancialSettings(username);
  });
  
  // Set up theme selector
  const themeSelector = document.querySelector('.theme-selector');
  themeSelector.addEventListener('click', toggleThemeSelector);
  
  // Set up theme options
  document.querySelectorAll('.theme-option').forEach(option => {
    option.addEventListener('click', () => {
      const theme = option.dataset.theme;
      applyTheme(theme);
      toggleThemeSelector();
    });
  });
  
  // Set up financial settings handlers
  document.getElementById('interest-rate-setting').addEventListener('change', function() {
    handleInterestRateChange(currentUser, parseFloat(this.value));
  });
  
  document.getElementById('tax-rate-setting').addEventListener('change', function() {
    handleTaxRateChange(currentUser, parseFloat(this.value));
  });
  
  // For demonstration purposes, simulate interest payment every few minutes
  // In a real application, this would be based on actual dates
  setInterval(() => {
    if (currentUser) {
      applyInterestPayment(currentUser);
    }
  }, 300000); // 5 minutes
};
