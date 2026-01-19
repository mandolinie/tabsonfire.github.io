// @prepros-prepend 10_cookies.js
// @prepros-prepend 20_tabsonfire.js

document.addEventListener('DOMContentLoaded', () => {
  initCookies();
  initTabsOnFire();
});

// --- Active nav elements using body ID ---
const currentPage = document.body.id;

document.querySelectorAll("nav a").forEach(link => {
  if (link.dataset.page === currentPage) {
    link.classList.add("active");
  }
});

// --- Copyright year ---
document.getElementById('year').textContent = new Date().getFullYear();