import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import FoodLogger from '@/components/organisms/FoodLogger'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import { foodService } from '@/services/api/foodService'

const FoodLog = () => {
  const [foodEntries, setFoodEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  
  useEffect(() => {
    loadFoodEntries()
  }, [selectedDate])
  
  const loadFoodEntries = async () => {
    try {
      setLoading(true)
      setError(null)
      const entries = await foodService.getFoodEntriesByDate(selectedDate)
      setFoodEntries(entries)
    } catch (err) {
      setError('Failed to load food entries')
    } finally {
      setLoading(false)
    }
  }
  
  const handleFoodLogged = (newEntry) => {
    setFoodEntries(prev => [newEntry, ...prev])
  }
  
  const handleDeleteEntry = async (entryId) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await foodService.deleteEntry(entryId)
        setFoodEntries(prev => prev.filter(entry => entry.Id !== entryId))
      } catch (err) {
        alert('Failed to delete entry')
      }
    }
  }
  
  const getTotalCalories = () => {
    return foodEntries.reduce((total, entry) => total + entry.calories, 0)
  }
  
  const getTotalMacros = () => {
    return foodEntries.reduce((totals, entry) => ({
      protein: totals.protein + entry.protein,
      carbs: totals.carbs + entry.carbs,
      fat: totals.fat + entry.fat
    }), { protein: 0, carbs: 0, fat: 0 })
  }
  
  const groupedEntries = foodEntries.reduce((groups, entry) => {
    const meal = entry.meal || 'other'
    if (!groups[meal]) {
      groups[meal] = []
    }
    groups[meal].push(entry)
    return groups
  }, {})
  
  const mealOrder = ['breakfast', 'lunch', 'dinner', 'snack', 'other']
  const mealIcons = {
    breakfast: 'Coffee',
    lunch: 'Sandwich',
    dinner: 'UtensilsCrossed',
    snack: 'Cookie',
    other: 'MoreHorizontal'
  }
  
  const totals = getTotalMacros()
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Food Log</h1>
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
            <p className="text-2xl font-bold text-primary">{getTotalCalories()}</p>
            <p className="text-sm text-gray-600">Total Calories</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-success">{totals.protein}g</p>
            <p className="text-sm text-gray-600">Protein</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-warning">{totals.carbs}g</p>
            <p className="text-sm text-gray-600">Carbs</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-error">{totals.fat}g</p>
            <p className="text-sm text-gray-600">Fat</p>
          </div>
        </div>
      </Card>
      
      <FoodLogger onFoodLogged={handleFoodLogged} />
      
      {/* Food Entries */}
      <div className="space-y-4">
        {loading ? (
          <Loading />
        ) : error ? (
          <Error message={error} onRetry={loadFoodEntries} />
        ) : foodEntries.length === 0 ? (
          <Empty
            title="No food entries for this date"
            description="Start logging your meals to track your nutrition"
            icon="Apple"
          />
        ) : (
          mealOrder.map(meal => {
            const entries = groupedEntries[meal]
            if (!entries || entries.length === 0) return null
            
            return (
              <motion.div
                key={meal}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <div className="flex items-center space-x-2 mb-4">
                    <ApperIcon name={mealIcons[meal]} size={20} className="text-primary" />
                    <h3 className="text-lg font-semibold text-gray-900 capitalize">{meal}</h3>
                    <Badge variant="primary">
                      {entries.reduce((total, entry) => total + entry.calories, 0)} cal
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    {entries.map((entry, index) => (
                      <div key={entry.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{entry.foodName}</p>
                          <p className="text-sm text-gray-600">{entry.servingSize}</p>
                          <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                            <span>{entry.calories} cal</span>
                            <span>{entry.protein}g protein</span>
                            <span>{entry.carbs}g carbs</span>
                            <span>{entry.fat}g fat</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteEntry(entry.Id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <ApperIcon name="Trash2" size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )
          })
        )}
      </div>
    </motion.div>
  )
}

export default FoodLog