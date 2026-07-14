/**
 * 지역 상세 (EXPLORE-02) — 랜드마크 카드 그리드 / 캐러셀
 */
(function () {
  const IMG = {
    gyeongbok: 'https://images.unsplash.com/photo-1538485049741-fc4ae4a8b63e?w=400&h=400&fit=crop',
    haewoondae: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=400&fit=crop',
    gwangan: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop',
    namsan: 'https://images.unsplash.com/photo-1517154428173-894dca833cd7?w=400&h=400&fit=crop',
  };

  const GRADE_META = {
    L: { ko: '전설', en: 'Legendary', tagline: '지역 상징성이 매우 큰 대표 명소' },
    E: { ko: '에픽', en: 'Epic', tagline: '인지도 높은 주요 명소' },
    R: { ko: '레어', en: 'Rare', tagline: '지역 대표 관광지' },
    C: { ko: '일반', en: 'Common', tagline: '일반 관광지' },
  };

  /** korea.svg 도형 순서 → 시·도 (홈 지도와 동일) */
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

  /** 전국 지도에 별도 폴리곤이 없는 광역시 — 좌표 마커 (viewBox 1366×768) */
  const METRO_MARKERS = {
    부산광역시: { cx: 768, cy: 565 },
    대구광역시: { cx: 728, cy: 478 },
    울산광역시: { cx: 808, cy: 528 },
    인천광역시: { cx: 548, cy: 318 },
    광주광역시: { cx: 528, cy: 528 },
    대전광역시: { cx: 602, cy: 438 },
    세종특별자치시: { cx: 588, cy: 408 },
    충청남도: { cx: 560, cy: 430 },
  };

  const REGION_DETAIL = {
    부산광역시: {
      area: '769.94km²',
      population: '약 334만 명',
      districts: '15개 구',
      summary: '대한민국 제2의 도시이자 동남권 거점 항구 도시예요. 해운대·광안리·자갈치 등 바다와 도시가 어우러진 매력적인 관광지입니다.',
      homepage: 'https://www.busan.go.kr',
      meta: '769.94km² | 약 334만 명 | 15개 구',
      date: '2026년 3월 24일',
      landmarks: [
        { name: '해운대', addr: '부산광역시 해운대구 우동', img: IMG.haewoondae, visited: true, grade: 'E', rating: 4, date: '2026.03.18', desc: '대표 해변 휴양지', district: '부산 해운대구' },
        { name: '광안리', addr: '부산광역시 수영구 광안동', img: IMG.gwangan, visited: true, grade: 'R', rating: 4, date: '2026.03.20', desc: '광안대교 야경 명소', district: '부산 수영구' },
        { name: '어쩌구', addr: '부산광역시 ...', visited: false },
        { name: '어쩌구', addr: '부산광역시 ...', visited: false },
      ],
    },
    서울특별시: {
      area: '605.21km²',
      population: '약 940만 명',
      districts: '25개 구',
      summary: '대한민국의 수도이자 정치·경제·문화의 중심지예요. 궁궐·한강·전통과 현대가 공존하는 도시입니다.',
      homepage: 'https://www.seoul.go.kr',
      meta: '605.21km² | 약 940만 명 | 25개 구',
      date: '2026년 3월 24일',
      landmarks: [
        { name: '경복궁', addr: '서울특별시 종로구 사직로', img: IMG.gyeongbok, visited: true, grade: 'R', rating: 4, date: '2026.03.20', desc: '조선 왕조의 법궁', district: '서울 종로구' },
        { name: '남산타워', addr: '서울특별시 용산구 남산공원길', img: IMG.namsan, visited: true, grade: 'E', rating: 3, date: '2024.06.05', desc: '서울 야경의 랜드마크', district: '서울 용산구' },
        { name: '어쩌구', addr: '서울특별시 ...', visited: false },
        { name: '어쩌구', addr: '서울특별시 ...', visited: false },
        { name: '어쩌구', addr: '서울특별시 ...', visited: false },
        { name: '어쩌구', addr: '서울특별시 ...', visited: false },
      ],
    },
    경기도: {
      area: '10,184km²',
      population: '약 1,350만 명',
      districts: '31개 시군',
      summary: '수도권을 둘러싼 최대 인구·면적의 도예요. 수원화성·한강·신도시와 자연이 함께하는 다채로운 탐험지입니다.',
      homepage: 'https://www.gg.go.kr',
      meta: '10,184km² | 약 1,350만 명 | 31개 시군',
      date: '2026년 3월 20일',
      landmarks: [
        { name: '수원화성', addr: '경기도 수원시 팔달구', img: IMG.gyeongbok, visited: true, grade: 'R', rating: 4, date: '2026.03.15', desc: '유네스코 세계문화유산', district: '경기 수원시' },
        { name: '어쩌구', addr: '경기도 ...', visited: false },
        { name: '어쩌구', addr: '경기도 ...', visited: false },
      ],
    },
  };

  let miniMapCache = {};

  function renderFacts(detail) {
    const items = [detail.area, detail.population, detail.districts].filter(Boolean);
    return items.map((label) => `<span class="region-detail__fact">${label}</span>`).join('');
  }

  function getDetail(region) {
    if (REGION_DETAIL[region.name]) return REGION_DETAIL[region.name];

    const landmarks = Array.from({ length: Math.min(region.total, 9) }, (_, i) => ({
      name: i < region.collected ? `랜드마크 ${i + 1}` : '어쩌구',
      addr: `${region.name} ...`,
      img: i < region.collected ? IMG.gyeongbok : undefined,
      visited: i < region.collected,
    }));

    return {
      area: '—',
      population: '—',
      districts: region.shortName || region.name,
      summary: `${region.name}의 대표 랜드마크를 방문 인증하고 카드를 모아보세요.`,
      homepage: '#',
      meta: `${region.name} 탐험 지역`,
      date: '2026년 3월 24일',
      landmarks,
    };
  }

  async function loadMapSvg(url) {
    if (miniMapCache[url]) return miniMapCache[url].cloneNode(true);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`SVG load failed: ${url}`);
    const raw = await res.text();
    const doc = new DOMParser().parseFromString(raw, 'image/svg+xml');
    const svg = doc.querySelector('svg');
    if (!svg) throw new Error(`No SVG in ${url}`);
    miniMapCache[url] = svg;
    return svg.cloneNode(true);
  }

  function normalizeGroupAdminId(gid) {
    const name = String(gid || '').replace(/^_/, '');
    return /(시|군|구)$/.test(name) && !name.startsWith('LWPOLYLINE') ? name : '';
  }

  function bindProvinceShapeAdmins(svg, regionName) {
    const shapeMap = window.TRIPLOG_PROVINCE?.getShapeAdminMap(regionName) || {};
    svg.querySelectorAll('g[id]').forEach((group) => {
      const adminName = normalizeGroupAdminId(group.id);
      if (!adminName) return;
      group.querySelectorAll('path, polygon').forEach((el) => {
        if (el.getAttribute('fill') === 'none') return;
        el.dataset.adminName = adminName;
      });
    });

    const shapes = [...svg.querySelectorAll('path, polygon')].filter((el) => el.getAttribute('fill') !== 'none');
    shapes.forEach((el, index) => {
      if (el.dataset.adminName) return;
      const adminName = shapeMap[String(index)];
      if (adminName) el.dataset.adminName = adminName;
    });
  }

  function paintProvinceMiniMapShape(el, highlighted) {
    el.classList.add('mini-map-land');
    el.classList.toggle('is-active', highlighted);
    el.style.fill = highlighted ? 'var(--map-land-active)' : 'var(--surface-dim)';
    el.style.stroke = highlighted ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.85)';
    el.style.strokeWidth = highlighted ? '1.6px' : '1px';
    el.style.opacity = highlighted ? '1' : '0.85';
  }

  function applyMiniMapAdminFilter(root, selectedAdmin) {
    const host = root.querySelector('[data-region-mini-map]');
    const svg = host?.querySelector('svg');
    if (!svg) return;
    const filterAll = !selectedAdmin || selectedAdmin === '전체';
    svg.querySelectorAll('path, polygon').forEach((el) => {
      if (el.getAttribute('fill') === 'none') return;
      const adminName = el.dataset.adminName;
      const highlighted = filterAll || adminName === selectedAdmin;
      paintProvinceMiniMapShape(el, highlighted);
    });
  }

  function styleProvinceMiniMap(svg, regionName) {
    const textLayer = svg.querySelector('#text');
    if (textLayer) textLayer.style.display = 'none';
    bindProvinceShapeAdmins(svg, regionName);
    svg.querySelectorAll('path, polygon').forEach((el) => {
      if (el.getAttribute('fill') === 'none') return;
      el.removeAttribute('class');
      paintProvinceMiniMapShape(el, true);
    });
  }

  function closeAdminPicker(root) {
    const picker = root.querySelector('[data-region-admin-picker]');
    const toggle = root.querySelector('[data-region-admin-toggle]');
    const menu = root.querySelector('[data-region-admin-menu]');
    if (!picker || !toggle || !menu) return;
    picker.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    menu.hidden = true;
  }

  function renderAdminPicker(root, regionName) {
    const picker = root.querySelector('[data-region-admin-picker]');
    const label = root.querySelector('[data-region-admin-label]');
    const menu = root.querySelector('[data-region-admin-menu]');
    if (!picker || !label || !menu) return;

    const provinceApi = window.TRIPLOG_PROVINCE;
    const isProvince = provinceApi?.isProvinceRegion(regionName);
    picker.hidden = !isProvince;
    closeAdminPicker(root);

    if (!isProvince) {
      root.dataset.regionAdminFilter = '';
      return;
    }

    const selected = root.dataset.regionAdminFilter || '전체';
    label.textContent = selected;
    const admins = provinceApi.sortKorean(provinceApi.getProvinceAdmins(regionName));
    const options = ['전체', ...admins];
    menu.innerHTML = options
      .map((name) => {
        const active = name === selected ? ' active' : '';
        return `<button class="region-detail__admin-option${active} is-pressable" type="button" role="option" data-region-admin-option="${name}" aria-selected="${name === selected}">${name}</button>`;
      })
      .join('');
    applyMiniMapAdminFilter(root, selected);
  }

  function setAdminFilter(root, adminName) {
    root.dataset.regionAdminFilter = adminName;
    const label = root.querySelector('[data-region-admin-label]');
    if (label) label.textContent = adminName;
    root.querySelectorAll('[data-region-admin-option]').forEach((btn) => {
      const on = btn.dataset.regionAdminOption === adminName;
      btn.classList.toggle('active', on);
      btn.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    applyMiniMapAdminFilter(root, adminName);
    closeAdminPicker(root);
  }

  function initAdminPicker(root) {
    if (root.dataset.adminPickerInit) return;
    root.dataset.adminPickerInit = '1';

    root.addEventListener('click', (e) => {
      const toggle = e.target.closest('[data-region-admin-toggle]');
      if (toggle) {
        const picker = root.querySelector('[data-region-admin-picker]');
        const menu = root.querySelector('[data-region-admin-menu]');
        if (!picker || picker.hidden || !menu) return;
        const open = picker.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        menu.hidden = !open;
        return;
      }

      const option = e.target.closest('[data-region-admin-option]');
      if (option) {
        setAdminFilter(root, option.dataset.regionAdminOption);
        return;
      }

      if (!e.target.closest('[data-region-admin-picker]')) {
        closeAdminPicker(root);
      }
    });
  }

  function highlightNationalMiniMap(svg, regionName) {
    const shapes = svg.querySelectorAll('path, polygon');
    shapes.forEach((el, index) => {
      el.removeAttribute('class');
      el.removeAttribute('style');
      el.classList.add('mini-map-land');
      const shapeName = NATIONAL_SHAPE_REGIONS[index];
      if (shapeName === regionName || (regionName === '강원도' && shapeName === '강원특별자치도')) {
        el.classList.add('is-active');
      }
    });

    svg.querySelectorAll('.mini-map-marker, .mini-map-marker-soft').forEach((el) => el.remove());

    const marker = METRO_MARKERS[regionName];
    const shapeIndex = NATIONAL_SHAPE_REGIONS.indexOf(regionName);
    if (marker && shapeIndex < 0) {
      const soft = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      soft.setAttribute('class', 'mini-map-marker-soft');
      soft.setAttribute('cx', String(marker.cx));
      soft.setAttribute('cy', String(marker.cy));
      soft.setAttribute('r', '42');
      svg.appendChild(soft);

      const softDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      softDot.setAttribute('class', 'mini-map-marker');
      softDot.setAttribute('cx', String(marker.cx));
      softDot.setAttribute('cy', String(marker.cy));
      softDot.setAttribute('r', '18');
      svg.appendChild(softDot);
    }
  }

  async function renderMiniMap(root, regionName) {
    const host = root.querySelector('[data-region-mini-map]');
    if (!host) return;
    host.setAttribute('aria-label', `${regionName} 위치 지도`);
    host.innerHTML = '<div class="region-detail__mini-map__empty">지도 불러오는 중…</div>';

    try {
      const provinceFile = PROVINCE_SVG[regionName];
      const url = provinceFile
        ? `assets/maps/${provinceFile}`
        : 'assets/maps/korea.svg';
      const svg = await loadMapSvg(url);
      svg.removeAttribute('id');
      svg.setAttribute('aria-hidden', 'true');
      svg.querySelectorAll('style').forEach((el) => el.remove());
      if (provinceFile) {
        host.classList.add('region-detail__mini-map--province');
        styleProvinceMiniMap(svg, regionName);
      } else {
        host.classList.remove('region-detail__mini-map--province');
        highlightNationalMiniMap(svg, regionName);
      }
      host.innerHTML = '';
      host.appendChild(svg);
    } catch (err) {
      console.error(err);
      host.innerHTML = '<div class="region-detail__mini-map__empty">지도를 불러올 수 없습니다</div>';
    }
  }

  function renderCardBack(lm) {
    const grade = GRADE_META[lm.grade] || GRADE_META.C;
    const gradeCls = `grade-tag--${lm.grade || 'C'}`;
    const shortLoc = (lm.district || '').split(' ').slice(1).join(' ') || lm.district || '';
    const max = 5;
    const rating = Math.max(0, Math.min(max, lm.rating || 0));
    const stars = Array.from({ length: max }, (_, i) =>
      `<iconify-icon icon="${i < rating ? 'mingcute:star-fill' : 'mingcute:star-line'}" width="13"></iconify-icon>`
    ).join('');

    return `
      <div class="card-flip__back-body card-detail">
        <div class="card-detail__head">
          <div class="card-detail__rating" aria-label="별점">${stars}</div>
          <span class="grade-tag ${gradeCls}">${grade.ko}</span>
          <span class="card-detail__collected"><iconify-icon icon="mingcute:check-circle-fill" width="14"></iconify-icon> 수집 완료</span>
        </div>
        <div class="card-detail__meta">
          <span class="card-detail__meta-item"><iconify-icon icon="mingcute:location-line" width="13"></iconify-icon> ${lm.district || ''}</span>
          <span class="card-detail__meta-item"><iconify-icon icon="mingcute:check-circle-line" width="13"></iconify-icon> ${lm.date || ''} 획득</span>
        </div>
        <div class="card-detail__desc">
          <iconify-icon icon="mingcute:sparkles-line" width="14"></iconify-icon>
          <span>${lm.desc || ''}</span>
        </div>
        <div class="card-detail__boxes">
          <div class="card-detail__box">
            <iconify-icon class="card-detail__box-icon" icon="mingcute:trophy-line" width="18"></iconify-icon>
            <span class="card-detail__box-label">희귀도</span>
            <span class="card-detail__box-value">${grade.ko}</span>
          </div>
          <div class="card-detail__box">
            <iconify-icon class="card-detail__box-icon" icon="mingcute:location-line" width="18"></iconify-icon>
            <span class="card-detail__box-label">위치</span>
            <span class="card-detail__box-value">${shortLoc}</span>
          </div>
          <div class="card-detail__box">
            <iconify-icon class="card-detail__box-icon" icon="mingcute:star-line" width="18"></iconify-icon>
            <span class="card-detail__box-label">등급</span>
            <span class="card-detail__box-value">${grade.en}</span>
          </div>
        </div>
        <p class="card-detail__tagline grade-text--${lm.grade || 'C'}">${grade.tagline}</p>
        <button class="card-flip__detail-btn is-pressable" type="button" data-go="detail" data-landmark-index="${lm.index}">상세 보기</button>
      </div>`;
  }

  function renderCollectCard(lm, interactive, index) {
    const cls = lm.visited ? 'region-collect-card' : 'region-collect-card region-collect-card--locked';
    const thumb = `<div class="region-collect-card__placeholder"><iconify-icon icon="mingcute:pic-line" width="28"></iconify-icon></div>`;
    const inner = `${thumb}<p class="region-collect-card__name">${lm.name}</p><p class="region-collect-card__addr">${lm.addr}</p>`;

    if (interactive && lm.visited) {
      return `<button class="${cls} region-collect-card--button is-pressable" data-go="detail" data-landmark-index="${index}" type="button">${inner}</button>`;
    }
    return `<div class="${cls}">${inner}</div>`;
  }

  function renderGrid(detail, interactive) {
    const cards = detail.landmarks.map((lm, i) => renderCollectCard(lm, interactive, i)).join('');
    const extras = Array.from({ length: Math.max(0, 9 - detail.landmarks.length) }, () =>
      renderCollectCard({ name: '어쩌구', addr: `${detail.landmarks[0]?.addr?.split(' ')[0] || ''} ...`, visited: false }, false)
    ).join('');
    return cards + extras;
  }

  function renderCarouselSlide(lm, interactive, index) {
    const locked = !lm.visited;
    const img =
      lm.visited && lm.img
        ? `<img src="${lm.img}" alt="">`
        : `<div class="region-card-carousel__placeholder"></div>`;
    const chip = lm.visited ? `<span class="region-card-carousel__chip">모두</span>` : '';
    const frontInner = `
      <div class="region-card-carousel__img-wrap">
        ${img}
        ${chip}
      </div>
      <div class="region-card-carousel__info">
        <p class="region-card-carousel__name">${lm.name}</p>
        <p class="region-card-carousel__addr">${lm.addr}</p>
      </div>`;

    const cls = `region-card-carousel__slide${locked ? ' region-card-carousel__slide--locked' : ''}`;

    if (interactive && lm.visited) {
      const lmWithIndex = { ...lm, index };
      return `
        <article class="${cls}">
          <div class="card-flip" data-region-card-flip>
            <div class="card-flip__inner">
              <div class="card-flip__face card-flip__face--front" role="button" tabindex="0" aria-label="${lm.name} 카드 앞면">
                ${frontInner}
              </div>
              <div class="card-flip__face card-flip__face--back" aria-hidden="true">
                ${renderCardBack(lmWithIndex)}
              </div>
            </div>
          </div>
        </article>`;
    }
    return `<article class="${cls}">${frontInner}</article>`;
  }

  function renderCarousel(detail, interactive) {
    return detail.landmarks.map((lm, i) => renderCarouselSlide(lm, interactive, i)).join('');
  }

  function setRegionCardFlipped(flipEl, flipped) {
    if (!flipEl) return;
    flipEl.classList.toggle('is-flipped', flipped);
    const back = flipEl.querySelector('.card-flip__face--back');
    if (back) back.setAttribute('aria-hidden', flipped ? 'false' : 'true');
  }

  function initRegionCardFlip(root) {
    const track = root.querySelector('[data-region-carousel]');
    if (!track || track.dataset.flipInit) return;
    track.dataset.flipInit = '1';

    let touchStartX = 0;
    let touchStartY = 0;
    let tapLocked = false;

    track.addEventListener('touchstart', (e) => {
      const flip = e.target.closest('[data-region-card-flip]');
      if (!flip) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      const flip = e.target.closest('[data-region-card-flip]');
      if (!flip || e.target.closest('[data-go="detail"]')) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      if (Math.abs(dx) < 40 && Math.abs(dy) < 40) {
        tapLocked = true;
        setRegionCardFlipped(flip, !flip.classList.contains('is-flipped'));
        window.setTimeout(() => { tapLocked = false; }, 320);
      }
    }, { passive: true });

    track.addEventListener('click', (e) => {
      if (e.target.closest('[data-go="detail"]')) return;
      const flip = e.target.closest('[data-region-card-flip]');
      if (!flip || tapLocked) return;
      setRegionCardFlipped(flip, !flip.classList.contains('is-flipped'));
    });
  }

  function initRegionCarousel(root, startIndex) {
    const track = root.querySelector('[data-region-carousel]');
    const pager = root.querySelector('[data-region-pager]');
    if (!track || !pager) return;

    const slides = track.querySelectorAll('.region-card-carousel__slide');
    const total = slides.length;
    if (!total) return;

    function clampIndex(index) {
      return Math.max(0, Math.min(index, total - 1));
    }

    function scrollToIndex(index, behavior = 'auto') {
      const slide = slides[clampIndex(index)];
      if (!slide) return;
      const offset = slide.offsetLeft - (track.clientWidth - slide.offsetWidth) / 2;
      track.scrollTo({ left: offset, behavior });
    }

    function getActiveIndex() {
      const center = track.scrollLeft + track.clientWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      slides.forEach((slide, i) => {
        const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
        const dist = Math.abs(center - slideCenter);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      return best;
    }

    function updatePager(index) {
      const safeIndex = clampIndex(index);
      pager.textContent = `${safeIndex + 1} / ${total}`;
      root.dataset.regionCarouselIndex = String(safeIndex);
    }

    let scrollTimer;
    if (!track.dataset.carouselInit) {
      track.dataset.carouselInit = '1';
      track.addEventListener(
        'scroll',
        () => {
          clearTimeout(scrollTimer);
          scrollTimer = setTimeout(() => updatePager(getActiveIndex()), 80);
        },
        { passive: true }
      );
    }

    requestAnimationFrame(() => {
      scrollToIndex(startIndex);
      updatePager(startIndex);
    });
  }

  window.renderRegionDetail = function renderRegionDetail(region, root) {
    if (!root || !region) return;

    const detail = getDetail(region);
    const pct = Math.min(100, Math.round((region.collected / region.total) * 100));
    const visited = detail.landmarks.filter((lm) => lm.visited);
    const carouselIndex = Math.max(0, visited.length - 1);

    const titleEls = root.querySelectorAll('[data-region-title]');
    const factsEls = root.querySelectorAll('[data-region-facts]');
    const summaryEls = root.querySelectorAll('[data-region-summary]');
    const homepageEls = root.querySelectorAll('[data-region-homepage]');
    const statValues = root.querySelectorAll('[data-region-stat-value]');
    const grid = root.querySelector('[data-region-card-grid]');
    const carousel = root.querySelector('[data-region-carousel]');

    titleEls.forEach((el) => { el.textContent = region.name; });
    const factsHtml = renderFacts(detail);
    factsEls.forEach((el) => { el.innerHTML = factsHtml; });
    summaryEls.forEach((el) => { el.textContent = detail.summary; });
    homepageEls.forEach((el) => { el.href = detail.homepage || '#'; });
    statValues.forEach((el) => {
      el.textContent = `${pct}%`;
    });
    if (grid) grid.innerHTML = renderGrid(detail, true);
    if (carousel) carousel.innerHTML = renderCarousel(detail, true);

    root.dataset.regionCarouselIndex = String(carouselIndex);
    root.dataset.regionName = region.name;
    root.dataset.regionAdminFilter = '전체';

    renderMiniMap(root, region.name).then(() => {
      renderAdminPicker(root, region.name);
    });
    initAdminPicker(root);
    initRegionCarousel(root, carouselIndex);
    initRegionCardFlip(root);
  };
})();
