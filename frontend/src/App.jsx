import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import PostEditor from './pages/PostEditor'
import Drafts from './pages/Drafts'
import Profile from './pages/Profile'

function App() {
  const { user, loading } = useAuth()
  const location = useLocation()

  const showNavbar =
    user &&
    !['/', '/login', '/register'].includes(location.pathname)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {showNavbar && <Navbar />}

      {/* IMPORTANT: navbar is fixed, so add padding */}
      <main className={showNavbar ? 'pt-16' : ''}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={user ? <Dashboard /> : <Navigate to="/" />}
          />
          <Route
            path="/editor"
            element={user ? <PostEditor /> : <Navigate to="/" />}
          />
          <Route
            path="/editor/:id"
            element={user ? <PostEditor /> : <Navigate to="/" />}
          />
          <Route
            path="/drafts"
            element={user ? <Drafts /> : <Navigate to="/" />}
          />
          <Route
            path="/profile"
            element={user ? <Profile /> : <Navigate to="/" />}
          />
        </Routes>
      </main>
    </div>
  )
}

export default App






// import { Routes, Route, Navigate } from 'react-router-dom'
// import { useAuth } from './contexts/AuthContext'
// import Navbar from './components/Navbar'
// import Home from './pages/Home'
// import Login from './pages/Login'
// import Register from './pages/Register'
// import Dashboard from './pages/Dashboard'
// import PostEditor from './pages/PostEditor'
// import Drafts from './pages/Drafts'
// import Profile from './pages/Profile'

// function App() {
//   const { user, loading } = useAuth()

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
//       <main>
//         <Routes>
//           <Route 
//             path="/"
//             element={<Home />}
//           />
//           <Route 
//             path="/login" 
//             element={<Login />}
//           />
//           <Route 
//             path="/register" 
//             element={<Register />}
//           />
//           <Route 
//             path="/dashboard" 
//             element={user ? <Dashboard /> : <Navigate to="/" />} 
//           />
//           <Route 
//             path="/editor" 
//             element={user ? <PostEditor /> : <Navigate to="/" />} 
//           />
//           <Route 
//             path="/editor/:id" 
//             element={user ? <PostEditor /> : <Navigate to="/" />} 
//           />
//           <Route 
//             path="/drafts" 
//             element={user ? <Drafts /> : <Navigate to="/" />} 
//           />
//           <Route 
//             path="/profile" 
//             element={user ? <Profile /> : <Navigate to="/" />} 
//           />
//         </Routes>
//       </main>
//     </div>
//   )
// }

// export default App
