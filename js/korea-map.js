/**
 * 전국 지도 — 일러스트 SVG 클릭 → 시·도 상세 SVG
 */
(function () {
  const MAP_BASE = 'assets/maps/';
  const NATIONAL_URL = MAP_BASE + 'korea.svg';

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
  let mapStage = null;

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

  function ensureStage() {
    if (mapStage) return mapStage;
    mapStage = document.createElement('div');
    mapStage.className = 'korea-map__stage';
    container.appendChild(mapStage);
    return mapStage;
  }

  function renderToolbar(regionName) {
    let toolbar = container.querySelector('.korea-map__toolbar');
    if (!toolbar) {
      toolbar = document.createElement('div');
      toolbar.className = 'korea-map__toolbar';
      container.insertBefore(toolbar, container.firstChild);
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

      const activate = () => showProvince(regionName);
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
    currentRegion = null;
    container.classList.remove('korea-map--province');
    hideToolbar();

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

    const stage = ensureStage();
    stage.innerHTML = '<div class="korea-map__loading">지도 불러오는 중…</div>';

    try {
      const svg = await loadSvg(url);
      styleProvinceSvg(svg);
      stage.innerHTML = '';
      stage.appendChild(svg);

      svg.addEventListener('click', () => {
        if (callbacks.onRegionExplore) callbacks.onRegionExplore(regionName);
      });
    } catch (err) {
      stage.innerHTML = '<p class="korea-map__error">지도를 불러올 수 없습니다.</p>';
      console.error(err);
    }
  }

  function init(el, options = {}) {
    container = el;
    callbacks = options;
    return showNational();
  }

  window.KoreaMapModule = {
    init,
    showNational,
    showProvince,
    getProvinceUrl,
  };
})();
