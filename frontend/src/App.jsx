
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
function App() {
 

  return (
   <BrowserRouter>
   

   <Routes>
    <Route path='/admin-login' element={<AdminLogin/>}></Route>
    <Route path='/admin-dashboard' element={<AdminDashboard/>}></Route>
   </Routes>


   </BrowserRouter>
  )
}

export default App
