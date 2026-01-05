/***********************
 * WEEKLY MENU DATA
 ***********************/
const weeklyMenu = {
  Monday: {
    breakfast: "Idli, Sambar, Chutney",
    lunch: "Rice, Sambar, Poriyal, Curd",
    dinner: "Chapati, Vegetable Kurma"
  },
  Tuesday: {
    breakfast: "Pongal, Chutney",
    lunch: "Rice, Rasam, Beans Poriyal, Curd",
    dinner: "Dosa, Tomato Chutney"
  },
  Wednesday: {
    breakfast: "Upma, Coconut Chutney",
    lunch: "Rice, Sambar, Cabbage Poriyal, Curd",
    dinner: "Chapati, Paneer Curry"
  },
  Thursday: {
    breakfast: "Idiyappam, Coconut Milk",
    lunch: "Rice, Rasam, Potato Fry, Curd",
    dinner: "Vegetable Fried Rice"
  },
  Friday: {
    breakfast: "Dosa, Sambar",
    lunch: "Rice, Sambar, Keerai Poriyal, Curd",
    dinner: "Chapati, Mixed Veg Curry"
  },
  Saturday: {
    breakfast: "Poori, Masala",
    lunch: "Rice, Chicken Curry / Veg Curry, Curd",
    dinner: "Lemon Rice"
  },
  Sunday: {
    breakfast: "Masala Dosa",
    lunch: "Special Meal (Biryani / Veg Biryani)",
    dinner: "Chapati, Kurma"
  }
};

/***********************
 * RATING LOGIC
 ***********************/
let selectedRating = 0;

const stars = document.querySelectorAll(".stars span");
const submitBtn = document.getElementById("submitReview");
const reviewText = document.getElementById("reviewText");
const reviewMsg = document.getElementById("reviewMsg");

// Today key (IMPORTANT)
const todayKey = new Date().toDateString();
const savedReview = JSON.parse(localStorage.getItem(todayKey));

/***********************
 * STAR CLICK
 ***********************/
stars.forEach(star => {
  star.addEventListener("click", () => {
    if (submitBtn.disabled) return;

    selectedRating = parseInt(star.getAttribute("data-value"));

    stars.forEach(s => s.classList.remove("active"));
    for (let i = 0; i < selectedRating; i++) {
      stars[i].classList.add("active");
    }
  });
});

/***********************
 * SUBMIT REVIEW
 ***********************/
submitBtn.addEventListener("click", () => {
  if (selectedRating === 0) {
    reviewMsg.style.color = "red";
    reviewMsg.textContent = "Please select a rating ⭐";
    return;
  }

  const reviewData = {
    rating: selectedRating,
    review: reviewText.value,
    date: todayKey
  };

  // Save using DATE as key
  localStorage.setItem(todayKey, JSON.stringify(reviewData));

  lockRating(reviewData);
});

/***********************
 * LOAD EXISTING REVIEW
 ***********************/
if (savedReview) {
  lockRating(savedReview);
}

/***********************
 * LOCK UI FUNCTION
 ***********************/
function lockRating(data) {
  submitBtn.disabled = true;
  submitBtn.textContent = "Already Submitted";

  stars.forEach(star => star.style.pointerEvents = "none");
  reviewText.disabled = true;

  stars.forEach((star, index) => {
    if (index < data.rating) {
      star.classList.add("active");
    }
  });

  reviewMsg.style.color = "green";
  reviewMsg.textContent = `You rated today’s food ⭐${data.rating}`;
}
