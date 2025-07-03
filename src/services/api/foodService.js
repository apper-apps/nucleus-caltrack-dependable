import { foodDatabase } from '@/services/mockData/foodDatabase'

const FOOD_ENTRIES_KEY = 'caltrack_food_entries'

export const foodService = {
  async searchFood(query) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return foodDatabase.filter(food => 
      food.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 10)
  },
  
  async logFood(foodEntry) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const entries = this.getStoredEntries()
    const newEntry = {
      ...foodEntry,
      Id: this.getNextId(entries),
      date: new Date().toISOString()
    }
    
    entries.push(newEntry)
    localStorage.setItem(FOOD_ENTRIES_KEY, JSON.stringify(entries))
    return newEntry
  },
  
  async getFoodEntriesByDate(date) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const entries = this.getStoredEntries()
    return entries.filter(entry => entry.date.startsWith(date))
  },
  
  async deleteEntry(entryId) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const entries = this.getStoredEntries()
    const filtered = entries.filter(entry => entry.Id !== entryId)
    localStorage.setItem(FOOD_ENTRIES_KEY, JSON.stringify(filtered))
    return true
  },
  
  getStoredEntries() {
    const stored = localStorage.getItem(FOOD_ENTRIES_KEY)
    return stored ? JSON.parse(stored) : []
  },
  
  getNextId(entries) {
    const maxId = entries.reduce((max, entry) => Math.max(max, entry.Id || 0), 0)
    return maxId + 1
  }
}