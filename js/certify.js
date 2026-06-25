/**
 * 근처 랜드마크 — GPS 인증 시작 화면
 */
(function () {
  const LANDMARKS = [
    {
      name: '국립중앙과학관',
      district: '대전 유성구',
      distance: '0.3km',
      rarity: 'Rare',
      status: 'available',
    },
    {
      name: '대전시립미술관',
      district: '대전 유성구',
      distance: '0.5km',
      rarity: 'Common',
      status: 'available',
    },
    {
      name: '충남대학교',
      district: '대전 유성구',
      distance: '1.2km',
      rarity: 'Common',
      status: 'far',
    },
  ];

  const STATUS_LABEL = {
    available: '인증가능',
    done: '완료',
    far: '거리부족',
  };

  function renderCard(lm) {
    const isPressable = lm.status === 'available';
    const tag = `<span class="certify-card__rarity certify-card__rarity--${lm.rarity.toLowerCase()}">${lm.rarity}</span>`;
    const statusIcon =
      lm.status === 'done'
        ? '<iconify-icon icon="mingcute:check-circle-fill" width="20"></iconify-icon>'
        : lm.status === 'far'
          ? '<iconify-icon icon="mingcute:location-line" width="20"></iconify-icon>'
          : '<iconify-icon icon="mingcute:right-line" width="18"></iconify-icon>';

    const inner = `
      <span class="certify-card__pin" aria-hidden="true">
        <iconify-icon icon="mingcute:location-fill" width="18"></iconify-icon>
      </span>
      <div class="certify-card__body">
        <div class="certify-card__title-row">
          <h3 class="certify-card__name">${lm.name}</h3>
          ${tag}
        </div>
        <p class="certify-card__meta">${lm.district}</p>
        <p class="certify-card__distance">거리 ${lm.distance}</p>
      </div>
      <div class="certify-card__status">
        ${statusIcon}
        <span>${STATUS_LABEL[lm.status]}</span>
      </div>
    `;

    if (isPressable) {
      return `<button class="certify-card certify-card--${lm.status} is-pressable" type="button" data-go="certifyVisit">${inner}</button>`;
    }
    return `<div class="certify-card certify-card--${lm.status}" aria-disabled="true">${inner}</div>`;
  }

  function renderCertifyList(root) {
    if (!root) return;
    const list = root.querySelector('[data-certify-list]');
    if (!list) return;
    list.innerHTML = LANDMARKS.map(renderCard).join('');
  }

  window.renderCertifyList = renderCertifyList;
})();
