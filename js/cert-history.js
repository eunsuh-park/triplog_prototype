/**
 * 인증 내역 — 나의 여행 기록 타임라인 (마이페이지에서도 재사용)
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
      review: '엑스포과학공원에서 과학 체험이 정말 재미있었어요.',
    },
    {
      name: '한밭수목원',
      district: '대전 서구',
      date: '2024.03.22',
      review: '봄꽃이 만개했어요. 사진 찍기 최고!',
    },
    {
      name: '성심당 본점',
      district: '대전 중구',
      date: '2024.03.15',
      review: '대전 오면 꼭 들르는 곳. 튀김소보로 강추.',
    },
  ];

  function renderItem(item, clickable, showDate) {
    const goAttr = clickable ? ' data-go="recordDetail" role="button" tabindex="0"' : '';
    const pressCls = clickable ? ' cert-timeline__item--link is-pressable' : '';
    const dateHtml = showDate
      ? `<time class="cert-timeline__date" datetime="${item.date.replace(/\./g, '-')}">${item.date}</time>`
      : '';
    return `
      <div class="cert-timeline__entry">
        ${dateHtml}
        <article class="cert-timeline__item${pressCls}"${goAttr}>
          <div class="cert-timeline__head">
            <h3 class="cert-timeline__name">${item.name}</h3>
            <span class="cert-timeline__badge">${item.district}</span>
          </div>
          <p class="cert-timeline__review">${item.review}</p>
        </article>
      </div>
    `;
  }

  function renderTimelineItems(records, options) {
    const opts = options || {};
    const list = opts.limit ? (records || RECORDS).slice(0, opts.limit) : (records || RECORDS);
    let lastDate = null;
    return list
      .map((item) => {
        const showDate = item.date !== lastDate;
        lastDate = item.date;
        return renderItem(item, opts.clickable, showDate);
      })
      .join('');
  }

  function renderCertHistory(root) {
    if (!root) return;
    const list = root.querySelector('[data-cert-timeline]');
    if (!list) return;
    list.innerHTML = renderTimelineItems(RECORDS, { clickable: true });
  }

  function renderMyRecords(root) {
    if (!root) return;
    const list = root.querySelector('[data-my-records-timeline]');
    if (!list) return;
    list.innerHTML = renderTimelineItems(RECORDS, { clickable: true });
  }

  window.TRIPLOG_RECORDS = RECORDS;
  window.renderTimelineItems = renderTimelineItems;
  window.renderCertHistory = renderCertHistory;
  window.renderMyRecords = renderMyRecords;
})();
