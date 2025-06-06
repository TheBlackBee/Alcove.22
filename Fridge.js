// kitchen/fridge.js

// Simulated sensor data
const fridgeInventory = [
  { item: 'Milk', quantity: 1, expiry: '2025-05-01', takenBy: 'Imara' },
  { item: 'Eggs', quantity: 6, expiry: '2025-04-30', takenBy: null },
  { item: 'Spinach', quantity: 0, expiry: '2025-04-28', takenBy: 'Warren' }
];

function updateFridgeContents() {
  const container = document.getElementById('fridge-contents');
  container.innerHTML = '<h3>Current Inventory</h3>' + fridgeInventory.map(item =>
    `<p>${item.item} - ${item.quantity} left - Exp: ${item.expiry} ${item.takenBy ? `(taken by ${item.takenBy})` : ''}</p>`
  ).join('');
}

function generateGroceryList() {
  const container = document.getElementById('grocery-list');
  const list = fridgeInventory.filter(item => item.quantity <= 1);
  container.innerHTML = '<h3>Grocery List</h3>' + list.map(i =>
    `<p>${i.item} - low stock</p>`
  ).join('');
}
function takeFromFridge(itemName) {
  console.log(`${currentUser.name} removed ${itemName} from the fridge.`);
  // add this action to history or analytics
}
function suggestRecipes() {
  const container = document.getElementById('recipe-suggestions');
  const availableItems = fridgeInventory.map(i => i.item.toLowerCase());
  const sampleRecipes = [
    { name: "Omelette", ingredients: ["eggs", "milk"] },
    { name: "Green Smoothie", ingredients: ["spinach", "milk"] }
  ];
  const suggestions = sampleRecipes.filter(recipe =>
    recipe.ingredients.every(ing => availableItems.includes(ing))
  );

  container.innerHTML = '<h3>Recipe Suggestions</h3>' + suggestions.map(r => `<p>${r.name}</p>`).join('');
}

function showUserAnalytics() {
  const container = document.getElementById('user-analytics');
  const stats = fridgeInventory.reduce((acc, item) => {
    if (item.takenBy) {
      acc[item.takenBy] = (acc[item.takenBy] || 0) + 1;
    }
    return acc;
  }, {});
  container.innerHTML = '<h3>User Analytics</h3>' + Object.entries(stats).map(
    ([user, count]) => `<p>${user} took ${count} items</p>`
  ).join('');
}

function updateFridgeDashboard() {
  updateFridgeContents();
  generateGroceryList();
  suggestRecipes();
  showUserAnalytics();
}

function simulateBraceletScan() {
  const randomIndex = Math.floor(Math.random() * users.length);
  document.getElementById('userDropdown').value = randomIndex;
  switchUser();
}

function interactWithFridge(braceletId) {
  const userName = simulateBraceletScan(braceletId);
  if (!userName) return;
  

  // Simulate taking out an item
  const item = prompt(`Hi ${userName}, what item are you taking out?`);
  const target = fridgeInventory.find(i => i.item.toLowerCase() === item.toLowerCase());

  if (target) {
    if (target.quantity > 0) {
      target.quantity--;
      target.takenBy = userName;
      alert(`${userName} took 1 ${target.item}`);
    } else {
      alert(`${target.item} is out of stock!`);
    }
  } else {
    alert(`${item} is not in the fridge.`);
  }

  updateFridgeDashboard();
}

// Initialize
document.addEventListener('DOMContentLoaded', updateFridgeDashboard);
