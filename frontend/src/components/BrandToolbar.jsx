import React from 'react';

const PAGE_OPTIONS = [10, 25, 50, 100];

const BrandToolbar = ({
  searchInput, onSearchChange,
  pageSize, onPageSizeChange,
  totalCount, selected, isAdmin,
  onBulkDelete,
}) => (
  <div className="toolbar">
    <div className="toolbar-left">
      <div className="search-box">
        <span className="search-icon">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </span>
        <input className="search-input" type="text" placeholder="Search brands..."
          value={searchInput} onChange={e => onSearchChange(e.target.value)}/>
        {searchInput && (
          <button className="search-clear" onClick={() => onSearchChange('')}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        )}
      </div>
      {selected.size > 0 && isAdmin && (
        <button className="btn btn-danger" onClick={onBulkDelete}>
          Delete {selected.size}
        </button>
      )}
    </div>
    <div className="toolbar-right">
      <div className="page-size-wrap">
        <span className="ps-label">Rows</span>
        <select className="ps-select" value={pageSize} onChange={e => onPageSizeChange(Number(e.target.value))}>
          {PAGE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div className="count-badge">
        Total <strong>{totalCount.toLocaleString()}</strong>
        {selected.size > 0 && <span className="sel-pill">{selected.size} selected</span>}
      </div>
    </div>
  </div>
);

export default BrandToolbar;