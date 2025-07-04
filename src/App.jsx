import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { motion } from 'framer-motion'
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext'
import Layout from '@/components/organisms/Layout'
import Dashboard from '@/components/pages/Dashboard'
import FoodLog from '@/components/pages/FoodLog'
import ExerciseLog from '@/components/pages/ExerciseLog'
import Progress from '@/components/pages/Progress'
import Profile from '@/components/pages/Profile'

const AppContent = () => {
  const { isDark } = useTheme()
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-surface dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
    >
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="food" element={<FoodLog />} />
          <Route path="exercise" element={<ExerciseLog />} />
          <Route path="progress" element={<Progress />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={isDark ? 'dark' : 'light'}
        style={{ zIndex: 9999 }}
      />
    </motion.div>
  )
}
function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

export default App