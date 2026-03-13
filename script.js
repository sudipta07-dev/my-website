/* ============================================================
   SUDIPTA GHOSH — PORTFOLIO SCRIPTS
   Features: Cursor, Navbar, Typed Effect, Scroll Reveal,
             Skill Bars, Dark Mode, Form Validation, Ripple
   ============================================================ */

'use strict';

/* ─── Helpers ─── */
const qs  = (s, ctx = document) => ctx.querySelector(s);
const qsa = (s, ctx = document) => [...ctx.querySelectorAll(s)];

/* ============================================================
   1. CUSTOM CURSOR
   ============================================================ */
(function initCursor() {
  const cursor   = qs('#cursor');
  const follower = qs('#cursorFollower');
  if (!cursor || !follower) return;

  let fx = 0, fy = 0;   // follower position
  let mx = 0, my = 0;   // mouse position
  let raf;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  // Smooth follower
  function animateFollower() {
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    follower.style.left = fx + 'px';
    follower.style.top  = fy + 'px';
    raf = requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hover effect on interactive elements
  const hoverTargets = 'a, button, .skill-card, .project-card, .cert-card, .social-link, .stat-item, input, textarea';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverTargets)) {
      cursor.classList.add('hovering');
      follower.classList.add('hovering');
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverTargets)) {
      cursor.classList.remove('hovering');
      follower.classList.remove('hovering');
    }
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity   = '0';
    follower.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity   = '1';
    follower.style.opacity = '0.5';
  });
})();


/* ============================================================
   2. STICKY NAVBAR + ACTIVE LINK ON SCROLL
   ============================================================ */
(function initNavbar() {
  const navbar = qs('#navbar');
  const links  = qsa('.nav-link');

  // Scrolled class for glass effect
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Active section highlighting
  const sections = qsa('section[id]');
  const observerOpts = { rootMargin: `-${getComputedStyle(document.documentElement).getPropertyValue('--nav-h') || '70px'} 0px -50% 0px` };

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const active = qs(`.nav-link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, observerOpts);

  sections.forEach(s => sectionObserver.observe(s));
})();


/* ============================================================
   3. MOBILE HAMBURGER MENU
   ============================================================ */
(function initHamburger() {
  const btn   = qs('#hamburger');
  const links = qs('#navLinks');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    btn.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', String(isOpen));
  });

  // Close on link click
  qsa('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });
})();


/* ============================================================
   4. DARK / LIGHT MODE TOGGLE
   ============================================================ */
(function initTheme() {
  const btn  = qs('#themeToggle');
  const icon = qs('#themeIcon');
  const html = document.documentElement;

  // Load saved preference
  const saved = localStorage.getItem('sg-theme') || 'dark';
  html.setAttribute('data-theme', saved);
  updateIcon(saved);

  btn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('sg-theme', next);
    updateIcon(next);
  });

  function updateIcon(theme) {
    if (!icon) return;
    icon.className = theme === 'dark' ? 'bx bx-sun' : 'bx bx-moon';
  }
})();


/* ============================================================
   5. TYPED TEXT EFFECT (HERO)
   ============================================================ */
(function initTyped() {
  const el = qs('#typedText');
  if (!el) return;

  const phrases = [
    'Frontend Developer',
    'AI & ML Student',
    'UI/UX Enthusiast',
    'Creative Problem Solver',
  ];

  let phraseIdx = 0;
  let charIdx   = 0;
  let deleting  = false;
  let delay     = 150;

  function tick() {
    const phrase = phrases[phraseIdx];

    if (deleting) {
      charIdx--;
      el.textContent = phrase.slice(0, charIdx);
      delay = 70;
    } else {
      charIdx++;
      el.textContent = phrase.slice(0, charIdx);
      delay = 130;
    }

    if (!deleting && charIdx === phrase.length) {
      // Pause at end
      delay = 2000;
      deleting = true;
    } else if (deleting && charIdx === 0) {
      deleting  = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      delay     = 400;
    }

    setTimeout(tick, delay);
  }

  tick();
})();


/* ============================================================
   6. SCROLL REVEAL ANIMATION
   ============================================================ */
(function initScrollReveal() {
  const items = qsa('.reveal-up, .reveal-left, .reveal-right');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    items.forEach(item => observer.observe(item));
  } else {
    // Fallback: reveal all immediately
    items.forEach(item => item.classList.add('revealed'));
  }
})();


/* ============================================================
   7. SKILL BAR ANIMATION (on scroll)
   ============================================================ */
(function initSkillBars() {
  const fills = qsa('.skill-fill');
  if (!fills.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill  = entry.target;
        const width = fill.style.getPropertyValue('--w');
        fill.style.width = width;
        observer.unobserve(fill);
      }
    });
  }, { threshold: 0.5 });

  fills.forEach(f => observer.observe(f));
})();


/* ============================================================
   8. BUTTON RIPPLE EFFECT
   ============================================================ */
(function initRipple() {
  document.addEventListener('click', e => {
    const btn = e.target.closest('.btn');
    if (!btn) return;

    const ripple = document.createElement('span');
    const rect   = btn.getBoundingClientRect();
    const size   = Math.max(rect.width, rect.height) * 2;
    const x      = e.clientX - rect.left - size / 2;
    const y      = e.clientY - rect.top  - size / 2;

    Object.assign(ripple.style, {
      position:      'absolute',
      width:         size + 'px',
      height:        size + 'px',
      left:          x + 'px',
      top:           y + 'px',
      borderRadius:  '50%',
      background:    'rgba(255,255,255,.18)',
      transform:     'scale(0)',
      pointerEvents: 'none',
      animation:     'rippleAnim .55s var(--ease) forwards',
    });

    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });

  // Inject ripple keyframe once
  if (!qs('#rippleStyle')) {
    const style = document.createElement('style');
    style.id = 'rippleStyle';
    style.textContent = `
      @keyframes rippleAnim {
        to { transform: scale(1); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
})();


/* ============================================================
   9. CONTACT FORM VALIDATION
   ============================================================ */
(function initContactForm() {
  const form    = qs('#contactForm');
  if (!form) return;

  const nameInput    = qs('#name');
  const emailInput   = qs('#email');
  const messageInput = qs('#message');
  const submitBtn    = qs('#submitBtn');
  const submitLabel  = qs('#submitLabel');
  const submitIcon   = qs('#submitIcon');
  const successMsg   = qs('#formSuccess');

  // Validate individual field
  function validateField(input, errorId, validator) {
    const errorEl = qs('#' + errorId);
    const msg     = validator(input.value.trim());
    if (msg) {
      input.classList.add('error');
      if (errorEl) errorEl.textContent = msg;
      return false;
    }
    input.classList.remove('error');
    if (errorEl) errorEl.textContent = '';
    return true;
  }

  // Validators
  const validators = {
    name:    v => v.length < 2 ? 'Please enter your name (at least 2 characters).' : '',
    email:   v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Please enter a valid email address.',
    message: v => v.length < 10 ? 'Message must be at least 10 characters.' : '',
  };

  // Live validation (blur)
  nameInput.addEventListener('blur',    () => validateField(nameInput,    'nameError',    validators.name));
  emailInput.addEventListener('blur',   () => validateField(emailInput,   'emailError',   validators.email));
  messageInput.addEventListener('blur', () => validateField(messageInput, 'messageError', validators.message));

  // Clear error on input
  [nameInput, emailInput, messageInput].forEach(inp => {
    inp.addEventListener('input', () => {
      inp.classList.remove('error');
      const errorEl = qs(`#${inp.id}Error`);
      if (errorEl) errorEl.textContent = '';
    });
  });

  // Submit
  form.addEventListener('submit', e => {
    e.preventDefault();

    const v1 = validateField(nameInput,    'nameError',    validators.name);
    const v2 = validateField(emailInput,   'emailError',   validators.email);
    const v3 = validateField(messageInput, 'messageError', validators.message);

    if (!v1 || !v2 || !v3) return;

    // Simulate sending
    submitBtn.disabled   = true;
    submitLabel.textContent = 'Sending…';
    submitIcon.className = 'bx bx-loader-alt bx-spin';

    setTimeout(() => {
      submitBtn.disabled   = false;
      submitLabel.textContent = 'Send Message';
      submitIcon.className = 'bx bx-send';
      successMsg.textContent = '✓ Message sent! I\'ll get back to you soon.';
      form.reset();

      setTimeout(() => { successMsg.textContent = ''; }, 5000);
    }, 1800);
  });
})();


/* ============================================================
   10. BACK TO TOP BUTTON
   ============================================================ */
(function initBackToTop() {
  const btn = qs('#backToTop');
  if (!btn) return;
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* ============================================================
   11. FOOTER YEAR
   ============================================================ */
const yearEl = qs('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();


/* ============================================================
   12. SMOOTH SCROLL FOR ANCHOR LINKS
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = qs(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 70;
    const top  = target.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* ============================================================
   13. PROJECT CARD — TILT EFFECT (subtle)
   ============================================================ */
(function initTilt() {
  qsa('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect  = card.getBoundingClientRect();
      const cx    = rect.left + rect.width / 2;
      const cy    = rect.top  + rect.height / 2;
      const rotY  = ((e.clientX - cx) / (rect.width  / 2)) * 4;
      const rotX  = -((e.clientY - cy) / (rect.height / 2)) * 4;
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();


/* ============================================================
   14. HERO PARALLAX (subtle orb movement)
   ============================================================ */
(function initParallax() {
  const orbs = qsa('.orb');
  window.addEventListener('mousemove', e => {
    const x = (e.clientX / window.innerWidth  - 0.5) * 30;
    const y = (e.clientY / window.innerHeight - 0.5) * 30;
    orbs.forEach((orb, i) => {
      const depth = (i + 1) * 0.4;
      orb.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
    });
  }, { passive: true });
})();
