/* ================================================================
   PORTFOLIO — script.js
================================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* NAVBAR */
  const navbar = document.getElementById('navbar');
  function handleNavbarScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }
  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  /* MOBILE MENU */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ACTIVE NAV LINK */
  const sections = document.querySelectorAll('section[id]');
  const allLinks = document.querySelectorAll('.nav-link');

  function setActiveLink() {
    let currentId = '';
    const scrollPos = window.scrollY + 120;
    sections.forEach(section => {
      if (scrollPos >= section.offsetTop) currentId = section.getAttribute('id');
    });
    allLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
    });
  }
  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();

  /* SCROLL REVEAL */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  revealEls.forEach(el => revealObserver.observe(el));

  /* BACK TO TOP */
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ============================================================
     CONTACT FORM — Web3Forms ✅
  ============================================================ */
  const contactForm  = document.getElementById('contactForm');
  const submitBtn    = document.getElementById('submitBtn');
  const formFeedback = document.getElementById('formFeedback');

  function showFeedback(type, message) {
    formFeedback.textContent = message;
    formFeedback.className   = `form-feedback ${type}`;
  }

  function validateField(field) {
    const value = field.value.trim();
    if (field.required && !value) return false;
    if (field.type === 'email' && value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }
    return true;
  }

  contactForm.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('blur', () => {
      field.style.borderColor = !validateField(field) ? '#ef4444' : '';
    });
    field.addEventListener('input', () => {
      field.style.borderColor = '';
    });
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    formFeedback.className = 'form-feedback';

    const name    = document.getElementById('name');
    const email   = document.getElementById('email');
    const message = document.getElementById('message');
    let   valid   = true;

    [name, email, message].forEach(field => {
      if (!validateField(field)) {
        valid = false;
        field.style.borderColor = '#ef4444';
      }
    });

    if (!valid) {
      showFeedback('error', '⚠️ Please fill in all required fields correctly.');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.querySelector('span').textContent = 'Sending…';

    // ✅ Web3Forms API call
    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_key: '51cc9945-5129-432b-bfae-5549eeba577b', // ✅ Your key
        name:       name.value.trim(),
        email:      email.value.trim(),
        subject:    document.getElementById('subject').value.trim() || 'No subject',
        message:    message.value.trim(),
      })
    })
    .then(res => res.json())
    .then(data => {
      submitBtn.disabled = false;
      submitBtn.querySelector('span').textContent = 'Send Message';
      if (data.success) {
        showFeedback('success', `✅ Thanks, ${name.value.trim()}! Your message has been received. I'll be in touch soon.`);
        contactForm.reset();
        formFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        showFeedback('error', '❌ Something went wrong. Please try again.');
      }
    })
    .catch(() => {
      submitBtn.disabled = false;
      submitBtn.querySelector('span').textContent = 'Send Message';
      showFeedback('error', '❌ Network error. Please try again.');
    });
  });

  /* SMOOTH SCROLL */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = target.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
    });
  });

}); // end DOMContentLoaded