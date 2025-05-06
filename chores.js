
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
let currentChoreId = null;

function simulateChoreCompletion(choreId) {
  currentChoreId = choreId;
  document.getElementById("proof-submission").style.display = "block";
}
function submitProof() {
  const fileInput = document.getElementById("proofFile");
  const file = fileInput.files[0];
  
  if (!file) {
    alert("Please select a file.");
    return;
  }

  // Simulate upload
  const proofURL = URL.createObjectURL(file);

  // Simulate adding to admin review list
  const submission = {
    id: Date.now(),
    user: currentUser.name,
    chore: "Chore " + currentChoreId,
    proof: proofURL,
    status: "pending"
  };

  const chores = [
  {
    id: 1,
    name: "Do the Dishes",
    points: 10,
    tutorial: "tutorials/dishes.mp4"
  },
  {
    id: 2,
    name: "Vacuum the Living Room",
    points: 15,
    tutorial: "tutorials/vacuuming.mp4"
  }
];

  // For real app: send this to backend
  console.log("Submitted Proof:", submission);

  alert("Proof submitted for review!");
  document.getElementById("proof-submission").style.display = "none";
  fileInput.value = "";
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
const choreTutorials = {
  "Sweep Floor": "assets/tutorials/sweep.mp4",
  "Wash Dishes": "assets/tutorials/dishes.mp4",
  "Mop Kitchen": "assets/tutorials/mop.mp4",
  "Tidy Bedroom": "assets/tutorials/tidy_bedroom.mp4"
};

function loadTutorials() {
  const container = document.getElementById("tutorial-videos");
  container.innerHTML = "";

  Object.entries(choreTutorials).forEach(([chore, url]) => {
    const wrapper = document.createElement("div");
    wrapper.className = "tutorial-wrapper";

    wrapper.innerHTML = `
      <h4>${chore}</h4>
      <video width="320" height="240" controls>
        <source src="${url}" type="video/mp4">
        Your browser does not support the video tag.
      </video>
    `;

    container.appendChild(wrapper);
  });
}

document.addEventListener("DOMContentLoaded", loadTutorials);
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

// components/chores.js

const chores = [
  { id: 1, name: "Sweep Kitchen", points: 10, video: "videos/sweep-kitchen.mp4" },
  { id: 2, name: "Clean Bathroom", points: 15, video: "videos/clean-bathroom.mp4" },
];

let currentUser = 0;
const users = ["Imara", "Warren", "Nia"];
let submittedChores = [];

function renderChores() {
  const list = document.getElementById("chores-list");
  list.innerHTML = "";
  chores.forEach(chore => {
    const choreEl = document.createElement("div");
    choreEl.innerHTML = `
      <h3>${chore.name}</h3>
      <video width="200" controls src="${chore.video}"></video><br/>
      <input type="file" accept="image/*,video/*" id="proof-${chore.id}" />
      <button onclick="submitChore(${chore.id})">Submit for Review</button>
      <button onclick="tradeChore(${chore.id})">Trade Chore</button>
    `;
    list.appendChild(choreEl);
  });
}

function submitChore(id) {
  const fileInput = document.getElementById(`proof-${id}`);
  const file = fileInput.files[0];
  if (!file) {
    alert("Please attach proof.");
    return;
  }
  submittedChores.push({ choreId: id, userId: currentUser, file });
  alert("Submitted! Awaiting admin review.");
}

const tutorial = document.createElement("video");
tutorial.src = "../videos/sweep-kitchen.mp4";
tutorial.controls = true;
document.getElementById("tutorialContainer").appendChild(tutorial);


function tradeChore(id) {
  const newUser = prompt("Enter the name of the person you want to trade with:");
  if (users.includes(newUser)) {
    alert(`Chore ${id} sent to ${newUser}. Awaiting confirmation.`);
  } else {
    alert("User not found.");
  }
}

window.renderChores = renderChores;

document.addEventListener("DOMContentLoaded", () => {
  renderChores();
});
