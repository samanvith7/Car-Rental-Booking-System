import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getCars } from '../services/api';
import CarCard from '../components/cars/CarCard';
import CarFilter from '../components/cars/CarFilter';
import Loader from '../components/common/Loader';
import { FiGrid, FiList, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const defaultFilters = {
  search: '', location: '', category: '', type: '', fuelType: '',
  transmission: '', minPrice: '', maxPrice: '', available: '',
};

const CarsPage = () => {
  const [searchParams] = useSearchParams();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    ...defaultFilters,
    search: searchParams.get('search') || '',
    location: searchParams.get('location') || '',
    category: searchParams.get('category') || '',
  });
  const [view, setView] = useState('grid');
  const [sortBy, setSortBy] = useState('');

  const fetchCars = useCallback(async () => {
    setLoading(true);
    try {
      const params = { ...filters, page: currentPage, limit: 9 };
      if (sortBy === 'price_asc') params.sortPrice = 'asc';
      if (sortBy === 'price_desc') params.sortPrice = 'desc';
      const { data } = await getCars(params);
      setCars(data.data);
      setTotal(data.total);
      setPages(data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage, sortBy]);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    setCurrentPage(1);
  };

  return (
    <div style={{ paddingTop: 90, minHeight: '100vh' }}>
      <div className="container" style={{ paddingBottom: 60 }}>
        {/* Header */}
        <div style={{ paddingTop: 32, paddingBottom: 32, borderBottom: '1px solid var(--border)', marginBottom: 32 }}>
          <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 8 }}>Browse Cars</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            {loading ? 'Searching...' : `${total} vehicle${total !== 1 ? 's' : ''} available`}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 32, alignItems: 'start' }}
          className="cars-layout">
          {/* Sidebar */}
          <div className="filter-sidebar">
            <CarFilter filters={filters} onChange={handleFilterChange} onReset={handleReset} />
          </div>

          {/* Main */}
          <div>
            {/* Toolbar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)', padding: '8px 14px', borderRadius: 8, fontSize: 14, cursor: 'pointer' }}>
                  <option value="">Sort: Default</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                {[['grid', <FiGrid />], ['list', <FiList />]].map(([v, icon]) => (
                  <button key={v} onClick={() => setView(v)}
                    style={{ padding: 8, borderRadius: 8, background: view === v ? 'var(--accent)' : 'var(--bg-card)', border: '1px solid ' + (view === v ? 'transparent' : 'var(--border)'), color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Cars Grid/List */}
            {loading ? <Loader /> : cars.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 40px', background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🚗</div>
                <h3 style={{ fontSize: 20, marginBottom: 8 }}>No cars found</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Try adjusting your filters</p>
                <button className="btn btn-primary" onClick={handleReset}>Clear Filters</button>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: view === 'grid' ? 'repeat(auto-fill, minmax(280px, 1fr))' : '1fr',
                gap: 20
              }}>
                {cars.map(car => <CarCard key={car._id} car={car} />)}
              </div>
            )}

            {/* Pagination */}
            {pages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 40 }}>
                <button className="btn btn-secondary btn-sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                  <FiChevronLeft />
                </button>
                {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setCurrentPage(p)}
                    style={{ width: 36, height: 36, borderRadius: 8, border: '1px solid ' + (p === currentPage ? 'var(--accent)' : 'var(--border)'), background: p === currentPage ? 'var(--accent)' : 'transparent', color: 'var(--text-primary)', cursor: 'pointer', fontSize: 14, fontWeight: p === currentPage ? 700 : 400 }}>
                    {p}
                  </button>
                ))}
                <button className="btn btn-secondary btn-sm" onClick={() => setCurrentPage(p => Math.min(pages, p + 1))} disabled={currentPage === pages}>
                  <FiChevronRight />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .cars-layout { grid-template-columns: 1fr !important; }
          .filter-sidebar { position: static !important; }
        }
      `}</style>
    </div>
  );
};

export default CarsPage;
