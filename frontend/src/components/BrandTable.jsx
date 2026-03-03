import React from 'react';
import { Link } from 'react-router-dom';
import { getInitials, getColor, formatDate } from '../utils/brandUtils';

const SortIcon = ({ col, sortBy, sortDir }) => {
  const active = sortBy === col;
  return (
    <span className={`sort-icon ${active ? 'sort-active' : ''}`}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        {active && sortDir==='asc' ? <><path d="M12 19V5"/><polyline points="5 12 12 5 19 12"/></> :
         active && sortDir==='desc' ? <><path d="M12 5v14"/><polyline points="5 12 12 19 19 12"/></> :
         <><polyline points="8 9 12 5 16 9" opacity=".4"/><polyline points="8 15 12 19 16 15" opacity=".4"/></>}
      </svg>
    </span>
  );
};

const Th = ({ col, label, sortBy, sortDir, onSort, className='' }) => (
  <th className={`th-sortable ${className}`} onClick={() => onSort(col)}>
    {label} <SortIcon col={col} sortBy={sortBy} sortDir={sortDir}/>
  </th>
);

const BrandTable = ({
  brands, loading, pageSize, page,
  sortBy, sortDir, onSort,
  selected, onToggleSelect, onToggleAll, allChecked, partialChecked,
  onDelete, isAdmin, searchInput,
}) => {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th style={{ width:48 }}>
              <input type="checkbox" className="custom-check" checked={allChecked}
                ref={el => el && (el.indeterminate = partialChecked)} onChange={onToggleAll}/>
            </th>
            <Th col="id"             label="#" sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
            <Th col="name"           label="Brand" sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
            <th className="hide-mobile">Slug</th>
            <Th col="products_count" label="Products" className="hide-mobile" sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
            <Th col="created_at"     label="Created"  className="hide-tablet" sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: Math.min(pageSize, 10) }).map((_, i) => (
              <tr key={i} className="tr-row">
                {[48,36,160,90,40,80,70].map((w, j) => (
                  <td key={j}><div className="skeleton" style={{ width:w, height:14, borderRadius:6 }}/></td>
                ))}
              </tr>
            ))
          ) : brands.length === 0 ? (
            <tr><td colSpan={7} style={{ textAlign:'center', padding:'64px 24px' }}>
              <p style={{ fontFamily:'Syne,sans-serif', fontSize:18, fontWeight:700, color:'var(--text-3)', marginBottom:8 }}>
                {searchInput ? `No results for "${searchInput}"` : 'No brands yet'}
              </p>
              <p style={{ fontSize:13, color:'var(--text-4)' }}>
                {searchInput ? 'Try a different keyword' : 'Add your first brand'}
              </p>
            </td></tr>
          ) : (
            brands.map((b, i) => (
              <tr key={b.id} className={`tr-row${selected.has(b.id)?' tr-selected':''}`}>
                <td><input type="checkbox" className="custom-check" checked={selected.has(b.id)} onChange={() => onToggleSelect(b.id)}/></td>
                <td><span className="id-badge">#{b.id}</span></td>
                <td>
                  <div className="brand-cell">
                    <div className="brand-avatar" style={{ background: getColor((page-1)*pageSize+i) }}>
                      {getInitials(b.name)}
                    </div>
                    <div>
                      <div className="brand-name">{b.name}</div>
                      <div className="brand-meta">{b.slug||'—'}</div>
                    </div>
                  </div>
                </td>
                <td className="hide-mobile"><span className="slug-text">{b.slug||'—'}</span></td>
                <td className="hide-mobile"><span className="product-count">{(b.products_count??0).toLocaleString()}</span></td>
                <td className="hide-tablet"><span className="date-text">{formatDate(b.created_at)}</span></td>
                <td>
                  <div className="actions-cell">
                    <Link to={`/brands/edit/${b.id}`} className="action-btn action-edit" title="Edit">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </Link>
                    {isAdmin ? (
                      <button className="action-btn action-delete" onClick={() => onDelete(b.id, b.name)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                      </button>
                    ) : (
                      <button className="action-btn action-locked" disabled>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BrandTable;