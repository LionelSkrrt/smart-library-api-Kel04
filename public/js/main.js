// Mobile menu toggle
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
    });
  }

  // FAQ accordion
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const answer = btn.nextElementSibling;
      const isOpen = btn.classList.contains('open');
      document.querySelectorAll('.faq-q').forEach(b => { b.classList.remove('open'); b.nextElementSibling.classList.remove('show'); });
      if (!isOpen) { btn.classList.add('open'); answer.classList.add('show'); }
    });
  });

  // Scroll fade-in
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

  // Active nav link
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-links a, .mobile-menu a').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });
});

// Toast helper
function showToast(msg, type = 'success') {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${type === 'success' ? '✓' : '✕'}</span> ${msg}`;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3200);
}

// Countdown timer
function startCountdown(endTime, el) {
  function update() {
    const now = Date.now();
    const diff = endTime - now;
    if (diff <= 0) { el.innerHTML = '<span style="color:var(--accent)">Berakhir</span>'; return; }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const pad = n => String(n).padStart(2, '0');
    if (el.querySelector('.timer-digits')) {
      el.querySelector('[data-unit="h"]').textContent = pad(h + d * 24);
      el.querySelector('[data-unit="m"]').textContent = pad(m);
      el.querySelector('[data-unit="s"]').textContent = pad(s);
    }
  }
  update();
  setInterval(update, 1000);
}

// Format currency IDR
function formatIDR(n) {
  return 'Rp ' + Number(n).toLocaleString('id-ID');
}
