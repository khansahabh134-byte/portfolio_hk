/*==================================================================
  PORTFOLIO — MAIN SCRIPT (Vanilla JS, no dependencies)
  Sections:
    1. Loading screen
    2. Theme (dark/light) toggle
    3. Sticky navbar + active link highlight
    4. Mobile menu
    5. Custom cursor
    6. Smooth scroll (in-page anchors)
    7. Scroll reveal animations (IntersectionObserver)
    8. Typing effect (hero role text)
    9. Animated counters
    10. Skill bar animation
    11. Portfolio filter
    12. Contact form validation
    13. Scroll-to-top button
==================================================================*/

document.addEventListener('DOMContentLoaded', function () {

  /* ---------------- 1. LOADING SCREEN ---------------- */
  const loader = document.querySelector('.loader');
  if (loader) {
    window.addEventListener('load', function () {
      setTimeout(function () {
        loader.classList.add('loaded');
      }, 350);
    });
    // Fallback in case 'load' already fired
    setTimeout(function () { loader.classList.add('loaded'); }, 1800);
  }

  /* ---------------- 2. THEME TOGGLE ---------------- */
  const root = document.documentElement;
  const themeToggle = document.querySelector('.theme-toggle');
  const savedTheme = localStorage.getItem('portfolio-theme');

  if (savedTheme) {
    root.setAttribute('data-theme', savedTheme);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    root.setAttribute('data-theme', 'dark');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('portfolio-theme', next);
    });
  }

  /* ---------------- 3. STICKY NAVBAR + ACTIVE LINK ---------------- */
  const navbar = document.querySelector('.navbar');
  function handleNavScroll() {
    if (!navbar) return;
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  handleNavScroll();
  window.addEventListener('scroll', handleNavScroll, { passive: true });

  // Highlight active nav link based on current page filename
  const currentPage = (window.location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('.nav-links a').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ---------------- 4. MOBILE MENU ---------------- */
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function () {
      menuToggle.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        menuToggle.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  /* ---------------- 5. CUSTOM CURSOR ---------------- */
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');
  if (cursorDot && cursorRing && window.matchMedia('(pointer: fine)').matches) {
    let ringX = 0, ringY = 0, targetX = 0, targetY = 0;

    window.addEventListener('mousemove', function (e) {
      targetX = e.clientX;
      targetY = e.clientY;
      cursorDot.style.left = targetX + 'px';
      cursorDot.style.top = targetY + 'px';
    });

    function animateRing() {
      ringX += (targetX - ringX) * 0.18;
      ringY += (targetY - ringY) * 0.18;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    document.querySelectorAll('a, button, .filter-btn, input, textarea').forEach(function (el) {
      el.addEventListener('mouseenter', function () { cursorRing.classList.add('hovering'); });
      el.addEventListener('mouseleave', function () { cursorRing.classList.remove('hovering'); });
    });
  }

  /* ---------------- 6. SMOOTH SCROLL FOR ANCHORS ---------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.length > 1) {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const offset = 90;
          const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      }
    });
  });

  /* ---------------- 7. SCROLL REVEAL ---------------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------------- 8. TYPING EFFECT ---------------- */
  const typeTarget = document.querySelector('[data-typing]');
  if (typeTarget) {
    const words = JSON.parse(typeTarget.getAttribute('data-typing'));
    let wordIndex = 0, charIndex = 0, deleting = false;
    const textSpan = typeTarget.querySelector('.type-text');

    function typeLoop() {
      const currentWord = words[wordIndex];
      if (!deleting) {
        charIndex++;
        textSpan.textContent = currentWord.substring(0, charIndex);
        if (charIndex === currentWord.length) {
          deleting = true;
          setTimeout(typeLoop, 1400);
          return;
        }
      } else {
        charIndex--;
        textSpan.textContent = currentWord.substring(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          wordIndex = (wordIndex + 1) % words.length;
        }
      }
      setTimeout(typeLoop, deleting ? 45 : 90);
    }
    typeLoop();
  }

  /* ---------------- 9. ANIMATED COUNTERS ---------------- */
  const counters = document.querySelectorAll('.counter-box .num');
  if (counters.length) {
    const counterObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (c) { counterObserver.observe(c); });
  }
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    const duration = 1600;
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    }
    requestAnimationFrame(step);
  }

  /* ---------------- 10. SKILL BAR ANIMATION ---------------- */
  const skillFills = document.querySelectorAll('.skill-fill');
  if (skillFills.length) {
    const skillObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const fill = entry.target;
          const pct = fill.getAttribute('data-percent') || '0';
          fill.style.width = pct + '%';
          obs.unobserve(fill);
        }
      });
    }, { threshold: 0.3 });
    skillFills.forEach(function (fill) { skillObserver.observe(fill); });
  }

  /* ---------------- 11. PORTFOLIO FILTER ---------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  if (filterBtns.length && portfolioItems.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        portfolioItems.forEach(function (item) {
          const category = item.getAttribute('data-category');
          if (filter === 'all' || filter === category) {
            item.classList.remove('hide');
          } else {
            item.classList.add('hide');
          }
        });
      });
    });
  }

  /* ---------------- 12. CONTACT FORM VALIDATION ---------------- */
  const contactForm = document.querySelector('#contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      let valid = true;

      const fields = {
        name: { el: contactForm.querySelector('#name'), rule: v => v.trim().length >= 2, msg: 'Please enter your full name.' },
        email: { el: contactForm.querySelector('#email'), rule: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), msg: 'Please enter a valid email address.' },
        phone: { el: contactForm.querySelector('#phone'), rule: v => v.trim() === '' || /^[0-9+\-\s()]{7,}$/.test(v), msg: 'Please enter a valid phone number.' },
        subject: { el: contactForm.querySelector('#subject'), rule: v => v.trim().length >= 3, msg: 'Please enter a subject.' },
        message: { el: contactForm.querySelector('#message'), rule: v => v.trim().length >= 10, msg: 'Message should be at least 10 characters.' }
      };

      Object.keys(fields).forEach(function (key) {
        const f = fields[key];
        if (!f.el) return;
        const field = f.el.closest('.field');
        const errorEl = field.querySelector('.error-msg');
        if (!f.rule(f.el.value)) {
          field.classList.add('has-error');
          if (errorEl) errorEl.textContent = f.msg;
          valid = false;
        } else {
          field.classList.remove('has-error');
          if (errorEl) errorEl.textContent = '';
        }
      });

      const statusEl = contactForm.querySelector('.form-status');
      if (valid) {
        if (statusEl) {
          statusEl.textContent = "Thanks! Your message has been sent successfully — I'll get back to you soon.";
          statusEl.classList.remove('show');
          statusEl.classList.add('show', 'success');
        }
        contactForm.reset();
      } else if (statusEl) {
        statusEl.textContent = 'Please fix the highlighted fields above.';
        statusEl.classList.add('show');
        statusEl.classList.remove('success');
      }
    });

    // Clear error state as user types
    contactForm.querySelectorAll('input, textarea').forEach(function (input) {
      input.addEventListener('input', function () {
        input.closest('.field').classList.remove('has-error');
      });
    });
  }

  /* ---------------- 13. SCROLL-TO-TOP BUTTON ---------------- */
  const scrollTopBtn = document.querySelector('.scroll-top-btn');
  if (scrollTopBtn) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 500) {
        scrollTopBtn.classList.add('show');
      } else {
        scrollTopBtn.classList.remove('show');
      }
    }, { passive: true });

    scrollTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

});
