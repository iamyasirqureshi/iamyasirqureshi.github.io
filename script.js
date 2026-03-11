/* =====================================================
   YASIR QURESHI — PORTFOLIO
   script.js
   ===================================================== */

/* ══════════════════════════════════════
   1. CUSTOM CURSOR
══════════════════════════════════════ */
const dot  = document.getElementById('cur-dot');
const ring = document.getElementById('cur-ring');

let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  dot.style.left = mouseX + 'px';
  dot.style.top  = mouseY + 'px';
});

// Ring follows cursor with smooth lag
(function animateRing() {
  ringX += (mouseX - ringX) * 0.13;
  ringY += (mouseY - ringY) * 0.13;
  ring.style.left = ringX + 'px';
  ring.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
})();

// Hide cursor when it leaves the window
document.addEventListener('mouseleave', () => {
  dot.style.opacity  = '0';
  ring.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
  dot.style.opacity  = '1';
  ring.style.opacity = '1';
});


/* ══════════════════════════════════════
   2. SCROLL REVEAL
══════════════════════════════════════ */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


/* ══════════════════════════════════════
   3. PROGRESS BARS (Currently Learning)
   Animate when the section comes into view
══════════════════════════════════════ */
const progressObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.progress-bar').forEach(bar => {
        const targetWidth = bar.getAttribute('data-width') || '0';
        // Small delay so the bar animates after card fades in
        setTimeout(() => {
          bar.style.width = targetWidth + '%';
        }, 300);
      });
      progressObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.learn-card').forEach(card => progressObserver.observe(card));


/* ══════════════════════════════════════
   4. ACTIVE NAV LINK ON SCROLL
══════════════════════════════════════ */
const sections  = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => a.classList.remove('active'));
      const id = entry.target.getAttribute('id');
      const active = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => sectionObserver.observe(s));


/* ══════════════════════════════════════
   5. NAV SHADOW ON SCROLL
══════════════════════════════════════ */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });


/* ══════════════════════════════════════
   6. MOBILE HAMBURGER MENU
══════════════════════════════════════ */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close menu when a link is tapped
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});


/* ══════════════════════════════════════
   7. SMOOTH SCROLL FOR NAV LINKS
══════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


/* ══════════════════════════════════════
   8. TYPING EFFECT — HERO ROLES
   Cycles through roles in the hero section
══════════════════════════════════════ */
// ── EDIT: Add or remove roles here ──
const roles = [
  'Android Developer',
  'Game Developer',
  'Portrait Artist',
  'CS Student @ GH Raisoni'
];

const heroRolesEl = document.querySelector('.hero-roles');

if (heroRolesEl) {
  // Replace static spans with a typed element
  heroRolesEl.innerHTML = '<span class="typed-role"></span><span class="typed-cursor">|</span>';
  const typedEl  = heroRolesEl.querySelector('.typed-role');
  const cursorEl = heroRolesEl.querySelector('.typed-cursor');

  // Cursor blink style
  cursorEl.style.cssText = 'color: #3de8c8; animation: blink 1s step-start infinite; margin-left: 2px;';

  // Inject blink keyframes once
  if (!document.getElementById('blink-style')) {
    const style = document.createElement('style');
    style.id = 'blink-style';
    style.textContent = '@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }';
    document.head.appendChild(style);
  }

  let roleIndex = 0;
  let charIndex  = 0;
  let isDeleting = false;

  function typeRole() {
    const current = roles[roleIndex];

    if (!isDeleting) {
      typedEl.textContent = current.slice(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        isDeleting = true;
        setTimeout(typeRole, 2000); // pause before deleting
        return;
      }
    } else {
      typedEl.textContent = current.slice(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        roleIndex  = (roleIndex + 1) % roles.length;
      }
    }

    setTimeout(typeRole, isDeleting ? 55 : 95);
  }

  setTimeout(typeRole, 800);
}


/* ══════════════════════════════════════
   9. PROJECT CARD TILT ON HOVER
══════════════════════════════════════ */
document.querySelectorAll('.proj-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect   = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width  / 2;
    const cy = rect.height / 2;
    const tiltX = ((y - cy) / cy) * 6;   // max 6deg
    const tiltY = ((x - cx) / cx) * -6;
    card.style.transform = `translateY(-6px) perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});


/* ══════════════════════════════════════
   10. STAT ROW COUNTER ANIMATION
   Numbers count up when hero is visible
══════════════════════════════════════ */
function animateCount(el, target, suffix) {
  let current = 0;
  const step = target / 40;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = (Number.isInteger(target) ? Math.floor(current) : current.toFixed(1)) + suffix;
  }, 30);
}

const heroStatsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Animate CGPA
      const cgpaEl = document.querySelector('.stat-val em:first-of-type');
      if (cgpaEl) animateCount(cgpaEl, 8.9, '');

      heroStatsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) heroStatsObserver.observe(heroStats);
