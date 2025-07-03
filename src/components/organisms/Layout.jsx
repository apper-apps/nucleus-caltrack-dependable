import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import BottomNavigation from '@/components/organisms/BottomNavigation'
import Header from '@/components/organisms/Header'

const Layout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-surface">
      <Header />
      
      <main className="pb-20 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  )
}

export default Layout