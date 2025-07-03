import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import DashboardStats from '@/components/organisms/DashboardStats'
import QuickActions from '@/components/molecules/QuickActions'
import RecentActivity from '@/components/organisms/RecentActivity'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { dashboardService } from '@/services/api/dashboardService'

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    loadDashboardData()
  }, [])
  
  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await dashboardService.getDashboardData()
      setDashboardData(data)
    } catch (err) {
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }
  
  const handleQuickAction = (type) => {
    switch (type) {
      case 'food':
        window.location.href = '/food'
        break
      case 'exercise':
        window.location.href = '/exercise'
        break
      case 'weight':
        // For now, just show a message
        alert('Weight logging coming soon!')
        break
      default:
        break
    }
  }
  
  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadDashboardData} />
  if (!dashboardData) return null
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2"
        >
          Welcome back!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-600"
        >
          Here's your health overview for today
        </motion.p>
      </div>
      
      <DashboardStats stats={dashboardData.stats} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <RecentActivity />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <div className="premium-card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <QuickActions
              onFoodLog={() => handleQuickAction('food')}
              onExerciseLog={() => handleQuickAction('exercise')}
              onWeightLog={() => handleQuickAction('weight')}
            />
          </div>
          
          <div className="premium-card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Tip</h3>
            <div className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
              <p className="text-sm text-gray-700">
                {dashboardData.dailyTip || "Stay hydrated! Aim for 8 glasses of water throughout the day to support your metabolism."}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Dashboard