import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/atoms/Card'

const StatCard = ({ 
  title, 
  value, 
  unit, 
  icon, 
  trend, 
  trendValue,
  color = 'primary',
  loading = false 
}) => {
  const colors = {
    primary: 'from-primary to-secondary',
    success: 'from-success to-emerald-400',
    warning: 'from-warning to-orange-400',
    error: 'from-error to-red-400',
    info: 'from-info to-blue-400'
  }
  
  if (loading) {
    return (
      <Card className="animate-pulse">
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="h-8 bg-gray-200 rounded w-16"></div>
          <div className="h-3 bg-gray-200 rounded w-24"></div>
        </div>
      </Card>
    )
  }
  
  return (
    <Card hover className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <div className="flex items-baseline space-x-1">
            <motion.span 
              className="text-2xl font-bold text-gray-900"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {value}
            </motion.span>
            {unit && (
              <span className="text-sm text-gray-500">{unit}</span>
            )}
          </div>
          {trend && (
            <div className="flex items-center mt-2">
              <ApperIcon 
                name={trend === 'up' ? 'TrendingUp' : 'TrendingDown'} 
                size={14} 
                className={`mr-1 ${trend === 'up' ? 'text-success' : 'text-error'}`} 
              />
              <span className={`text-xs font-medium ${trend === 'up' ? 'text-success' : 'text-error'}`}>
                {trendValue}
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className={`p-3 rounded-full bg-gradient-to-br ${colors[color]}`}>
            <ApperIcon name={icon} size={24} className="text-white" />
          </div>
        )}
      </div>
      
      {/* Subtle background gradient */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colors[color]} opacity-5 rounded-full -mr-16 -mt-16`}></div>
    </Card>
  )
}

export default StatCard