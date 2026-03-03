import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import AdminLayout    from './components/AdminLayout'
import AdminLogin     from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import AddCategory    from './pages/AddCategory'
import AllCategories  from './pages/AllCategories'
import AddBrand       from './pages/AddBrand'
import AllBrands      from './pages/AllBrands'
import AddProduct     from './pages/AddProduct'
import AllProducts    from './pages/AllProducts'

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={2500} theme="dark" />
      <Routes>

        {/* Public  */}
        <Route path="/admin-login" element={<AdminLogin />} />

        {/*  AdminLayout */}
        <Route element={<AdminLayout />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/add-category"    element={<AddCategory />} />
          <Route path="/all-categories"  element={<AllCategories />} />
          <Route path="/add-brand"       element={<AddBrand />} />
          <Route path="/all-brands"      element={<AllBrands />} />
          <Route path="/add-product"     element={<AddProduct />} />
          <Route path="/all-products"    element={<AllProducts />} />
        </Route>

        <Route path="*" element={<Navigate to="/admin-dashboard" replace />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App