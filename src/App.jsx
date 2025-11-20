import './App.css'
import { HashRouter, Routes, Route } from 'react-router'
import Home from './pages/Home'
import About from './pages/About'

function App() {

  return <HashRouter>
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/about" element={<About />}></Route>
    </Routes>
  </HashRouter>
}

export default App
