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
    const img = lm.visited && lm.img ? `<img src="${lm.img}" alt="">` : `<div class="region-collect-card__placeholder"></div>`;
    const inner = `${img}<p class="region-collect-card__name">${lm.name}</p><p class="region-collect-card__addr">${lm.addr}</p>`;

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

    initRegionCarousel(root, carouselIndex);
    initRegionCardFlip(root);
  };
})();
