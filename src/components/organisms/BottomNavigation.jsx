import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const BottomNavigation = () => {
  const navItems = [
    { path: '/', label: 'Dashboard', icon: 'Home' },
    { path: '/food', label: 'Food', icon: 'Apple' },
    { path: '/exercise', label: 'Exercise', icon: 'Dumbbell' },
    { path: '/progress', label: 'Progress', icon: 'TrendingUp' },
    { path: '/profile', label: 'Profile', icon: 'User' }
  ]
  
  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 glass-effect border-t border-gray-200/50 z-50"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'text-primary bg-primary/10'
                    : 'text-gray-600 hover:text-primary hover:bg-primary/5'
                }`
              }
            >
              {({ isActive }) => (
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="flex flex-col items-center space-y-1"
                >
                  <ApperIcon
                    name={item.icon}
                    size={20}
                    className={isActive ? 'text-primary' : 'text-gray-600'}
                  />
                  <span className={`text-xs font-medium ${isActive ? 'text-primary' : 'text-gray-600'}`}>
                    {item.label}
                  </span>
                </motion.div>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </motion.nav>
  )
}

export default BottomNavigation