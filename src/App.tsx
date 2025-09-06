import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from "./pages/Home"
import Projects from "./pages/Projects"
import ProjectDetails from "./pages/ProjectDetails"



function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/projects' element={<Projects/>}/>
          <Route path='/projects/:id' element={<ProjectDetails/>}/>
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
