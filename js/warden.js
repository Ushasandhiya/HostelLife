/*********************************
 * DARK MODE (SAFE INIT)
 *********************************/
document.addEventListener("DOMContentLoaded", () => {
  const themeBtn = document.getElementById("themeToggle");

  if (themeBtn) {
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
  }
});

/*********************************
 * AUTH CHECK
 *********************************/
if (localStorage.getItem("userRole") !== "warden") {
  window.location.href = "index.html";
}

/*********************************
 * LOGOUT
 *********************************/
document.getElementById("logoutBtn").onclick = () => {
  localStorage.removeItem("userRole");
  window.location.href = "index.html";
};

/*********************************
 * ANNOUNCEMENTS (FIXED)
 *********************************/
let announcements =
  JSON.parse(localStorage.getItem("announcements")) || [];

const list = document.getElementById("announcementList");
const msg = document.getElementById("announceMsg");

/* Render announcements */
function renderAnnouncements() {
  list.innerHTML = "";

  if (announcements.length === 0) {
    list.innerHTML = "<p class='muted'>No announcements yet</p>";
    return;
  }

  announcements.forEach((a, index) => {
    // Guard against old corrupted data
    if (!a.text || !a.time) return;

    const div = document.createElement("div");
    div.className = "announcement-item";

    div.innerHTML = `
      <p>${a.text}</p>
      <small>${a.time}</small><br />
      <button>Delete</button>
    `;

    div.querySelector("button").onclick = () => {
      announcements.splice(index, 1);
      localStorage.setItem(
        "announcements",
        JSON.stringify(announcements)
      );
      renderAnnouncements();
    };

    list.appendChild(div);
  });
}

/* Post announcement */
document.getElementById("postAnnouncement").onclick = () => {
  const text = document
    .getElementById("announcementText")
    .value.trim();

  if (!text) {
    msg.textContent = "Announcement cannot be empty";
    msg.style.color = "red";
    return;
  }

  const newAnnouncement = {
    text: text,
    time: new Date().toLocaleString()
  };

  announcements.unshift(newAnnouncement);
  localStorage.setItem(
    "announcements",
    JSON.stringify(announcements)
  );

  msg.textContent = "Announcement posted ✅";
  msg.style.color = "green";
  document.getElementById("announcementText").value = "";

  renderAnnouncements();
};

renderAnnouncements();

/*********************************
 * RATINGS STATS
 *********************************/
const ratings = Object.keys(localStorage)
  .filter(k => k.startsWith("review-"))
  .map(k => {
    try {
      return JSON.parse(localStorage.getItem(k)).rating;
    } catch {
      return null;
    }
  })
  .filter(r => typeof r === "number");

document.getElementById("totalReviews").textContent = ratings.length;

if (ratings.length > 0) {
  const avg =
    ratings.reduce((a, b) => a + b, 0) / ratings.length;
  document.getElementById("avgRating").textContent =
    avg.toFixed(1);
} else {
  document.getElementById("avgRating").textContent = "–";
}
