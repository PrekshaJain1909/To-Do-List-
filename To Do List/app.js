document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("taskName");
  const startInput = document.getElementById("startTime");
  const endInput = document.getElementById("endTime");
  const categoryInput = document.getElementById("category");
  const addBtn = document.getElementById("addBtn");
  const todoList = document.getElementById("todoList");
  const nowTask = document.getElementById("nowTask");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function timeToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  }

  function getTimeUntilStart(fromTime) {
    const now = new Date();
    const currentMin = now.getHours() * 60 + now.getMinutes();
    const taskStartMin = timeToMinutes(fromTime);
    return taskStartMin - currentMin;
  }

  function renderTasks() {
    todoList.innerHTML = "";
    nowTask.innerHTML = "";

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    tasks.sort((a, b) => timeToMinutes(a.from) - timeToMinutes(b.from));

    tasks.forEach((task, index) => {
      const li = document.createElement("li");

      const leftSide = document.createElement("div");
      leftSide.classList.add("left-side");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.completed;
      checkbox.addEventListener("change", () => {
        task.completed = checkbox.checked;
        saveTasks();
        renderTasks();
      });

      const taskText = document.createElement("span");
      taskText.textContent = `${task.name} (${task.category})`;
      taskText.classList.add("task-text");
      if (task.completed) {
        taskText.classList.add("completed");
      }

      const countdown = document.createElement("small");
      const minsLeft = getTimeUntilStart(task.from);
      countdown.textContent =
        minsLeft > 0 ? `⏳ ${minsLeft} min left` : minsLeft === 0 ? "🟢 Starting now!" : "";

      leftSide.appendChild(checkbox);
      leftSide.appendChild(taskText);
      if (!task.completed && minsLeft >= 0) leftSide.appendChild(countdown);

      const rightSide = document.createElement("div");
      rightSide.classList.add("right-side");

      const timeStamp = document.createElement("small");
      timeStamp.textContent = `🕒 ${task.from} - ${task.to}`;
      timeStamp.classList.add("timestamp");

      const delBtn = document.createElement("button");
      delBtn.textContent = "🗑️";
      delBtn.classList.add("deleteBtn");
      delBtn.addEventListener("click", () => {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
      });

      rightSide.appendChild(timeStamp);
      rightSide.appendChild(delBtn);

      li.appendChild(leftSide);
      li.appendChild(rightSide);

      const fromMin = timeToMinutes(task.from);
      const toMin = timeToMinutes(task.to);
      const isCurrentTask =
        currentMinutes >= fromMin && currentMinutes <= toMin && !task.completed;

      if (isCurrentTask) {
        const nowLi = li.cloneNode(true);
        nowLi.classList.add("now-highlight");
        nowTask.appendChild(nowLi);
      }

      todoList.appendChild(li);

      // Notify 5 minutes before
      if (!task.notified && minsLeft === 5) {
        showNotification(task.name, task.from);
        task.notified = true;
        saveTasks();
      }
    });
  }

  addBtn.addEventListener("click", () => {
    const name = taskInput.value.trim();
    const from = startInput.value;
    const to = endInput.value;
    const category = categoryInput.value.trim() || "General";

    if (!name || !from || !to) {
      alert("Please fill in all fields.");
      return;
    }

    const task = {
      name,
      from,
      to,
      category,
      completed: false,
      notified: false
    };

    tasks.push(task);
    saveTasks();
    renderTasks();

    taskInput.value = "";
    startInput.value = "";
    endInput.value = "";
    categoryInput.value = "";
  });

  function showNotification(taskName, startTime) {
    if (Notification.permission === "granted") {
      new Notification(`⏰ Reminder`, {
        body: `"${taskName}" starts at ${startTime}`,
        icon: "https://cdn-icons-png.flaticon.com/512/2659/2659360.png"
      });
    }
  }

  if (Notification.permission !== "granted") {
    Notification.requestPermission();
  }

  renderTasks();
  setInterval(renderTasks, 60000); // Update every 1 min
});
