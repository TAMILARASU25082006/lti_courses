// Global Password Eye Toggle Helper Function
function togglePassword(inputId, btnId) {
  const input = document.getElementById(inputId);
  const btn = document.getElementById(btnId);
  if (!input) return;

  if (input.type === 'password') {
    input.type = 'text';
    if (btn) {
      btn.innerHTML = `
        <svg class="w-5 h-5 text-goldenYellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.025 10.025 0 011.982-.313c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21M3 3l18 18"/>
        </svg>`;
    }
  } else {
    input.type = 'password';
    if (btn) {
      btn.innerHTML = `
        <svg class="w-5 h-5 text-gray-400 hover:text-goldenYellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
        </svg>`;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Navigation Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('show');
    });
  }

  // Registration Form Dynamic Level Field Toggle
  const courseSelect = document.getElementById('selectedCourse');
  const levelGroup = document.getElementById('roboticsLevelGroup');

  if (courseSelect && levelGroup) {
    const updateLevelVisibility = () => {
      if (courseSelect.value && courseSelect.value.toLowerCase().includes('robotics')) {
        levelGroup.style.display = 'block';
      } else {
        levelGroup.style.display = 'none';
      }
    };
    courseSelect.addEventListener('change', updateLevelVisibility);
    updateLevelVisibility(); // Run on load
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth'
          });
        }
      }
    });
  });
});
