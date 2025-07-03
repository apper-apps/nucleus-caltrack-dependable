import { motion } from 'framer-motion'
import ProgressCharts from '@/components/organisms/ProgressCharts'
import Card from '@/components/atoms/Card'
import StatCard from '@/components/molecules/StatCard'
import { useState, useEffect } from 'react'
import { progressService } from '@/services/api/progressService'

const Progress = () => {
  const [progressStats, setProgressStats] = useState(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    loadProgressStats()
  }, [])
  
  const loadProgressStats = async () => {
    try {
      const stats = await progressService.getProgressStats()
      setProgressStats(stats)
    } catch (error) {
      console.error('Failed to load progress stats:', error)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Progress Tracking</h1>
        <p className="text-gray-600">Monitor your health and fitness journey</p>
      </div>
      
      {/* Progress Stats */}
      {progressStats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <StatCard
            title="Weight Loss"
            value={progressStats.weightLoss}
            unit="kg"
            icon="TrendingDown"
            color="success"
            trend="down"
            trendValue={`${progressStats.weightLossRate}kg/week`}
            loading={loading}
          />
          <StatCard
            title="Avg Daily Calories"
            value={progressStats.avgCalories}
            icon="Activity"
            color="primary"
            loading={loading}
          />
          <StatCard
            title="Workout Streak"
            value={progressStats.workoutStreak}
            unit="days"
            icon="Calendar"
            color="warning"
            loading={loading}
          />
          <StatCard
            title="Goal Progress"
            value={progressStats.goalProgress}
            unit="%"
            icon="Target"
            color="success"
            loading={loading}
          />
        </motion.div>
      )}
      
      {/* Charts */}
      <ProgressCharts />
      
      {/* Goals & Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Goals</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Target Weight</p>
                  <p className="text-sm text-gray-600">65 kg</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-success">85% Complete</p>
                  <div className="w-16 h-2 bg-gray-200 rounded-full mt-1">
                    <div className="w-3/4 h-2 bg-success rounded-full"></div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Daily Calories</p>
                  <p className="text-sm text-gray-600">1800 cal</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-primary">92% Complete</p>
                  <div className="w-16 h-2 bg-gray-200 rounded-full mt-1">
                    <div className="w-11/12 h-2 bg-primary rounded-full"></div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Weekly Exercise</p>
                  <p className="text-sm text-gray-600">5 sessions</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-warning">60% Complete</p>
                  <div className="w-16 h-2 bg-gray-200 rounded-full mt-1">
                    <div className="w-3/5 h-2 bg-warning rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-success/10 to-emerald-100 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center">
                  <span className="text-white text-sm font-bold">🏆</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">7-Day Streak</p>
                  <p className="text-sm text-gray-600">Completed daily logging</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-white text-sm font-bold">💪</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">First 5K</p>
                  <p className="text-sm text-gray-600">Completed 5km run</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-warning/10 to-orange-100 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-warning flex items-center justify-center">
                  <span className="text-white text-sm font-bold">⚖️</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Weight Milestone</p>
                  <p className="text-sm text-gray-600">Lost 2kg this month</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Progress