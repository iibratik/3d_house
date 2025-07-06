import React from 'react';
import { ChevronDown } from 'lucide-react'; // если используете иконки
import { ComplexFilters, } from '@/entities/Complex/model/types';



type FilterBarProps = {
  filters: ComplexFilters[]
  onFiltersChange: (filters: ComplexFilters[]) => void
  labels?: string[]
}

export function FilterBar({ filters, onFiltersChange, labels }: FilterBarProps) {
  const handleFilterChange = (idx: number, value: string) => {
    const next = [...filters]
    next[idx] = { ...next[idx], filterValue: value }
    onFiltersChange(next)
  }

  const resetAll = () => {
    onFiltersChange(filters.map(f => ({ ...f, filterValue: '' })))
  }

  return (
    <div className="bg-white fixed left-0 w-full z-50 dark:bg-gray-800 shadow-sm border-b border-gray-100 dark:border-gray-700 py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap gap-4 items-center">
          {filters.map((f, idx) => (
            <div key={idx} className="relative">
              <select
                value={f.filterValue}
                onChange={e => handleFilterChange(idx, e.target.value)}
                className="appearance-none bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[120px]"
              >
                <option value="">{labels?.[idx] ?? 'Все'}</option>
                {f.filterRanges.map((range, index) => {
                  // локализация статусов
                  const label =
                    range === 'construction' ? 'Строится' :
                      range === 'ready' ? 'Сдан' :
                        range === 'planned' ? 'Запланирован' :
                          range;
                  return (
                    <option key={index} value={range}>{label}</option>
                  )
                })}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4 pointer-events-none" />
            </div>
          ))}

          <button
            onClick={resetAll}
            className="text-blue-600 cursor-pointer dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium ml-auto"
          >
            Сбросить
          </button>
        </div>
      </div>
    </div>
  )
}