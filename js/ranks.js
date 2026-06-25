/**
 * 랭킹 목록 (4위~, 내 순위 47위)
 */
(function () {
  const RANK_ROWS = [
    {
      rank: 4,
      name: '한국탐험',
      sub: '서울 · 경기 집중 수집',
      badge: '256장',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=88&h=88&fit=crop',
    },
    {
      rank: 5,
      name: '랜드마크헌터',
      sub: '전라권 80% 달성',
      badge: '241장',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=88&h=88&fit=crop',
    },
    {
      rank: 6,
      name: '도감왕',
      sub: '강원권 전체 수집 중',
      badge: '198장',
      avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=88&h=88&fit=crop',
    },
    { ellipsis: true },
    {
      rank: 45,
      name: '카드모으미',
      sub: '수도권 탐험 중',
      badge: '11장',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=88&h=88&fit=crop',
    },
    {
      rank: 46,
      name: '전국일주',
      sub: '경상권 방문 중',
      badge: '9장',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=88&h=88&fit=crop',
    },
    {
      rank: 47,
      name: '나 (탐험러)',
      sub: '7장 수집 · 상위 12%',
      badge: '7장',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=88&h=88&fit=crop',
      me: true,
    },
    {
      rank: 48,
      name: '주말탐험가',
      sub: '충청권 수집 중',
      badge: '6장',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=88&h=88&fit=crop',
    },
    {
      rank: 49,
      name: '랜드마크초보',
      sub: '서울 위주',
      badge: '5장',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=88&h=88&fit=crop',
    },
  ];

  function renderRankRow(row) {
    if (row.ellipsis) {
      return '<div class="rank-row rank-row--ellipsis" aria-hidden="true">···</div>';
    }

    const meClass = row.me ? ' rank-row--me is-pressable' : '';
    const sub = row.sub ? `<p class="rank-row__sub">${row.sub}</p>` : '';

    return `
      <div class="rank-row${meClass}">
        <span class="rank-row__num">${row.rank}</span>
        <img class="rank-row__avatar" src="${row.avatar}" alt="">
        <div class="rank-row__info">
          <p class="rank-row__name">${row.name}</p>
          ${sub}
        </div>
        <span class="rank-row__badge">${row.badge}</span>
      </div>
    `;
  }

  window.renderRankList = function renderRankList(container) {
    if (!container) return;
    container.innerHTML = RANK_ROWS.map(renderRankRow).join('');
  };

  document.querySelectorAll('[data-rank-list]').forEach((el) => {
    window.renderRankList(el);
  });
})();
