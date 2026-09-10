(() => {
  const all = document.querySelector('#allFixedBreakdown');
  const detailsCard = document.querySelector('.summary-expand');
  const min = document.querySelector('#minFixed');
  const husband = document.querySelector('#husbandFixed');
  const salary = document.querySelector('#salaryFixed');
  const minTotal = document.querySelector('#minFixedTotal');
  const husbandTotal = document.querySelector('#husbandFixedTotal');
  const salaryTotal = document.querySelector('#salaryFixedTotal');

  if (!all || !min || !husband || !salary) return;

  const section = (title, total, html) => `
    <section class="fixed-break-section">
      <div class="fixed-break-head"><strong>${title}</strong><span>${total || ''}</span></div>
      <div class="fixed-list">${html || '<p class="sub">내역 없음</p>'}</div>
    </section>`;

  const sync = () => {
    all.innerHTML =
      section('민정 고정비', minTotal?.textContent, min.innerHTML) +
      section('세훈 고정비', husbandTotal?.textContent, husband.innerHTML) +
      section('월급통장 고정의무', salaryTotal?.textContent, salary.innerHTML);
  };

  [min, husband, salary, minTotal, husbandTotal, salaryTotal].filter(Boolean).forEach(el => {
    new MutationObserver(sync).observe(el, {subtree:true, childList:true, characterData:true});
  });

  detailsCard?.addEventListener('toggle', () => {
    if (detailsCard.open) sync();
  });

  setTimeout(sync, 600);
})();