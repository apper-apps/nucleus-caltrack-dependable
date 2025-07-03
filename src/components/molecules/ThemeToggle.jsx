import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import { useTheme } from '@/contexts/ThemeContext'

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme()

  const themeOptions = [
    { value: 'light', label: 'Light', icon: 'Sun' },
    { value: 'dark', label: 'Dark', icon: 'Moon' },
    { value: 'system', label: 'System', icon: 'Monitor' }
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <ApperIcon name="Palette" size={20} className="text-gray-600 dark:text-gray-300" />
        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Theme</h4>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        {themeOptions.map((option) => (
          <motion.button
            key={option.value}
            onClick={() => setTheme(option.value)}
            className={`
              relative p-3 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
              ${theme === option.value 
                ? 'border-primary bg-primary/10 text-primary dark:bg-primary/20' 
                : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
              }
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex flex-col items-center space-y-1">
              <ApperIcon name={option.icon} size={18} />
              <span className="text-xs font-medium">{option.label}</span>
            </div>
            
            {theme === option.value && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full flex items-center justify-center"
              >
                <ApperIcon name="Check" size={8} className="text-white" />
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  )
}

export default ThemeToggle