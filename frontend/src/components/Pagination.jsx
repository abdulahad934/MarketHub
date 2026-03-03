import React, { useRef } from 'react';

const Pagination = ({ page, totalPages, from, to, totalCount, onPageChange, label = 'items' }) => {
  const jumpRef = useRef();

  const pages = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const nums = [1];
    if (page > 3) nums.push('...');
    for (let i = Math.max(2, page-1); i <= Math.min(totalPages-1, page+1); i++) nums.push(i);
    if (page < totalPages - 2) nums.push('...');
    nums.push(totalPages);
    return nums;
  };

  const jump = (e) => {
    if (e.key !== 'Enter') return;
    const v = Number(e.target.value);
    if (v >= 1 && v <= totalPages) { onPageChange(v); jumpRef.current.value = ''; }
  };

  return (
    <div className="pg-bar">
      <div className="pg-info">
        {from}–{to} of <strong>{totalCount.toLocaleString()}</strong> {label}
      </div>
      <div className="pg-controls">
        <button className="pg-btn" onClick={() => onPageChange(1)} disabled={page===1}>«</button>
        <button className="pg-btn" onClick={() => onPageChange(page-1)} disabled={page===1}>‹</button>
        {pages().map((p, i) =>
          p === '...'
            ? <span key={`e${i}`} className="pg-ellipsis">···</span>
            : <button key={p} className={`pg-btn${page===p?' pg-active':''}`} onClick={() => onPageChange(p)}>{p}</button>
        )}
        <button className="pg-btn" onClick={() => onPageChange(page+1)} disabled={page===totalPages}>›</button>
        <button className="pg-btn" onClick={() => onPageChange(totalPages)} disabled={page===totalPages}>»</button>
      </div>
      <div className="pg-jump">
        <span className="ps-label">Go to</span>
        <input ref={jumpRef} type="number" className="pg-jump-input" placeholder={page} onKeyDown={jump}/>
        <span className="ps-label">of {totalPages}</span>
      </div>
    </div>
  );
};

export default Pagination;