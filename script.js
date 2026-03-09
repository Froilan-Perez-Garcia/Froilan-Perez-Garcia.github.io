document.addEventListener('DOMContentLoaded', () => {
  initTema();
  initCanvasFondo();
  initNavegacion();
  initScrollActivo();
  initAnimacionesScroll();
  initMenuMovil();
  initFormulario();
});

function initTema() {
  const btnTema   = document.getElementById('btn-tema');
  const iconoTema = document.getElementById('icono-tema');
  const textoTema = document.getElementById('texto-tema');
  const html      = document.documentElement;

  if (!btnTema || !iconoTema || !textoTema) return;

  let temaEnMemoria = 'oscuro';

  function guardarTema(valor) {
    temaEnMemoria = valor;
    try { localStorage.setItem('tema', valor); } catch(e) {}
  }

  function leerTema() {
    try { return localStorage.getItem('tema') || temaEnMemoria; } catch(e) { return temaEnMemoria; }
  }

  function actualizarBoton(esClaro) {
    iconoTema.textContent = esClaro ? '🌙' : '☀️';
    textoTema.textContent = esClaro ? 'Oscuro' : 'Claro';
  }

  const temaGuardado = leerTema();
  if (temaGuardado === 'claro') {
    html.classList.add('tema-claro');
    actualizarBoton(true);
  } else {
    html.classList.remove('tema-claro');
    actualizarBoton(false);
  }

  btnTema.addEventListener('click', () => {
    const esClaro = html.classList.contains('tema-claro');
    if (esClaro) {
      html.classList.remove('tema-claro');
      guardarTema('oscuro');
      actualizarBoton(false);
    } else {
      html.classList.add('tema-claro');
      guardarTema('claro');
      actualizarBoton(true);
    }
    window.dispatchEvent(new CustomEvent('temaChanged'));
  });
}

function initCanvasFondo() {
  const canvas = document.getElementById('canvas-fondo');
  const ctx    = canvas.getContext('2d');
  let particulas = [];
  let animFrameId;

  function obtenerColores() {
    const esClaro = document.documentElement.classList.contains('tema-claro');
    return { particula: esClaro ? 'rgba(201, 111, 168,' : 'rgba(145, 71, 255,' };
  }

  function ajustarTamano() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function crearParticula() {
    return {
      x:     Math.random() * canvas.width,
      y:     Math.random() * canvas.height,
      vx:    (Math.random() - 0.5) * 0.4,
      vy:    (Math.random() - 0.5) * 0.4,
      radio: Math.random() * 2 + 1,
      alpha: Math.random() * 0.4 + 0.1,
    };
  }

  function inicializarParticulas() {
    const cantidad = Math.min(Math.floor((canvas.width * canvas.height) / 15000), 80);
    particulas = Array.from({ length: cantidad }, crearParticula);
  }

  function dibujar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const colores = obtenerColores();
    const distanciaMax = 120;

    particulas.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radio, 0, Math.PI * 2);
      ctx.fillStyle = `${colores.particula}${p.alpha})`;
      ctx.fill();

      for (let j = i + 1; j < particulas.length; j++) {
        const otra = particulas[j];
        const dx   = p.x - otra.x;
        const dy   = p.y - otra.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < distanciaMax) {
          const alphaLinea = (1 - dist / distanciaMax) * 0.15;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(otra.x, otra.y);
          ctx.strokeStyle = `${colores.particula}${alphaLinea})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    });

    animFrameId = requestAnimationFrame(dibujar);
  }

  ajustarTamano();
  inicializarParticulas();
  dibujar();

  window.addEventListener('resize', () => {
    cancelAnimationFrame(animFrameId);
    ajustarTamano();
    inicializarParticulas();
    dibujar();
  });

  window.addEventListener('temaChanged', () => {});
}

function initNavegacion() {
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });
}

function initScrollActivo() {
  const secciones = document.querySelectorAll('main section[id]');
  const navLinks  = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let actual = '';
    secciones.forEach(sec => {
      const top    = sec.offsetTop - 80;
      const bottom = top + sec.offsetHeight;
      if (window.scrollY >= top && window.scrollY < bottom) actual = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('activo', link.getAttribute('href') === `#${actual}`);
    });
  }, { passive: true });
}

function initAnimacionesScroll() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll(
    '.trabajo-card, .proyecto-card, .habilidad-categoria, .sobre-mi-grid, .contacto-grid, .section-header'
  ).forEach(el => {
    el.classList.add('oculto');
    observer.observe(el);
  });
}

function initMenuMovil() {
  const btnHamburguesa = document.getElementById('btn-hamburguesa');
  const navLinks       = document.querySelector('.nav-links');
  const header         = document.querySelector('header');

  if (!btnHamburguesa) return;

  btnHamburguesa.addEventListener('click', () => {
    const abierto = navLinks.classList.toggle('nav-abierto');
    btnHamburguesa.classList.toggle('activo', abierto);
    btnHamburguesa.setAttribute('aria-expanded', abierto);
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', cerrarMenu);
  });

  document.addEventListener('click', e => {
    if (!header.contains(e.target)) cerrarMenu();
  });

  function cerrarMenu() {
    navLinks.classList.remove('nav-abierto');
    btnHamburguesa.classList.remove('activo');
    btnHamburguesa.setAttribute('aria-expanded', 'false');
  }
}

function initFormulario() {
  const form = document.querySelector('form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nombre  = form.querySelector('#nombre').value.trim();
    const email   = form.querySelector('#email').value.trim();
    const mensaje = form.querySelector('#mensaje').value.trim();

    if (!nombre || !email || !mensaje) {
      mostrarMensaje(form, '⚠️ Por favor, completa todos los campos.', 'error');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      mostrarMensaje(form, '⚠️ Por favor, introduce un email válido.', 'error');
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    const textoOriginal = btn.textContent;
    btn.textContent = 'Enviando...';
    btn.disabled = true;

    try {
      await esperar(1500);
      mostrarMensaje(form, '✅ ¡Mensaje enviado! Te contactaré pronto.', 'exito');
      form.reset();
    } catch (err) {
      mostrarMensaje(form, '❌ Hubo un error al enviar. Intenta de nuevo.', 'error');
    } finally {
      btn.textContent = textoOriginal;
      btn.disabled = false;
    }
  });
}

function mostrarMensaje(contenedor, texto, tipo) {
  contenedor.querySelector('.form-mensaje')?.remove();
  const div = document.createElement('div');
  div.className = `form-mensaje form-mensaje--${tipo}`;
  div.textContent = texto;
  contenedor.appendChild(div);
  setTimeout(() => div.remove(), 5000);
}

function esperar(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
