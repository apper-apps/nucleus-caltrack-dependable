import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import ExerciseLogger from '@/components/organisms/ExerciseLogger'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import { exerciseService } from '@/services/api/exerciseService'

const ExerciseLog = () => {
  const [exerciseEntries, setExerciseEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  
  useEffect(() => {
    loadExerciseEntries()
  }, [selectedDate])
  
  const loadExerciseEntries = async () => {
    try {
      setLoading(true)
      setError(null)
      const entries = await exerciseService.getExerciseEntriesByDate(selectedDate)
      setExerciseEntries(entries)
    } catch (err) {
      setError('Failed to load exercise entries')
    } finally {
      setLoading(false)
    }
  }
  
  const handleExerciseLogged = (newEntry) => {
    setExerciseEntries(prev => [newEntry, ...prev])
  }
  
  const handleDeleteEntry = async (entryId) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await exerciseService.deleteEntry(entryId)
        setExerciseEntries(prev => prev.filter(entry => entry.Id !== entryId))
      } catch (err) {
        alert('Failed to delete entry')
      }
    }
  }
  
  const getTotalCaloriesBurned = () => {
    return exerciseEntries.reduce((total, entry) => total + entry.caloriesBurned, 0)
  }
  
  const getTotalDuration = () => {
    return exerciseEntries.reduce((total, entry) => total + entry.duration, 0)
  }
  
  const getActivityIcon = (activity) => {
    const icons = {
      running: 'PersonStanding',
      walking: 'FootPrints',
      cycling: 'Bike',
      swimming: 'Waves',
      weight_training: 'Dumbbell',
      yoga: 'Flower',
      dancing: 'Music',
      basketball: 'CircleDot',
      tennis: 'Circle',
      soccer: 'CircleDot'
    }
    return icons[activity] || 'Activity'
  }
  
  const getIntensityColor = (intensity) => {
    switch (intensity) {
      case 'light':
        return 'info'
      case 'moderate':
        return 'warning'
      case 'vigorous':
        return 'error'
      default:
        return 'default'
    }
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Exercise Log</h1>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>
      
      {/* Daily Summary */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{getTotalCaloriesBurned()}</p>
            <p className="text-sm text-gray-600">Calories Burned</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-success">{getTotalDuration()}</p>
            <p className="text-sm text-gray-600">Total Minutes</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-warning">{exerciseEntries.length}</p>
            <p className="text-sm text-gray-600">Workouts</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-info">{Math.round(getTotalDuration() / 60 * 10) / 10}</p>
            <p className="text-sm text-gray-600">Hours</p>
          </div>
        </div>
      </Card>
      
      <ExerciseLogger onExerciseLogged={handleExerciseLogged} />
      
      {/* Exercise Entries */}
      <div className="space-y-4">
        {loading ? (
          <Loading />
        ) : error ? (
          <Error message={error} onRetry={loadExerciseEntries} />
        ) : exerciseEntries.length === 0 ? (
          <Empty
            title="No exercise entries for this date"
            description="Start logging your workouts to track your fitness progress"
            icon="Dumbbell"
          />
        ) : (
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Exercise History</h3>
            <div className="space-y-3">
              {exerciseEntries.map((entry, index) => (
                <motion.div
                  key={entry.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10">
                      <ApperIcon 
                        name={getActivityIcon(entry.activity)} 
                        size={20} 
                        className="text-primary" 
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 capitalize">
                        {entry.activity.replace('_', ' ')}
                      </p>
                      <p className="text-sm text-gray-600">
                        {entry.duration} minutes • {format(new Date(entry.date), 'h:mm a')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Badge variant={getIntensityColor(entry.intensity)}>
                      {entry.intensity}
                    </Badge>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{entry.caloriesBurned}</p>
                      <p className="text-xs text-gray-600">calories</p>
                    </div>
                    <button
                      onClick={() => handleDeleteEntry(entry.Id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <ApperIcon name="Trash2" size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </motion.div>
  )
}

export default ExerciseLog