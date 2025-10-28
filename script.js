document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      // Temporary hardcoded users (will connect to backend later)
      const users = [
        { username: 'admin', password: 'admin123', role: 'admin' },
        { username: 'employee1', password: 'pass123', role: 'employee' }
      ];

      const user = users.find(u => u.username === username && u.password === password);

      if (user) {
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        if (user.role === 'admin') {
          window.location.href = 'admin.html';
        } else {
          window.location.href = 'dashboard.html';
        }
      } else {
        document.getElementById('error-msg').textContent = 'Invalid username or password.';
      }
    });
  }
});
