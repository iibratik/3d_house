'use client';

import React, { useEffect, useState } from 'react';
import { FilterBar } from '@/features/ComplexFilters';
import { ComplexCard } from '@/entities/Complex';
import { Button } from '@/shared/ui/Button/Button';
import { ComplexFilters } from '@/entities/Complex/model/types';
import { Footer } from '@/widgets/Footer/ui/Footer';
import { useComplexStore } from '@/entities/Complex/model/store';

// const mockProperties: Complex[] = [
//   {
//     id: 1,
//     name: "Жилой комплекс Tashkent City",
//     modelLink: '/3dModels/Building/Building_ktx2.glb',
//     location: {
//       city: "Ташкент",
//       district: "Чиланзарский район"
//     },
//     areaRange: {
//       min: 45,
//       max: 120
//     },
//     price: 450,
//     floors: 25,
//     status: "construction",
//     amenities: ["Парковка", "Охрана", "Детская площадка", "Фитнес-зал"],
//     completionDate: "IV квартал 2025",
//     developer: {
//       id: 1,
//       name: "Fergana Construction Group",
//       logo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop"
//     }
//   },
//   {
//     id: 2,
//     name: "Комплекс Samarkand Gardens",
//     modelLink: '/3dModels/Building1.glb',
//     location: {
//       city: "Самарканд",
//       district: "Центральный район"
//     },
//     areaRange: {
//       min: 55,
//       max: 95
//     },
//     price: 320,
//     floors: 12,
//     status: "ready",
//     amenities: ["Парковка", "Консьерж", "Спортплощадка"],
//     developer: {
//       id: 1,
//       name: "Fergana Construction Group",
//       logo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop"
//     }
//   },
//   {
//     id: 3,
//     name: "Oasis Residence",
//     modelLink: '/3dModels/Building2.glb',
//     location: {
//       city: "Ташкент",
//       district: "Мирзо-Улугбекский район"
//     },
//     areaRange: {
//       min: 60,
//       max: 140
//     },
//     price: 580,
//     floors: 18,
//     status: "construction",
//     amenities: ["Подземная парковка", "Охрана 24/7", "Бассейн", "Сауна", "Детский сад"],
//     completionDate: "II квартал 2026",
//     developer: {
//       id: 1,
//       name: "Fergana Construction Group",
//       logo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop"
//     }
//   },
// ];
export default function HomePage() {
  const { fetchAllComplexes, getFiltered, isLoading, error } = useComplexStore();

  const complexes = getFiltered();
  const [filters, setFilters] = useState<ComplexFilters>(
    {
      cityRange: [
        { label: 'Весь город', value: '' },
        { label: 'Ташкент', value: 'Tashkent' },
        { label: 'Самарканд', value: 'Samarkand' },
        { label: 'Бухара', value: 'Bukhara' },
        { label: 'Нукус', value: 'Nukus' },
        { label: 'Фергана', value: 'Fergana' },
      ],
      priceRange: [
        { label: 'Весь город', value: '' }
      ],
      areaRange: [
        { label: 'Площадь', value: '' },
      ],
      roomRange: [
        { label: 'Весь город', value: '' }
      ],
      statusRange: [
        { label: 'Весь город', value: 'planned' }
      ]
    }
  );


  useEffect(() => {
    fetchAllComplexes();
  }, [fetchAllComplexes,]);
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* <Navigation /> */}
      <FilterBar filters={filters} onFiltersChange={setFilters} />

      {/* Герой секция */}
      <section className="uzbek-pattern bg-gradient-to-br h-screen   from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 py-16" style={{
        backgroundSize: `cover`,
        backgroundImage: `linear-gradient(#3B82F6B3, #0F5729A6), url('https://images.unsplash.com/photo-1466442929976-97f336a657be?w=1920&h=1080&fit=crop')`
      }}>
        <div className="container mx-auto px-4 h-screen text-center flex items-center flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Найдите дом своей мечты
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Лучшие жилые комплексы Узбекистана. Современные планировки, качественная отделка, развитая инфраструктура.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" className="text-lg px-8 py-3">
              Смотреть новостройки
            </Button>
            <Button variant="secondary" className="text-lg px-8 py-3">
              Консультация
            </Button>
          </div>
        </div>
      </section>

      {/* Статистика */}
      {/* <section className="py-12 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">

          </div>
        </div>
      </section> */}

      {/* Каталог */}
      <section className="all-aprtaments-catalog py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Популярные жилые комплексы
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Выберите идеальное жилье из нашего каталога проверенных застройщиков
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {isLoading && (
              <div className="col-span-full text-center text-gray-500 dark:text-gray-300 py-4">
                Загрузка...
              </div>
            )}

            {error && (
              <div className="col-span-full text-center text-red-500 dark:text-red-400 py-4">
                Ошибка: {error}
              </div>
            )}

            {!isLoading && !error && complexes.length === 0 && (
              <div className="col-span-full text-center text-gray-500 py-4">
                Нет данных для отображения.
              </div>
            )}

            {!isLoading && !error && complexes.map((complex) => (
              <div key={complex.id} className="animate-fade-in">
                <ComplexCard
                  complex={complex}
                />
              </div>
            ))}

          </div>

          <div className="text-center">
            <Button onClick={() => {
              fetchAllComplexes()
            }} variant="primary" className="px-8 py-3">
              Показать еще объекты
            </Button>
          </div>
        </div>
      </section>

      {/* Преимущества */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Почему выбирают нас
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl">✓</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Проверенные застройщики</h3>
              <p className="text-gray-600 dark:text-gray-400">Работаем только с надежными компанями с хорошей репутацией</p>
            </div>

            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl">🏠</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Лучшие локации</h3>
              <p className="text-gray-600 dark:text-gray-400">Жилые комплексы в развитых районах с хорошей инфраструктурой</p>
            </div>

            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl">💼</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Поддержка 24/7</h3>
              <p className="text-gray-600 dark:text-gray-400">Наши эксперты всегда готовы помочь с выбором недвижимости</p>
            </div>
          </div>
        </div>
      </section>

      {/* Футер */}
      <Footer />
    </div>
  );
}