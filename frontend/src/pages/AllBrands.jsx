import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { CSVLink } from 'react-csv';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/allbrands.css';
import * as XLSX from 'xlsx';
import AdminLayout from '../components/AdminLayout';

const brandColors = ['#f59e0b','#10b981','#3b82f6','#8b5cf6','#ec4899','#14b8a6','#f97316','#6366f1'];
const getInitials  = (name = '') => name.slice(0, 2).toUpperCase();
const PAGE_OPTIONS = [10, 25, 50, 100];

const useAuth = () => {
  const role = localStorage.getItem('userRole') || 'admin';
  return { isAdmin: role === 'admin' };
};

/* ── Empty illustration ── */
const EmptySVG = () => (
  <svg width="160" height="130" viewBox="0 0 160 130" fill="none">
    <rect x="20" y="20" width="120" height="90" rx="14" fill="currentColor" opacity=".06"/>
    <rect x="36" y="40" width="55"  height="8" rx="4" fill="currentColor" opacity=".15"/>
    <rect x="36" y="56" width="88"  height="6" rx="3" fill="currentColor" opacity=".1"/>
    <rect x="36" y="70" width="70"  height="6" rx="3" fill="currentColor" opacity=".1"/>
    <rect x="36" y="84" width="48"  height="6" rx="3" fill="currentColor" opacity=".08"/>
    <circle cx="122" cy="32" r="20" fill="currentColor" opacity=".07"/>
    <path d="M114 32h16M122 24v16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity=".2"/>
  </svg>
);

/* ── Sort icon ── */
const SortIcon = ({ col, sortBy, sortDir }) => {
  const active = sortBy === col;
  return (
    <span className={`sort-icon ${active ? 'sort-active' : ''}`}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        {active && sortDir === 'asc'
          ? <><path d="M12 19V5"/><polyline points="5 12 12 5 19 12"/></>
          : active && sortDir === 'desc'
            ? <><path d="M12 5v14"/><polyline points="5 12 12 19 19 12"/></>
            : <><polyline points="8 9 12 5 16 9" opacity=".4"/><polyline points="8 15 12 19 16 15" opacity=".4"/></>
        }
      </svg>
    </span>
  );
};

/* ══════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════ */
const AllBrands = () => {
  const { isAdmin } = useAuth();
  const importRef   = useRef();

  /* ── Server-side state ── */
  const [brands,      setBrands]      = useState([]);
  const [totalCount,  setTotalCount]  = useState(0);
  const [page,        setPage]        = useState(1);
  const [pageSize,    setPageSize]    = useState(10);
  const [sortBy,      setSortBy]      = useState('id');
  const [sortDir,     setSortDir]     = useState('desc');
  const [search,      setSearch]      = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loading,     setLoading]     = useState(true);
  const [selected,    setSelected]    = useState(new Set());
  const [theme,       setTheme]       = useState(() => localStorage.getItem('brandTheme') || 'dark');
  const [showLog,     setShowLog]     = useState(false);
  const [activityLog, setActivityLog] = useState(() => {
    try { return JSON.parse(localStorage.getItem('brandActivityLog') || '[]'); } catch { return []; }
  });

  useEffect(() => { localStorage.setItem('brandTheme', theme); }, [theme]);

  const logActivity = (action, details) => {
    const user = localStorage.getItem('userName') || 'Admin';
    const entry = { action, details, user, time: new Date().toLocaleString() };
    setActivityLog(prev => {
      const next = [entry, ...prev].slice(0, 50);
      localStorage.setItem('brandActivityLog', JSON.stringify(next));
      return next;
    });
  };

  /* ── Fetch from server (server-side pagination + sorting) ── */
  const fetchBrands = useCallback(() => {
    setLoading(true);
    setSelected(new Set());
    const token   = localStorage.getItem('accessToken');
    const headers = { Authorization: `Bearer ${token}` };

    // Build query params for server-side pagination & sorting
    const params = new URLSearchParams({
      page,
      page_size: pageSize,
      ordering:  sortDir === 'asc' ? sortBy : `-${sortBy}`,
      ...(search && { search }),
    });

    fetch(`http://127.0.0.1:8080/api/products/brands/?${params}`, { headers })
      .then(r => r.json())
      .then(data => {
        // Django REST Framework paginated response shape:
        // { count, results } — adjust if your API differs
        if (data && Array.isArray(data.results)) {
          setBrands(data.results);
          setTotalCount(data.count ?? data.results.length);
        } else if (Array.isArray(data)) {
          // Non-paginated fallback
          setBrands(data);
          setTotalCount(data.length);
        }
        setLoading(false);
      })
      .catch(() => { toast.error('Failed to load brands'); setLoading(false); });
  }, [page, pageSize, sortBy, sortDir, search]);

  useEffect(() => { fetchBrands(); }, [fetchBrands]);

  /* ── Search debounce ── */
  useEffect(() => {
    const t = setTimeout(() => { setPage(1); setSearch(searchInput); }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  /* ── Reset page when pageSize changes ── */
  useEffect(() => { setPage(1); }, [pageSize, sortBy, sortDir]);

  /* ── Sorting ── */
  const handleSort = (col) => {
    if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(col); setSortDir('asc'); }
    setPage(1);
  };

  /* ── Delete ── */
  const handleDelete = (id, name) => {
    if (!isAdmin) return toast.error('Only admins can delete brands.');
    toast.warn(
      <div className="toast-confirm">
        <p>Delete <strong>{name}</strong>?</p>
        <div className="toast-actions">
          <button className="toast-btn danger" onClick={() => {
            const token = localStorage.getItem('accessToken');
            fetch(`http://127.0.0.1:8080/api/products/brands/${id}/`, {
              method: 'DELETE',
              headers: { Authorization: `Bearer ${token}` },
            }).then(() => {
              logActivity('DELETE', `Deleted brand "${name}" (ID: ${id})`);
              toast.dismiss(); toast.success(`"${name}" deleted`);
              fetchBrands();
            }).catch(() => toast.error('Delete failed'));
          }}>Yes, Delete</button>
          <button className="toast-btn neutral" onClick={() => toast.dismiss()}>Cancel</button>
        </div>
      </div>,
      { autoClose: false, closeButton: false }
    );
  };

  /* ── Bulk delete ── */
  const handleBulkDelete = () => {
    if (!isAdmin) return toast.error('Only admins can delete brands.');
    if (selected.size === 0) return toast.info('No brands selected.');
    toast.warn(
      <div className="toast-confirm">
        <p>Delete <strong>{selected.size}</strong> selected brand{selected.size > 1 ? 's' : ''}?</p>
        <div className="toast-actions">
          <button className="toast-btn danger" onClick={async () => {
            const token = localStorage.getItem('accessToken');
            const names = brands.filter(b => selected.has(b.id)).map(b => b.name).join(', ');
            await Promise.all([...selected].map(id =>
              fetch(`http://127.0.0.1:8080/api/products/brands/${id}/`, {
                method: 'DELETE', headers: { Authorization: `Bearer ${token}` },
              })
            ));
            logActivity('BULK DELETE', `Deleted: ${names}`);
            toast.dismiss(); toast.success(`${selected.size} brand(s) deleted`);
            fetchBrands();
          }}>Yes, Delete All</button>
          <button className="toast-btn neutral" onClick={() => toast.dismiss()}>Cancel</button>
        </div>
      </div>,
      { autoClose: false, closeButton: false }
    );
  };

  /* ── Select helpers ── */
  const toggleSelect   = id => setSelected(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const allChecked     = brands.length > 0 && brands.every(b => selected.has(b.id));
  const partialChecked = brands.some(b => selected.has(b.id)) && !allChecked;
  const toggleAll      = () => setSelected(allChecked ? new Set() : new Set(brands.map(b => b.id)));

  /* ── Export Excel (current page) ── */
  const handleExportExcel = () => {
    const data = brands.map(b => ({ ID: b.id, Name: b.name, Slug: b.slug, Products: b.products_count ?? 0, Created: b.created_at ?? '' }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Brands');
    XLSX.writeFile(wb, 'brands.xlsx');
    logActivity('EXPORT', `Exported ${data.length} brands to Excel`);
    toast.success('Excel exported!');
  };

  /* ── Import CSV ── */
  const handleImportCSV = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      const wb   = XLSX.read(evt.target.result, { type: 'binary' });
      const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
      const imported = rows.filter(r => r.Name || r.name);
      // POST each to server — simplified batch
      const token = localStorage.getItem('accessToken');
      Promise.all(imported.map(r =>
        fetch('http://127.0.0.1:8080/api/products/brands/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ name: r.Name || r.name, slug: r.Slug || r.slug || '' }),
        })
      )).then(() => {
        logActivity('IMPORT', `Imported ${imported.length} brands`);
        toast.success(`${imported.length} brand(s) imported!`);
        fetchBrands();
      }).catch(() => toast.error('Import failed'));
    };
    reader.readAsBinaryString(file);
    e.target.value = '';
  };

  /* ── Pagination helpers ── */
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const from       = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const to         = Math.min(page * pageSize, totalCount);

  const getPageNumbers = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = [1];
    if (page > 3)               pages.push('…');
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2)  pages.push('…');
    pages.push(totalPages);
    return pages;
  };

  const csvData = brands.map(b => ({ ID: b.id, Name: b.name, Slug: b.slug }));
  const isDark  = theme === 'dark';

  /* ══════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════ */
  return (
    <AdminLayout>
    <div className={`brands-root ${theme}`}>
      <div className="brands-wrapper">

        {/* ── Header ── */}
        <div className="page-header">
          <div>
            <div className="page-label">Product Management</div>
            <h1 className="page-title">All <span>Brands</span></h1>
            <p className="page-subtitle">Manage and organize your product brands</p>
          </div>
          <div className="header-actions">
            <button className="btn btn-icon" onClick={() => setTheme(isDark ? 'light' : 'dark')} title="Toggle theme">
              {isDark
                ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
                : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
              }
            </button>
            <button className="btn btn-icon" onClick={() => setShowLog(v => !v)} title="Activity log">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              {activityLog.length > 0 && <span className="log-dot"/>}
            </button>
            <button className="btn btn-outline" onClick={() => importRef.current.click()}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              Import
            </button>
            <input ref={importRef} type="file" accept=".csv,.xlsx" style={{display:'none'}} onChange={handleImportCSV}/>
            <CSVLink data={csvData} filename="brands.csv" style={{textDecoration:'none'}}>
              <button className="btn btn-outline">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                CSV
              </button>
            </CSVLink>
            <button className="btn btn-outline" onClick={handleExportExcel}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 12l2.5 3L14 9"/></svg>
              Excel
            </button>
            <Link to="/add-brand" className="btn btn-primary">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add Brand
            </Link>
          </div>
        </div>

        {/* ── Activity Log ── */}
        {showLog && (
          <div className="log-panel">
            <div className="log-header">
              <span className="log-title">Activity Log</span>
              <div style={{display:'flex',gap:8}}>
                <button className="log-clear" onClick={() => { setActivityLog([]); localStorage.removeItem('brandActivityLog'); }}>Clear</button>
                <button className="log-close" onClick={() => setShowLog(false)}>✕</button>
              </div>
            </div>
            {activityLog.length === 0
              ? <p className="log-empty">No activity yet.</p>
              : <ul className="log-list">
                  {activityLog.map((l, i) => (
                    <li key={i} className="log-item">
                      <span className={`log-action log-${l.action.toLowerCase().replace(/\s+/g,'-')}`}>{l.action}</span>
                      <span className="log-details">{l.details}</span>
                      <span className="log-meta">{l.user} · {l.time}</span>
                    </li>
                  ))}
                </ul>
            }
          </div>
        )}

        {/* ── Toolbar ── */}
        <div className="toolbar">
          <div className="toolbar-left">
            <div className="search-box">
              <span className="search-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </span>
              <input
                className="search-input" type="text" placeholder="Search brands…"
                value={searchInput} onChange={e => setSearchInput(e.target.value)}
              />
              {searchInput && (
                <button className="search-clear" onClick={() => setSearchInput('')}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              )}
            </div>
            {selected.size > 0 && isAdmin && (
              <button className="btn btn-danger" onClick={handleBulkDelete}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                Delete {selected.size}
              </button>
            )}
          </div>
          <div className="toolbar-right">
            <div className="page-size-wrap">
              <span className="ps-label">Rows</span>
              <select className="ps-select" value={pageSize} onChange={e => setPageSize(Number(e.target.value))}>
                {PAGE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="count-badge">
              Total <strong>{totalCount.toLocaleString()}</strong>
              {selected.size > 0 && <span className="sel-pill">{selected.size} selected</span>}
            </div>
          </div>
        </div>

        {/* ── Table ── */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th className="th-check">
                  <input type="checkbox" className="custom-check" checked={allChecked}
                    ref={el => el && (el.indeterminate = partialChecked)} onChange={toggleAll}/>
                </th>
                <th className="th-sortable" onClick={() => handleSort('id')}>
                  # <SortIcon col="id" sortBy={sortBy} sortDir={sortDir}/>
                </th>
                <th className="th-sortable" onClick={() => handleSort('name')}>
                  Brand <SortIcon col="name" sortBy={sortBy} sortDir={sortDir}/>
                </th>
                <th className="hide-mobile">Slug</th>
                <th className="th-sortable hide-mobile" onClick={() => handleSort('products_count')}>
                  Products <SortIcon col="products_count" sortBy={sortBy} sortDir={sortDir}/>
                </th>
                <th className="th-sortable hide-tablet" onClick={() => handleSort('created_at')}>
                  Created <SortIcon col="created_at" sortBy={sortBy} sortDir={sortDir}/>
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({length: pageSize > 10 ? 10 : pageSize}).map((_, i) => (
                  <tr key={i} className="tr-row skeleton-row">
                    <td><div className="skeleton" style={{width:18,height:18,borderRadius:4}}/></td>
                    <td><div className="skeleton" style={{width:36}}/></td>
                    <td>
                      <div style={{display:'flex',alignItems:'center',gap:12}}>
                        <div className="skeleton-avatar"/>
                        <div><div className="skeleton" style={{width:110,marginBottom:5}}/><div className="skeleton" style={{width:70,height:11}}/></div>
                      </div>
                    </td>
                    <td className="hide-mobile"><div className="skeleton" style={{width:90}}/></td>
                    <td className="hide-mobile"><div className="skeleton" style={{width:40}}/></td>
                    <td className="hide-tablet"><div className="skeleton" style={{width:80}}/></td>
                    <td><div className="skeleton" style={{width:70}}/></td>
                  </tr>
                ))
              ) : brands.length === 0 ? (
                <tr><td colSpan={7}>
                  <div className="empty-state">
                    <div className="empty-illo"><EmptySVG/></div>
                    <div className="empty-title">{search ? `No results for "${search}"` : 'No brands yet'}</div>
                    <div className="empty-sub">{search ? 'Try a different keyword' : 'Add your first brand to get started'}</div>
                    {!search && <Link to="/add-brand" className="btn btn-primary" style={{marginTop:20}}>+ Add Brand</Link>}
                  </div>
                </td></tr>
              ) : (
                brands.map((b, i) => {
                  const color      = brandColors[((page - 1) * pageSize + i) % brandColors.length];
                  const isSelected = selected.has(b.id);
                  const dateStr    = b.created_at ? new Date(b.created_at).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' }) : '—';
                  return (
                    <tr key={b.id} className={`tr-row${isSelected ? ' tr-selected' : ''}`}>
                      <td className="td-check"><input type="checkbox" className="custom-check" checked={isSelected} onChange={() => toggleSelect(b.id)}/></td>
                      <td><span className="id-badge">#{b.id}</span></td>
                      <td>
                        <div className="brand-cell">
                          <div className="brand-avatar" style={{background:color}}>{getInitials(b.name)}</div>
                          <div>
                            <div className="brand-name">{b.name}</div>
                            <div className="brand-meta brand-meta-mobile">{b.slug || '—'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="hide-mobile"><span className="slug-text">{b.slug || '—'}</span></td>
                      <td className="hide-mobile"><span className="product-count">{(b.products_count ?? 0).toLocaleString()}</span></td>
                      <td className="hide-tablet"><span className="date-text">{dateStr}</span></td>
                      <td>
                        <div className="actions-cell">
                          <Link to={`/brands/edit/${b.id}`} className="action-btn action-edit" title="Edit">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                          </Link>
                          {isAdmin
                            ? <button className="action-btn action-delete" title="Delete" onClick={() => handleDelete(b.id, b.name)}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                              </button>
                            : <button className="action-btn action-locked" title="Admins only" disabled>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                              </button>
                          }
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination Bar ── */}
        {!loading && totalCount > 0 && (
          <div className="pagination-bar">
            {/* Left: info */}
            <div className="pg-info">
              {from === 0 ? '0' : from}–{to} of <strong>{totalCount.toLocaleString()}</strong> brands
            </div>

            {/* Centre: page numbers */}
            <div className="pg-controls">
              <button className="pg-btn pg-edge" onClick={() => setPage(1)} disabled={page === 1} title="First page">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="11 17 6 12 11 7"/><polyline points="18 17 13 12 18 7"/></svg>
              </button>
              <button className="pg-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} title="Previous">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
              </button>

              {getPageNumbers().map((p, i) =>
                p === '…'
                  ? <span key={`e${i}`} className="pg-ellipsis">···</span>
                  : <button key={p} className={`pg-btn${page === p ? ' pg-active' : ''}`} onClick={() => setPage(p)}>{p}</button>
              )}

              <button className="pg-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} title="Next">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
              <button className="pg-btn pg-edge" onClick={() => setPage(totalPages)} disabled={page === totalPages} title="Last page">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/></svg>
              </button>
            </div>

            {/* Right: jump to page */}
            <div className="pg-jump">
              <span className="ps-label">Go to</span>
              <input
                type="number" min={1} max={totalPages}
                className="pg-jump-input"
                placeholder={page}
                onKeyDown={e => { if (e.key === 'Enter') { const v = Number(e.target.value); if (v >= 1 && v <= totalPages) { setPage(v); e.target.value = ''; } } }}
              />
              <span className="ps-label">of {totalPages}</span>
            </div>
          </div>
        )}

        {/* ── Role footer ── */}
        <div className="role-footer">
          <span className={`role-badge ${isAdmin ? 'role-admin' : 'role-viewer'}`}>
            {isAdmin ? '🛡 Admin · Full access' : '👁 Viewer · Read-only'}
          </span>
        </div>

      </div>

      <ToastContainer position="bottom-right" theme={theme}
        toastStyle={{ background: isDark ? '#1e293b' : '#fff', border:`1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`, fontFamily:"'DM Sans',sans-serif", fontSize:14, color: isDark ? '#e2e8f0' : '#1e293b' }}
      />
    </div>
    </AdminLayout>
  );
};

export default AllBrands;