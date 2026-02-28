
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import AdminLogin from './components/AdminLogin';
function App() {
 

  return (
   <BrowserRouter>
   

   <Routes>
    <Route path='/' element={<AdminLogin/>}></Route>
   </Routes>


   </BrowserRouter>
  )
}

export default App
