// users.js
const users = [
  { id: 'bracelet_001', name: 'Imara', avatar: '🧕', vitals: { heartRate: 78, temp: 36.5 } },
  { id: 'bracelet_002', name: 'Warren', avatar: '👨🏾‍🦳', vitals: { heartRate: 82, temp: 36.7 } },
  { id: 'bracelet_003', name: 'Nia', avatar: '👵🏿', vitals: { heartRate: 70, temp: 36.6 } }
];
<div id="notifications">
  <h3>Notifications</h3>
  <ul id="notificationList"></ul>
</div>

// Listening to user point changes
onSnapshot(collection(db, "users"), snap => {
  const lb = document.getElementById("leaderboardList");
  lb.innerHTML = "";
  snap.docs
    .map(d => d.data())
    .sort((a,b)=>b.points - a.points)
    .forEach(u => lb.innerHTML += `<li>${u.name}: ${u.points}</li>`);
});
let currentUser = users[0]; // default active user
