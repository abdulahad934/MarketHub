import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import { brandService } from '../services/brandService';
import { isAdmin, readLog, saveLog } from '../utils/brandUtils';

const LOG_KEY = 'brandActivityLog';

export const useBrands = () => {
  const importRef = useRef();

  const [brands,      setBrands]      = useState([]);
  const [totalCount,  setTotalCount]  = useState(0);
  const [loading,     setLoading]     = useState(true);
  const [page,        setPage]        = useState(1);
  const [pageSize,    setPageSize]    = useState(10);
  const [sortBy,      setSortBy]      = useState('id');
  const [sortDir,     setSortDir]     = useState('desc');
  const [searchInput, setSearchInput] = useState('');
  const [search,      setSearch]      = useState('');
  const [selected,    setSelected]    = useState(new Set());
  const [activityLog, setActivityLog] = useState(() => readLog(LOG_KEY));

  // debounced search
  useEffect(() => {
    const t = setTimeout(() => { setPage(1); setSearch(searchInput); }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => { setPage(1); }, [pageSize, sortBy, sortDir]);

  const log = useCallback((action, details) => {
    const entry = { action, details, user: localStorage.getItem('userName') || 'Admin', time: new Date().toLocaleString() };
    setActivityLog(prev => { const next = [entry, ...prev].slice(0, 50); saveLog(LOG_KEY, next); return next; });
  }, []);

  const clearLog = useCallback(() => { setActivityLog([]); localStorage.removeItem(LOG_KEY); }, []);

  const fetchBrands = useCallback(async () => {
    setLoading(true);
    setSelected(new Set());
    try {
      const { results, count } = await brandService.getAll({ page, pageSize, sortBy, sortDir, search });
      setBrands(results);
      setTotalCount(count);
    } catch { toast.error('Failed to load brands'); }
    finally { setLoading(false); }
  }, [page, pageSize, sortBy, sortDir, search]);

  useEffect(() => { fetchBrands(); }, [fetchBrands]);

  const handleSort = useCallback((col) => {
    if (col === sortBy) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(col); setSortDir('asc'); }
    setPage(1);
  }, [sortBy]);

  const confirmDelete = (message, onConfirm) =>
    toast.warn(
      <div className="toast-confirm">
        <p>{message}</p>
        <div className="toast-actions">
          <button className="toast-btn danger"  onClick={onConfirm}>Yes, Delete</button>
          <button className="toast-btn neutral" onClick={() => toast.dismiss()}>Cancel</button>
        </div>
      </div>,
      { autoClose: false, closeButton: false }
    );

  const handleDelete = useCallback((id, name) => {
    if (!isAdmin()) return toast.error('Only admins can delete.');
    confirmDelete(`Delete "${name}"?`, async () => {
      try { await brandService.delete(id); log('DELETE', `"${name}" (ID:${id})`); toast.dismiss(); toast.success(`"${name}" deleted`); fetchBrands(); }
      catch { toast.error('Delete failed'); }
    });
  }, [fetchBrands, log]);

  const handleBulkDelete = useCallback(() => {
    if (!isAdmin()) return toast.error('Only admins can delete.');
    if (!selected.size) return toast.info('Nothing selected.');
    confirmDelete(`Delete ${selected.size} brand(s)?`, async () => {
      try {
        const names = brands.filter(b => selected.has(b.id)).map(b => b.name).join(', ');
        await brandService.bulkDelete([...selected]);
        log('BULK DELETE', names);
        toast.dismiss(); toast.success(`${selected.size} deleted`); fetchBrands();
      } catch { toast.error('Bulk delete failed'); }
    });
  }, [selected, brands, fetchBrands, log]);

  const toggleSelect = useCallback((id) =>
    setSelected(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; }), []);

  const toggleAll = useCallback(() =>
    setSelected(prev => brands.every(b => prev.has(b.id)) ? new Set() : new Set(brands.map(b => b.id))),
  [brands]);

  const handleExportExcel = useCallback(() => {
    const rows = brands.map(b => ({ ID:b.id, Name:b.name, Slug:b.slug, Products:b.products_count??0, Created:b.created_at??'' }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows), 'Brands');
    XLSX.writeFile(wb, 'brands.xlsx');
    log('EXPORT', `${rows.length} brands`);
    toast.success('Exported!');
  }, [brands, log]);

  const handleImportCSV = useCallback((e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const wb  = XLSX.read(evt.target.result, { type: 'binary' });
        const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
        const payload = rows.filter(r => r.Name||r.name).map(r => ({ name:r.Name||r.name, slug:r.Slug||r.slug||'' }));
        await brandService.bulkCreate(payload);
        log('IMPORT', `${payload.length} brands`);
        toast.success(`${payload.length} imported!`);
        fetchBrands();
      } catch { toast.error('Import failed'); }
    };
    reader.readAsBinaryString(file);
    e.target.value = '';
  }, [fetchBrands, log]);

  const totalPages    = Math.max(1, Math.ceil(totalCount / pageSize));
  const from          = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const to            = Math.min(page * pageSize, totalCount);
  const allChecked    = brands.length > 0 && brands.every(b => selected.has(b.id));
  const partialChecked = brands.some(b => selected.has(b.id)) && !allChecked;

  return {
    brands, totalCount, loading,
    page, setPage, pageSize, setPageSize,
    totalPages, from, to,
    sortBy, sortDir, handleSort,
    searchInput, setSearchInput,
    selected, toggleSelect, toggleAll, allChecked, partialChecked,
    handleDelete, handleBulkDelete, handleExportExcel, handleImportCSV,
    activityLog, clearLog,
    importRef,
    isAdmin: isAdmin(),
  };
};