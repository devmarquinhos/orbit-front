import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from "./pages/Home"
import Projects from "./pages/Projects"
import ProjectDetails from "./pages/ProjectDetails"
import Login from './pages/Login' // Importe o Login
import Register from './pages/Register' // Importe o Register
import ProtectedRoute from './components/ProtectedRoute' // Importe a rota protegida

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Rotas Públicas */}
          <Route path='/' element={<Home/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>

          {/* Rotas Protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route path='/projects' element={<Projects/>}/>
            <Route path='/projects/:id' element={<ProjectDetails/>}/>
          </Route>
        </Routes>
      </Layout>
    </Router>
  )
}

export default App