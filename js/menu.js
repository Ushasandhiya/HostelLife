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

let selectedRating = 0;

const stars = document.querySelectorAll(".stars span");
const submitBtn = document.getElementById("submitReview");
const reviewText = document.getElementById("reviewText");
const reviewMsg = document.getElementById("reviewMsg");

// Star click logic
stars.forEach(star => {
  star.addEventListener("click", () => {
    selectedRating = star.getAttribute("data-value");

    stars.forEach(s => s.classList.remove("active"));
    for (let i = 0; i < selectedRating; i++) {
      stars[i].classList.add("active");
    }
  });
});

// Submit review
submitBtn.addEventListener("click", () => {
  if (selectedRating === 0) {
    reviewMsg.style.color = "red";
    reviewMsg.textContent = "Please select a rating ⭐";
    return;
  }

  const reviewData = {
    rating: selectedRating,
    review: reviewText.value,
    date: new Date().toDateString()
  };

  localStorage.setItem("todayReview", JSON.stringify(reviewData));

  reviewMsg.style.color = "green";
  reviewMsg.textContent = "Thanks! Your review has been submitted 😊";

  reviewText.value = "";
});

