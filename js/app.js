document.addEventListener("DOMContentLoaded", function () {

  const settingsButton = document.getElementById("settingsButton");

  const addWorkoutButton = document.getElementById("addWorkoutButton");
  const workoutModal = document.getElementById("workoutModal");
  const closeWorkoutModal = document.getElementById("closeWorkoutModal");
  const workoutForm = document.getElementById("workoutForm");
  const workoutList = document.getElementById("workoutList");

  const addGoalButton = document.getElementById("addGoalButton");
  const goalModal = document.getElementById("goalModal");
  const closeGoalModal = document.getElementById("closeGoalModal");
  const goalForm = document.getElementById("goalForm");
  const goalList = document.getElementById("goalList");

  const weeklyWorkoutCount = document.getElementById("weeklyWorkoutCount");
  const currentStreak = document.getElementById("currentStreak");
  const activeGoalCount = document.getElementById("activeGoalCount");

const totalWorkoutCount = document.getElementById("totalWorkoutCount");
const totalTrainingTime = document.getElementById("totalTrainingTime");
const longestWorkout = document.getElementById("longestWorkout");
  
  let workouts =
    JSON.parse(localStorage.getItem("fitnessWorkouts")) || [];

  let goals =
    JSON.parse(localStorage.getItem("fitnessGoals")) || [];


  function saveWorkouts() {
    localStorage.setItem(
      "fitnessWorkouts",
      JSON.stringify(workouts)
    );
  }


  function saveGoals() {
    localStorage.setItem(
      "fitnessGoals",
      JSON.stringify(goals)
    );
  }


  function parseLocalDate(dateString) {
    const parts = dateString.split("-");

    return new Date(
      Number(parts[0]),
      Number(parts[1]) - 1,
      Number(parts[2])
    );
  }


  function getDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }


  function getWeeklyWorkoutTotal() {

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const day = today.getDay();

    const mondayOffset =
      day === 0 ? -6 : 1 - day;

    const monday = new Date(today);

    monday.setDate(
      today.getDate() + mondayOffset
    );

    const sunday = new Date(monday);

    sunday.setDate(
      monday.getDate() + 6
    );

    return workouts.filter(function (workout) {

      const workoutDate =
        parseLocalDate(workout.date);

      return (
        workoutDate >= monday &&
        workoutDate <= sunday
      );

    }).length;
  }


  function getWorkoutStreak() {

    if (workouts.length === 0) {
      return 0;
    }

    const workoutDates = new Set(
      workouts.map(function (workout) {
        return workout.date;
      })
    );

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    let checkDate = new Date(today);

    if (!workoutDates.has(getDateKey(checkDate))) {

      checkDate.setDate(
        checkDate.getDate() - 1
      );

      if (!workoutDates.has(getDateKey(checkDate))) {
        return 0;
      }
    }

    let streak = 0;

    while (
      workoutDates.has(
        getDateKey(checkDate)
      )
    ) {

      streak++;

      checkDate.setDate(
        checkDate.getDate() - 1
      );
    }

    return streak;
  }


  function updateSummary() {

    if (weeklyWorkoutCount) {
      weeklyWorkoutCount.textContent =
        `${getWeeklyWorkoutTotal()} / 4`;
    }

    if (currentStreak) {

      const streak =
        getWorkoutStreak();

      currentStreak.textContent =
        streak === 1
          ? "1 day"
          : `${streak} days`;
    }

    if (activeGoalCount) {
      activeGoalCount.textContent =
        goals.length;
    }
  }

  function updateProgressStats() {

  if (totalWorkoutCount) {
    totalWorkoutCount.textContent = workouts.length;
  }

  const totalMinutes = workouts.reduce(function (total, workout) {
    return total + Number(workout.duration || 0);
  }, 0);

  if (totalTrainingTime) {
    if (totalMinutes >= 60) {
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      totalTrainingTime.textContent =
        minutes > 0
          ? `${hours}h ${minutes}m`
          : `${hours}h`;
    } else {
      totalTrainingTime.textContent = `${totalMinutes} min`;
    }
  }

  const longest = workouts.reduce(function (max, workout) {
    return Math.max(max, Number(workout.duration || 0));
  }, 0);

  if (longestWorkout) {
    longestWorkout.textContent = `${longest} min`;
  }
  }

  function renderWorkouts() {

    if (!workoutList) return;

    if (workouts.length === 0) {

      workoutList.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🏋️</div>
          <h3>No workout planned</h3>
          <p>Add a workout to start building your routine.</p>
        </div>
      `;

      updateSummary();

      return;
    }


    workoutList.innerHTML = workouts.map(function (workout) {

      return `
        <div class="workout-item">

          <div>

            <h3>${workout.name}</h3>

            <p>
              ${workout.date}
              ·
              ${workout.duration} minutes
            </p>

            ${
              workout.notes
                ? `<p>${workout.notes}</p>`
                : ""
            }

          </div>

          <button
            class="delete-workout"
            data-id="${workout.id}"
          >
            Delete
          </button>

        </div>
      `;

    }).join("");


    document
      .querySelectorAll(".delete-workout")
      .forEach(function (button) {

        button.addEventListener("click", function () {

          const id =
            Number(this.dataset.id);

          workouts =
            workouts.filter(function (workout) {

              return workout.id !== id;

            });

          saveWorkouts();

          renderWorkouts();
          updateProgressStats();
        });

      });


    updateSummary();
  }


  function renderGoals() {

    if (!goalList) return;

    if (goals.length === 0) {

      goalList.innerHTML = `
        <div class="empty-state small">
          <div class="empty-icon">🎯</div>
          <h3>No goals yet</h3>
          <p>Create a fitness goal and track your progress.</p>
        </div>
      `;

      updateSummary();

      return;
    }


    goalList.innerHTML = goals.map(function (goal) {
const target = Number(goal.target) || 0;
const progress = Number(goal.progress) || 0;

const percentage =
  target > 0
    ? Math.min(100, Math.round((progress / target) * 100))
    : 0;
      return `
        <div class="goal-item">

          <div>

            <h3>${goal.name}</h3>

            <p>
              Target:
              ${goal.target}
              ${goal.unit}
            </p>

<div class="goal-progress">
  <div class="goal-progress-info">
    <span>${progress} / ${target} ${goal.unit}</span>
    <span>${percentage}%</span>
  </div>

  <div class="goal-progress-bar">
    <div
      class="goal-progress-fill"
      style="width: ${percentage}%"
    ></div>
  </div>
</div>

            <p>
              Due:
              ${goal.date}
            </p>

          </div>

          <button
            class="delete-goal"
            data-id="${goal.id}"
          >
            Delete
          </button>

        </div>
      `;

    }).join("");


    document
      .querySelectorAll(".delete-goal")
      .forEach(function (button) {

        button.addEventListener("click", function () {

          const id =
            Number(this.dataset.id);

          goals =
            goals.filter(function (goal) {

              return goal.id !== id;

            });

          saveGoals();

          renderGoals();
          updateProgressStats();
        });

      });


    updateSummary();
  }


  if (settingsButton) {

    settingsButton.addEventListener("click", function () {

      alert("Settings panel is working.");

    });
  }


  if (addWorkoutButton) {

    addWorkoutButton.addEventListener("click", function () {

      workoutModal.classList.add("is-open");

    });
  }


  if (closeWorkoutModal) {

    closeWorkoutModal.addEventListener("click", function () {

      workoutModal.classList.remove("is-open");

    });
  }


  if (workoutModal) {

    workoutModal.addEventListener("click", function (event) {

      if (event.target === workoutModal) {

        workoutModal.classList.remove("is-open");

      }
    });
  }


  if (workoutForm) {

    workoutForm.addEventListener("submit", function (event) {

      event.preventDefault();

      const workout = {

        id: Date.now(),

        name:
          document.getElementById("workoutName").value,

        date:
          document.getElementById("workoutDate").value,

        duration:
          document.getElementById("workoutDuration").value,

        notes:
          document.getElementById("workoutNotes").value

      };

      workouts.push(workout);

      saveWorkouts();

      renderWorkouts();

      workoutForm.reset();

      workoutModal.classList.remove("is-open");

    });
  }


  if (addGoalButton) {

    addGoalButton.addEventListener("click", function () {

      goalModal.classList.add("is-open");

    });
  }


  if (closeGoalModal) {

    closeGoalModal.addEventListener("click", function () {

      goalModal.classList.remove("is-open");

    });
  }


  if (goalModal) {

    goalModal.addEventListener("click", function (event) {

      if (event.target === goalModal) {

        goalModal.classList.remove("is-open");

      }
    });
  }


  if (goalForm) {

    goalForm.addEventListener("submit", function (event) {

      event.preventDefault();

      const goal = {

        id: Date.now(),

        name:
          document.getElementById("goalName").value,

        date:
          document.getElementById("goalDate").value,

        target:
  document.getElementById("goalTarget").value,

progress:
  document.getElementById("goalProgress").value,

unit:
  document.getElementById("goalUnit").value

      };

      goals.push(goal);

      saveGoals();

      renderGoals();

      goalForm.reset();

      goalModal.classList.remove("is-open");

    });
  }


  renderWorkouts();
renderGoals();
updateSummary();
updateProgressStats();

});
