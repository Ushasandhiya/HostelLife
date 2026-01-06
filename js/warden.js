document.addEventListener("DOMContentLoaded", () => {
  const themeBtn = document.getElementById("themeToggle");

  if (!themeBtn) {
    console.error("Theme toggle not found");
    return;
  }

  // Apply saved theme
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    themeBtn.textContent = "☀️";
  }

  themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    const isDark = document.body.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    themeBtn.textContent = isDark ? "☀️" : "🌙";
  });
});


// -------- AUTH CHECK ----------
if (localStorage.getItem("userRole") !== "warden") {
  window.location.href = "index.html";
}

// -------- LOGOUT ----------
document.getElementById("logoutBtn").onclick = () => {
  localStorage.removeItem("userRole");
  window.location.href = "index.html";
};

// -------- ANNOUNCEMENTS ----------
let announcements = JSON.parse(localStorage.getItem("announcements")) || [];
const list = document.getElementById("announcementList");
const msg = document.getElementById("announceMsg");

function renderAnnouncements() {
  list.innerHTML = "";

  if (announcements.length === 0) {
    list.innerHTML = "<p class='muted'>No announcements yet</p>";
    return;
  }

  announcements.forEach((a, index) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <p>${a}</p>
      <button data-i="${index}">Delete</button>
    `;
    div.querySelector("button").onclick = () => {
      announcements.splice(index, 1);
      localStorage.setItem("announcements", JSON.stringify(announcements));
      renderAnnouncements();
    };
    list.appendChild(div);
  });
}

document.getElementById("postAnnouncement").onclick = () => {
  const text = document.getElementById("announcementText").value.trim();
  if (!text) {
    msg.textContent = "Announcement cannot be empty";
    msg.style.color = "red";
    return;
  }

  announcements.unshift(text);
  localStorage.setItem("announcements", JSON.stringify(announcements));
  msg.textContent = "Announcement posted ✅";
  msg.style.color = "green";
  document.getElementById("announcementText").value = "";
  renderAnnouncements();
};

renderAnnouncements();

// -------- RATINGS STATS ----------
const ratings = Object.keys(localStorage)
  .filter(k => k.startsWith("review-"))
  .map(k => JSON.parse(localStorage.getItem(k)).rating);

document.getElementById("totalReviews").textContent = ratings.length;

if (ratings.length > 0) {
  const avg = ratings.reduce((a,b)=>a+b,0) / ratings.length;
  document.getElementById("avgRating").textContent = avg.toFixed(1);
} else {
  document.getElementById("avgRating").textContent = "–";
}
