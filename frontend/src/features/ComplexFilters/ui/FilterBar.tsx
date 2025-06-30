import React from 'react';
import { ChevronDown } from 'lucide-react'; // если используете иконки
import { ComplexFilters, } from '@/shared/types/complex';



type FilterBarProps = {
  filters: ComplexFilters;
  onFiltersChange: (filters: ComplexFilters) => void;
};

export function FilterBar({ filters, onFiltersChange }: FilterBarProps) {
  const handleFilterChange = (key: keyof ComplexFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined,
    });
  };

  const resetFilters = () => {
    // onFiltersChange({});
  };

  return (
    <div className="bg-white fixed left-0 w-full z-100 dark:bg-gray-800 shadow-sm border-b border-gray-100 dark:border-gray-700 py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Город */}
          <div className="relative">
            {/* <select
              value={filters.cityValue || ''}
              onChange={(e) => handleFilterChange('cityValue', e.target.value)}
              className="appearance-none bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[120px]"
            >
              {filters.cityRange.map((range, index) => {
                return (
                  <option value={range.value} key={index}>{range.label}</option>
                )
              })}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4 pointer-events-none" /> */}
          </div>

          {/* Цена */}
          <div className="relative">
            <select
              value={filters.priceRangeValue || ''}
              onChange={(e) => handleFilterChange('priceRangeValue', e.target.value)}
              className="appearance-none bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[140px]"
            >
              <option value="">Цена</option>
              <option value="0-500">до 500 млн</option>
              <option value="500-1000">500-1000 млн</option>
              <option value="1000-1500">1-1.5 млрд</option>
              <option value="1500+">свыше 1.5 млрд</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4 pointer-events-none" />
          </div>

          {/* Площадь */}
          <div className="relative">
            <select
              value={filters.areaRangeValue || ''}
              onChange={(e) => handleFilterChange('areaRange', e.target.value)}
              className="appearance-none bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[120px]"
            >
              <option value="">Площадь</option>
              <option value="30-50">30-50 м²</option>
              <option value="50-80">50-80 м²</option>
              <option value="80-120">80-120 м²</option>
              <option value="120+">свыше 120 м²</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4 pointer-events-none" />
          </div>

          {/* Комнаты */}
          <div className="relative">
            <select
              value={filters.roomsValue || ''}
              onChange={(e) => handleFilterChange('roomsValue', e.target.value)}
              className="appearance-none bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[120px]"
            >
              <option value="">Комнаты</option>
              <option value="1">1 комната</option>
              <option value="2">2 комнаты</option>
              <option value="3">3 комнаты</option>
              <option value="4+">4+ комнат</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4 pointer-events-none" />
          </div>

          {/* Статус */}
          <div className="relative">
            <select
              value={filters.statusValue || ''}
              onChange={(e) => handleFilterChange('statusValue', e.target.value)}
              className="appearance-none bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[140px]"
            >
              <option value="">Статус</option>
              <option value="ready">Сдан</option>
              <option value="construction">Строится</option>
              <option value="planned">Планируется</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4 pointer-events-none" />
          </div>

          {/* Сброс */}
          <button
            onClick={resetFilters}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors ml-auto"
          >
            Сбросить
          </button>
        </div>
      </div>
    </div>
  );
}
