// === USERS DATABASE (TEMP LOCAL FOR NOW) ===
let users = [
  { username: "admin", password: "admin123", role: "admin", forms: [] },
  { 
    username: "employee1", 
    password: "password123", 
    role: "employee", 
    forms: [
      { name: "Employee Purchase Form", link: "https://script.google.com/macros/s/AKfycbwtMxTjHv8vDNfZeeoDl92i2lFeEivlvmZwIjkuxUBylhjIzInYN6gyXqS2qwAQ9aCLCQ/exec", status: "pending" }
    ] 
  }
];

// === LOGIN FUNCTIONALITY ===
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    
    const user = users.find(u => u.username === username && u.password === password);
    const errorMsg = document.getElementById("error-msg");

    if (!user) {
      errorMsg.textContent = "Invalid username or password!";
      return;
    }

    localStorage.setItem("loggedInUser", JSON.stringify(user));

    if (user.role === "admin") {
      window.location.href = "admin.html";
    } else {
      window.location.href = "dashboard.html";
    }
  });
}

// === LOGOUT FUNCTION ===
function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
}

// === PAGE INITIALIZATION ===
document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const path = window.location.pathname;

  // Redirect to login if not logged in
  if (!user && !path.endsWith("index.html")) {
    window.location.href = "index.html";
    return;
  }

  // Employee Dashboard
  if (path.includes("dashboard.html")) {
    document.getElementById("employeeName").textContent = user.username;
    loadEmployeeForms(user);
  }

  // Admin Dashboard
  if (path.includes("admin.html")) {
    loadUsers();
  }
});

// === EMPLOYEE DASHBOARD ===
function loadEmployeeForms(user) {
  const list = document.getElementById("formsList");
  if (!user.forms || user.forms.length === 0) {
    list.innerHTML = "<p>No forms assigned yet.</p>";
    return;
  }

  list.innerHTML = user.forms.map(f => `
    <div class="form-item">
      <a href="${f.link}" target="_blank">${f.name}</a> — <span>Status: ${f.status}</span>
    </div>
  `).join("");
}

// === ADMIN DASHBOARD ===
function loadUsers() {
  const list = document.getElementById("usersList");
  list.innerHTML = users.map(u => `
    <div class="user-item">
      <strong>${u.username}</strong> (${u.role})
      ${u.forms && u.forms.length > 0 ? 
        `<ul>${u.forms.map(f => `<li>${f.name}</li>`).join("")}</ul>` 
        : "<em>No forms assigned</em>"}
    </div>
  `).join("");
}

function assignForm() {
  const username = document.getElementById("assign-username").value.trim();
  const formName = document.getElementById("form-name").value.trim();
  const formLink = document.getElementById("form-link").value.trim();

  if (!username || !formName || !formLink) {
    alert("Please fill out all fields!");
    return;
  }

  const user = users.find(u => u.username === username && u.role === "employee");
  if (!user) {
    alert("Employee not found.");
    return;
  }

  user.forms.push({ name: formName, link: formLink, status: "pending" });
  alert(`Form "${formName}" assigned to ${username}!`);

  loadUsers();
  document.getElementById("assign-username").value = "";
  document.getElementById("form-name").value = "";
  document.getElementById("form-link").value = "";
}
