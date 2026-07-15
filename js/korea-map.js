/**
 * 전국 지도 — 일러스트 SVG 클릭 → 시·도 상세 SVG
 */
(function () {
  const MAP_BASE = 'assets/maps/';
  const NATIONAL_URL = MAP_BASE + 'korea.svg';
  const MIN_SCALE = 1;
  const MAX_SCALE = 4;

  /** korea.svg 도형 순서(위→아래) → 시·도 */
  const NATIONAL_SHAPE_REGIONS = [
    '전라남도',
    '전라북도',
    '서울특별시',
    '강원특별자치도',
    '경기도',
    '경상남도',
    '경상북도',
    '충청북도',
    '제주특별자치도',
  ];

  const PROVINCE_SVG = {
    서울특별시: '서울특별시.svg',
    부산광역시: '부산광역시.svg',
    인천광역시: '인천광역시.svg',
    대구광역시: '대구광역시.svg',
    광주광역시: '광주광역시.svg',
    대전광역시: '대전광역시.svg',
    울산광역시: '울산광역시.svg',
    세종특별자치시: '세종특별자치시.svg',
    강원특별자치도: '강원도.svg',
    강원도: '강원도.svg',
    충청북도: '충청북도.svg',
    충청남도: '충청남도.svg',
    전라북도: '전라북도.svg',
    전라남도: '전라남도.svg',
    경상북도: '경상북도.svg',
    경상남도: '경상남도.svg',
    제주특별자치도: '제주특별자치도.svg',
    경기도: 'gyeonggi.svg',
  };

  let container = null;
  let callbacks = {};
  let currentRegion = null;
  let mapViewport = null;
  let mapCanvas = null;
  let mapStage = null;
  let scale = 1;
  let translateX = 0;
  let translateY = 0;
  let suppressMapClick = false;

  async function loadSvg(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`SVG load failed: ${url}`);
    const text = await res.text();
    const doc = new DOMParser().parseFromString(text, 'image/svg+xml');
    const svg = doc.querySelector('svg');
    if (!svg) throw new Error(`No SVG in ${url}`);
    return svg;
  }

  function isVisited(regionName) {
    const region = window.TRIPLOG_REGIONS?.find((r) => r.name === regionName);
    return region ? region.collected > 0 : false;
  }

  function getProvinceUrl(regionName) {
    const file = PROVINCE_SVG[regionName];
    return file ? MAP_BASE + file : null;
  }

  function applyTransform() {
    if (!mapCanvas) return;
    mapCanvas.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
  }

  function resetMapTransform() {
    scale = 1;
    translateX = 0;
    translateY = 0;
    applyTransform();
  }

  function getTouchDistance(touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.hypot(dx, dy);
  }

  function initMapGestures(viewport) {
    if (viewport.dataset.gesturesInit) return;
    viewport.dataset.gesturesInit = '1';

    let pinchStartDist = 0;
    let pinchStartScale = 1;
    let panStartX = 0;
    let panStartY = 0;
    let panOriginX = 0;
    let panOriginY = 0;
    let isPanning = false;
    let gestureMoved = false;

    const markMoved = (dx, dy) => {
      if (Math.abs(dx) > 6 || Math.abs(dy) > 6) {
        gestureMoved = true;
        suppressMapClick = true;
      }
    };

    viewport.addEventListener(
      'touchstart',
      (e) => {
        gestureMoved = false;
        suppressMapClick = false;
        if (e.touches.length === 2) {
          isPanning = false;
          pinchStartDist = getTouchDistance(e.touches);
          pinchStartScale = scale;
        } else if (e.touches.length === 1) {
          isPanning = true;
          panStartX = e.touches[0].clientX;
          panStartY = e.touches[0].clientY;
          panOriginX = translateX;
          panOriginY = translateY;
        }
      },
      { passive: true }
    );

    viewport.addEventListener(
      'touchmove',
      (e) => {
        if (e.touches.length === 2) {
          e.preventDefault();
          const dist = getTouchDistance(e.touches);
          if (pinchStartDist > 0) {
            scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, pinchStartScale * (dist / pinchStartDist)));
            gestureMoved = true;
            suppressMapClick = true;
            applyTransform();
          }
        } else if (e.touches.length === 1 && isPanning) {
          const dx = e.touches[0].clientX - panStartX;
          const dy = e.touches[0].clientY - panStartY;
          markMoved(dx, dy);
          if (gestureMoved) {
            e.preventDefault();
            translateX = panOriginX + dx;
            translateY = panOriginY + dy;
            applyTransform();
          }
        }
      },
      { passive: false }
    );

    viewport.addEventListener(
      'touchend',
      () => {
        isPanning = false;
        if (scale <= 1) {
          resetMapTransform();
        }
        if (gestureMoved) {
          window.setTimeout(() => {
            suppressMapClick = false;
          }, 80);
        }
      },
      { passive: true }
    );

    viewport.addEventListener(
      'wheel',
      (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.92 : 1.08;
        scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale * delta));
        if (scale <= 1) resetMapTransform();
        else applyTransform();
      },
      { passive: false }
    );
  }

  function ensureViewport() {
    if (mapViewport) return mapViewport;
    mapViewport = document.createElement('div');
    mapViewport.className = 'korea-map__viewport';
    mapCanvas = document.createElement('div');
    mapCanvas.className = 'korea-map__canvas';
    mapViewport.appendChild(mapCanvas);
    container.appendChild(mapViewport);
    initMapGestures(mapViewport);
    return mapViewport;
  }

  function ensureStage() {
    ensureViewport();
    if (mapStage) return mapStage;
    mapStage = document.createElement('div');
    mapStage.className = 'korea-map__stage';
    mapCanvas.appendChild(mapStage);
    return mapStage;
  }

  function renderToolbar(regionName) {
    let toolbar = container.querySelector('.korea-map__toolbar');
    if (!toolbar) {
      toolbar = document.createElement('div');
      toolbar.className = 'korea-map__toolbar';
      container.insertBefore(toolbar, mapViewport);
    }

    toolbar.innerHTML = `
      <button class="korea-map__back is-pressable" type="button" data-map-back aria-label="전국 지도로">
        <iconify-icon icon="mingcute:left-line" width="18"></iconify-icon>
        전국 지도
      </button>
      <span class="korea-map__label">${regionName}</span>
      <button class="korea-map__explore is-pressable" type="button" data-map-explore>탐험하기</button>
    `;

    toolbar.querySelector('[data-map-back]').addEventListener('click', showNational);
    toolbar.querySelector('[data-map-explore]').addEventListener('click', () => {
      if (currentRegion && callbacks.onRegionExplore) {
        callbacks.onRegionExplore(currentRegion);
      }
    });
  }

  function hideToolbar() {
    const toolbar = container.querySelector('.korea-map__toolbar');
    if (toolbar) toolbar.remove();
  }

  function bindNationalRegions(svg) {
    const shapes = svg.querySelectorAll('path, polygon');
    shapes.forEach((el, index) => {
      const regionName = NATIONAL_SHAPE_REGIONS[index];
      if (!regionName) return;

      el.classList.add('map-region');
      el.dataset.region = regionName;
      el.setAttribute('role', 'button');
      el.setAttribute('tabindex', '0');
      el.setAttribute('aria-label', regionName);

      const visited = isVisited(regionName);
      el.classList.add(visited ? 'is-visited' : 'is-default');
      el.setAttribute('fill', visited ? 'var(--map-land-active)' : 'var(--map-land)');

      const activate = () => {
        if (suppressMapClick) return;
        showProvince(regionName);
      };
      el.addEventListener('click', activate);
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          activate();
        }
      });
      el.addEventListener('pointerenter', () => {
        svg.querySelectorAll('.map-region').forEach((r) => r.classList.remove('is-hover'));
        el.classList.add('is-hover');
      });
      el.addEventListener('pointerleave', () => el.classList.remove('is-hover'));
    });
  }

  function styleProvinceSvg(svg) {
    svg.classList.add('province-svg');
    svg.setAttribute('aria-hidden', 'false');

    const textLayer = svg.querySelector('#text');
    if (textLayer) textLayer.style.display = 'none';

    svg.querySelectorAll('path, polygon').forEach((el) => {
      if (el.classList.contains('cls-1') || el.getAttribute('fill') === 'none') return;
      el.classList.add('province-region');
      el.style.cursor = 'pointer';
    });
  }

  async function showNational() {
    if (!container) return;
    const prev = currentRegion;
    currentRegion = null;
    container.classList.remove('korea-map--province');
    hideToolbar();
    resetMapTransform();
    if (prev && callbacks.onProvinceLeave) callbacks.onProvinceLeave();

    const stage = ensureStage();
    stage.innerHTML = '';

    try {
      const svg = await loadSvg(NATIONAL_URL);
      svg.classList.add('korea-svg');
      svg.setAttribute('aria-label', '대한민국 지도');
      bindNationalRegions(svg);
      stage.appendChild(svg);
    } catch (err) {
      stage.innerHTML = '<p class="korea-map__error">지도를 불러올 수 없습니다.</p>';
      console.error(err);
    }
  }

  async function showProvince(regionName) {
    if (!container) return;
    const url = getProvinceUrl(regionName);
    if (!url) return;

    currentRegion = regionName;
    container.classList.add('korea-map--province');
    renderToolbar(regionName);
    resetMapTransform();
    if (callbacks.onProvinceEnter) callbacks.onProvinceEnter(regionName);

    const stage = ensureStage();
    stage.innerHTML = '<div class="korea-map__loading">지도 불러오는 중…</div>';

    try {
      const svg = await loadSvg(url);
      styleProvinceSvg(svg);
      stage.innerHTML = '';
      stage.appendChild(svg);
    } catch (err) {
      stage.innerHTML = '<p class="korea-map__error">지도를 불러올 수 없습니다.</p>';
      console.error(err);
    }
  }

  function getCurrentRegion() {
    return currentRegion;
  }

  function init(el, options = {}) {
    container = el;
    callbacks = options;
    mapViewport = null;
    mapCanvas = null;
    mapStage = null;
    ensureViewport();
    return showNational();
  }

  window.KoreaMapModule = {
    init,
    showNational,
    showProvince,
    getProvinceUrl,
    getCurrentRegion,
  };
})();
