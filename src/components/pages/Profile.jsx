import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Switch from 'react-switch'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import FormField from '@/components/molecules/FormField'
import StatCard from '@/components/molecules/StatCard'
import ThemeToggle from '@/components/molecules/ThemeToggle'
import ApperIcon from '@/components/ApperIcon'
import { profileService } from '@/services/api/profileService'
import { notificationService } from '@/services/api/notificationService'
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
  const [notifications, setNotifications] = useState({})
  const [notificationLoading, setNotificationLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
useEffect(() => {
    loadProfile()
    loadNotifications()
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
  
  const loadNotifications = async () => {
    try {
      const data = await notificationService.getNotificationPreferences()
      setNotifications(data)
    } catch (error) {
      console.error('Failed to load notifications:', error)
    }
  }
  
  const handleNotificationToggle = async (key) => {
    const newNotifications = {
      ...notifications,
      [key]: !notifications[key]
    }
    
    setNotificationLoading(true)
    try {
      await notificationService.updateNotificationPreferences(newNotifications)
      setNotifications(newNotifications)
      toast.success('Notification preferences updated!')
    } catch (error) {
      toast.error('Failed to update notification preferences')
    } finally {
      setNotificationLoading(false)
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
  
const NotificationToggle = ({ label, description, checked, onChange, disabled }) => (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1">
        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{label}</div>
        {description && (
          <div className="text-xs text-gray-500 dark:text-gray-400">{description}</div>
        )}
      </div>
      <Switch
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        onColor="#3b82f6"
        offColor="#d1d5db"
        checkedIcon={false}
        uncheckedIcon={false}
        height={20}
        width={40}
        handleDiameter={16}
        className="react-switch"
      />
    </div>
  )

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
      
      {/* Tab Navigation */}
      <div className="flex justify-center">
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'profile'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <ApperIcon name="User" size={16} className="inline mr-2" />
            Profile
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'notifications'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <ApperIcon name="Bell" size={16} className="inline mr-2" />
            Notifications
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'settings'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <ApperIcon name="Settings" size={16} className="inline mr-2" />
            Settings
          </button>
        </div>
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
{/* Profile Tab */}
      {activeTab === 'profile' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Profile Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Personal Information</h3>
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
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Goals & Activity</h3>
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
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Recommendation</p>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Based on your profile, we recommend {calculations.recommendedCalories} calories per day to achieve your goal.
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          </div>
          
          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center"
          >
            <Button
              onClick={handleSave}
              loading={loading}
              size="lg"
              icon="Save"
              className="w-full max-w-md"
            >
              Save Profile
            </Button>
          </motion.div>
        </motion.div>
      )}
      
      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                <ApperIcon name="Bell" size={20} className="inline mr-2" />
                Daily Notifications
              </h3>
              <div className="space-y-2">
                <NotificationToggle
                  label="Goal Reminders"
                  description="Get reminded about your daily calorie and exercise goals"
                  checked={notifications.goalReminders || false}
                  onChange={() => handleNotificationToggle('goalReminders')}
                  disabled={notificationLoading}
                />
                <NotificationToggle
                  label="Daily Check-ins"
                  description="Receive daily reminders to log your meals and workouts"
                  checked={notifications.dailyReminders || false}
                  onChange={() => handleNotificationToggle('dailyReminders')}
                  disabled={notificationLoading}
                />
                <NotificationToggle
                  label="Meal Reminders"
                  description="Get notified when it's time for your next meal"
                  checked={notifications.mealReminders || false}
                  onChange={() => handleNotificationToggle('mealReminders')}
                  disabled={notificationLoading}
                />
              </div>
            </Card>
            
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                <ApperIcon name="TrendingUp" size={20} className="inline mr-2" />
                Progress & Updates
              </h3>
              <div className="space-y-2">
                <NotificationToggle
                  label="Progress Updates"
                  description="Receive updates about your progress towards goals"
                  checked={notifications.progressUpdates || false}
                  onChange={() => handleNotificationToggle('progressUpdates')}
                  disabled={notificationLoading}
                />
                <NotificationToggle
                  label="Weekly Reports"
                  description="Get weekly summary reports of your activity"
                  checked={notifications.weeklyReports || false}
                  onChange={() => handleNotificationToggle('weeklyReports')}
                  disabled={notificationLoading}
                />
                <NotificationToggle
                  label="Achievement Notifications"
                  description="Be notified when you reach milestones and achievements"
                  checked={notifications.achievementNotifications || false}
                  onChange={() => handleNotificationToggle('achievementNotifications')}
                  disabled={notificationLoading}
                />
              </div>
            </Card>
          </div>
        </motion.div>
      )}
      
      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Theme Settings */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                <ApperIcon name="Palette" size={20} className="inline mr-2" />
                Appearance
              </h3>
              <ThemeToggle />
            </Card>
            
            {/* Units Settings */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                <ApperIcon name="Ruler" size={20} className="inline mr-2" />
                Units
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Weight Unit</span>
                  <select className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm">
                    <option>kg</option>
                    <option>lbs</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Height Unit</span>
                  <select className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm">
                    <option>cm</option>
                    <option>ft/in</option>
                  </select>
                </div>
              </div>
            </Card>
            
            {/* Account Settings */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                <ApperIcon name="Shield" size={20} className="inline mr-2" />
                Account
              </h3>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  size="sm"
                  icon="Download"
                  className="w-full"
                  onClick={() => toast.info('Export feature coming soon!')}
                >
                  Export Data
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  icon="RefreshCw"
                  className="w-full"
                  onClick={() => toast.info('Reset feature coming soon!')}
                >
                  Reset Data
                </Button>
              </div>
            </Card>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default Profile