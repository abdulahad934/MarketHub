import React, { useState } from 'react';
import { Link }            from 'react-router-dom';
import { CSVLink }         from 'react-csv';
import { ToastContainer }  from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useBrands }   from '../hooks/useBrands';
import BrandTable      from '../components/BrandTable';
import BrandToolbar    from '../components/BrandToolbar';
import Pagination      from '../components/Pagination';
import ActivityLog     from '../components/ActivityLog';
import '../styles/allbrands.css';

const AllBrands = () => {
  const brandState = useBrands();
  const [showLog, setShowLog] = useState(false);
  const [theme,   setTheme]   = useState(() => localStorage.getItem('brandTheme') || 'dark');

  const toggleTheme = () => {
    const t = theme === 'dark' ? 'light' : 'dark';
    setTheme(t); localStorage.setItem('brandTheme', t);
  };

  const isDark  = theme === 'dark';
  const csvData = brandState.brands.map(b => ({ ID:b.id, Name:b.name, Slug:b.slug }));

  return (
    <div className={`page-root ${theme}`}>
      <div className="page-wrapper">

        {/* Header */}
        <div className="page-header">
          <div>
            <div className="page-label">Product Management</div>
            <h1 className="page-title">All <span>Brands</span></h1>
            <p className="page-subtitle">Manage and organize your product brands</p>
          </div>
          <div className="header-actions">
            <button className="btn btn-icon" onClick={toggleTheme}>
              {isDark
                ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
                : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
              }
            </button>
            <button className="btn btn-icon" onClick={() => setShowLog(v => !v)}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/></svg>
              {brandState.activityLog.length > 0 && <span className="log-dot"/>}
            </button>
            <button className="btn btn-outline" onClick={() => brandState.importRef.current.click()}>Import</button>
            <input ref={brandState.importRef} type="file" accept=".csv,.xlsx" style={{display:'none'}} onChange={brandState.handleImportCSV}/>
            <CSVLink data={csvData} filename="brands.csv" style={{textDecoration:'none'}}>
              <button className="btn btn-outline">CSV</button>
            </CSVLink>
            <button className="btn btn-outline" onClick={brandState.handleExportExcel}>Excel</button>
            <Link to="/add-brand" className="btn btn-primary">+ Add Brand</Link>
          </div>
        </div>

        {/* Activity Log */}
        {showLog && (
          <ActivityLog
            log={brandState.activityLog}
            onClear={brandState.clearLog}
            onClose={() => setShowLog(false)}
          />
        )}

        {/* Toolbar */}
        <BrandToolbar
          searchInput={brandState.searchInput}
          onSearchChange={brandState.setSearchInput}
          pageSize={brandState.pageSize}
          onPageSizeChange={brandState.setPageSize}
          totalCount={brandState.totalCount}
          selected={brandState.selected}
          isAdmin={brandState.isAdmin}
          onBulkDelete={brandState.handleBulkDelete}
        />

        {/* Table */}
        <BrandTable
          brands={brandState.brands}
          loading={brandState.loading}
          page={brandState.page}
          pageSize={brandState.pageSize}
          sortBy={brandState.sortBy}
          sortDir={brandState.sortDir}
          onSort={brandState.handleSort}
          selected={brandState.selected}
          onToggleSelect={brandState.toggleSelect}
          onToggleAll={brandState.toggleAll}
          allChecked={brandState.allChecked}
          partialChecked={brandState.partialChecked}
          onDelete={brandState.handleDelete}
          isAdmin={brandState.isAdmin}
          searchInput={brandState.searchInput}
        />

        {/* Pagination */}
        {!brandState.loading && brandState.totalCount > 0 && (
          <Pagination
            page={brandState.page}
            totalPages={brandState.totalPages}
            from={brandState.from}
            to={brandState.to}
            totalCount={brandState.totalCount}
            onPageChange={brandState.setPage}
            label="brands"
          />
        )}

        <div className="role-footer">
          <span className={`role-badge ${brandState.isAdmin ? 'role-admin' : 'role-viewer'}`}>
            {brandState.isAdmin ? '🛡 Admin · Full access' : '👁 Viewer · Read-only'}
          </span>
        </div>
      </div>

      <ToastContainer position="bottom-right" theme={theme}
        toastStyle={{ background: isDark?'#1e293b':'#fff', fontFamily:'DM Sans,sans-serif', fontSize:14, color: isDark?'#e2e8f0':'#1e293b' }}
      />
    </div>
  );
};

export default AllBrands;
