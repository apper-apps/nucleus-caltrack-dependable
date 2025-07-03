import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import FormField from '@/components/molecules/FormField'
import StatCard from '@/components/molecules/StatCard'
import ThemeToggle from '@/components/molecules/ThemeToggle'
import ApperIcon from '@/components/ApperIcon'
import { profileService } from '@/services/api/profileService'
const Profile = () => {
  const [profile, setProfile] = useState({
    age: '',
    gender: '',
    height: '',
    currentWeight: '',
    targetWeight: '',
    activityLevel: '',
    goal: '',
    dailyCalorieGoal: ''
  })
  const [loading, setLoading] = useState(false)
  const [calculations, setCalculations] = useState(null)
  
  useEffect(() => {
    loadProfile()
  }, [])
  
  useEffect(() => {
    if (profile.age && profile.gender && profile.height && profile.currentWeight && profile.activityLevel) {
      calculateMetrics()
    }
  }, [profile.age, profile.gender, profile.height, profile.currentWeight, profile.activityLevel, profile.goal])
  
  const loadProfile = async () => {
    try {
      const data = await profileService.getProfile()
      setProfile(data)
    } catch (error) {
      console.error('Failed to load profile:', error)
    }
  }
  
  const calculateMetrics = () => {
    const age = parseInt(profile.age)
    const weight = parseFloat(profile.currentWeight)
    const height = parseFloat(profile.height)
    const isMale = profile.gender === 'male'
    
    if (!age || !weight || !height) return
    
    // BMR calculation using Mifflin-St Jeor equation
    let bmr
    if (isMale) {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161
    }
    
    // Activity level multipliers
    const activityMultipliers = {
      sedentary: 1.2,
      lightly_active: 1.375,
      moderately_active: 1.55,
      very_active: 1.725,
      extremely_active: 1.9
    }
    
    const tdee = bmr * (activityMultipliers[profile.activityLevel] || 1.2)
    
    // Goal-based calorie adjustment
    let recommendedCalories = tdee
    if (profile.goal === 'weight_loss') {
      recommendedCalories = tdee - 500 // 500 calorie deficit
    } else if (profile.goal === 'weight_gain') {
      recommendedCalories = tdee + 500 // 500 calorie surplus
    }
    
    // BMI calculation
    const bmi = weight / ((height / 100) ** 2)
    
    setCalculations({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      recommendedCalories: Math.round(recommendedCalories),
      bmi: Math.round(bmi * 10) / 10
    })
  }
  
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfile(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleSave = async () => {
    setLoading(true)
    try {
      const updatedProfile = {
        ...profile,
        dailyCalorieGoal: calculations?.recommendedCalories || profile.dailyCalorieGoal
      }
      await profileService.updateProfile(updatedProfile)
      setProfile(updatedProfile)
      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }
  
  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' }
  ]
  
  const activityOptions = [
    { value: 'sedentary', label: 'Sedentary (Little/no exercise)' },
    { value: 'lightly_active', label: 'Lightly Active (Light exercise 1-3 days/week)' },
    { value: 'moderately_active', label: 'Moderately Active (Moderate exercise 3-5 days/week)' },
    { value: 'very_active', label: 'Very Active (Hard exercise 6-7 days/week)' },
    { value: 'extremely_active', label: 'Extremely Active (Very hard exercise, physical job)' }
  ]
  
  const goalOptions = [
    { value: 'weight_loss', label: 'Weight Loss' },
    { value: 'weight_maintenance', label: 'Weight Maintenance' },
    { value: 'weight_gain', label: 'Weight Gain' }
  ]
  
return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Profile & Settings</h1>
        <p className="text-gray-600 dark:text-gray-300">Manage your personal information and health goals</p>
      </div>
      
      {/* Calculated Metrics */}
      {calculations && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <StatCard
            title="BMR"
            value={calculations.bmr}
            unit="cal/day"
            icon="Activity"
            color="primary"
          />
          <StatCard
            title="TDEE"
            value={calculations.tdee}
            unit="cal/day"
            icon="Zap"
            color="success"
          />
          <StatCard
            title="Recommended Calories"
            value={calculations.recommendedCalories}
            unit="cal/day"
            icon="Target"
            color="warning"
          />
          <StatCard
            title="BMI"
            value={calculations.bmi}
            icon="Scale"
            color="info"
          />
        </motion.div>
      )}
      
      {/* Profile Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Age"
                  name="age"
                  type="number"
                  value={profile.age}
                  onChange={handleInputChange}
                  placeholder="Enter your age"
                  min="1"
                  max="120"
                />
                <FormField
                  label="Gender"
                  name="gender"
                  type="select"
                  value={profile.gender}
                  onChange={handleInputChange}
                  options={genderOptions}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Height (cm)"
                  name="height"
                  type="number"
                  value={profile.height}
                  onChange={handleInputChange}
                  placeholder="Enter height in cm"
                  min="100"
                  max="250"
                />
                <FormField
                  label="Current Weight (kg)"
                  name="currentWeight"
                  type="number"
                  value={profile.currentWeight}
                  onChange={handleInputChange}
                  placeholder="Enter current weight"
                  min="30"
                  max="300"
                  step="0.1"
                />
              </div>
              
              <FormField
                label="Target Weight (kg)"
                name="targetWeight"
                type="number"
                value={profile.targetWeight}
                onChange={handleInputChange}
                placeholder="Enter target weight"
                min="30"
                max="300"
                step="0.1"
              />
            </div>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Goals & Activity</h3>
            <div className="space-y-4">
              <FormField
                label="Activity Level"
                name="activityLevel"
                type="select"
                value={profile.activityLevel}
                onChange={handleInputChange}
                options={activityOptions}
              />
              
              <FormField
                label="Goal"
                name="goal"
                type="select"
                value={profile.goal}
                onChange={handleInputChange}
                options={goalOptions}
              />
              
              <FormField
                label="Daily Calorie Goal"
                name="dailyCalorieGoal"
                type="number"
                value={profile.dailyCalorieGoal || calculations?.recommendedCalories || ''}
                onChange={handleInputChange}
                placeholder="Enter daily calorie goal"
                min="1000"
                max="5000"
              />
              
              {calculations && (
                <div className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <ApperIcon name="Lightbulb" size={16} className="text-primary" />
                    <p className="text-sm font-medium text-gray-900">Recommendation</p>
                  </div>
                  <p className="text-sm text-gray-700">
                    Based on your profile, we recommend {calculations.recommendedCalories} calories per day to achieve your goal.
                  </p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
{/* Settings Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Theme Settings */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Appearance</h3>
            <ThemeToggle />
          </Card>
        </motion.div>

        {/* Additional Settings Placeholder */}
        <motion.div
          initial={{ opacity: 0, x: 0 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Notifications</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Goal reminders</span>
                <div className="w-10 h-6 bg-primary rounded-full relative">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Progress updates</span>
                <div className="w-10 h-6 bg-gray-200 dark:bg-gray-600 rounded-full relative">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="flex items-end"
        >
          <Card className="w-full flex items-center justify-center">
            <Button
              onClick={handleSave}
              loading={loading}
              size="lg"
              icon="Save"
              className="w-full"
            >
              Save Profile
            </Button>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default Profile