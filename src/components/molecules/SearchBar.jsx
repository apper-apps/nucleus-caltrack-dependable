import { useState } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Input from '@/components/atoms/Input'

const SearchBar = ({ 
  placeholder = "Search...", 
  onSearch, 
  suggestions = [],
  loading = false,
  className = '' 
}) => {
  const [query, setQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  
  const handleSearch = (value) => {
    setQuery(value)
    if (onSearch) {
      onSearch(value)
    }
    setShowSuggestions(value.length > 0 && suggestions.length > 0)
  }
  
  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.name)
    setShowSuggestions(false)
    if (onSearch) {
      onSearch(suggestion.name)
    }
  }
  
  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setShowSuggestions(query.length > 0 && suggestions.length > 0)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          icon="Search"
          className="pr-10"
        />
        {loading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <ApperIcon name="Loader2" size={18} className="text-gray-400 animate-spin" />
          </div>
        )}
      </div>
      
      {showSuggestions && suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-premium border border-gray-200 max-h-64 overflow-y-auto z-50"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{suggestion.name}</p>
                  <p className="text-sm text-gray-500">{suggestion.calories} cal per {suggestion.serving}</p>
                </div>
                <ApperIcon name="Plus" size={16} className="text-gray-400" />
              </div>
            </button>
          ))}
        </motion.div>
      )}
    </div>
  )
}

export default SearchBar