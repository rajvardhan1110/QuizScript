import { useState } from 'react'
import './App.css'

import Login from './pages/Login'
import { BrowserRouter,Routes,Route,Link,useNavigate, Outlet} from 'react-router-dom'
import UserSignin from './pages/UserSignin'
import UserSignup from './pages/UserSignup'
import AdminSignin from './pages/AdminSignin'
import AdminSignup from './pages/AdminSignup'
import AdminHome from './pages/AdminHome'
import UserHome from './pages/UserHome'
import CreateTest from './pages/CreateTest'
import TestDetail from './pages/TestDetail'
import TestInfo from './pages/TestInfo'
import LiveTestPage






from './pages/LiveTestPage'
import TestSummary from './pages/TestSummary'

function App() {
 const [count, setCount] = useState(0)

  return (
    <>
    <BrowserRouter>
      <Routes>

       
          <Route index element={<Login/>}/>
          <Route path="/user/signin" element={<UserSignin/>}/>
          <Route path="/user/signup" element={<UserSignup/>}/>
          <Route path="/admin/signin" element={<AdminSignin/>}/>
          <Route path="/admin/signup" element={<AdminSignup/>}/>
          <Route path="/admin/home" element={<AdminHome/>}/>
          <Route path="/user/home" element={<UserHome/>}/>
          <Route path="/test/createtest" element={<CreateTest/>}/>
          <Route path="/test/:id" element={<TestDetail />} />
          <Route path="/testInfo/:testId" element={<TestInfo/>}/>
          <Route path="/testInfo/:testId/live" element={<LiveTestPage />} />
          <Route path="/testInfo/:testId/summary" element={<TestSummary />} />


  
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
