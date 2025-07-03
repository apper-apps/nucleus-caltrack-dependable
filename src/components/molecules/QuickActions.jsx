import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const QuickActions = ({ onFoodLog, onExerciseLog, onWeightLog }) => {
  const actions = [
    {
      label: 'Log Food',
      icon: 'Apple',
      onClick: onFoodLog,
      color: 'gradient-success'
    },
    {
      label: 'Log Exercise',
      icon: 'Dumbbell',
      onClick: onExerciseLog,
      color: 'gradient-primary'
    },
    {
      label: 'Log Weight',
      icon: 'Scale',
      onClick: onWeightLog,
      color: 'bg-gradient-to-r from-warning to-orange-400'
    }
  ]
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {actions.map((action, index) => (
        <motion.button
          key={action.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={action.onClick}
          className={`p-4 rounded-xl ${action.color} text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 group`}
        >
          <div className="flex items-center justify-center mb-2">
            <ApperIcon name={action.icon} size={24} className="group-hover:scale-110 transition-transform" />
          </div>
          <p className="font-semibold text-sm">{action.label}</p>
        </motion.button>
      ))}
    </div>
  )
}

export default QuickActions