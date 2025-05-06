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

window.rejectChore = function(index) {
  const chores = JSON.parse(localStorage.getItem("pendingChores")) || [];
  const rejected = chores.splice(index, 1)[0];
  localStorage.setItem("pendingChores", JSON.stringify(chores));
  location.reload();
};
