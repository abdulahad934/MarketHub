
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AddCategory from './pages/AddCategory';
import AddBrand from './pages/AddBrand';
import AllBrands from './pages/AllBrands';
import AddProduct from './pages/AddProduct';
import AllCategories from './pages/AllCategories';
import AllProducts from './pages/AllProducts';
function App() {
 

  return (
   <BrowserRouter>
   
   <Routes>
    {/* Add Category, Brand And Product, Login, Admindashboard */}
    <Route path='/admin-login' element={<AdminLogin/>}></Route>
    <Route path='/admin-dashboard' element={<AdminDashboard/>}></Route>
    <Route path='/add-category' element={<AddCategory/>}></Route>
    <Route path='/add-brand' element={<AddBrand/>}></Route>
    <Route path='/add-product' element={<AddProduct/>}></Route>

    {/* All Brand, all category, all products */}
    <Route path='/all-categories' element={<AllCategories/>}></Route>
    <Route path='/all-brands' element={<AllBrands/>}></Route>
    <Route path='/all-products' element={<AllProducts/>}></Route>
   </Routes>


   </BrowserRouter>
  )
}

export default App
