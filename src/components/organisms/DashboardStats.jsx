import { motion } from 'framer-motion'
import StatCard from '@/components/molecules/StatCard'
import ProgressRing from '@/components/molecules/ProgressRing'

const DashboardStats = ({ stats, loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <StatCard key={i} loading={true} />
        ))}
      </div>
    )
  }
  
  const calorieProgress = stats.consumed > 0 ? (stats.consumed / stats.goal) * 100 : 0
  
  return (
    <div className="space-y-6">
      {/* Main calorie progress */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="premium-card p-8 text-center"
      >
        <div className="flex flex-col items-center space-y-4">
          <ProgressRing 
            percentage={Math.min(calorieProgress, 100)} 
            size={160} 
            color="primary"
          >
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{stats.remaining}</p>
              <p className="text-sm text-gray-600">remaining</p>
            </div>
          </ProgressRing>
          
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Daily Calorie Goal</h3>
            <div className="flex items-center justify-center space-x-6 text-sm">
              <div className="text-center">
                <p className="font-semibold text-gray-900">{stats.goal}</p>
                <p className="text-gray-600">Goal</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-success">{stats.consumed}</p>
                <p className="text-gray-600">Consumed</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-error">{stats.burned}</p>
                <p className="text-gray-600">Burned</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Weight"
          value={stats.weight}
          unit="kg"
          icon="Scale"
          color="primary"
          trend={stats.weightTrend}
          trendValue={stats.weightChange}
        />
        <StatCard
          title="BMI"
          value={stats.bmi}
          icon="Activity"
          color="info"
        />
        <StatCard
          title="Protein"
          value={stats.protein}
          unit="g"
          icon="Beef"
          color="success"
        />
        <StatCard
          title="Water"
          value={stats.water}
          unit="L"
          icon="Droplets"
          color="info"
        />
      </div>
    </div>
  )
}

export default DashboardStats