import { CategoryInfo, ProductCategory } from '../../../types'

interface CategoryFilterProps {
  categories: CategoryInfo[]
  selectedCategory: ProductCategory | 'all'
  onSelectCategory: (category: ProductCategory | 'all') => void
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <div
      className="flex gap-2 p-2 overflow-x-auto"
      style={{
        backgroundColor: 'var(--pos-bg-secondary)',
        borderRadius: '16px',
        border: '1px solid var(--pos-border)',
      }}
    >
      <button
        onClick={() => onSelectCategory('all')}
        className="flex align-items-center gap-2 px-4 py-2 border-none cursor-pointer transition-all transition-duration-200"
        style={{
          backgroundColor:
            selectedCategory === 'all' ? 'var(--pos-accent)' : 'var(--pos-bg-tertiary)',
          color: selectedCategory === 'all' ? 'white' : 'var(--pos-text-primary)',
          borderRadius: '10px',
          fontWeight: 600,
          whiteSpace: 'nowrap',
          minWidth: 'fit-content',
        }}
      >
        <i className="pi pi-th-large"></i>
        <span>Todos</span>
      </button>

      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          className="flex align-items-center gap-2 px-4 py-2 border-none cursor-pointer transition-all transition-duration-200"
          style={{
            backgroundColor:
              selectedCategory === category.id ? category.color : 'var(--pos-bg-tertiary)',
            color: selectedCategory === category.id ? 'white' : 'var(--pos-text-primary)',
            borderRadius: '10px',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            minWidth: 'fit-content',
          }}
        >
          <i className={category.icon}></i>
          <span>{category.name}</span>
        </button>
      ))}
    </div>
  )
}
