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
        { name: '해운대', addr: '부산광역시 해운대구 우동', img: IMG.haewoondae, visited: true },
        { name: '광안리', addr: '부산광역시 수영구 광안동', img: IMG.gwangan, visited: true },
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
        { name: '경복궁', addr: '서울특별시 종로구 사직로', img: IMG.gyeongbok, visited: true },
        { name: '남산타워', addr: '서울특별시 용산구 남산공원길', img: IMG.namsan, visited: true },
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
        { name: '수원화성', addr: '경기도 수원시 팔달구', img: IMG.gyeongbok, visited: true },
        { name: '어쩌구', addr: '경기도 ...', visited: false },
        { name: '어쩌구', addr: '경기도 ...', visited: false },
      ],
    },
  };

  function renderFacts(detail) {
    const items = [
      { icon: 'mingcute:map-2-line', label: detail.area },
      { icon: 'mingcute:group-line', label: detail.population },
      { icon: 'mingcute:building-2-line', label: detail.districts },
    ].filter((item) => item.label);

    return items
      .map(
        (item) =>
          `<span class="region-detail__fact"><iconify-icon icon="${item.icon}" width="14"></iconify-icon>${item.label}</span>`
      )
      .join('');
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

  function renderCollectCard(lm, interactive) {
    const cls = lm.visited ? 'region-collect-card' : 'region-collect-card region-collect-card--locked';
    const img = lm.visited && lm.img ? `<img src="${lm.img}" alt="">` : `<div class="region-collect-card__placeholder"></div>`;
    const inner = `${img}<p class="region-collect-card__name">${lm.name}</p><p class="region-collect-card__addr">${lm.addr}</p>`;

    if (interactive && lm.visited) {
      return `<button class="${cls} is-pressable" data-go="detail" type="button" style="border:none;padding:0;cursor:pointer;text-align:left">${inner}</button>`;
    }
    return `<div class="${cls}">${inner}</div>`;
  }

  function renderGrid(detail, interactive) {
    const cards = detail.landmarks.map((lm) => renderCollectCard(lm, interactive)).join('');
    const extras = Array.from({ length: Math.max(0, 9 - detail.landmarks.length) }, () =>
      renderCollectCard({ name: '어쩌구', addr: `${detail.landmarks[0]?.addr?.split(' ')[0] || ''} ...`, visited: false }, false)
    ).join('');
    return cards + extras;
  }

  window.renderRegionDetail = function renderRegionDetail(region, root) {
    if (!root || !region) return;

    const detail = getDetail(region);
    const pct = Math.min(100, Math.round((region.collected / region.total) * 100));
    const visited = detail.landmarks.filter((lm) => lm.visited);
    const carouselIndex = Math.max(0, visited.length - 1);
    const current = detail.landmarks[carouselIndex] || detail.landmarks[0];

    const title = root.querySelector('[data-region-title]');
    const facts = root.querySelector('[data-region-facts]');
    const summary = root.querySelector('[data-region-summary]');
    const homepage = root.querySelector('[data-region-homepage]');
    const statValues = root.querySelectorAll('[data-region-stat-value]');
    const grid = root.querySelector('[data-region-card-grid]');
    const meta = root.querySelector('[data-region-meta]');
    const date = root.querySelector('[data-region-date]');
    const pager = root.querySelector('[data-region-pager]');
    const stackImg = root.querySelector('[data-region-stack-img]');
    const stackName = root.querySelector('[data-region-stack-name]');
    const stackAddr = root.querySelector('[data-region-stack-addr]');

    if (title) title.textContent = region.name;
    if (facts) facts.innerHTML = renderFacts(detail);
    if (summary) summary.textContent = detail.summary;
    if (homepage) homepage.href = detail.homepage || '#';
    statValues.forEach((el) => {
      el.textContent = `${pct}%`;
    });
    if (grid) grid.innerHTML = renderGrid(detail, true);
    if (meta) meta.textContent = detail.meta;
    if (date) date.textContent = detail.date;
    if (pager) pager.textContent = `${region.collected} / ${region.total}`;
    if (stackImg && current?.img) stackImg.src = current.img;
    if (stackName) stackName.textContent = current?.name || '';
    if (stackAddr) stackAddr.textContent = current?.addr || '';

    root.dataset.regionCarouselIndex = String(carouselIndex);
    root.dataset.regionName = region.name;
  };
})();
