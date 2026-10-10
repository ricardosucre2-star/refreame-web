/* RE-FRAME · script.js (index.html y gracias.html)
   ID de GA4: reemplazar por el real (formato G-XXXXXXXXXX). Vacío o placeholder = no se carga Analytics. */
var GA_ID = 'G-XXXXXXXXXX';
(function () {
  'use strict';
  var GA_ACTIVE = /^G-[A-Z0-9]{6,}$/.test(GA_ID) && GA_ID !== 'G-XXXXXXXXXX';
  var UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'];
  var TOKEN_KEY = 'rf_lead_token', SENT_KEY = 'rf_lead_sent', UTM_KEY = 'rf_utm';
  var store = {
    get: function (s, k) { try { return s.getItem(k); } catch (e) { return null; } },
    set: function (s, k, v) { try { s.setItem(k, v); } catch (e) {} },
    del: function (s, k) { try { s.removeItem(k); } catch (e) {} }
  };

  /* ---------- GA4 ---------- */
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  if (GA_ACTIVE) {
    var s = document.createElement('script');
    s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_ID);
    document.head.appendChild(s);
    gtag('js', new Date()); gtag('config', GA_ID); /* envía page_view automático */
  }
  function track(name, params) { if (GA_ACTIVE) gtag('event', name, params || {}); }

  /* ---------- UTMs ---------- */
  function readUtm() {
    var q = new URLSearchParams(location.search), saved = {}, found = false;
    try { saved = JSON.parse(store.get(sessionStorage, UTM_KEY) || '{}'); } catch (e) {}
    UTM_KEYS.forEach(function (k) { var v = q.get(k); if (v) { saved[k] = v.slice(0, 100); found = true; } });
    if (found) store.set(sessionStorage, UTM_KEY, JSON.stringify(saved));
    return saved;
  }
  var utm = readUtm();

  var page = document.body.getAttribute('data-page');
  if (page === 'gracias') { handleThanks(); return; }

  UTM_KEYS.forEach(function (k) { var el = document.getElementById(k); if (el) el.value = utm[k] || 'directo'; });

  /* ---------- Menú ---------- */
  var burger = document.getElementById('burger'), menu = document.getElementById('menu');
  function closeMenu() { menu.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); burger.setAttribute('aria-label', 'Abrir menú'); }
  burger.addEventListener('click', function () {
    var o = menu.classList.toggle('open'); burger.setAttribute('aria-expanded', String(o)); burger.setAttribute('aria-label', o ? 'Cerrar menú' : 'Abrir menú');
  });
  menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeMenu); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu.classList.contains('open')) { closeMenu(); burger.focus(); } });
  var header = document.getElementById('header');
  window.addEventListener('scroll', function () { header.classList.toggle('scrolled', window.scrollY > 8); }, { passive: true });

  /* ---------- Evento cta_click: solo los botones CTA, no los enlaces del menú ---------- */
  document.querySelectorAll('.track-cta').forEach(function (a) {
    a.addEventListener('click', function () {
      track('cta_click', { cta_name: 'solicitar_evaluacion_retiro', cta_location: a.getAttribute('data-cta') || 'desconocido' });
    });
  });

  /* ---------- Reveal sutil ---------- */
  var targets = document.querySelectorAll('.card,.steps li,.status-row,.notice');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold: .12 });
    targets.forEach(function (t) { t.classList.add('reveal'); io.observe(t); });
  }

  /* ---------- Formulario ---------- */
  var form = document.getElementById('lead-form'), err = document.getElementById('form-error'), btn = document.getElementById('submit-btn');
  function showErr(msg, el) { err.textContent = msg; err.hidden = false; if (el) el.focus(); }
  function validate() {
    err.hidden = true; var bad = null;
    form.querySelectorAll('.invalid').forEach(function (i) { i.classList.remove('invalid'); });
    form.querySelectorAll('[required]').forEach(function (el) {
      var ok = el.type === 'checkbox' ? el.checked : el.value.trim() !== '';
      if (!ok) { el.classList.add('invalid'); bad = bad || el; }
    });
    if (bad) { showErr(bad.type === 'checkbox' ? 'Debes autorizar el contacto para enviar la solicitud.' : 'Completa los campos obligatorios marcados con *.', bad); return false; }
    var mail = form.correo.value.trim(), tel = form.telefono.value.trim();
    var mailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail);
    var telOk = tel.replace(/[^\d]/g, '').length >= 8 && /^[+\d\s()\-]+$/.test(tel);
    if (!mailOk && !telOk) {
      form.correo.classList.add('invalid'); form.telefono.classList.add('invalid');
      showErr(mail || tel ? 'El correo o el teléfono ingresado no es válido. Revisa al menos uno de los dos.' : 'Indica un correo electrónico o un teléfono de contacto válido.', form.correo); return false;
    }
    if (mail && !mailOk) { form.correo.classList.add('invalid'); showErr('El correo electrónico no parece válido.', form.correo); return false; }
    if (tel && !telOk) { form.telefono.classList.add('invalid'); showErr('El teléfono no parece válido (mínimo 8 dígitos).', form.telefono); return false; }
    return true;
  }
  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    if (!validate()) return;
    if (form['bot-field'].value) return; /* honeypot */
    btn.disabled = true; var label = btn.firstChild.textContent; btn.firstChild.textContent = 'Enviando… ';
    var body = new URLSearchParams(new FormData(form)).toString();
    fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body })
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        /* envío confirmado por Netlify: marcamos token de un solo uso para gracias.html */
        store.set(sessionStorage, TOKEN_KEY, Date.now() + '-' + Math.random().toString(36).slice(2));
        location.href = 'gracias.html';
      })
      .catch(function () {
        btn.disabled = false; btn.firstChild.textContent = label;
        showErr('No pudimos enviar la solicitud. Si estás viendo este archivo localmente, el formulario solo funciona en el sitio publicado en Netlify. Si ya está publicado, revisa tu conexión e inténtalo de nuevo.');
      });
  });

  /* ---------- gracias.html: generate_lead solo tras envío exitoso y una única vez ---------- */
  function handleThanks() {
    var token = store.get(sessionStorage, TOKEN_KEY);
    if (!token) { var n = document.getElementById('direct-note'); if (n) n.hidden = false; return; }
    store.del(sessionStorage, TOKEN_KEY); /* consumir: recargar no repite el evento */
    var sent = store.get(localStorage, SENT_KEY);
    if (sent && sent.split(',').indexOf(token) !== -1) return;
    store.set(localStorage, SENT_KEY, (sent ? sent + ',' : '') + token);
    track('generate_lead', { form_name: 'solicitudes-reframe', utm_source: utm.utm_source || 'directo', utm_medium: utm.utm_medium || 'directo', utm_campaign: utm.utm_campaign || 'directo' });
  }
})();
