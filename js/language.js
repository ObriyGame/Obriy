/* Remember the visitor's choice; Ukrainian is the default. */
(() => {
  const current = document.documentElement.lang;
  const url = new URL(window.location.href);
  const explicit = url.searchParams.get('lang');
  let preferred = current;
  try {
    if (explicit === 'uk' || explicit === 'en') {
      preferred = explicit;
      localStorage.setItem('obriy-language', explicit);
    } else {
      preferred = localStorage.getItem('obriy-language') || current;
    }
  } catch (_) {
    if (explicit === 'uk' || explicit === 'en') preferred = explicit;
  }
  if ((preferred === 'uk' || preferred === 'en') && preferred !== current) {
    const target = new URL(preferred === 'en' ? 'en.html' : 'index.html', url);
    target.search = url.search;
    target.hash = url.hash;
    window.location.replace(target.href);
    return;
  }
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-language]').forEach(link => {
      const target = new URL(link.href);
      target.hash = window.location.hash;
      link.href = target.href;
      link.addEventListener('click', () => {
        try { localStorage.setItem('obriy-language', link.dataset.language); } catch (_) {}
        const destination = new URL(link.href);
        destination.hash = window.location.hash;
        link.href = destination.href;
      });
    });
  });
})();
