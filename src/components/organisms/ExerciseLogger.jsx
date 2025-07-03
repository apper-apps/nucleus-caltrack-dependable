import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import FormField from '@/components/molecules/FormField'
import Card from '@/components/atoms/Card'
import ApperIcon from '@/components/ApperIcon'
import { exerciseService } from '@/services/api/exerciseService'

const ExerciseLogger = ({ onExerciseLogged, userWeight = 70 }) => {
  const [exercise, setExercise] = useState({
    activity: '',
    duration: '',
    intensity: 'moderate'
  })
  const [loading, setLoading] = useState(false)
  
  const activityOptions = [
    { value: 'running', label: 'Running' },
    { value: 'walking', label: 'Walking' },
    { value: 'cycling', label: 'Cycling' },
    { value: 'swimming', label: 'Swimming' },
    { value: 'weight_training', label: 'Weight Training' },
    { value: 'yoga', label: 'Yoga' },
    { value: 'dancing', label: 'Dancing' },
    { value: 'basketball', label: 'Basketball' },
    { value: 'tennis', label: 'Tennis' },
    { value: 'soccer', label: 'Soccer' }
  ]
  
  const intensityOptions = [
    { value: 'light', label: 'Light' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'vigorous', label: 'Vigorous' }
  ]
  
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setExercise(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const calculateCaloriesBurned = () => {
    if (!exercise.activity || !exercise.duration) return 0
    
    const metValues = {
      running: { light: 6, moderate: 8, vigorous: 11 },
      walking: { light: 3, moderate: 4, vigorous: 5 },
      cycling: { light: 4, moderate: 6, vigorous: 8 },
      swimming: { light: 4, moderate: 6, vigorous: 8 },
      weight_training: { light: 3, moderate: 4, vigorous: 6 },
      yoga: { light: 2, moderate: 3, vigorous: 4 },
      dancing: { light: 3, moderate: 4, vigorous: 5 },
      basketball: { light: 4, moderate: 6, vigorous: 8 },
      tennis: { light: 4, moderate: 5, vigorous: 7 },
      soccer: { light: 5, moderate: 7, vigorous: 9 }
    }
    
    const met = metValues[exercise.activity]?.[exercise.intensity] || 4
    const durationHours = parseFloat(exercise.duration) / 60
    const calories = met * userWeight * durationHours
    
    return Math.round(calories)
  }
  
  const handleLogExercise = async () => {
    if (!exercise.activity || !exercise.duration) {
      toast.error('Please fill in all fields')
      return
    }
    
    setLoading(true)
    try {
      const caloriesBurned = calculateCaloriesBurned()
      const exerciseEntry = {
        ...exercise,
        duration: parseInt(exercise.duration),
        caloriesBurned,
        date: new Date().toISOString()
      }
      
      await exerciseService.logExercise(exerciseEntry)
      toast.success('Exercise logged successfully!')
      
      // Reset form
      setExercise({
        activity: '',
        duration: '',
        intensity: 'moderate'
      })
      
      if (onExerciseLogged) {
        onExerciseLogged(exerciseEntry)
      }
    } catch (error) {
      toast.error('Failed to log exercise')
    } finally {
      setLoading(false)
    }
  }
  
  const estimatedCalories = calculateCaloriesBurned()
  
  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Log Exercise</h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Activity"
            name="activity"
            type="select"
            value={exercise.activity}
            onChange={handleInputChange}
            options={activityOptions}
            placeholder="Select activity"
          />
          <FormField
            label="Duration (minutes)"
            name="duration"
            type="number"
            value={exercise.duration}
            onChange={handleInputChange}
            placeholder="Enter duration"
            min="1"
          />
        </div>
        
        <FormField
          label="Intensity"
          name="intensity"
          type="select"
          value={exercise.intensity}
          onChange={handleInputChange}
          options={intensityOptions}
        />
        
        {estimatedCalories > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-gradient-to-r from-success/10 to-emerald-100 rounded-lg"
          >
            <div className="flex items-center space-x-2">
              <ApperIcon name="Flame" size={20} className="text-success" />
              <div>
                <p className="text-sm text-gray-600">Estimated Calories Burned</p>
                <p className="text-2xl font-bold text-gray-900">{estimatedCalories}</p>
              </div>
            </div>
          </motion.div>
        )}
        
        <Button
          onClick={handleLogExercise}
          loading={loading}
          disabled={!exercise.activity || !exercise.duration}
          className="w-full"
          icon="Plus"
        >
          Log Exercise
        </Button>
      </div>
    </Card>
  )
}

export default ExerciseLogger