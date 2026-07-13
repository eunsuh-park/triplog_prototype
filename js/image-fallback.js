/**
 * 이미지 로드 실패 시 회색 배경 + 아이콘 플레이스홀더로 대체
 */
(function () {
  const ICON = 'mingcute:pic-line';

  function createFallback(alt) {
    const el = document.createElement('div');
    el.className = 'img-fallback';
    el.setAttribute('role', 'img');
    if (alt) el.setAttribute('aria-label', alt);
    el.innerHTML = `<iconify-icon icon="${ICON}" width="32" aria-hidden="true"></iconify-icon>`;
    return el;
  }

  function applyFallback(img) {
    if (!img || img.dataset.fallbackApplied) return;
    img.dataset.fallbackApplied = '1';

    const fallback = createFallback(img.alt || '');
    const parent = img.parentElement;

    if (parent?.classList.contains('img-fallback-wrap')) {
      parent.replaceChild(fallback, img);
      return;
    }

    fallback.classList.add(...img.classList);
    fallback.style.cssText = img.style.cssText;
    img.replaceWith(fallback);
  }

  function bind(img) {
    if (!img || img.dataset.fallbackBound) return;
    img.dataset.fallbackBound = '1';
    img.addEventListener('error', () => applyFallback(img));
    if (img.complete && img.naturalWidth === 0 && img.src) applyFallback(img);
  }

  function bindAll(root) {
    if (!root) return;
    root.querySelectorAll('img:not([data-fallback-bound])').forEach(bind);
  }

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((m) => {
      m.addedNodes.forEach((node) => {
        if (node.nodeType !== 1) return;
        if (node.tagName === 'IMG') bind(node);
        else bindAll(node);
      });
    });
  });

  function init() {
    bindAll(document);
    observer.observe(document.body, { childList: true, subtree: true });
  }

  window.TriplogImageFallback = {
    bind,
    bindAll,
    applyFallback,
    placeholderHtml(alt, iconSize, extraClass) {
      const size = iconSize || 32;
      const classes = extraClass ? `img-fallback ${extraClass}` : 'img-fallback';
      const label = alt ? ` role="img" aria-label="${alt.replace(/"/g, '&quot;')}"` : ' aria-hidden="true"';
      return `<div class="${classes}"${label}><iconify-icon icon="${ICON}" width="${size}"></iconify-icon></div>`;
    },
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
