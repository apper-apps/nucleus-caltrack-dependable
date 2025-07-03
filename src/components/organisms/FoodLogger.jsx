import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import SearchBar from '@/components/molecules/SearchBar'
import Button from '@/components/atoms/Button'
import FormField from '@/components/molecules/FormField'
import Card from '@/components/atoms/Card'
import ApperIcon from '@/components/ApperIcon'
import { foodService } from '@/services/api/foodService'

const FoodLogger = ({ onFoodLogged }) => {
  const [searchResults, setSearchResults] = useState([])
  const [selectedFood, setSelectedFood] = useState(null)
  const [servingSize, setServingSize] = useState(1)
  const [meal, setMeal] = useState('breakfast')
  const [loading, setLoading] = useState(false)
  const [searching, setSearching] = useState(false)
  
  const mealOptions = [
    { value: 'breakfast', label: 'Breakfast' },
    { value: 'lunch', label: 'Lunch' },
    { value: 'dinner', label: 'Dinner' },
    { value: 'snack', label: 'Snack' }
  ]
  
  const handleSearch = async (query) => {
    if (query.length < 2) {
      setSearchResults([])
      return
    }
    
    setSearching(true)
    try {
      const results = await foodService.searchFood(query)
      setSearchResults(results)
    } catch (error) {
      toast.error('Failed to search foods')
    } finally {
      setSearching(false)
    }
  }
  
  const handleFoodSelect = (food) => {
    setSelectedFood(food)
    setSearchResults([])
  }
  
  const handleLogFood = async () => {
    if (!selectedFood) return
    
    setLoading(true)
    try {
      const foodEntry = {
        foodName: selectedFood.name,
        calories: Math.round(selectedFood.calories * servingSize),
        protein: Math.round(selectedFood.protein * servingSize),
        carbs: Math.round(selectedFood.carbs * servingSize),
        fat: Math.round(selectedFood.fat * servingSize),
        servingSize: `${servingSize} ${selectedFood.serving}`,
        meal: meal,
        date: new Date().toISOString()
      }
      
      await foodService.logFood(foodEntry)
      toast.success('Food logged successfully!')
      
      // Reset form
      setSelectedFood(null)
      setServingSize(1)
      setMeal('breakfast')
      
      if (onFoodLogged) {
        onFoodLogged(foodEntry)
      }
    } catch (error) {
      toast.error('Failed to log food')
    } finally {
      setLoading(false)
    }
  }
  
  const calculatedNutrition = selectedFood ? {
    calories: Math.round(selectedFood.calories * servingSize),
    protein: Math.round(selectedFood.protein * servingSize),
    carbs: Math.round(selectedFood.carbs * servingSize),
    fat: Math.round(selectedFood.fat * servingSize)
  } : null
  
  return (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Search Foods</h3>
        <SearchBar
          placeholder="Search for foods..."
          onSearch={handleSearch}
          suggestions={searchResults}
          loading={searching}
        />
        
        {searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 space-y-2"
          >
            {searchResults.map((food, index) => (
              <button
                key={index}
                onClick={() => handleFoodSelect(food)}
                className="w-full p-3 text-left rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{food.name}</p>
                    <p className="text-sm text-gray-600">{food.calories} cal per {food.serving}</p>
                  </div>
                  <ApperIcon name="Plus" size={16} className="text-gray-400" />
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </Card>
      
      {selectedFood && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Log Food</h3>
              <button
                onClick={() => setSelectedFood(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ApperIcon name="X" size={18} className="text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">{selectedFood.name}</h4>
                <p className="text-sm text-gray-600">
                  {selectedFood.calories} cal per {selectedFood.serving}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Serving Size"
                  type="number"
                  value={servingSize}
                  onChange={(e) => setServingSize(Number(e.target.value))}
                  min="0.1"
                  step="0.1"
                />
                <FormField
                  label="Meal"
                  type="select"
                  value={meal}
                  onChange={(e) => setMeal(e.target.value)}
                  options={mealOptions}
                />
              </div>
              
              {calculatedNutrition && (
                <div className="p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg">
                  <h5 className="font-medium text-gray-900 mb-2">Nutrition Info</h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Calories</p>
                      <p className="font-semibold">{calculatedNutrition.calories}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Protein</p>
                      <p className="font-semibold">{calculatedNutrition.protein}g</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Carbs</p>
                      <p className="font-semibold">{calculatedNutrition.carbs}g</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Fat</p>
                      <p className="font-semibold">{calculatedNutrition.fat}g</p>
                    </div>
                  </div>
                </div>
              )}
              
              <Button
                onClick={handleLogFood}
                loading={loading}
                disabled={!selectedFood}
                className="w-full"
                icon="Plus"
              >
                Log Food
              </Button>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  )
}

export default FoodLogger