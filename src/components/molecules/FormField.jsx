import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'

const FormField = ({ 
  type = 'input', 
  label, 
  name, 
  value, 
  onChange, 
  error, 
  options = [],
  ...props 
}) => {
  const handleChange = (e) => {
    if (onChange) {
      onChange({
        target: {
          name,
          value: e.target.value
        }
      })
    }
  }
  
  if (type === 'select') {
    return (
      <Select
        label={label}
        name={name}
        value={value}
        onChange={handleChange}
        options={options}
        error={error}
        {...props}
      />
    )
  }
  
  return (
    <Input
      label={label}
      name={name}
      value={value}
      onChange={handleChange}
      error={error}
      {...props}
    />
  )
}

export default FormField