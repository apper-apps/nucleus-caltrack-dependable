import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Chart from 'react-apexcharts'
import Card from '@/components/atoms/Card'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { progressService } from '@/services/api/progressService'

const ProgressCharts = () => {
  const [chartData, setChartData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedPeriod, setSelectedPeriod] = useState('7d')
  
  const periodOptions = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' }
  ]
  
  useEffect(() => {
    loadChartData()
  }, [selectedPeriod])
  
  const loadChartData = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await progressService.getProgressData(selectedPeriod)
      setChartData(data)
    } catch (err) {
      setError('Failed to load progress data')
    } finally {
      setLoading(false)
    }
  }
  
  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadChartData} />
  if (!chartData) return null
  
  const weightChartOptions = {
    chart: {
      type: 'line',
      height: 300,
      toolbar: { show: false },
      foreColor: '#6B7280'
    },
    series: [{
      name: 'Weight',
      data: chartData.weightData.map(item => ({
        x: new Date(item.date).getTime(),
        y: item.weight
      }))
    }],
    xaxis: {
      type: 'datetime',
      labels: {
        format: 'MMM dd'
      }
    },
    yaxis: {
      title: {
        text: 'Weight (kg)'
      }
    },
    stroke: {
      curve: 'smooth',
      width: 3,
      colors: ['#4F46E5']
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        colorStops: [
          { offset: 0, color: '#4F46E5', opacity: 0.3 },
          { offset: 100, color: '#4F46E5', opacity: 0.1 }
        ]
      }
    },
    grid: {
      borderColor: '#E5E7EB',
      strokeDashArray: 5
    }
  }
  
  const calorieChartOptions = {
    chart: {
      type: 'bar',
      height: 300,
      toolbar: { show: false },
      foreColor: '#6B7280'
    },
    series: [
      {
        name: 'Consumed',
        data: chartData.calorieData.map(item => item.consumed)
      },
      {
        name: 'Burned',
        data: chartData.calorieData.map(item => item.burned)
      }
    ],
    xaxis: {
      categories: chartData.calorieData.map(item => 
        new Date(item.date).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        })
      )
    },
    yaxis: {
      title: {
        text: 'Calories'
      }
    },
    colors: ['#10B981', '#EF4444'],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded'
      }
    },
    grid: {
      borderColor: '#E5E7EB',
      strokeDashArray: 5
    }
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Progress Charts</h2>
        <div className="flex space-x-2">
          {periodOptions.map(option => (
            <button
              key={option.value}
              onClick={() => setSelectedPeriod(option.value)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                selectedPeriod === option.value
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Weight Progress</h3>
            <Chart
              options={weightChartOptions}
              series={weightChartOptions.series}
              type="line"
              height={300}
            />
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Calorie Balance</h3>
            <Chart
              options={calorieChartOptions}
              series={calorieChartOptions.series}
              type="bar"
              height={300}
            />
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default ProgressCharts