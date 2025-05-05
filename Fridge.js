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

// Initialize
document.addEventListener('DOMContentLoaded', updateFridgeDashboard);
