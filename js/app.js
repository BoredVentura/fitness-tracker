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

          const id = Number(this.dataset.id);

          workouts = workouts.filter(function (workout) {
            return workout.id !== id;
          });

          saveWorkouts();
          renderWorkouts();

        });

      });
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
      return;
    }

    goalList.innerHTML = goals.map(function (goal) {
      return `
        <div class="goal-item">

          <div>
            <h3>${goal.name}</h3>

            <p>
              Target: ${goal.target} ${goal.unit}
            </p>

            <p>
              Due: ${goal.date}
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

          const id = Number(this.dataset.id);

          goals = goals.filter(function (goal) {
            return goal.id !== id;
          });

          saveGoals();
          renderGoals();

        });

      });
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
        name: document.getElementById("workoutName").value,
        date: document.getElementById("workoutDate").value,
        duration: document.getElementById("workoutDuration").value,
        notes: document.getElementById("workoutNotes").value
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
        name: document.getElementById("goalName").value,
        date: document.getElementById("goalDate").value,
        target: document.getElementById("goalTarget").value,
        unit: document.getElementById("goalUnit").value
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

});
