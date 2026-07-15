/**
 * 대한민국 17개 시·도 (행정구역) — 도감 지자체 목록
 *
 * 필터 분류 (chip data-region):
 * - all: 전체 17개
 * - metro (수도권): 서울특별시, 인천광역시, 경기도
 * - metro-city (광역시): 부산·인천·대구·광주·대전·울산 (인천은 수도권과 겹침)
 * - other (도): 9개 도·특별자치도·세종 (수도권·광역시 제외)
 */
(function () {
  const THUMB_POOL = [
    'https://images.unsplash.com/photo-1538485049741-fc4ae4a8b63e?w=60&h=60&fit=crop',
    'https://images.unsplash.com/photo-1517154428173-894dca833cd7?w=60&h=60&fit=crop',
    'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=60&h=60&fit=crop',
  ];

  window.TRIPLOG_REGIONS = [
    { name: '부산광역시', shortName: '부산', collected: 2, total: 4, groups: ['metro-city'] },
    { name: '서울특별시', shortName: '서울', collected: 12, total: 45, groups: ['metro'] },
    { name: '대전광역시', shortName: '대전', collected: 4, total: 8, groups: ['metro-city'] },
    { name: '경기도', shortName: '경기', collected: 143, total: 1000, groups: ['metro'] },
    { name: '강원특별자치도', shortName: '강원', collected: 18, total: 120, groups: ['other'] },
    { name: '전라남도', shortName: '전라남', collected: 14, total: 100, groups: ['other'] },
    { name: '인천광역시', shortName: '인천', collected: 7, total: 28, groups: ['metro', 'metro-city'] },
    { name: '광주광역시', shortName: '광주', collected: 3, total: 18, groups: ['metro-city'] },
    { name: '대구광역시', shortName: '대구', collected: 2, total: 24, groups: ['metro-city'] },
    { name: '울산광역시', shortName: '울산', collected: 1, total: 16, groups: ['metro-city'] },
    { name: '세종특별자치시', shortName: '세종', collected: 2, total: 10, groups: ['other'] },
    { name: '충청북도', shortName: '충청북', collected: 9, total: 80, groups: ['other'] },
    { name: '충청남도', shortName: '충청남', collected: 11, total: 90, groups: ['other'] },
    { name: '전라북도', shortName: '전라북', collected: 6, total: 70, groups: ['other'] },
    { name: '경상북도', shortName: '경상북', collected: 10, total: 110, groups: ['other'] },
    { name: '경상남도', shortName: '경상남', collected: 8, total: 95, groups: ['other'] },
    { name: '제주특별자치도', shortName: '제주', collected: 5, total: 40, groups: ['other'] },
  ];

  function filterRegions(filterKey) {
    if (!filterKey || filterKey === 'all') return window.TRIPLOG_REGIONS;
    return window.TRIPLOG_REGIONS.filter((region) => region.groups?.includes(filterKey));
  }

  function renderRegionRow(region, interactive) {
    const pct = Math.min(100, Math.round((region.collected / region.total) * 100));
    const explore = interactive
      ? ` data-go="exploreProvince" data-region="${region.name}"`
      : '';
    const tag = interactive ? 'button' : 'div';
    const attrs = interactive
      ? `class="region-row region-row--button is-pressable"${explore} type="button"`
      : 'class="region-row"';

    const thumbCount = region.collected > 0 ? Math.min(2, region.collected) : 0;
    const thumbsHtml = thumbCount
      ? `<div class="region-row__thumbs">${THUMB_POOL.slice(0, thumbCount)
          .map((src) => `<img class="region-row__thumb" src="${src}" alt="">`)
          .join('')}</div>`
      : '';

    return `
      <${tag} ${attrs}>
        <div class="region-row__info">
          <div class="region-row__name">${region.name}</div>
          <div class="region-row__bar progress-bar"><div class="progress-bar__fill" style="width:${pct}%"></div></div>
          <p class="region-row__collect">${region.collected}/${region.total}장 수집</p>
        </div>
        ${thumbsHtml}
        <iconify-icon class="region-row__chevron" icon="mingcute:right-line"></iconify-icon>
      </${tag}>
    `;
  }

  window.renderRegionList = function renderRegionList(container, { interactive = false, filter = 'all' } = {}) {
    if (!container) return;
    const regions = filterRegions(filter);
    container.innerHTML = regions.map((region) => renderRegionRow(region, interactive)).join('');
  };

  window.filterRegions = filterRegions;

  document.querySelectorAll('[data-region-list]').forEach((el) => {
    const interactive = el.dataset.regionList === 'interactive';
    const filter = el.dataset.regionFilter || 'all';
    renderRegionList(el, { interactive, filter });
  });

  document.querySelectorAll('.region-chips').forEach((chipBar) => {
    const section = chipBar.closest('.home-section, section');
    const list = section?.querySelector('[data-region-list]');
    if (!list) return;

    const interactive = list.dataset.regionList === 'interactive';
    chipBar.querySelectorAll('.chip[data-region]').forEach((chip) => {
      chip.addEventListener('click', () => {
        chipBar.querySelectorAll('.chip').forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');
        renderRegionList(list, { interactive, filter: chip.dataset.region || 'all' });
      });
    });
  });
})();
