// Año dinámico
document.getElementById('year').textContent = new Date().getFullYear();

// Menú móvil
const navToggle = document.getElementById('nav-toggle');
const nav = document.getElementById('nav');

navToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open);
});

// Cerrar menú al hacer clic en un enlace
nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Formulario
const form = document.getElementById('signup-form');
const submitBtn = document.getElementById('submit-btn');
const msg = document.getElementById('form-message');
const endpoint = 'https://bykqlmcjoatqylmusjav.supabase.co/functions/v1/submit-signature';

function showMsg(text, type) {
  msg.textContent = text;
  msg.className = 'form-message ' + type;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = form.email.value.trim();
  const comment = form.comment.value.trim();
  const initiative = form.initiative.value;
  const consent = form.consent.checked;

  if (!email || !isValidEmail(email)) {
    showMsg('Por favor, introduce un email válido.', 'error');
    return;
  }
  if (!comment) {
    showMsg('Por favor, escribe un comentario.', 'error');
    return;
  }
  if (!consent) {
    showMsg('Debes aceptar el consentimiento para continuar.', 'error');
    return;
  }

  submitBtn.disabled = true;
  showMsg('Enviando...', 'loading');

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        comment,
        initiative,
        consent: true,
        source_page: 'diaspora4cuba-landing',
        language: 'es',
        created_from_frontend: true
      })
    });

    if (!res.ok) throw new Error('Server error');
    showMsg('Gracias. Hemos recibido tu mensaje.', 'success');
    form.reset();
  } catch (err) {
    showMsg('Hubo un error enviando el formulario. Intenta de nuevo.', 'error');
    console.error(err);
  } finally {
    submitBtn.disabled = false;
  }
});
