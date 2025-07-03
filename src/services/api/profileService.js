const PROFILE_KEY = 'caltrack_profile'

export const profileService = {
  async getProfile() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const stored = localStorage.getItem(PROFILE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
    
// Return default profile
    return {
      age: 25,
      gender: 'male',
      height: 175,
      currentWeight: 70,
      targetWeight: 65,
      activityLevel: 'moderately_active',
      goal: 'weight_loss',
      dailyCalorieGoal: 1800,
      notifications: {
        goalReminders: true,
        progressUpdates: false,
        dailyReminders: true,
        weeklyReports: true,
        achievementNotifications: true,
        mealReminders: false
      }
    }
  },
  
  async updateProfile(profileData) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400))
    
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profileData))
    return profileData
  }
}