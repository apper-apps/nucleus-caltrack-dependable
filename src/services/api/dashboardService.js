import { profileService } from './profileService'
import { foodService } from './foodService'
import { exerciseService } from './exerciseService'

export const dashboardService = {
  async getDashboardData() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    try {
      const profile = await profileService.getProfile()
      const today = new Date().toISOString().split('T')[0]
      
      // Get today's food and exercise entries
      const foodEntries = await foodService.getFoodEntriesByDate(today)
      const exerciseEntries = await exerciseService.getExerciseEntriesByDate(today)
      
      // Calculate daily stats
      const consumed = foodEntries.reduce((total, entry) => total + entry.calories, 0)
      const burned = exerciseEntries.reduce((total, entry) => total + entry.caloriesBurned, 0)
      const goal = profile.dailyCalorieGoal || 2000
      const remaining = Math.max(0, goal - consumed + burned)
      
      // Calculate macros
      const protein = foodEntries.reduce((total, entry) => total + entry.protein, 0)
      const carbs = foodEntries.reduce((total, entry) => total + entry.carbs, 0)
      const fat = foodEntries.reduce((total, entry) => total + entry.fat, 0)
      
      // Calculate BMI
      const bmi = profile.currentWeight && profile.height 
        ? Math.round((profile.currentWeight / ((profile.height / 100) ** 2)) * 10) / 10
        : 0
      
      return {
        stats: {
          consumed,
          burned,
          remaining,
          goal,
          weight: profile.currentWeight || 0,
          bmi,
          protein: Math.round(protein),
          water: 2.1, // Mock data
          weightTrend: 'down',
          weightChange: '0.5kg this week'
        },
        dailyTip: "Remember to drink water before meals - it can help with portion control and hydration!"
      }
    } catch (error) {
      console.error('Dashboard service error:', error)
      throw error
    }
  }
}