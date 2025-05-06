
let currentUser = "Imara";
let chores = [
  { id: 1, task: "Clean kitchen", assignedTo: "Imara", completed: false, reviewed: false, points: 10, proof: null },
  { id: 2, task: "Take out trash", assignedTo: "Warren", completed: false, reviewed: false, points: 5, proof: null },
  { id: 3, task: "Sweep hallway", assignedTo: "Nia", completed: false, reviewed: false, points: 7, proof: null },
];

function switchUser() {
  const dropdown = document.getElementById("userDropdown");
  currentUser = dropdown.options[dropdown.selectedIndex].text;
  document.getElementById("currentUserDisplay").textContent = `🧕 ${currentUser}`;
  renderChores();
}

function renderChores() {
  const list = document.getElementById("chores-list");
  list.innerHTML = "";
  chores.forEach(chore => {
    const div = document.createElement("div");
    div.innerHTML = `
      <strong>${chore.task}</strong> (Assigned to: ${chore.assignedTo})
      ${chore.assignedTo === currentUser ? `
      <input type="file" accept="image/*,video/*" onchange="uploadProof(${chore.id}, event)" />
      <button onclick="markChoreComplete(${chore.id})">Submit Chore</button>
      <button onclick="requestChoreTrade(${chore.id})">Trade Chore</button>
      ` : ""}
      <a href="tutorials/${chore.task.replace(/\s+/g, '_').toLowerCase()}.mp4" target="_blank">View Tutorial</a>
      <div>Status: ${chore.completed ? (chore.reviewed ? 'Reviewed' : 'Pending Review') : 'Incomplete'}</div>
    `;
    list.appendChild(div);
  });
}

function uploadProof(choreId, event) {
  const file = event.target.files[0];
  const chore = chores.find(c => c.id === choreId);
  if (chore) {
    chore.proof = file.name;
    alert(`Proof uploaded: ${file.name}`);
  }
}

function markChoreComplete(choreId) {
  const chore = chores.find(c => c.id === choreId);
  if (chore && chore.assignedTo === currentUser && chore.proof) {
    chore.completed = true;
    alert("Chore submitted for review.");
    renderChores();
  } else {
    alert("Upload proof before submitting.");
  }
}

function requestChoreTrade(choreId) {
  const newAssignee = prompt("Enter the name of the person you'd like to trade with:");
  const chore = chores.find(c => c.id === choreId);
  if (chore && newAssignee) {
    chore.assignedTo = newAssignee;
    alert(`Chore reassigned to ${newAssignee}`);
    renderChores();
  }
}

function simulateAdminReview() {
  chores.forEach(chore => {
    if (chore.completed && !chore.reviewed) {
      const success = confirm(`Approve chore "${chore.task}" by ${chore.assignedTo}?`);
      chore.reviewed = true;
      if (!success) {
        chore.points = Math.max(0, chore.points - 5);
        alert(`Points deducted for ${chore.assignedTo}.`);
      }
    }
  });
  renderChores();
}

document.addEventListener("DOMContentLoaded", () => {
  renderChores();
});
