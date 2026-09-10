(() => {
  const style = document.createElement('style');
  style.textContent = `
    .ui-hidden,.salary-obligation-panel{display:none!important}
    .summary-grid-main{grid-template-columns:repeat(3,1fr)}
    .summary-expand{padding:0;overflow:hidden}
    .summary-expand summary{list-style:none;cursor:pointer;padding:18px;display:flex;align-items:center;justify-content:space-between;gap:10px;-webkit-tap-highlight-color:transparent}
    .summary-expand summary::-webkit-details-marker{display:none}
    .summary-expand summary strong{display:block;margin-top:10px;font-size:24px;letter-spacing:-.5px}
    .summary-arrow{font-size:22px;color:var(--muted);transition:transform .2s ease}
    .summary-expand[open] .summary-arrow{transform:rotate(180deg)}
    .all-fixed-breakdown{border-top:1px solid var(--line);padding:0 18px 14px;background:#fbfbfd}
    .fixed-break-section{padding:14px 0 4px;border-bottom:1px solid var(--line)}
    .fixed-break-section:last-child{border-bottom:0}
    .fixed-break-head{display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:4px}
    .fixed-break-head span{font-weight:800;color:var(--accent);white-space:nowrap}
    @media(max-width:620px){
      .summary-grid-main{grid-template-columns:1fr 1fr}
      .summary-expand{grid-column:span 1}
      .summary-expand summary{padding:15px}
      .summary-expand summary strong{font-size:20px}
      .all-fixed-breakdown{padding:0 15px 12px}
      .fixed-break-head{font-size:14px}
    }
  `;
  document.head.appendChild(style);

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