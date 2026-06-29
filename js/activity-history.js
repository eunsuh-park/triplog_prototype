/**
 * 활동 히스토리 — 정책 기준 타임라인 (전체/방문/뱃지/레벨)
 */
(function () {
  const ACTIVITIES = [
    { type: 'level', filter: 'level', title: '레벨 업', body: 'Lv.24 여행 탐험가가 되었어요.', date: '2026.06.22. 오후 2:32', xp: null },
    { type: 'badge', filter: 'badge', title: '새로운 뱃지 획득', body: "'첫 랜드마크' 뱃지를 획득했어요.", date: '2026.06.22. 오후 2:31', xp: 30 },
    { type: 'region', filter: 'visit', title: '지역 방문 완료', body: '유성구의 랜드마크를 모두 방문했어요.', date: '2026.06.22. 오후 2:30', xp: 100 },
    { type: 'landmark', filter: 'visit', title: '랜드마크 방문 완료', body: '국립중앙과학관 방문이 인증되었어요.', date: '2026.06.22. 오전 11:20', xp: 50, img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=80&h=80&fit=crop' },
    { type: 'landmark', filter: 'visit', title: '랜드마크 방문 완료', body: '성심당 본점 방문이 인증되었어요.', date: '2026.06.15. 오후 3:10', xp: 50, img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=80&h=80&fit=crop' },
    { type: 'badge', filter: 'badge', title: '새로운 뱃지 획득', body: "'기록하는 여행자' 뱃지를 획득했어요.", date: '2026.06.10. 오후 6:00', xp: 30 },
    { type: 'level', filter: 'level', title: '레벨 업', body: 'Lv.20 여행가가 되었어요.', date: '2026.06.01. 오전 9:15', xp: null },
  ];

  const ICONS = {
    level: 'mingcute:up-line',
    badge: 'mingcute:medal-line',
    region: 'mingcute:flag-1-line',
    landmark: 'mingcute:location-fill',
  };

  function renderItem(item) {
    const xpHtml = item.xp ? `<span class="activity-item__xp">+${item.xp} XP</span>` : '';
    const imgHtml = item.img
      ? `<img class="activity-item__thumb" src="${item.img}" alt="">`
      : `<span class="activity-item__icon"><iconify-icon icon="${ICONS[item.type] || 'mingcute:star-line'}" width="20"></iconify-icon></span>`;
    return `
      <article class="activity-item" data-activity-type="${item.filter}">
        ${imgHtml}
        <div class="activity-item__body">
          <p class="activity-item__type">${item.title}</p>
          <p class="activity-item__text">${item.body}</p>
          <time class="activity-item__date">${item.date}</time>
        </div>
        ${xpHtml}
      </article>
    `;
  }

  function renderActivityHistory(root, filter) {
    if (!root) return;
    const list = root.querySelector('[data-activity-list]');
    if (!list) return;
    const items = filter === 'all'
      ? ACTIVITIES
      : ACTIVITIES.filter((a) => a.filter === filter);
    const monthLabel = '<p class="activity-month">2026년 6월</p>';
    list.innerHTML = monthLabel + items.map(renderItem).join('');
  }

  function bindFilters(root) {
    if (!root) return;
    root.querySelectorAll('[data-activity-filter]').forEach((btn) => {
      btn.addEventListener('click', () => {
        root.querySelectorAll('[data-activity-filter]').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        renderActivityHistory(root, btn.dataset.activityFilter);
      });
    });
  }

  window.renderActivityHistory = function (root) {
    renderActivityHistory(root, 'all');
    bindFilters(root);
  };
})();
