import { motion } from 'framer-motion'

const Card = ({ 
  children, 
  className = '', 
  hover = false, 
  gradient = false,
  ...props 
}) => {
  const baseClasses = "premium-card p-6"
  const cardClasses = `${baseClasses} ${gradient ? 'gradient-card' : ''} ${className}`
  
  return (
    <motion.div
      whileHover={hover ? { scale: 1.02, y: -2 } : {}}
      transition={{ duration: 0.2 }}
      className={cardClasses}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default Card