/**
 * 인증 내역 — 나의 여행 기록 타임라인
 */
(function () {
  const RECORDS = [
    {
      name: '유성온천',
      district: '대전 유성구',
      date: '2024.04.10',
      review: '온천에서 힐링! 따뜻한 물이 정말 좋았어요.',
    },
    {
      name: '엑스포과학공원',
      district: '대전 유성구',
      date: '2024.04.01',
      review: '어릴 적 추억이 생생해요 😊',
    },
    {
      name: '한밭수목원',
      district: '대전 서구',
      date: '2024.03.22',
      review: '봄꽃이 만개했어요. 사진 찍기 좋아요!',
    },
    {
      name: '성심당 본점',
      district: '대전 중구',
      date: '2024.03.15',
      review: '대전 오면 꼭 가야 하는 곳. 튀김소보로 강추.',
    },
  ];

  function renderItem(item) {
    return `
      <article class="cert-timeline__item">
        <div class="cert-timeline__head">
          <h3 class="cert-timeline__name">${item.name}</h3>
          <span class="cert-timeline__badge">${item.district}</span>
        </div>
        <time class="cert-timeline__date" datetime="${item.date.replace(/\./g, '-')}">${item.date}</time>
        <p class="cert-timeline__review">${item.review}</p>
      </article>
    `;
  }

  function renderCertHistory(root) {
    if (!root) return;
    const list = root.querySelector('[data-cert-timeline]');
    if (!list) return;
    list.innerHTML = RECORDS.map(renderItem).join('');
  }

  window.renderCertHistory = renderCertHistory;
})();
