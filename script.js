/**
 * ZUMS Computer Society - Shared JavaScript
 * Features: Canvas neon particle tracker, Bootstrap modals, mobile nav,
 * smooth scroll, form handling, and shared utilities.
 */

(function () {
  'use strict';

  // ==========================================
  // 1. NEON PARTICLE POINTER TRACKER (CANVAS)
  // ==========================================
  const canvas = document.getElementById('pointerCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let width = window.innerWidth;
    let height = window.innerHeight;

    function resizeCanvas() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    function createParticle(x, y) {
      particles.push({
        x: x,
        y: y,
        size: Math.random() * 5 + 3,
        alpha: 0.9,
        life: 1
      });
    }

    function animateParticles() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 0, ${p.alpha})`;
        ctx.fill();
        p.size *= 0.96;
        p.alpha -= 0.02;
        if (p.alpha <= 0.02) {
          particles.splice(i, 1);
          i--;
        }
      }
      requestAnimationFrame(animateParticles);
    }
    animateParticles();

    window.addEventListener('mousemove', (e) => {
      createParticle(e.clientX, e.clientY);
    });
    window.addEventListener('touchmove', (e) => {
      if (e.touches) {
        for (let i = 0; i < e.touches.length; i++) {
          createParticle(e.touches[i].clientX, e.touches[i].clientY);
        }
      }
    });
  }

  // ==========================================
  // 2. BOOTSTRAP MODAL HELPER (replaces alert)
  // ==========================================
  window.showZcsModal = function (title, message, type = 'info') {
    const modalId = 'zcsSharedModal';
    let modalEl = document.getElementById(modalId);

    // Build modal if it doesn't exist
    if (!modalEl) {
      const modalHtml = `
        <div class="modal fade" id="${modalId}" tabindex="-1" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="${modalId}Title">${title}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body" id="${modalId}Body">${message}</div>
              <div class="modal-footer">
                <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Got it</button>
              </div>
            </div>
          </div>
        </div>
      `;
      const wrapper = document.createElement('div');
      wrapper.innerHTML = modalHtml;
      document.body.appendChild(wrapper.firstElementChild);
      modalEl = document.getElementById(modalId);
    }

    document.getElementById(modalId + 'Title').textContent = title;
    document.getElementById(modalId + 'Body').innerHTML = message;

    const bsModal = bootstrap.Modal.getOrCreateInstance(modalEl);
    bsModal.show();
  };

  // ==========================================
  // 3. MOBILE NAVBAR COLLAPSE HANDLING
  // ==========================================
  const navbarCollapse = document.getElementById('mainNavbar');
  if (navbarCollapse) {
    // Close navbar when clicking a nav link (on mobile)
    navbarCollapse.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
        if (bsCollapse && window.innerWidth < 992) {
          bsCollapse.hide();
        }
      });
    });
  }

  // ==========================================
  // 4. SMOOTH SCROLL FOR ANCHOR LINKS
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '' || targetId === '#!') return;
      const targetElem = document.querySelector(targetId);
      if (targetElem) {
        e.preventDefault();
        const headerOffset = 90;
        const elementPosition = targetElem.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ==========================================
  // 5. FORM SUBMISSION HANDLERS (with Modals)
  // ==========================================
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      window.showZcsModal('Welcome Back!', 'You have been logged in successfully. Redirecting to dashboard...');
      setTimeout(() => {
        window.location.href = 'admin.html';
      }, 2000);
    });
  }

  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const pwd = document.getElementById('regPassword').value;
      const cpwd = document.getElementById('regConfirmPassword').value;
      if (pwd !== cpwd) {
        window.showZcsModal('Password Mismatch', 'Your passwords do not match. Please try again.', 'warning');
        return;
      }
      window.showZcsModal('Account Created!', 'Your account has been registered successfully. Welcome to ZCS!');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 2000);
    });
  }

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      window.showZcsModal('Message Sent!', 'Thank you for reaching out. We will get back to you within 24 hours.');
      this.reset();
    });
  }

  const eventRegForm = document.getElementById('eventRegForm');
  if (eventRegForm) {
    eventRegForm.addEventListener('submit', function (e) {
      e.preventDefault();
      window.showZcsModal('Registration Submitted!', 'Your event registration has been received. Check your email for confirmation details.');
      this.reset();
    });
  }

  // ==========================================
  // 6. "JOIN / REGISTER" BUTTON PLACEHOLDERS
  // ==========================================
  document.querySelectorAll('.join-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      window.showZcsModal('Join ZCS', 'Registration portal opens next week. Sign up now to secure your spot in our upcoming workshops and competitions!');
    });
  });

  // ==========================================
  // 7. "READ MORE" BLOG BUTTONS
  // ==========================================
  document.querySelectorAll('.read-more').forEach((btn) => {
    btn.addEventListener('click', () => {
      window.showZcsModal('Coming Soon', 'Full blog post is being drafted. Stay tuned for more insights from ZUMS Computer Society.');
    });
  });

  // ==========================================
  // 8. ANIMATE ON SCROLL (simple intersection)
  // ==========================================
  const animateElements = document.querySelectorAll('.animate-on-scroll');
  if (animateElements.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-up');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    animateElements.forEach((el) => observer.observe(el));
  }

  // ==========================================
  // 9. NAVBAR SCROLL EFFECT
  // ==========================================
  const mainNav = document.querySelector('.navbar');
  if (mainNav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        mainNav.style.background = 'rgba(0, 0, 0, 0.9)';
        mainNav.style.boxShadow = '0 4px 20px rgba(0, 255, 0, 0.1)';
      } else {
        mainNav.style.background = 'rgba(0, 0, 0, 0.75)';
        mainNav.style.boxShadow = 'none';
      }
    });
  }

  // ==========================================
  // 10. ADMIN SIDEBAR TOGGLE (mobile)
  // ==========================================
  const sidebarToggle = document.getElementById('sidebarToggle');
  const adminSidebar = document.getElementById('adminSidebar');
  if (sidebarToggle && adminSidebar) {
    sidebarToggle.addEventListener('click', () => {
      adminSidebar.classList.toggle('d-none');
      adminSidebar.classList.toggle('d-block');
    });
  }

  // ==========================================
  // 11. YEAR AUTO-UPDATE
  // ==========================================
  const yearSpans = document.querySelectorAll('.year-update');
  yearSpans.forEach((span) => {
    span.textContent = new Date().getFullYear();
  });

    // ==========================================
  // 12. ACTIVE NAVBAR LINK ON SCROLL
  // ==========================================
  const navLinks = document.querySelectorAll('.navbar .nav-link[href^="#"]');

  function updateActiveNavLink() {
    let currentSection = '';

    const sections = document.querySelectorAll('section[id]');

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;

      if (
        window.scrollY >= sectionTop &&
        window.scrollY < sectionTop + sectionHeight
      ) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active-link');

      const href = link.getAttribute('href');

      if (
        currentSection &&
        href === `#${currentSection}`
      ) {
        link.classList.add('active-link');
      }

  // Special case for Wings dropdown
      if (
        ['workshops-wing', 'robotics', 'esports', 'programming', 'ai', 'cybersecurity'].includes(currentSection) &&
        href === '#wings'
      ) {
        link.classList.add('active-link');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink);
  updateActiveNavLink();
  
  // ==========================================
// ==========================================
// 13. ACTIVE NAV LINK FOR MULTIPLE PAGES
// ==========================================
const currentPage = window.location.pathname.split('/').pop();

document.querySelectorAll('.navbar .nav-link').forEach((link) => {
  const href = link.getAttribute('href');

  // Only apply on standalone pages
  if (currentPage === 'blog.html' && href === 'blog.html') {
    link.classList.add('active-link');
  }

  if (currentPage === 'forms.html' && href === 'forms.html') {
    link.classList.add('active-link');
  }

  if (currentPage === 'contact.html' && href === 'contact.html') {
    link.classList.add('active-link');
  }

  if (currentPage === 'events.html' && href === 'events.html') {
    link.classList.add('active-link');
  }
});

document.querySelectorAll('.navbar .dropdown-toggle').forEach((dropdown) => {
  dropdown.addEventListener('click', (e) => {
    if (window.innerWidth >= 992) {
      e.preventDefault();
    }
  });
});

})();
