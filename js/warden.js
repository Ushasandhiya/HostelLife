/*********************************
 * DARK MODE (SAFE INIT)
 *********************************/
document.addEventListener("DOMContentLoaded", () => {
  const themeBtn = document.getElementById("themeToggle");

  if (themeBtn) {
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
 * ANNOUNCEMENTS (BACKEND)
 *********************************/
const list = document.getElementById("announcementList");
const msg = document.getElementById("announceMsg");
const postBtn = document.getElementById("postAnnouncement");

/* Load announcements from backend */
async function loadAnnouncements() {
  try {
    const res = await fetch("https://hostellife-backend.onrender.com/api/announcements");
    const announcements = await res.json();

    list.innerHTML = "";

    if (!announcements || announcements.length === 0) {
      list.innerHTML = "<p class='muted'>No announcements yet</p>";
      return;
    }

    announcements.forEach(a => {
      const div = document.createElement("div");
      div.className = "announcement-item";

      div.innerHTML = `
        <p>${a.text}</p>
        <small>${a.time}</small>
      `;

      list.appendChild(div);
    });

  } catch (err) {
    list.innerHTML = "<p>Error loading announcements</p>";
    console.error(err);
  }
}

/* Post announcement to backend */
postBtn.onclick = async () => {
  const text = document.getElementById("announcementText").value.trim();

  if (!text) {
    msg.textContent = "Announcement cannot be empty";
    msg.style.color = "red";
    return;
  }

  try {
    const res = await fetch("https://hostellife-backend.onrender.com/api/announcements", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text })
    });

    if (!res.ok) throw new Error("Failed");

    msg.textContent = "Announcement posted ✅";
    msg.style.color = "green";
    document.getElementById("announcementText").value = "";

    loadAnnouncements(); // refresh list

  } catch (err) {
    msg.textContent = "Failed to post announcement";
    msg.style.color = "red";
    console.error(err);
  }
};

// Initial load
loadAnnouncements();

/*********************************
 * RATINGS STATS (UNCHANGED)
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

const total = ratings.length;
document.getElementById("totalReviews").textContent = total;

const starsEl = document.getElementById("ratingStars");
const fillEl = document.getElementById("ratingFill");

if (total > 0) {
  const avg = ratings.reduce((a, b) => a + b, 0) / total;

  document.getElementById("avgRating").textContent = avg.toFixed(1);

  const percent = (avg / 5) * 100;
  fillEl.style.width = percent + "%";

  starsEl.className =
    "rating-stars " +
    (avg <= 1.5 ? "red" : avg <= 3.5 ? "yellow" : "green");
} else {
  document.getElementById("avgRating").textContent = "–";
  fillEl.style.width = "0%";
  starsEl.className = "rating-stars";
}
