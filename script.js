const form = document.getElementById("studentForm");
const table = document.getElementById("studentTable");
const search = document.getElementById("search");
const empty = document.getElementById("empty");

let students = JSON.parse(localStorage.getItem("students") || "[]");

function grade(marks) {
  if (marks >= 90) return "A+";
  if (marks >= 80) return "A";
  if (marks >= 70) return "B";
  if (marks >= 60) return "C";
  if (marks >= 50) return "D";
  return "F";
}

function save() {
  localStorage.setItem("students", JSON.stringify(students));
}

function render(filter = "") {
  table.innerHTML = "";
  const q = filter.toLowerCase().trim();
  const list = students.filter(s =>
    s.name.toLowerCase().includes(q) ||
    s.roll.toLowerCase().includes(q) ||
    s.course.toLowerCase().includes(q)
  );

  empty.style.display = list.length ? "none" : "block";

  list.forEach((s) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${escapeHtml(s.name)}</td>
      <td>${escapeHtml(s.roll)}</td>
      <td>${escapeHtml(s.course)}</td>
      <td>${s.marks}</td>
      <td>${grade(s.marks)}</td>
      <td><button class="delete" onclick="removeStudent('${s.id}')">Delete</button></td>
    `;
    table.appendChild(row);
  });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, c => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
  }[c]));
}

form.addEventListener("submit", e => {
  e.preventDefault();
  const student = {
    id: Date.now().toString(),
    name: document.getElementById("name").value.trim(),
    roll: document.getElementById("roll").value.trim(),
    course: document.getElementById("course").value.trim(),
    marks: Number(document.getElementById("marks").value)
  };
  students.push(student);
  save();
  render(search.value);
  form.reset();
});

function removeStudent(id) {
  students = students.filter(s => s.id !== id);
  save();
  render(search.value);
}

search.addEventListener("input", () => render(search.value));
render();
