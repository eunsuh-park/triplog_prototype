/**
 * 랭킹 — 시상대(TOP 3) · 목록(4위~) · 내 순위 고정바
 * 포인트(점)는 방문/사진 인증으로 쌓이는 랭킹 점수이며, 도감 카드(장) 수와는 별개의 수치입니다.
 */
(function () {
  const TIERS = {
    grandmaster: { label: 'Grandmaster', icon: 'mingcute:medal-fill' },
    master: { label: 'Master', icon: 'mingcute:crown-fill' },
    diamond: { label: 'Diamond', icon: 'mingcute:diamond-fill' },
    platinum: { label: 'Platinum', icon: 'mingcute:diamond-fill' },
    gold: { label: 'Gold', icon: 'mingcute:trophy-fill' },
    silver: { label: 'Silver', icon: 'mingcute:trophy-line' },
  };

  // 전체 랭킹 / 월간 랭킹 데이터셋 (프로토타입용)
  const DATASETS = {
    all: {
      podium: [
        { rank: 1, name: '배낭여행러', initial: '배', tier: 'grandmaster', points: 28500 },
        { rank: 2, name: '사진찍는민지', initial: '사', tier: 'master', points: 22100 },
        { rank: 3, name: '주말여행러', initial: '주', tier: 'diamond', points: 18750 },
      ],
      rows: [
        { rank: 4, name: '트립마스터', initial: '트', level: 8, title: '도시 탐험가', tier: 'platinum', points: 14200 },
        { rank: 5, name: '여행하는수진', initial: '여', level: 7, title: '도시 탐험가', tier: 'gold', points: 11800 },
        { rank: 6, name: '걷는여행자', initial: '걷', level: 6, title: '로컬 여행자', tier: 'gold', points: 10200 },
        { rank: 7, name: '맛집헌터', initial: '맛', level: 6, title: '로컬 여행자', tier: 'silver', points: 9600 },
        { rank: 8, name: '기록하는하루', initial: '기', level: 5, title: '주말 여행자', tier: 'silver', points: 9100 },
        { ellipsis: true },
      ],
      me: { rank: 23, name: '여행하는 성훈', initial: '성', title: '대전 탐험가', tier: 'gold', points: 8450 },
    },
    monthly: {
      podium: [
        { rank: 1, name: '여행하는수진', initial: '여', tier: 'grandmaster', points: 6200 },
        { rank: 2, name: '걷는여행자', initial: '걷', tier: 'master', points: 5400 },
        { rank: 3, name: '배낭여행러', initial: '배', tier: 'diamond', points: 4850 },
      ],
      rows: [
        { rank: 4, name: '맛집헌터', initial: '맛', level: 6, title: '로컬 여행자', tier: 'platinum', points: 4100 },
        { rank: 5, name: '트립마스터', initial: '트', level: 8, title: '도시 탐험가', tier: 'gold', points: 3700 },
        { rank: 6, name: '주말여행러', initial: '주', level: 7, title: '주말 여행자', tier: 'gold', points: 3200 },
        { rank: 7, name: '기록하는하루', initial: '기', level: 5, title: '주말 여행자', tier: 'silver', points: 2950 },
        { ellipsis: true },
      ],
      me: { rank: 11, name: '여행하는 성훈', initial: '성', title: '대전 탐험가', tier: 'gold', points: 2480 },
    },
  };

  const AVATAR_PALETTE = [
    { bg: '#FF6B6B', fg: '#FFFFFF' },
    { bg: '#4ECDC4', fg: '#083A36' },
    { bg: '#5B8DEF', fg: '#FFFFFF' },
    { bg: '#A66CFF', fg: '#FFFFFF' },
    { bg: '#F7B731', fg: '#4A3200' },
    { bg: '#26DE81', fg: '#064D2E' },
    { bg: '#FD79A8', fg: '#FFFFFF' },
    { bg: '#00CEC9', fg: '#004A48' },
    { bg: '#E17055', fg: '#FFFFFF' },
    { bg: '#6C5CE7', fg: '#FFFFFF' },
    { bg: '#FDCB6E', fg: '#5C4200' },
    { bg: '#74B9FF', fg: '#0A2E57' },
  ];

  function pickAvatarColor(seed) {
    let hash = 0;
    for (let i = 0; i < seed.length; i += 1) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
  }

  function renderAvatar(initial, name, className) {
    const { bg, fg } = pickAvatarColor(name);
    return `<span class="${className}" style="background:${bg};color:${fg}">${initial}</span>`;
  }

  function fmtPoints(value) {
    return `${value.toLocaleString('ko-KR')}점`;
  }

  function tierPill(tierKey) {
    const tier = TIERS[tierKey];
    if (!tier) return '';
    return `
      <span class="tier-pill tier-pill--${tierKey}">
        <iconify-icon icon="${tier.icon}" width="13" aria-hidden="true"></iconify-icon>
        ${tier.label}
      </span>
    `;
  }

  function renderPodiumItem(item) {
    const crown = item.rank === 1
      ? '<iconify-icon class="podium-item__crown" icon="mingcute:crown-fill" width="26" aria-hidden="true"></iconify-icon>'
      : '';
    return `
      <div class="podium-item podium-item--${item.rank}">
        ${crown}
        ${renderAvatar(item.initial, item.name, 'podium-item__avatar')}
        ${tierPill(item.tier)}
        <span class="podium-item__name">${item.name}</span>
        <span class="podium-item__points">${fmtPoints(item.points)}</span>
        <div class="podium-item__bar"><span>${item.rank}</span></div>
      </div>
    `;
  }

  function renderRow(row) {
    if (row.ellipsis) {
      return '<div class="rank-row rank-row--ellipsis" aria-hidden="true">···</div>';
    }
    const sub = (row.level != null)
      ? `<p class="rank-row__sub">Lv.${row.level} ${row.title}</p>`
      : (row.title ? `<p class="rank-row__sub">${row.title}</p>` : '');
    return `
      <div class="rank-row">
        <span class="rank-row__num">${row.rank}</span>
        ${renderAvatar(row.initial, row.name, 'rank-row__avatar')}
        <div class="rank-row__info">
          <p class="rank-row__name">${row.name}</p>
          ${sub}
        </div>
        <div class="rank-row__meta">
          ${tierPill(row.tier)}
          <span class="rank-row__points">${fmtPoints(row.points)}</span>
        </div>
      </div>
    `;
  }

  function renderMe(me) {
    const sub = me.title ? `<p class="rank-row__sub">${me.title}</p>` : '';
    return `
      <p class="rank-me__label">내 순위</p>
      <div class="rank-row rank-row--me is-pressable" role="button" tabindex="0" aria-label="내 순위 ${me.rank}위">
        <span class="rank-row__num rank-row__num--me">${me.rank}</span>
        ${renderAvatar(me.initial, me.name, 'rank-row__avatar')}
        <div class="rank-row__info">
          <p class="rank-row__name">${me.name}</p>
          ${sub}
        </div>
        <div class="rank-row__meta">
          ${tierPill(me.tier)}
          <span class="rank-row__points">${fmtPoints(me.points)}</span>
        </div>
      </div>
    `;
  }

  function renderRankView(scope) {
    const data = DATASETS[scope] || DATASETS.all;
    document.querySelectorAll('[data-rank-podium]').forEach((el) => {
      el.innerHTML = data.podium.map(renderPodiumItem).join('');
    });
    document.querySelectorAll('[data-rank-list]').forEach((el) => {
      el.innerHTML = data.rows.map(renderRow).join('');
    });
    document.querySelectorAll('[data-rank-me]').forEach((el) => {
      el.innerHTML = renderMe(data.me);
    });
  }

  window.renderRankList = function renderRankList() {
    renderRankView('all');
  };

  renderRankView('all');

  document.querySelectorAll('[data-rank-tabs]').forEach((tabs) => {
    tabs.querySelectorAll('[data-rank-tab]').forEach((btn) => {
      btn.addEventListener('click', () => {
        tabs.querySelectorAll('[data-rank-tab]').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        renderRankView(btn.dataset.rankTab);
      });
    });
  });
})();
