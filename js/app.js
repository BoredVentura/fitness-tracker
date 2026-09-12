document.addEventListener("DOMContentLoaded", function () {

  const settingsButton = document.getElementById("settingsButton");
  const addWorkoutButton = document.getElementById("addWorkoutButton");
  const workoutModal = document.getElementById("workoutModal");
  const closeWorkoutModal = document.getElementById("closeWorkoutModal");
  const workoutForm = document.getElementById("workoutForm");
  const workoutList = document.getElementById("workoutList");

  let workouts =
    JSON.parse(localStorage.getItem("fitnessWorkouts")) || [];

  function saveWorkouts() {
    localStorage.setItem(
      "fitnessWorkouts",
      JSON.stringify(workouts)
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

  renderWorkouts();

});      </button>
    </div>
  `).join("");

  document.querySelectorAll(".delete-workout").forEach((button) => {
    button.addEventListener("click", function () {
      const id = Number(this.dataset.id);

      workouts = workouts.filter((workout) => workout.id !== id);

      saveWorkouts();
      renderWorkouts();
    });
  });
}

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

renderWorkouts();
