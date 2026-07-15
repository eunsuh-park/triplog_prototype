/**
 * 인증 내역 — 나의 여행 기록 타임라인 (마이페이지에서도 재사용)
 */
(function () {
  const RECORDS = [
    {
      name: '유성온천',
      district: '대전 유성구',
      date: '2024.04.10',
      time: '11:20',
      review: '온천에서 힐링! 따뜻한 물이 정말 좋았어요.',
    },
    {
      name: '국립중앙과학관',
      district: '대전 유성구',
      date: '2024.04.10',
      time: '14:05',
      review: '전시가 알차요. 아이들과 가기 좋은 코스!',
    },
    {
      name: '유림공원',
      district: '대전 유성구',
      date: '2024.04.10',
      time: '16:40',
      review: '산책하기 딱 좋은 날씨. 저녁 노을이 예뻤어요.',
    },
    {
      name: '엑스포과학공원',
      district: '대전 유성구',
      date: '2024.04.01',
      time: '15:10',
      review: '엑스포과학공원에서 과학 체험이 정말 재미있었어요.',
    },
    {
      name: '한밭수목원',
      district: '대전 서구',
      date: '2024.03.22',
      time: '13:30',
      review: '봄꽃이 만개했어요. 사진 찍기 최고!',
    },
    {
      name: '성심당 본점',
      district: '대전 중구',
      date: '2024.03.15',
      time: '10:15',
      review: '대전 오면 꼭 들르는 곳. 튀김소보로 강추.',
    },
  ];

  function dateKey(date) {
    return String(date || '').replace(/\./g, '-');
  }

  function timeValue(time) {
    if (!time) return 0;
    const parts = String(time).split(':');
    const h = Number(parts[0]) || 0;
    const m = Number(parts[1]) || 0;
    return h * 60 + m;
  }

  function sortRecords(records) {
    return (records || []).slice().sort((a, b) => {
      const dateCmp = dateKey(b.date).localeCompare(dateKey(a.date));
      if (dateCmp !== 0) return dateCmp;
      return timeValue(a.time) - timeValue(b.time);
    });
  }

  function groupByDate(records) {
    const groups = [];
    const indexByDate = {};
    sortRecords(records).forEach((item) => {
      if (indexByDate[item.date] == null) {
        indexByDate[item.date] = groups.length;
        groups.push({ date: item.date, items: [] });
      }
      groups[indexByDate[item.date]].items.push(item);
    });
    return groups;
  }

  function renderArticle(item, clickable) {
    const goAttr = clickable ? ' data-go="recordDetail" role="button" tabindex="0"' : '';
    const pressCls = clickable ? ' cert-timeline__item--link is-pressable' : '';
    return `
      <article class="cert-timeline__item${pressCls}"${goAttr}>
        <div class="cert-timeline__head">
          <h3 class="cert-timeline__name">${item.name}</h3>
          <span class="cert-timeline__badge">${item.district}</span>
        </div>
        <p class="cert-timeline__review">${item.review}</p>
      </article>
    `;
  }

  function renderDayGroup(group, clickable) {
    const itemsHtml = group.items.map((item) => renderArticle(item, clickable)).join('');
    return `
      <div class="cert-timeline__entry">
        <time class="cert-timeline__date" datetime="${dateKey(group.date)}">${group.date}</time>
        ${itemsHtml}
      </div>
    `;
  }

  function renderTimelineItems(records, options) {
    const opts = options || {};
    const source = records || RECORDS;
    const groups = groupByDate(source);
    const limited = opts.limit ? groups.slice(0, opts.limit) : groups;
    return limited
      .map((group) => renderDayGroup(group, opts.clickable))
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
