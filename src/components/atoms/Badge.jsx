import ApperIcon from '@/components/ApperIcon'

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'md',
  icon,
  className = '' 
}) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    error: 'bg-error/10 text-error',
    info: 'bg-info/10 text-info'
  }
  
  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  }
  
  const badgeClasses = `inline-flex items-center rounded-full font-medium ${variants[variant]} ${sizes[size]} ${className}`
  
  return (
    <span className={badgeClasses}>
      {icon && <ApperIcon name={icon} size={size === 'sm' ? 12 : 14} className="mr-1" />}
      {children}
    </span>
  )
}

export default Badge