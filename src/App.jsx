
import { Route, Routes } from 'react-router-dom'
import SignInPage from './pages/SignInPage'
import Layout from './utils/Layout'
import DashboardPage from './pages/DashboardPage'
import ManageDoctorsPage from './pages/ManageDoctorsPage'
import AdminSurgeryRecords from './pages/SurgeryRecords'
import SurgeryDetailsPage from './pages/SurgeryDetailsPage'

function App() {

  return (
    <Routes>
    <Route path='/' element={<SignInPage/>}/>


    <Route path='/dashboard' element={<Layout/>}>
      <Route index element={<DashboardPage/>}/>
      <Route path='manage-doctors' element={<ManageDoctorsPage/>}/>
      <Route path='records' element={<AdminSurgeryRecords/>}/>
      <Route path='records/:id' element={<SurgeryDetailsPage/>}/>

    </Route>

   </Routes>
  )
}

export default App
