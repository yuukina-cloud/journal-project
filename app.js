const $ = (sel) => document.querySelector(sel);

const titleInput = $("#titleInput");
const addBtn = $("#addBtn");
const taskList = $("#taskList");
const empty = $("#empty");
const statusEl = $("#status");
const countPill = $("#countPill");
const tabs = [...document.querySelectorAll(".tab")];

let filter = "all"; // all | todo | done
let tasks = load();

function uid(){
  return Math.floor(Date.now() + Math.random() * 1000);
}

function save(){
  localStorage.setItem("journal_tasks_v1", JSON.stringify(tasks));
}

function load(){
  try{
    return JSON.parse(localStorage.getItem("journal_tasks_v1") || "[]");
  }catch{
    return [];
  }
}

function setStatus(text){ statusEl.textContent = text; }

function filteredTasks(){
  if(filter === "todo") return tasks.filter(t => t.done === 0);
  if(filter === "done") return tasks.filter(t => t.done === 1);
  return tasks;
}

function render(){
  const ft = filteredTasks();
  taskList.innerHTML = "";

  countPill.textContent = `${tasks.length} tasks`;

  if(ft.length === 0) empty.classList.remove("hidden");
  else empty.classList.add("hidden");

  for(const t of ft){
    const li = document.createElement("li");
    li.className = "item" + (t.done ? " done" : "");

    const left = document.createElement("div");
    left.className = "left";

    const check = document.createElement("button");
    check.className = "check";
    check.textContent = "✓";
    check.title = "完了/未完了";
    check.addEventListener("click", () => {
      t.done = t.done ? 0 : 1;
      save();
      render();
    });

    const textBox = document.createElement("div");
    textBox.style.minWidth = "0";

    const title = document.createElement("div");
    title.className = "title";
    title.textContent = t.title;

    const meta = document.createElement("div");
    meta.className = "meta";
    meta.textContent = (t.done ? "完了" : "未完了") + " • " + (t.created_at || "");

    textBox.appendChild(title);
    textBox.appendChild(meta);

    left.appendChild(check);
    left.appendChild(textBox);

    const trash = document.createElement("button");
    trash.className = "trash";
    trash.textContent = "🗑";
    trash.title = "削除";
    trash.addEventListener("click", () => {
      if(confirm(`削除しますか？\n\n${t.title}`)){
        tasks = tasks.filter(x => x.id !== t.id);
        save();
        render();
      }
    });

    li.appendChild(left);
    li.appendChild(trash);
    taskList.appendChild(li);
  }

  setStatus("ready");
}

function addTask(title){
  tasks.unshift({
    id: uid(),
    title,
    done: 0,
    created_at: new Date().toLocaleString()
  });
  save();
  render();
}

addBtn.addEventListener("click", () => {
  const title = titleInput.value.trim();
  if(!title) return;
  titleInput.value = "";
  addTask(title);
});

titleInput.addEventListener("keydown", (e) => {
  if(e.key === "Enter") addBtn.click();
});

tabs.forEach(btn => {
  btn.addEventListener("click", () => {
    tabs.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    filter = btn.dataset.filter;
    render();
  });
});

render();
