import { foodService } from './foodService'
import { exerciseService } from './exerciseService'

export const progressService = {
  async getProgressData(period = '7d') {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 90
    const dates = Array.from({ length: days }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return date.toISOString().split('T')[0]
    }).reverse()
    
    // Generate mock weight data with slight variations
    const weightData = dates.map((date, index) => ({
      date,
      weight: 70 - (index * 0.1) + (Math.random() * 0.3 - 0.15) // Gradual decrease with some variation
    }))
    
    // Generate calorie data from actual entries where available
    const calorieData = await Promise.all(
      dates.map(async (date) => {
        try {
          const foodEntries = await foodService.getFoodEntriesByDate(date)
          const exerciseEntries = await exerciseService.getExerciseEntriesByDate(date)
          
          const consumed = foodEntries.reduce((total, entry) => total + entry.calories, 0)
          const burned = exerciseEntries.reduce((total, entry) => total + entry.caloriesBurned, 0)
          
          return {
            date,
            consumed: consumed || Math.floor(Math.random() * 500 + 1500), // Mock if no data
            burned: burned || Math.floor(Math.random() * 300 + 200) // Mock if no data
          }
        } catch (error) {
          // Return mock data if service fails
          return {
            date,
            consumed: Math.floor(Math.random() * 500 + 1500),
            burned: Math.floor(Math.random() * 300 + 200)
          }
        }
      })
    )
    
    return {
      weightData,
      calorieData
    }
  },
  
  async getProgressStats() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return {
      weightLoss: 2.5,
      weightLossRate: 0.3,
      avgCalories: 1850,
      workoutStreak: 5,
      goalProgress: 75
    }
  }
}