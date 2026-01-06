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
 * STUDENT ANNOUNCEMENTS + BADGE
 *********************************/
let announcements =
  JSON.parse(localStorage.getItem("announcements")) || [];

const announcementList =
  document.getElementById("announcementList");

const badge =
  document.getElementById("announcementBadge");

/* Clean corrupted / old data */
announcements = announcements.filter(
  a => typeof a === "object" && a.text && a.time
);

/* ----- Badge count ----- */
if (announcements.length > 0) {
  badge.textContent = announcements.length;
  badge.classList.remove("hidden");
} else {
  badge.classList.add("hidden");
}

/* ----- Display announcements ----- */
announcementList.innerHTML = "";

if (announcements.length === 0) {
  announcementList.innerHTML =
    "<p class='muted'>No announcements yet</p>";
} else {
  announcements.forEach(a => {
    const div = document.createElement("div");
    div.className = "announcement-item";

    div.innerHTML = `
      <p>${a.text}</p>
      <small>${a.time}</small>
    `;

    announcementList.appendChild(div);
  });
}

/*********************************
 * MENU DATA
 *********************************/
const weeklyMenu = {
  Monday:{ breakfast:"Idli", lunch:"Rice & Sambar", dinner:"Chapati" },
  Tuesday:{ breakfast:"Pongal", lunch:"Rasam Rice", dinner:"Dosa" },
  Wednesday:{ breakfast:"Upma", lunch:"Sambar Rice", dinner:"Paneer Curry" },
  Thursday:{ breakfast:"Idiyappam", lunch:"Curd Rice", dinner:"Fried Rice" },
  Friday:{ breakfast:"Dosa", lunch:"Keerai Rice", dinner:"Mixed Veg" },
  Saturday:{ breakfast:"Poori", lunch:"Chicken/Veg Curry", dinner:"Lemon Rice" },
  Sunday:{ breakfast:"Masala Dosa", lunch:"Biryani", dinner:"Chapati Kurma" }
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
 * RATING
 *********************************/
let selected = 0;
const stars = document.querySelectorAll(".stars span");
const msg = document.getElementById("reviewMsg");
const key = "review-" + new Date().toDateString();

if (localStorage.getItem(key)) {
  lock(JSON.parse(localStorage.getItem(key)));
}

stars.forEach(star => {
  star.onclick = () => {
    selected = +star.dataset.value;
    stars.forEach((s,i)=>{
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

document.getElementById("submitReview").onclick = () => {
  if (!selected) return;

  const data = { rating: selected };
  localStorage.setItem(key, JSON.stringify(data));
  lock(data);
};

function lock(data) {
  msg.textContent = `You rated ⭐ ${data.rating}`;
  document.getElementById("submitReview").disabled = true;
}
