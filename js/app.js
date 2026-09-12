document.addEventListener("DOMContentLoaded", function () {

  // ==============================
  // ELEMENTS
  // ==============================

  const settingsButton = document.getElementById("settingsButton");
const settingsModal = document.getElementById("settingsModal");
const closeSettingsModal = document.getElementById("closeSettingsModal");
const settingsForm = document.getElementById("settingsForm");
const weeklyTargetInput = document.getElementById("weeklyTarget");
const accentColorInput = document.getElementById("accentColor");
const backgroundColorInput = document.getElementById("backgroundColor");
  const exportDataButton = document.getElementById("exportDataButton");
const importDataInput = document.getElementById("importDataInput");
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

  const progressModal = document.getElementById("progressModal");
  const closeProgressModal = document.getElementById("closeProgressModal");
  const progressForm = document.getElementById("progressForm");
  const progressGoalId = document.getElementById("progressGoalId");
  const progressValue = document.getElementById("progressValue");

  const weeklyWorkoutCount =
    document.getElementById("weeklyWorkoutCount");

  const currentStreak =
    document.getElementById("currentStreak");

  const activeGoalCount =
    document.getElementById("activeGoalCount");

  const totalWorkoutCount =
    document.getElementById("totalWorkoutCount");

  const totalTrainingTime =
    document.getElementById("totalTrainingTime");

  const longestWorkout =
    document.getElementById("longestWorkout");


  // ==============================
  // DATA
  // ==============================

  let workouts =
    JSON.parse(localStorage.getItem("fitnessWorkouts")) || [];

  let goals =
    JSON.parse(localStorage.getItem("fitnessGoals")) || [];

  let trackerSettings =
  JSON.parse(localStorage.getItem("fitnessSettings")) || {
    weeklyTarget: 4,
    accentColor: "#536f5e",
    backgroundColor: "#f6f5f1"
  };

  // ==============================
  // SAVE DATA
  // ==============================

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

function saveSettings() {
  localStorage.setItem(
    "fitnessSettings",
    JSON.stringify(trackerSettings)
  );
}

  function applySettings() {
  document.documentElement.style.setProperty(
    "--accent",
    trackerSettings.accentColor
  );

function exportData() {
  const backup = {
    workouts: workouts,
    goals: goals,
    settings: trackerSettings,
    exportedAt: new Date().toISOString()
  };

  const blob = new Blob(
    [JSON.stringify(backup, null, 2)],
    { type: "application/json" }
  );

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = "fitness-tracker-backup.json";

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}

    function importData(file) {

  const reader = new FileReader();

  reader.onload = function (event) {

    try {

      const backup =
        JSON.parse(event.target.result);

      workouts =
        Array.isArray(backup.workouts)
          ? backup.workouts
          : [];

      goals =
        Array.isArray(backup.goals)
          ? backup.goals
          : [];

      trackerSettings =
        backup.settings || trackerSettings;

      saveWorkouts();
      saveGoals();
      saveSettings();

      applySettings();
      renderWorkouts();
      renderGoals();
      updateSummary();
      updateProgressStats();

      alert("Backup imported successfully.");

    } catch (error) {

      alert("That backup file could not be imported.");

    }

  };

  reader.readAsText(file);
    }
    
  document.documentElement.style.setProperty(
    "--bg",
    trackerSettings.backgroundColor
  );
  }
  // ==============================
  // HELPERS
  // ==============================

  function escapeHTML(value) {
    const div = document.createElement("div");
    div.textContent = value ?? "";
    return div.innerHTML;
  }

  function parseLocalDate(dateString) {

    if (!dateString) {
      return new Date(0);
    }

    const parts = dateString.split("-");

    return new Date(
      Number(parts[0]),
      Number(parts[1]) - 1,
      Number(parts[2])
    );
  }

  function getDateKey(date) {

    const year = date.getFullYear();

    const month =
      String(date.getMonth() + 1).padStart(2, "0");

    const day =
      String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }


  // ==============================
  // SUMMARY
  // ==============================

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

    const workoutDates =
      new Set(
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
        `${getWeeklyWorkoutTotal()} / ${trackerSettings.weeklyTarget}`;
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
      totalWorkoutCount.textContent =
        workouts.length;
    }

    const totalMinutes =
      workouts.reduce(function (total, workout) {

        return (
          total +
          Number(workout.duration || 0)
        );

      }, 0);


    if (totalTrainingTime) {

      if (totalMinutes >= 60) {

        const hours =
          Math.floor(totalMinutes / 60);

        const minutes =
          totalMinutes % 60;

        totalTrainingTime.textContent =
          minutes > 0
            ? `${hours}h ${minutes}m`
            : `${hours}h`;

      } else {

        totalTrainingTime.textContent =
          `${totalMinutes} min`;
      }
    }


    const longest =
      workouts.reduce(function (max, workout) {

        return Math.max(
          max,
          Number(workout.duration || 0)
        );

      }, 0);


    if (longestWorkout) {
      longestWorkout.textContent =
        `${longest} min`;
    }
  }


  // ==============================
  // WORKOUTS
  // ==============================

  function renderWorkouts() {

    if (!workoutList) return;


    if (workouts.length === 0) {

      workoutList.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🏋️</div>

          <h3>No workout planned</h3>

          <p>
            Add a workout to start building
            your routine.
          </p>
        </div>
      `;

      updateSummary();
      updateProgressStats();

      return;
    }


    workoutList.innerHTML =
      workouts.map(function (workout) {

        return `
          <div class="workout-item">

            <div>

              <h3>
                ${escapeHTML(workout.name)}
              </h3>

              <p>
                ${escapeHTML(workout.date)}
                ·
                ${escapeHTML(workout.duration)}
                minutes
              </p>

              ${
                workout.notes
                  ? `
                    <p>
                      ${escapeHTML(workout.notes)}
                    </p>
                  `
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

        button.addEventListener(
          "click",
          function () {

            const id =
              Number(this.dataset.id);

            workouts =
              workouts.filter(
                function (workout) {

                  return workout.id !== id;

                }
              );

            saveWorkouts();
            renderWorkouts();

          }
        );

      });


    updateSummary();
    updateProgressStats();
  }


  // ==============================
  // GOALS
  // ==============================

  function renderGoals() {

    if (!goalList) return;


    if (goals.length === 0) {

      goalList.innerHTML = `
        <div class="empty-state small">

          <div class="empty-icon">
            🎯
          </div>

          <h3>No goals yet</h3>

          <p>
            Create a fitness goal and track
            your progress.
          </p>

        </div>
      `;

      updateSummary();

      return;
    }


    goalList.innerHTML =
      goals.map(function (goal) {

        const target =
          Number(goal.target) || 0;

        const progress =
          Number(goal.progress) || 0;

        const percentage =
          target > 0
            ? Math.min(
                100,
                Math.round(
                  (progress / target) * 100
                )
              )
            : 0;


        return `
          <div class="goal-item">

            <div>

              <h3>
                ${escapeHTML(goal.name)}
              </h3>

              <p>
                Target:
                ${target}
                ${escapeHTML(goal.unit)}
              </p>


              <div class="goal-progress">

                <div class="goal-progress-info">

                  <span>
                    ${progress} /
                    ${target}
                    ${escapeHTML(goal.unit)}
                  </span>

                  <span>
                    ${percentage}%
                  </span>

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
                ${escapeHTML(goal.date)}
              </p>

            </div>


            <div class="goal-actions">

              <button
                class="update-goal"
                data-id="${goal.id}"
              >
                Update
              </button>

              <button
                class="delete-goal"
                data-id="${goal.id}"
              >
                Delete
              </button>

            </div>

          </div>
        `;

      }).join("");


    // UPDATE BUTTONS

    document
      .querySelectorAll(".update-goal")
      .forEach(function (button) {

        button.addEventListener(
          "click",
          function () {

            const id =
              Number(this.dataset.id);

            const goal =
              goals.find(
                function (goal) {
                  return goal.id === id;
                }
              );

            if (!goal) return;

            progressGoalId.value =
              goal.id;

            progressValue.value =
              goal.progress || 0;

            progressModal.classList.add(
              "is-open"
            );

          }
        );

      });


    // DELETE BUTTONS

    document
      .querySelectorAll(".delete-goal")
      .forEach(function (button) {

        button.addEventListener(
          "click",
          function () {

            const id =
              Number(this.dataset.id);

            goals =
              goals.filter(
                function (goal) {

                  return goal.id !== id;

                }
              );

            saveGoals();
            renderGoals();

          }
        );

      });

    document
  .querySelectorAll(".update-goal")
  .forEach(function (button) {

    button.addEventListener("click", function () {

      const id = Number(this.dataset.id);

      const goal = goals.find(function (goal) {
        return goal.id === id;
      });

      if (!goal) return;

      progressGoalId.value = goal.id;
      progressValue.value = goal.progress || 0;

      progressModal.classList.add("is-open");

    });

  });

    updateSummary();
  }


  // ==============================
  // SETTINGS
  // ==============================

  if (settingsButton) {
  settingsButton.addEventListener("click", function () {

    weeklyTargetInput.value =
      trackerSettings.weeklyTarget;

    accentColorInput.value =
      trackerSettings.accentColor;

    backgroundColorInput.value =
      trackerSettings.backgroundColor;

    settingsModal.classList.add("is-open");

  });
}

  if (closeSettingsModal) {
  closeSettingsModal.addEventListener("click", function () {
    settingsModal.classList.remove("is-open");
  });
}

if (settingsModal) {
  settingsModal.addEventListener("click", function (event) {
    if (event.target === settingsModal) {
      settingsModal.classList.remove("is-open");
    }
  });
}

  if (settingsForm) {
  settingsForm.addEventListener("submit", function (event) {

    event.preventDefault();

    trackerSettings.weeklyTarget =
      Number(weeklyTargetInput.value);

    trackerSettings.accentColor =
      accentColorInput.value;

    trackerSettings.backgroundColor =
      backgroundColorInput.value;

    saveSettings();
    applySettings();
    updateSummary();

    settingsModal.classList.remove("is-open");

  });
  }

  if (exportDataButton) {
  exportDataButton.addEventListener("click", function () {
    exportData();
  });
  }
  if (importDataInput) {
  importDataInput.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) return;

    importData(file);

    this.value = "";

  });
  }
  // ==============================
  // WORKOUT MODAL
  // ==============================

  if (addWorkoutButton) {

    addWorkoutButton.addEventListener(
      "click",
      function () {

        workoutModal.classList.add(
          "is-open"
        );

      }
    );
  }


  if (closeWorkoutModal) {

    closeWorkoutModal.addEventListener(
      "click",
      function () {

        workoutModal.classList.remove(
          "is-open"
        );

      }
    );
  }


  if (workoutModal) {

    workoutModal.addEventListener(
      "click",
      function (event) {

        if (event.target === workoutModal) {

          workoutModal.classList.remove(
            "is-open"
          );

        }

      }
    );
  }


  if (workoutForm) {

    workoutForm.addEventListener(
      "submit",
      function (event) {

        event.preventDefault();

        const workout = {

          id: Date.now(),

          name:
            document
              .getElementById("workoutName")
              .value,

          date:
            document
              .getElementById("workoutDate")
              .value,

          duration:
            document
              .getElementById("workoutDuration")
              .value,

          notes:
            document
              .getElementById("workoutNotes")
              .value

        };


        workouts.push(workout);

        saveWorkouts();
        renderWorkouts();

        workoutForm.reset();

        workoutModal.classList.remove(
          "is-open"
        );

      }
    );
  }


  // ==============================
  // GOAL MODAL
  // ==============================

  if (addGoalButton) {

    addGoalButton.addEventListener(
      "click",
      function () {

        goalModal.classList.add(
          "is-open"
        );

      }
    );
  }


  if (closeGoalModal) {

    closeGoalModal.addEventListener(
      "click",
      function () {

        goalModal.classList.remove(
          "is-open"
        );

      }
    );
  }


  if (goalModal) {

    goalModal.addEventListener(
      "click",
      function (event) {

        if (event.target === goalModal) {

          goalModal.classList.remove(
            "is-open"
          );

        }

      }
    );
  }


  if (goalForm) {

    goalForm.addEventListener(
      "submit",
      function (event) {

        event.preventDefault();


        const goal = {

          id: Date.now(),

          name:
            document
              .getElementById("goalName")
              .value,

          date:
            document
              .getElementById("goalDate")
              .value,

          target:
            document
              .getElementById("goalTarget")
              .value,

          progress:
            document
              .getElementById("goalProgress")
              .value,

          unit:
            document
              .getElementById("goalUnit")
              .value

        };


        goals.push(goal);

        saveGoals();
        renderGoals();

        goalForm.reset();

        goalModal.classList.remove(
          "is-open"
        );

      }
    );
  }


  // ==============================
  // UPDATE PROGRESS MODAL
  // ==============================

  if (closeProgressModal) {

    closeProgressModal.addEventListener(
      "click",
      function () {

        progressModal.classList.remove(
          "is-open"
        );

      }
    );
  }


  if (progressModal) {

    progressModal.addEventListener(
      "click",
      function (event) {

        if (event.target === progressModal) {

          progressModal.classList.remove(
            "is-open"
          );

        }

      }
    );
  }


  if (progressForm) {

    progressForm.addEventListener(
      "submit",
      function (event) {

        event.preventDefault();

        const id =
          Number(progressGoalId.value);

        const goal =
          goals.find(
            function (goal) {

              return goal.id === id;

            }
          );

        if (!goal) return;


        goal.progress =
          progressValue.value;


        saveGoals();
        renderGoals();

        progressForm.reset();

        progressModal.classList.remove(
          "is-open"
        );

      }
    );
  }


  // ==============================
  // INITIAL LOAD
  // ==============================
  applySettings();
  renderWorkouts();
  renderGoals();
  updateSummary();
  updateProgressStats();

});
