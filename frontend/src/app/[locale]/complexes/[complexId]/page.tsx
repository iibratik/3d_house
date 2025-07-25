'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  MapPin,
  Building,
  Users,
  Calendar,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button/Button';
import { formatAddress, formatPrice, getRoomLabel, getVisibleAmenities, } from '@/shared/lib/utils';
import { useComplexStore } from '@/entities/Complex/model/store';
import { useDeveloperStore } from '@/entities/Developer/model/store';
import { Link } from '@/i18n/navigation';
import { Complex } from '@/entities/Complex';
import { Apartament, Block } from '@/entities/Complex/model/types';
import { Developer, DeveloperCard } from '@/entities/Developer';
import { ModelViewer } from '@/entities/Model-viewer';
import { Modal } from '@/shared/ui/Modal/Modal';



export default function ComplexPage() {
  const { getComplexById, getBlockByComplexId, getApartaments } = useComplexStore();
  const { getDeveloperById } = useDeveloperStore();
  const { locale, complexId } = useParams<{ locale: string; complexId: string }>();

  // states
  const [complex, setComplex] = useState<Complex | null>(null);
  const [loadingComplex, setLoadingComplex] = useState<boolean>(true);
  const [loadedBlocks, setLoadedBlocks] = useState<Block[] | null>(null);
  const [loadedApartaments, setLoadedApartaments] = useState<Apartament[]>([]);
  const [loadedDeveloper, setLoadedDeveloper] = useState<Developer | null>(null);
  const [isOpenApartModal, setIsOpenApartModal] = useState(false);
  const [currentApartaments, setCurrentApartaments] = useState<Apartament[]>([]);
  const [selectedApartment, setSelectedApartment] = useState<Apartament | null>(null);
  const [selectedFloorInfo, setSelectedFloorInfo] = useState<{ block: string; floor: string } | null>(null);

  const router = useRouter();
  const visibleAmenities = getVisibleAmenities(complex);



  useEffect(() => {
    window.scrollTo(0, 0);
    async function fetchComplex() {
      setLoadingComplex(true);
      const result = await getComplexById(Number(complexId));

      if (result === 'success') {
        const loadedComplex = useComplexStore.getState().currentComplex
        setComplex(loadedComplex);
      } else {
        setComplex(null);
      }

      if (!loadedBlocks) return;

      loadedBlocks.forEach((block) => {
        fetchApartaments(block.id);
      });

      setLoadingComplex(false);
    };
    async function fetchBlocks() {

      const blockResult = await getBlockByComplexId(Number(complexId))


      if (blockResult === 'success') {
        const updatedBlocks = useComplexStore.getState().currentBlocks
        setLoadedBlocks(updatedBlocks)
      } else {
        setLoadedBlocks(null)
      }
    }
    async function fetchApartaments(blockId: number) {
      if (!blockId) return;

      const result = await getApartaments(blockId);
      if (result === 'success') {
        const updated = useComplexStore.getState().currentApartaments;
        // Просто перезаписываем весь массив
        setLoadedApartaments(updated ?? []);
      } else {
        // На ошибке — сбрасываем в пустой массив
        setLoadedApartaments([]);
      }
    }
    async function fetchDeveloper(developerId: number) {
      if (!developerId) return;

      if (complex) {
        const result = getDeveloperById(complex.developerId)
        if (await result == 'success') {
          const loadedDeveloper = useDeveloperStore.getState().currentDeveloper
          setLoadedDeveloper(loadedDeveloper)
        }
      }
    }
    fetchBlocks()

    fetchComplex();
    if (complex) {
      fetchDeveloper(complex?.developerId);
    }
  }, [getComplexById, complexId, getBlockByComplexId, loadedBlocks, getApartaments, complex, getDeveloperById]);

  if (loadingComplex) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-lg text-gray-500 dark:text-gray-300">
          Загрузка...
        </div>
      </div>
    );
  }
  if (!complexId) {
    console.error('complexId отсутствует в useParams!');
    return <div>Ошибка: отсутствует ID комплекса</div>;
  }
  if (!complex) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Жилой комплекс не найден</h1>
          <Link href={'/'} locale={locale}>
            <Button>
              Вернуться на главную
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className=" bg-gray-50 dark:bg-gray-900">
      {/* Hero Banner */}
      <section
        className="flex flex-col items-end gap-3 pt-3"

      >
        <div className="container mx-auto px-5">
          <Button
            variant="secondary"
            onClick={() => router.back()}
            className="flex items-center lg:gap-2 gap-3 lg:"
          >
            <ArrowLeft className="w-4 h-4" />
            Назад
          </Button>
        </div>
        <div className="container mx-auto px-4 lg:pb-16 pb-0 flex-col  text-white relative ">
          <div className="lg:h-[85vh] h-[40vh] model-content relative overflow-hidden rounded-2xl ">
            <ModelViewer
              modelUrl="/3dModels/Building/Building.glb"
              className="h-full"
              onFloorChange={(info) => {
                if (info) {
                  const blk = loadedBlocks?.find(b => b.name === info.block);
                  if (!blk) {
                    console.warn(`Блок "${info.block}" не найден среди loadedBlocks`);
                    setSelectedFloorInfo(info);
                    setCurrentApartaments([]);
                    return;
                  }

                  const floorNum = Number(info.floor);
                  const filtered = loadedApartaments.filter(
                    apt => apt.blockId === blk.id && apt.floor === floorNum
                  );

                  setSelectedFloorInfo(info);
                  setCurrentApartaments(filtered);
                } else {
                  setSelectedFloorInfo(null);
                  setCurrentApartaments([]);
                }
              }}

            />
            {selectedFloorInfo && (
              <div className="complex-info absolute top-0 right-0 lg:w-[40%] md:w-[30%]  bg-primary-dark p-5">
                <h3 className="mb-4 font-semibold text-white">
                  {currentApartaments.length > 0
                    ? 'Доступные квартиры на этаже:'
                    : 'На этом этаже нет доступных квартир'}
                </h3>

                {/* Показываем список только если есть хотя бы одна квартира */}
                {currentApartaments.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {currentApartaments.map((apt) => (
                      <div key={apt.id}>
                        <div
                          className={`border rounded-lg p-4  ${apt.floor
                            ? 'border-green-200 cursor-pointer bg-green-50 dark:bg-green-900/20 dark:border-green-800'
                            : 'border-gray-200 bg-gray-50 dark:bg-gray-700 dark:border-gray-600'
                            }`}
                          onClick={() => {
                            setIsOpenApartModal(true);
                            setSelectedApartment(apt);
                          }}
                        >
                          <div className="flex justify-between mb-2">
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {apt.typeId}-комн.
                            </h4>
                            <span className="text-xs px-2 py-1 rounded bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200">
                              Этаж {apt.floor}
                            </span>
                          </div>
                          {/* <div className="text-sm text-gray-600 dark:text-gray-400">
                            Цена: {formatPrice(apt.price)} сум
                          </div> */}
                        </div>

                        {/* Модалка открывается только для выбранной квартиры */}
                        {selectedApartment?.id === apt.id && isOpenApartModal && (
                          <Modal isOpen onClose={() => setIsOpenApartModal(false)}>
                            <h2 className="text-xl font-bold mb-4">
                              {apt.typeId}-комн. квартира, этаж {apt.floor}
                            </h2>
                            {/* Здесь ваш iframe или любой другой контент */}
                            <Button onClick={() => setIsOpenApartModal(false)}>
                              Закрыть
                            </Button>
                          </Modal>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}


          </div>

          <h1 className="text-4xl lg:text-left text-center md:text-5xl font-bold mt-4 mb-4">
            {complex.name}
          </h1>
          <div className="flex items-center mb-4 lg:flex-row flex-col">
            <MapPin className="w-5 h-5 mr-2" />
            <span className="text-lg lg:text-left text-center">
              {complex.address},
            </span>
          </div>
          <div className="text-2xl lg:text-left text-center font-bold text-green-400">
            от {complex.price ? formatPrice(complex.price) : ''} сум
          </div>
        </div>
      </section>

      {/* Complex Info */}
      <section className="lg:py-16 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                  О комплексе
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {complex.description}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Building className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <div className="font-semibold text-sm text-gray-900 dark:text-white">
                      {complex.floors}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      этажей
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Users className="w-8 h-8 mx-auto mb-2 text-green-600" />
                    <div className="font-semibold text-sm text-gray-900 dark:text-white">
                      {complex.squareMin}–{complex.squareMax}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      м²
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <MapPin className="w-8 h-8 mx-auto mb-2 text-red-600" />
                    <div className="font-semibold text-[12px] text-gray-900 dark:text-white">
                      {complex.address ? formatAddress(complex.address, 'district') : ''}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      район
                    </div>
                  </div>
                  {complex.date && (
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <Calendar className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {complex.date}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        сдача
                      </div>
                    </div>
                  )}
                </div>

                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Удобства
                </h3>
                {visibleAmenities.length > 0 && (
                  <div className='flex gap-3'>
                    {visibleAmenities.slice(0, 4).map((amenity, index) => (
                      <span
                        key={index}
                        className="inline-block bg-gray-100 dark:bg-blue-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded"
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
                )}
              </div>

              {/* Blocks and Apartments */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                  Доступные квартиры
                </h2>
                {loadedBlocks?.map((block) => {
                  // Квартиры, относящиеся к текущему блоку
                  const blockApartaments = loadedApartaments.filter(
                    (apt) => apt.blockId === block.id
                  );

                  // Подсчёт количества квартир по typeId
                  const typeGroups = new Map<number, Apartament[]>();
                  blockApartaments.forEach((apt) => {
                    if (!typeGroups.has(apt.typeId)) {
                      typeGroups.set(apt.typeId, []);
                    }
                    typeGroups.get(apt.typeId)!.push(apt);
                  });

                  return (
                    <div key={block.id} className="mb-8 last:mb-0">
                      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                        Блок {block.name}
                      </h3>

                      {blockApartaments.length === 0 ? (
                        <div className="text-gray-500 dark:text-gray-400 italic">
                          В этом блоке нет квартир
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                          {Array.from(typeGroups.entries()).map(([typeId, apts]) => {
                            const apt = apts[0]; // первая квартира с таким типом
                            const count = apts.length;
                            return (
                              <div key={typeId}>
                                <div
                                  className={`border rounded-lg p-4 ${apt.floor
                                    ? 'border-green-200 cursor-pointer   bg-green-50 dark:bg-green-900/20 dark:border-green-800'
                                    : 'border-gray-200 bg-gray-50 dark:bg-gray-700 dark:border-gray-600'
                                    }`}
                                  onClick={() => {
                                    console.log(apt);

                                    setIsOpenApartModal(true);
                                    setSelectedApartment(apt);
                                  }}
                                >
                                  <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-semibold text-gray-900 dark:text-white">
                                      {getRoomLabel(typeId)}
                                    </h4>
                                  </div>

                                  <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">

                                    <div className="text-xs mt-2 text-gray-500 dark:text-gray-400">
                                      Всего {getRoomLabel(typeId)} в блоке: {count}
                                    </div>
                                  </div>
                                </div>

                                {selectedApartment?.typeId === typeId && isOpenApartModal && (
                                  <Modal isOpen={isOpenApartModal} onClose={() => setIsOpenApartModal(false)}>
                                    <h2 className="text-xl font-bold mb-4">
                                      {typeId} - комнатная квартира
                                    </h2>
                                    <div className="apart-model w-[70vw] h-[60vh]">
                                      <iframe
                                        frameBorder="0"
                                        allowFullScreen
                                        width="100%"
                                        height="100%"
                                        src={apt.model ?? ''}
                                      />
                                    </div>
                                    <div className="flex justify-end gap-3">
                                      <Button
                                        className="px-4 my-2 py-2 bg-blue-600 rounded"
                                        onClick={() => setIsOpenApartModal(false)}
                                      >
                                        Закрыть
                                      </Button>
                                    </div>
                                  </Modal>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}

              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Developer Card */}
              {loadedDeveloper && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                    Застройщик
                  </h3>
                  <DeveloperCard developer={loadedDeveloper} />
                </div>
              )}

              {/* Contact Form */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                  Связаться с нами
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Имя
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Телефон
                    </label>
                    <input
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <Button className="w-full">Получить консультацию</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
