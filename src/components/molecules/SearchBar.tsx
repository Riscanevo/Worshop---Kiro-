import Icon from '../atoms/Icon'
import Input from '../atoms/Input'

export interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  onSearch?: () => void
  className?: string
}

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Buscar...',
  onSearch,
  className = '',
}: SearchBarProps) {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch()
    }
  }

  return (
    <div className={`p-inputgroup ${className}`}>
      <span className="p-inputgroup-addon">
        <Icon name="search" size="small" />
      </span>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onKeyPress={handleKeyPress}
      />
    </div>
  )
}
