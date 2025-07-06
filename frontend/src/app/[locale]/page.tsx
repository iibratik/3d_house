'use client';

import React, { useEffect, useState } from 'react';
import { FilterBar } from '@/features/ComplexFilters';
import { ComplexCard } from '@/entities/Complex';
import { Button } from '@/shared/ui/Button/Button';
// import { ComplexFilters } from '@/entities/Complex/model/types';
import { Footer } from '@/widgets/Footer/ui/Footer';
import { useComplexStore } from '@/entities/Complex/model/store';

export default function HomePage() {
  const { fetchAllComplexes, isLoading, error, getFilterValues, getFiltered } = useComplexStore();
  const complexes = useComplexStore.getState().complexes
  const currentFilters = useComplexStore.getState().currentFilters

  const [loadingCount, setLoadingCount] = useState(0);
  const [loaded, setLoaded] = useState<boolean[]>([]);
  const [activeModelIndex, setActiveModelIndex] = useState<number | null>(null);


  useEffect(() => {
    async function getComplexes() {
      await fetchAllComplexes();

      getFilterValues()
    }
    getComplexes()
  }, [fetchAllComplexes, getFilterValues]);

  useEffect(() => {
    setLoaded(Array(complexes.length).fill(false));
  }, [complexes]);


  const handleLoaded = (index: number) => {
    setLoaded((prev) => {
      const copy = [...prev];
      copy[index] = true;
      return copy;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <FilterBar
        filters={currentFilters}
        onFiltersChange={async (newFilters) => {
          useComplexStore.setState({ currentFilters: newFilters })
          getFiltered()
        }}
        labels={['Цена', 'Город', 'Площадь', 'Статус']}
      />
      <section
        className="uzbek-pattern bg-gradient-to-br h-screen from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 py-16"
        style={{
          backgroundSize: `cover`,
          backgroundImage: `linear-gradient(#3B82F6B3, #0F5729A6), url('https://images.unsplash.com/photo-1466442929976-97f336a657be?w=1920&h=1080&fit=crop')`,
        }}
      >
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

            {!isLoading && !error &&
              complexes.map((complex, index) => (
                <div key={complex.id} className="animate-fade-in">
                  <ComplexCard
                    complex={complex}
                    isAllowedToLoad={loadingCount < 3 && !loaded[index]}
                    setLoadingCount={setLoadingCount}
                    onLoadComplete={() => handleLoaded(index)}
                    activeModelIndex={activeModelIndex}
                    setActiveModelIndex={setActiveModelIndex}
                    index={index}
                  />
                </div>
              ))}
          </div>

          <div className="text-center">
            <Button onClick={fetchAllComplexes} variant="primary" className="px-8 py-3">
              Показать еще объекты
            </Button>
          </div>
        </div>
      </section>

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
              <p className="text-gray-600 dark:text-gray-400">
                Работаем только с надежными компанями с хорошей репутацией
              </p>
            </div>

            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl">🏠</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Лучшие локации</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Жилые комплексы в развитых районах с хорошей инфраструктурой
              </p>
            </div>

            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl">💼</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Поддержка 24/7</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Наши эксперты всегда готовы помочь с выбором недвижимости
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}