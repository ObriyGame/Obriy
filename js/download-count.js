/* Display GitHub's download count for the exact installer linked on this page. */
(async () => {
  const counter = document.querySelector('[data-download-count]');
  const link = document.querySelector('.download-actions a');
  if (!counter || !link) return;
  const unavailable = () => {
    counter.textContent = '—';
    counter.setAttribute('aria-label', counter.dataset.unavailable);
    counter.title = counter.dataset.unavailable;
  };
  try {
    const url = new URL(link.href);
    const parts = url.pathname.split('/');
    if (url.hostname !== 'github.com' || parts[3] !== 'releases' ||
        parts[4] !== 'download' || parts.length !== 7) throw new Error('Unexpected installer URL');
    const endpoint = `https://api.github.com/repos/${parts[1]}/${parts[2]}/releases/tags/${parts[5]}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    let release;
    try {
      const response = await fetch(endpoint, {
        headers: { Accept: 'application/vnd.github+json' },
        signal: controller.signal
      });
      if (!response.ok) throw new Error('Statistics unavailable');
      release = await response.json();
    } finally {
      clearTimeout(timeout);
    }
    const asset = (release.assets || []).find(item => item.browser_download_url === url.href);
    if (!asset || !Number.isSafeInteger(asset.download_count) || asset.download_count < 0) {
      throw new Error('Installer statistics missing');
    }
    counter.textContent = new Intl.NumberFormat(document.documentElement.lang).format(asset.download_count);
    counter.removeAttribute('aria-label');
  } catch (_) {
    unavailable();
  }
})();
