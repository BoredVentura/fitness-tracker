const settingsButton = document.getElementById("settingsButton");

const addWorkoutButton = document.getElementById("addWorkoutButton");
const workoutModal = document.getElementById("workoutModal");
const closeWorkoutModal = document.getElementById("closeWorkoutModal");
const workoutForm = document.getElementById("workoutForm");

settingsButton.addEventListener("click", function () {
  alert("Settings panel is working.");
});

addWorkoutButton.addEventListener("click", function () {
  workoutModal.classList.add("is-open");
});

closeWorkoutModal.addEventListener("click", function () {
  workoutModal.classList.remove("is-open");
});

workoutModal.addEventListener("click", function (event) {
  if (event.target === workoutModal) {
    workoutModal.classList.remove("is-open");
  }
});

workoutForm.addEventListener("submit", function (event) {
  event.preventDefault();

  alert("Workout saved.");

  workoutForm.reset();
  workoutModal.classList.remove("is-open");
});
