'use client';

import React, { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';
import { Complex } from '../model/types';
import { getStatusInfo, formatPrice } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/Button/Button';

import { Developer, DeveloperCard } from '@/entities/Developer';
import { useDeveloperStore } from '@/entities/Developer/model/store';
import { AMENITY_LABELS } from '@/shared/lib/amenities';
import { ModelPreViewer } from '@/entities/Model-viewer/components/ModelPreViewer';
import { useRouter } from 'next/navigation';

interface ComplexCardProps {
  complex: Complex;
  isAllowedToLoad: boolean;
  setLoadingCount: (fn: (prev: number) => number) => void;
  onLoadComplete: () => void;
  activeModelIndex: number | null;
  setActiveModelIndex: (index: number | null) => void;
  index: number;
}

export function ComplexCard({
  complex,
  setLoadingCount,
  onLoadComplete,
  activeModelIndex,
  setActiveModelIndex,
  index,
}: ComplexCardProps) {
  const {
    id,
    name,
    developerId,
    uri,
    image,
    squareMin,
    squareMax,
    price,
    floors,
    status,
    address,
    amenities,
  } = complex;
  const router = useRouter()
  const statusInfo = getStatusInfo(status);
  const [developer, setDeveloper] = useState<Developer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { getDeveloperById } = useDeveloperStore();

  const visibleAmenities = Object.entries(amenities[0])
    .filter(([key, value]) => value === 1 && key in AMENITY_LABELS)
    .map(([key]) => AMENITY_LABELS[key]);

  useEffect(() => {
    let isMounted = true;

    if (!developerId) {
      setIsLoading(false);
      return;
    }

    (async () => {
      try {
        const response = await getDeveloperById(developerId);

        if (isMounted && response === 'success') {
          const loadedDeveloper = useDeveloperStore.getState().currentDeveloper;
          setDeveloper(loadedDeveloper);
        }
      } catch (e) {
        console.error('Ошибка получения застройщика:', e);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };

  }, [developerId, getDeveloperById, image]);

  return (
    <div className="complex-card group bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700">
      <div className="relative h-100 overflow-hidden">
        <ModelPreViewer
          modelUrl={uri}
          imageUrl={image}
          setLoadingCount={setLoadingCount}
          onLoadComplete={onLoadComplete}
          activeModelIndex={activeModelIndex}
          setActiveModelIndex={setActiveModelIndex}
          index={index}
        />
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
            {statusInfo.text}
          </span>
        </div>
        {/* <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" /> */}
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {name}
        </h3>

        <div className="flex items-center text-gray-600 dark:text-gray-400 mb-3 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
          <span className="text-sm">{address}</span>
        </div>

        <h3 className="mb-2">Застройщик:</h3>
        {!isLoading && developer && <DeveloperCard developer={developer} />}

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Площадь:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {squareMin}-{squareMax} м²
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Этажность:</span>
            <span className="font-medium text-gray-900 dark:text-white">{floors} этажей</span>
          </div>
        </div>

        <div className="mb-4">
          <div className="text-xl font-bold text-green-600 dark:text-green-400">
            от {formatPrice(price)} сум
          </div>
        </div>

        <div className="mb-4">
          <div className="flex flex-wrap gap-1 min-h-[24px]">
            {visibleAmenities.slice(0, 4).map((amenity, index) => (
              <span
                key={index}
                className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded"
              >
                {amenity}
              </span>
            ))}
            {visibleAmenities.length > 3 && (
              <span className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded">
                +{visibleAmenities.length - 3}
              </span>
            )}
          </div>
        </div>
        <Button className="w-full" onClick={() => {
          console.log('Клик!');
          if (activeModelIndex !== null) {
            setActiveModelIndex(null);
            setTimeout(() => {
              router.push(`/complexes/${id}`);
            }, 150);
          } else {
            router.push(`/complexes/${id}`);
          }

        }}>Подробнее</Button>
      </div>
    </div>
  );
}
