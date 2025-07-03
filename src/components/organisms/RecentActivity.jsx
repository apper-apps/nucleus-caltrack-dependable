import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import { activityService } from '@/services/api/activityService'

const RecentActivity = () => {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    loadActivities()
  }, [])
  
  const loadActivities = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await activityService.getRecentActivities()
      setActivities(data)
    } catch (err) {
      setError('Failed to load recent activities')
    } finally {
      setLoading(false)
    }
  }
  
  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadActivities} />
  if (activities.length === 0) {
    return (
      <Empty
        title="No Recent Activity"
        description="Start logging your food and exercise to see your recent activity here"
        icon="Activity"
        action={() => window.location.href = '/food'}
        actionLabel="Log Food"
      />
    )
  }
  
  const getActivityIcon = (type) => {
    switch (type) {
      case 'food':
        return 'Apple'
      case 'exercise':
        return 'Dumbbell'
      case 'weight':
        return 'Scale'
      default:
        return 'Activity'
    }
  }
  
  const getActivityColor = (type) => {
    switch (type) {
      case 'food':
        return 'success'
      case 'exercise':
        return 'primary'
      case 'weight':
        return 'warning'
      default:
        return 'default'
    }
  }
  
  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.Id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className={`p-2 rounded-full bg-gradient-to-br ${
              getActivityColor(activity.type) === 'success' ? 'from-success/10 to-emerald-100' :
              getActivityColor(activity.type) === 'primary' ? 'from-primary/10 to-secondary/10' :
              'from-warning/10 to-orange-100'
            }`}>
              <ApperIcon 
                name={getActivityIcon(activity.type)} 
                size={16} 
                className={`${
                  getActivityColor(activity.type) === 'success' ? 'text-success' :
                  getActivityColor(activity.type) === 'primary' ? 'text-primary' :
                  'text-warning'
                }`}
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{activity.description}</p>
              <p className="text-sm text-gray-500">
                {format(new Date(activity.date), 'MMM dd, yyyy - h:mm a')}
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant={getActivityColor(activity.type)}>
                {activity.type}
              </Badge>
              {activity.calories && (
                <span className="text-sm font-medium text-gray-900">
                  {activity.calories} cal
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  )
}

export default RecentActivity