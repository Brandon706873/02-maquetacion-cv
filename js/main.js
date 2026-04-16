/* ============================================================
   main.js — Vanilla JS (sin jQuery ni librerías externas)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Typewriter (reemplaza typed.js) ── */
  const typedEl   = document.querySelector('.typed-text-display');
  const sourceEl  = document.querySelector('.typed-text');
  if (typedEl && sourceEl) {
    const strings  = sourceEl.textContent.split(', ').map(s => s.trim()).filter(Boolean);
    let si = 0, ci = 0, deleting = false;

    function type() {
      const current = strings[si];
      if (!deleting) {
        typedEl.textContent = current.slice(0, ++ci);
        if (ci === current.length) { deleting = true; setTimeout(type, 2000); return; }
      } else {
        typedEl.textContent = current.slice(0, --ci);
        if (ci === 0) { deleting = false; si = (si + 1) % strings.length; }
      }
      setTimeout(type, deleting ? 40 : 90);
    }
    type();
  }

  /* ── Menú móvil de la sidebar ── */
  const toggle = document.querySelector('.sidenav-toggle');
  const links  = document.querySelector('.sidenav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      links.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        if (window.innerWidth < 992) links.classList.remove('open');
      });
    });
  }

  /* ── Resaltar enlace activo al hacer scroll ── */
  const navLinks = document.querySelectorAll('.sidenav-links a[href^="#"]');
  const sections = [...navLinks]
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  if (sections.length) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(a => a.classList.remove('active'));
          const link = document.querySelector(`.sidenav-links a[href="#${entry.target.id}"]`);
          if (link) link.classList.add('active');
        }
      });
    }, { rootMargin: '-20% 0px -60% 0px' });
    sections.forEach(s => obs.observe(s));
  }

  /* ── Animar barras de habilidades al entrar en viewport (reemplaza waypoints) ── */
  const bars = document.querySelectorAll('.progress-bar[data-width]');
  if (bars.length) {
    const skillObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.width = entry.target.dataset.width;
          skillObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    bars.forEach(b => skillObs.observe(b));
  } else {
    /* fallback: animar todas al cargar */
    document.querySelectorAll('.progress-bar').forEach(b => {
      const w = b.getAttribute('aria-valuenow') || b.style.width;
      if (w) { b.style.width = '0'; setTimeout(() => { b.style.width = w + (w.includes('%') ? '' : '%'); }, 300); }
    });
  }

  /* ── Filtros de portafolio (reemplaza isotope) ── */
  const filterBtns = document.querySelectorAll('#portfolio-flters li');
  const items      = document.querySelectorAll('.portfolio-item');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      items.forEach(item => {
        const show = filter === '*' || item.classList.contains(filter.replace('.', ''));
        item.classList.toggle('hidden', !show);
      });
    });
  });

  /* ── Slider de testimonios (reemplaza slick) ── */
  const sliderEl = document.querySelector('.review-slider');
  const dotsEl   = document.querySelector('.review-controls');
  if (sliderEl) {
    const slides    = sliderEl.querySelectorAll('.review-slider-item');
    let current     = 0;
    let autoTimer;

    /* crear dots */
    if (dotsEl) {
      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'review-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => goTo(i));
        dotsEl.appendChild(dot);
      });
    }

    function goTo(idx) {
      current = (idx + slides.length) % slides.length;
      sliderEl.style.transform = `translateX(-${current * 100}%)`;
      dotsEl && dotsEl.querySelectorAll('.review-dot').forEach((d, i) =>
        d.classList.toggle('active', i === current));
      resetAuto();
    }

    function resetAuto() {
      clearInterval(autoTimer);
      autoTimer = setInterval(() => goTo(current + 1), 5000);
    }
    resetAuto();
  }

  /* ── Back to top ── */
  const backTop = document.querySelector('.back-to-top');
  if (backTop) {
    window.addEventListener('scroll', () => {
      backTop.classList.toggle('visible', window.scrollY > 150);
    }, { passive: true });
    backTop.addEventListener('click', e => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

});
