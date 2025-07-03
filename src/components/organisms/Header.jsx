import { motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'

const Header = () => {
  const location = useLocation()
  
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard'
      case '/food':
        return 'Food Log'
      case '/exercise':
        return 'Exercise Log'
      case '/progress':
        return 'Progress'
      case '/profile':
        return 'Profile'
      default:
        return 'CalTrack Pro'
    }
  }
  
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-40 glass-effect border-b border-gray-200/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3"
            >
              <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                <ApperIcon name="Activity" size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  CalTrack Pro
                </h1>
                <p className="text-xs text-gray-600">{getPageTitle()}</p>
              </div>
            </motion.div>
          </div>
          
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ApperIcon name="Bell" size={20} className="text-gray-600" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ApperIcon name="Settings" size={20} className="text-gray-600" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  )
}

export default Header