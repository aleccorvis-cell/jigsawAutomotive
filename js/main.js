/**
 * Jigsaw Automotive Group — Main JavaScript
 * Version 1.0
 * 
 * Features:
 * - Sticky header with scroll effect
 * - Mobile navigation
 * - Cookie banner (GDPR-compliant, localStorage only)
 * - Contact form validation + honeypot + math CAPTCHA
 * - Leadmagnet form handling
 * - FAQ accordion
 * - Scroll reveal animations (Intersection Observer)
 * - Smooth scrolling
 * - Security: input sanitization, rate limiting
 * 
 * No external dependencies. Pure vanilla JS.
 * License: Proprietary — Webdesign by Starmindsdesign by Alec
 */

'use strict';

(function () {

  /* ============================================
     1. HEADER — Sticky scroll effect
     ============================================ */
  const header = document.getElementById('header');
  
  if (header) {
    let lastScroll = 0;
    
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      
      if (currentScroll > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      
      lastScroll = currentScroll;
    };

    // Debounced scroll handler for performance
    let scrollTicking = false;
    window.addEventListener('scroll', () => {
      if (!scrollTicking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    }, { passive: true });
  }


  /* ============================================
     2. MOBILE NAVIGATION
     ============================================ */
  const menuToggle = document.getElementById('menu-toggle');
  const mainNav = document.getElementById('main-nav');
  const navOverlay = document.getElementById('nav-overlay');

  if (menuToggle && mainNav) {
    const toggleMenu = (open) => {
      const isOpen = typeof open === 'boolean' ? open : !mainNav.classList.contains('open');
      
      mainNav.classList.toggle('open', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Menü schliessen' : 'Menü öffnen');
      
      if (navOverlay) {
        navOverlay.classList.toggle('active', isOpen);
        navOverlay.setAttribute('aria-hidden', String(!isOpen));
      }
      
      // Prevent body scroll when menu is open
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    menuToggle.addEventListener('click', () => toggleMenu());
    
    if (navOverlay) {
      navOverlay.addEventListener('click', () => toggleMenu(false));
    }

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mainNav.classList.contains('open')) {
        toggleMenu(false);
        menuToggle.focus();
      }
    });

    // Close on nav link click (mobile)
    mainNav.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 960) {
          toggleMenu(false);
        }
      });
    });

    // Reset on resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 960 && mainNav.classList.contains('open')) {
        toggleMenu(false);
      }
    });
  }


  /* ============================================
     3. COOKIE BANNER
     ============================================ */
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');
  const COOKIE_KEY = 'jag_cookie_consent';

  if (cookieBanner && cookieAccept) {
    // Check if consent was already given
    const hasConsent = localStorage.getItem(COOKIE_KEY);
    
    if (!hasConsent) {
      // Show banner after a brief delay for better UX
      setTimeout(() => {
        cookieBanner.classList.add('visible');
      }, 1500);
    }

    cookieAccept.addEventListener('click', () => {
      localStorage.setItem(COOKIE_KEY, JSON.stringify({
        accepted: true,
        timestamp: new Date().toISOString(),
        version: '1.0'
      }));
      cookieBanner.classList.remove('visible');
    });
  }


  /* ============================================
     4. INPUT SANITIZATION (Security)
     ============================================ */
  function sanitizeInput(str) {
    if (typeof str !== 'string') return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML.trim();
  }

  function isValidEmail(email) {
    // RFC 5322 simplified
    return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(email);
  }


  /* ============================================
     5. MATH CAPTCHA
     ============================================ */
  let captchaAnswer = null;

  function generateCaptcha() {
    const captchaQuestion = document.getElementById('captcha-question');
    if (!captchaQuestion) return;

    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    captchaAnswer = a + b;
    captchaQuestion.textContent = `Was ist ${a} + ${b}?`;
  }

  generateCaptcha();


  /* ============================================
     6. CONTACT FORM
     ============================================ */
  const contactForm = document.getElementById('contact-form');
  
  if (contactForm) {
    // Set timestamp for anti-CSRF
    const timestampField = document.getElementById('form-timestamp');
    if (timestampField) {
      timestampField.value = Date.now().toString();
    }

    // Rate limiting
    let lastSubmitTime = 0;
    const MIN_SUBMIT_INTERVAL = 5000; // 5 seconds

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Rate limiting
      const now = Date.now();
      if (now - lastSubmitTime < MIN_SUBMIT_INTERVAL) {
        return;
      }

      // Reset errors
      contactForm.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));
      
      const successMsg = document.getElementById('contact-success');
      const errorMsg = document.getElementById('contact-error');
      if (successMsg) successMsg.style.display = 'none';
      if (errorMsg) errorMsg.style.display = 'none';

      // Honeypot check
      const honeypot = contactForm.querySelector('[name="_gotcha"]');
      if (honeypot && honeypot.value.length > 0) {
        // Bot detected — silently ignore
        if (successMsg) successMsg.style.display = 'block';
        return;
      }

      // Timestamp check (form filled too fast = bot)
      if (timestampField) {
        const elapsed = now - parseInt(timestampField.value, 10);
        if (elapsed < 3000) {
          // Filled in less than 3 seconds — likely a bot
          if (successMsg) successMsg.style.display = 'block';
          return;
        }
      }

      // Validate fields
      let isValid = true;

      const name = contactForm.querySelector('#contact-name');
      if (name && (!name.value.trim() || name.value.trim().length < 2)) {
        name.closest('.form-group').classList.add('error');
        isValid = false;
      }

      const email = contactForm.querySelector('#contact-email');
      if (email && (!email.value.trim() || !isValidEmail(email.value.trim()))) {
        email.closest('.form-group').classList.add('error');
        isValid = false;
      }

      const message = contactForm.querySelector('#contact-message');
      if (message && (!message.value.trim() || message.value.trim().length < 10)) {
        message.closest('.form-group').classList.add('error');
        isValid = false;
      }

      const consent = contactForm.querySelector('#contact-consent');
      if (consent && !consent.checked) {
        consent.closest('.form-group').classList.add('error');
        isValid = false;
      }

      // CAPTCHA check
      const captchaInput = contactForm.querySelector('#contact-captcha');
      const captchaGroup = document.getElementById('captcha-group');
      if (captchaInput && captchaAnswer !== null) {
        if (parseInt(captchaInput.value, 10) !== captchaAnswer) {
          if (captchaGroup) captchaGroup.classList.add('error');
          isValid = false;
        }
      }

      if (!isValid) {
        // Focus first error field
        const firstError = contactForm.querySelector('.form-group.error input, .form-group.error textarea');
        if (firstError) firstError.focus();
        return;
      }

      lastSubmitTime = now;

      // Collect sanitized data
      const formData = {
        name: sanitizeInput(name ? name.value : ''),
        email: sanitizeInput(email ? email.value : ''),
        company: sanitizeInput(contactForm.querySelector('#contact-company')?.value || ''),
        phone: sanitizeInput(contactForm.querySelector('#contact-phone')?.value || ''),
        subject: sanitizeInput(contactForm.querySelector('#contact-subject')?.value || ''),
        message: sanitizeInput(message ? message.value : '')
      };

      // GitHub Pages fallback: mailto
      // For production: use Formspree, Netlify Forms, or custom endpoint
      const formAction = contactForm.getAttribute('action');
      
      if (formAction && formAction.includes('formspree.io') && !formAction.includes('YOUR_FORM_ID')) {
        // Formspree integration (production)
        const submitBtn = document.getElementById('contact-submit');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Wird gesendet …';
        }

        fetch(formAction, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(formData)
        })
        .then(response => {
          if (response.ok) {
            if (successMsg) successMsg.style.display = 'block';
            contactForm.reset();
            generateCaptcha();
          } else {
            throw new Error('Server error');
          }
        })
        .catch(() => {
          if (errorMsg) errorMsg.style.display = 'block';
        })
        .finally(() => {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Nachricht senden';
          }
        });
      } else {
        // Mailto fallback for GitHub Pages demo
        const subject = encodeURIComponent(`Kontaktanfrage: ${formData.subject || 'Allgemeine Anfrage'}`);
        const body = encodeURIComponent(
          `Name: ${formData.name}\n` +
          `E-Mail: ${formData.email}\n` +
          `Unternehmen: ${formData.company || '–'}\n` +
          `Telefon: ${formData.phone || '–'}\n\n` +
          `Nachricht:\n${formData.message}`
        );
        
        window.location.href = `mailto:cchrappek@gmail.com?subject=${subject}&body=${body}`;
        
        if (successMsg) successMsg.style.display = 'block';
        contactForm.reset();
        generateCaptcha();
      }
    });
  }


  /* ============================================
     7. LEADMAGNET FORM
     ============================================ */
  const leadmagnetForm = document.getElementById('leadmagnet-form');
  
  if (leadmagnetForm) {
    leadmagnetForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Honeypot check
      const hp = leadmagnetForm.querySelector('[name="website"]');
      if (hp && hp.value.length > 0) return;

      const emailField = leadmagnetForm.querySelector('#lm-email');
      const consent = leadmagnetForm.querySelector('[name="consent"]');

      leadmagnetForm.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));

      let valid = true;

      if (emailField && (!emailField.value.trim() || !isValidEmail(emailField.value.trim()))) {
        emailField.closest('.form-group').classList.add('error');
        valid = false;
      }

      if (consent && !consent.checked) {
        valid = false;
      }

      if (!valid) return;

      // Demo: Show success and trigger download
      const successMsg = document.getElementById('leadmagnet-success');
      if (successMsg) successMsg.style.display = 'block';
      
      leadmagnetForm.style.display = 'none';

      // Trigger download (production: gate behind email capture endpoint)
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = 'assets/downloads/whitepaper-automotive-dach.pdf';
        link.download = 'Jigsaw-Whitepaper-Automotive-DACH.pdf';
        link.click();
      }, 1000);
    });
  }


  /* ============================================
     8. LEADMAGNET DIALOG
     ============================================ */
  const leadmagnetModal = document.getElementById('leadmagnet-modal');
  if (leadmagnetModal) {
    // Add styles for dialog
    const style = document.createElement('style');
    style.textContent = `
      .leadmagnet-dialog {
        border: 1px solid var(--color-border);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-xl);
        max-width: 480px;
        width: 90vw;
        padding: 0;
        position: relative;
      }
      .leadmagnet-dialog::backdrop {
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
      }
    `;
    document.head.appendChild(style);
  }


  /* ============================================
     9. FAQ ACCORDION
     ============================================ */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', function () {
      const item = this.closest('.faq-item');
      const isOpen = item.classList.contains('open');

      // Close all other items (accordion behavior)
      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove('open');
          openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current
      item.classList.toggle('open', !isOpen);
      this.setAttribute('aria-expanded', String(!isOpen));
    });
  });


  /* ============================================
     10. SCROLL REVEAL ANIMATIONS
     ============================================ */
  if ('IntersectionObserver' in window) {
    const revealElements = document.querySelectorAll('.reveal');
    
    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      // Show all elements immediately
      revealElements.forEach(el => el.classList.add('visible'));
    } else {
      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              revealObserver.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px'
        }
      );

      revealElements.forEach(el => revealObserver.observe(el));
    }
  } else {
    // Fallback: show everything
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
  }


  /* ============================================
     11. SMOOTH SCROLL FOR ANCHOR LINKS
     ============================================ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // Update focus for accessibility
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    });
  });


  /* ============================================
     12. RESPONSIVE GRID FIX FOR SUBPAGES
     ============================================ */
  // Fix grid layouts on mobile
  const grids = document.querySelectorAll('[style*="grid-template-columns: 1fr 1fr"]');
  
  function handleResponsiveGrids() {
    const isMobile = window.innerWidth <= 768;
    grids.forEach(grid => {
      if (isMobile) {
        grid.style.gridTemplateColumns = '1fr';
      } else {
        // Restore original (handled by inline style)
      }
    });
  }

  // Use matchMedia for efficiency
  const mobileQuery = window.matchMedia('(max-width: 768px)');
  
  function onMobileChange(e) {
    grids.forEach(grid => {
      if (e.matches) {
        grid.style.gridTemplateColumns = '1fr';
        // Reset order for alternating layouts
        Array.from(grid.children).forEach(child => {
          child.style.order = '';
        });
      }
    });
  }

  mobileQuery.addEventListener('change', onMobileChange);
  // Initial check
  if (mobileQuery.matches) {
    onMobileChange(mobileQuery);
  }

  /* ============================================
     13. CMS CONFIGURATION & MODULE TOGGLES
     ============================================ */
  function applyConfig(config) {
    if (!config) return;
    
    // Apply module toggles
    if (config.modules) {
      for (const [moduleName, isEnabled] of Object.entries(config.modules)) {
        const element = document.getElementById(moduleName);
        if (element) {
          element.style.display = isEnabled ? '' : 'none';
          
          // Also hide corresponding navigation link in header if applicable
          const navLink = document.querySelector(`.nav__link[href*="${moduleName}"]`);
          if (navLink) {
            navLink.style.display = isEnabled ? '' : 'none';
          }
        }
      }
    }
    
    // Apply general content replacements
    if (config.company) {
      // Update phone numbers
      document.querySelectorAll('[data-cms="phone"]').forEach(el => {
        el.textContent = config.company.phone;
        if (el.tagName === 'A') el.href = `tel:${config.company.phone.replace(/\s+/g, '')}`;
      });
      // Update emails
      document.querySelectorAll('[data-cms="email"]').forEach(el => {
        el.textContent = config.company.email;
        if (el.tagName === 'A') el.href = `mailto:${config.company.email}`;
      });
      // Update contact person
      document.querySelectorAll('[data-cms="contact-person"]').forEach(el => {
        el.textContent = config.company.contactPerson;
      });
    }

    // Apply Hero texts
    if (config.hero) {
      const heroTitle = document.getElementById('hero-title');
      if (heroTitle && config.hero.title) heroTitle.textContent = config.hero.title;
      
      const heroSubtitle = document.querySelector('.hero__subtitle');
      if (heroSubtitle && config.hero.subtitle) heroSubtitle.textContent = config.hero.subtitle;
      
      const heroCta1 = document.querySelector('.hero__actions .btn--primary');
      if (heroCta1 && config.hero.ctaPrimary) heroCta1.textContent = config.hero.ctaPrimary;
    }

    // Apply About texts
    if (config.ueberUns) {
      const aboutTitle = document.getElementById('about-title');
      if (aboutTitle && config.ueberUns.title) aboutTitle.textContent = config.ueberUns.title;
      
      const aboutLead = document.querySelector('#ueber-uns .body-large');
      if (aboutLead && config.ueberUns.leadText) aboutLead.textContent = config.ueberUns.leadText;
      
      const aboutBody = document.querySelector('#ueber-uns .body-small');
      if (aboutBody && config.ueberUns.bodyText) aboutBody.textContent = config.ueberUns.bodyText;
    }
  }

  // Load config from localStorage first (for local edits preview) or fetch from server
  const localConfig = localStorage.getItem('jigsaw_config');
  if (localConfig) {
    try {
      applyConfig(JSON.parse(localConfig));
    } catch (e) {
      console.error('Error loading config from localStorage', e);
    }
  } else {
    // Determine path prefix (admin folder is one level deeper)
    const prefix = window.location.pathname.includes('/admin/') ? '../' : '';
    fetch(`${prefix}content/config.json`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(config => {
        applyConfig(config);
      })
      .catch(err => {
        console.log('Using default static HTML contents (no config.json found or fetch failed)', err);
      });
  }

})();
