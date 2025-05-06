// /components/admin.js

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("pending-chores-container");
  const pendingChores = JSON.parse(localStorage.getItem("pendingChores")) || [];

  pendingChores.forEach((chore, index) => {
    const card = document.createElement("div");
    card.className = "chore-card";
    card.innerHTML = `
      <p><strong>User:</strong> ${chore.user}</p>
      <p><strong>Chore:</strong> ${chore.name}</p>
      <p><strong>Proof:</strong></p>
      ${chore.proof ? `<video controls src="${chore.proof}" width="200"></video>` : '<p>No proof submitted.</p>'}
      <button onclick="approveChore(${index})">Approve</button>
      <button onclick="rejectChore(${index})">Reject</button>
    `;
    container.appendChild(card);
  });
});
function approveChore(index) {
  const submission = pendingSubmissions[index];
  users[submission.userId].points += submission.points;
  users[submission.userId].notifications.push({
    message: `Your submission for "${submission.choreName}" has been approved. You earned ${submission.points} points.`,
    timestamp: new Date()
  });
  alert(`Approved. ${submission.points} points awarded.`);
  pendingSubmissions.splice(index, 1);
  renderPendingReviews();
}

function rejectChore(index) {
  const submission = pendingSubmissions[index];
  users[submission.userId].notifications.push({
    message: `Your submission for "${submission.choreName}" has been rejected. No points awarded.`,
    timestamp: new Date()
  });
  alert("Rejected. No points awarded.");
  pendingSubmissions.splice(index, 1);
  renderPendingReviews();
}
function renderNotifications(userId) {
  const notificationList = document.getElementById("notificationList");
  notificationList.innerHTML = "";
  users[userId].notifications.forEach((notification) => {
    const li = document.createElement("li");
    li.textContent = `${notification.message} (${notification.timestamp.toLocaleString()})`;
    notificationList.appendChild(li);
  });
}

function partialApprove(index) {
  const submission = pendingSubmissions[index];
  const deduction = prompt("Enter how many points to deduct:");
  const awarded = Math.max(0, submission.points - Number(deduction));
  users[submission.userId].points += awarded;
  users[submission.userId].notifications.push({
    message: `Your submission for "${submission.choreName}" has been partially approved. You earned ${awarded} points after a deduction of ${deduction} points.`,
    timestamp: new Date()
  });
  alert(`Partially approved. ${awarded} points awarded.`);
  pendingSubmissions.splice(index, 1);
  renderPendingReviews();
}

function renderPendingReviews() {
  const pendingList = document.getElementById("pending-reviews-list");
  pendingList.innerHTML = "";

  pendingSubmissions.forEach((submission, index) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <p><strong>${submission.user}</strong> - ${submission.choreName}</p>
      <video width="200" controls src="${submission.proofURL}"></video><br/>
      <button onclick="approveChore(${index})">Approve</button>
      <button onclick="rejectChore(${index})">Reject</button>
      <button onclick="partialApprove(${index})">Deduct Points</button>
    `;
    pendingList.appendChild(div);
  });
}
function submitChoreProof(userId, choreId, proofURL) {
  const chore = chores.find(c => c.id === choreId);
  pendingSubmissions.push({
    userId,
    user: users[userId].name,
    choreId,
    choreName: chore.name,
    proofURL,
    points: chore.points
  });

  alert("Submission pending admin review.");
}
window.approveChore = function(index) {
  const chores = JSON.parse(localStorage.getItem("pendingChores")) || [];
  const approved = chores.splice(index, 1)[0];
  localStorage.setItem("pendingChores", JSON.stringify(chores));

  // Award points
  const points = JSON.parse(localStorage.getItem("userPoints")) || {};
  points[approved.user] = (points[approved.user] || 0) + approved.points;
  localStorage.setItem("userPoints", JSON.stringify(points));
  location.reload();
};

const mockSubmissions = [
  {
    id: 1,
    user: "Imara",
    chore: "Sweep Floor",
    proof: "assets/submissions/sweep_imara.mp4",
    status: "pending"
  },
  {
    id: 2,
    user: "Warren",
    chore: "Wash Dishes",
    proof: "assets/submissions/dishes_warren.jpg",
    status: "pending"
  }
];

function loadSubmissions() {
  const container = document.getElementById("submissions-list");
  container.innerHTML = "";

  mockSubmissions.forEach((submission) => {
    const card = document.createElement("div");
    card.className = "submission-card";

    let media;
    if (submission.proof.endsWith(".mp4")) {
      media = `<video controls width="320"><source src="${submission.proof}" type="video/mp4"></video>`;
    } else {
      media = `<img src="${submission.proof}" width="320" />`;
    }

    card.innerHTML = `
      <h3>${submission.user} – ${submission.chore}</h3>
      ${media}
      <button onclick="approveChore(${submission.id})">Approve</button>
      <button onclick="rejectChore(${submission.id})">Reject</button>
      <button onclick="deductPoints(${submission.id})">Deduct Points</button>
    `;

    container.appendChild(card);
  });
}

function approveChore(id) {
  alert(`Chore ${id} approved and points awarded.`);
  // Logic for updating user points
}

function rejectChore(id) {
  alert(`Chore ${id} rejected.`);
}

function deductPoints(id) {
  alert(`Points deducted for chore ${id}.`);
}

document.addEventListener("DOMContentLoaded", loadSubmissions);

window.rejectChore = function(index) {
  const chores = JSON.parse(localStorage.getItem("pendingChores")) || [];
  const rejected = chores.splice(index, 1)[0];
  localStorage.setItem("pendingChores", JSON.stringify(chores));
  location.reload();
};
