/*********************************
 * DARK MODE
 *********************************/
const themeBtn = document.getElementById("themeToggle");

if (themeBtn && localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  themeBtn.textContent = "☀️";
}

if (themeBtn) {
  themeBtn.onclick = () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    themeBtn.textContent = isDark ? "☀️" : "🌙";
  };
}

/*********************************
 * AUTH CHECK
 *********************************/
if (!localStorage.getItem("userRole")) {
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
const announcementList = document.getElementById("announcementList");
const badge = document.getElementById("announcementBadge");

async function loadAnnouncements() {
  try {
    const res = await fetch("http://localhost:5000/api/announcements");
    const announcements = await res.json();

    announcementList.innerHTML = "";

    if (!announcements || announcements.length === 0) {
      announcementList.innerHTML = "<p class='muted'>No announcements yet</p>";
      badge.classList.add("hidden");
      return;
    }

    // Badge count
    badge.textContent = announcements.length;
    badge.classList.remove("hidden");

    announcements.forEach(a => {
      const div = document.createElement("div");
      div.className = "announcement-card";

      div.innerHTML = `
        <p>${a.text}</p>
        <small>${a.time}</small>
      `;

      announcementList.appendChild(div);
    });

  } catch (err) {
    console.error(err);
    announcementList.innerHTML = "<p>Error loading announcements</p>";
    badge.classList.add("hidden");
  }
}

// Load announcements on page load
loadAnnouncements();
setInterval(loadAnnouncements, 10000);
/*********************************
 * MENU DATA
 *********************************/
const weeklyMenu = {
  Monday: { breakfast: "Idli", lunch: "Rice & Sambar", dinner: "Chapati" },
  Tuesday: { breakfast: "Pongal", lunch: "Rasam Rice", dinner: "Dosa" },
  Wednesday: { breakfast: "Upma", lunch: "Sambar Rice", dinner: "Paneer Curry" },
  Thursday: { breakfast: "Idiyappam", lunch: "Curd Rice", dinner: "Fried Rice" },
  Friday: { breakfast: "Dosa", lunch: "Keerai Rice", dinner: "Mixed Veg" },
  Saturday: { breakfast: "Poori", lunch: "Chicken/Veg Curry", dinner: "Lemon Rice" },
  Sunday: { breakfast: "Masala Dosa", lunch: "Biryani", dinner: "Chapati Kurma" }
};

const days = Object.keys(weeklyMenu);
const today = days[new Date().getDay() - 1] || "Monday";

document.getElementById("breakfast").textContent =
  weeklyMenu[today].breakfast;
document.getElementById("lunch").textContent =
  weeklyMenu[today].lunch;
document.getElementById("dinner").textContent =
  weeklyMenu[today].dinner;

/*********************************
 * WEEKLY MENU TOGGLE
 *********************************/
const weeklyBox = document.getElementById("weeklyMenu");
document.getElementById("toggleWeekly").onclick = () => {
  weeklyBox.classList.toggle("hidden");
};

for (let day in weeklyMenu) {
  const div = document.createElement("div");
  div.className = "menu-day";
  div.innerHTML = `
    <strong>${day}</strong><br>
    🍳 ${weeklyMenu[day].breakfast}<br>
    🍛 ${weeklyMenu[day].lunch}<br>
    🌙 ${weeklyMenu[day].dinner}
  `;
  weeklyBox.appendChild(div);
}

/*********************************
 * FOOD RATING
 *********************************/
let selected = 0;
const stars = document.querySelectorAll(".stars span");
const msg = document.getElementById("reviewMsg");
const submitBtn = document.getElementById("submitReview");

const reviewKey = "review-" + new Date().toDateString();

if (localStorage.getItem(reviewKey)) {
  lock(JSON.parse(localStorage.getItem(reviewKey)));
}

stars.forEach(star => {
  star.onclick = () => {
    selected = +star.dataset.value;

    stars.forEach((s, i) => {
      s.className = "";
      if (i < selected) {
        s.classList.add(
          selected <= 1 ? "red" :
          selected <= 3 ? "yellow" : "green"
        );
      }
    });
  };
});

submitBtn.onclick = () => {
  if (!selected) return;

  const data = { rating: selected };
  localStorage.setItem(reviewKey, JSON.stringify(data));
  lock(data);
};

function lock(data) {
  msg.textContent = `You rated ⭐ ${data.rating}`;
  submitBtn.disabled = true;
}
