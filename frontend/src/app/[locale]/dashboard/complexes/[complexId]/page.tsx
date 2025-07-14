'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    ArrowLeft,

} from 'lucide-react';
import { Button } from '@/shared/ui/Button/Button';

import { useComplexStore } from '@/entities/Complex/model/store';

import { Link } from '@/i18n/navigation';
import { Complex } from '@/entities/Complex';
import { Apartament, Block } from '@/entities/Complex/model/types';
import { Modal } from '@/shared/ui/Modal/Modal';
import ChartComponent, { TimeRange } from '@/widgets/Charts/ui/CommonComplexChart';
import { getRoomLabel } from '@/shared/lib/utils';



export default function ComplexPage() {
    const { getComplexById, getBlockByComplexId, getApartaments, addNewApartament } = useComplexStore();
    const { locale, complexId } = useParams<{ locale: string; complexId: string }>();
    // states
    const [complex, setComplex] = useState<Complex | null>(null);
    const [loadingComplex, setLoadingComplex] = useState<boolean>(true);
    const [loadedBlocks, setLoadedBlocks] = useState<Block[] | null>(null);
    const [loadedApartaments, setLoadedApartaments] = useState<Apartament[]>([]);
    const [isOpenApartModal, setIsOpenApartModal] = useState(false);
    const [selectedApartment, setSelectedApartment] = useState<Apartament | null>(null);
    const router = useRouter();
    const chartData = {
        value: 'Month' as TimeRange, // 👈 фиксируем тип
        labels: ['01.07', '02.07', '03.07', '04.07'],
        viewsData: [100, 150, 120, 90],
        favoritesData: [20, 25, 30, 15],
        callsData: [5, 10, 7, 4],
    };
    const addingApartament: Apartament = {
        id: 0,
        blockId: 0,
        apartmentNumber: "0",
        floor: 0,
        typeId: 0,
        model: '',
    }


    useEffect(() => {
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
                setLoadedApartaments(updated);
            } else {
                // На ошибке — сбрасываем в пустой массив
                setLoadedApartaments([]);
            }
        }
        fetchBlocks()

        fetchComplex();
    }, [getComplexById, complexId, getBlockByComplexId, loadedBlocks, getApartaments, complex]);

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
                        onClick={() => router.replace('/dashboard')}
                        className="flex items-center lg:gap-2 gap-3 lg:"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Назад
                    </Button>
                </div>
                <div className="container mx-auto px-4 lg:pb-16 pb-0 flex-col  text-white relative ">


                    <h1 className="text-4xl lg:text-left text-center md:text-5xl font-bold mt-4 mb-4">
                        {complex.name}
                    </h1>
                    {/* <div className="flex items-center mb-4 lg:flex-row flex-col">
                        <MapPin className="w-5 h-5 mr-2" />
                        <span className="text-lg lg:text-left text-center">
                            {complex.address},
                        </span>
                    </div> */}
                    <h3 className='text-center text-2xl'>Статистика за месяц</h3>
                    <ChartComponent chartData={chartData} />
                </div>
            </section>

            {/* Complex Info */}
            <section className="lg:py-16 py-8">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Info */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
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
                            </div> */}

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
                                                                        ? 'border-green-200 cursor-pointer  bg-green-50 dark:bg-green-900/20 dark:border-green-800'
                                                                        : 'border-gray-200 bg-gray-50 dark:bg-gray-700 dark:border-gray-600'
                                                                        }`}
                                                                    onClick={() => {
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
                                                                        <div>Этаж: {apt.floor}</div>
                                                                        <div className="text-xs mt-2 text-gray-500 dark:text-gray-400">
                                                                            Всего {getRoomLabel(typeId)} в блоке: {count}
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {selectedApartment?.typeId === typeId && isOpenApartModal && (
                                                                    <Modal isOpen={isOpenApartModal} onClose={() => setIsOpenApartModal(false)}>
                                                                        <h2 className="text-xl font-bold mb-4">
                                                                            {getRoomLabel(typeId)}
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
                        <div className="lg:col-span-1 ">

                            {/* Add Aaprtament Form */}
                            <div className="sticky  top-20 bg-white dark:bg-gray-800 rounded-xl p-6">
                                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                                    Добавить квартиру
                                </h3>
                                <div className="space-y-4">
                                    <form action="#" onSubmit={() => {
                                        addNewApartament(addingApartament)
                                    }}>
                                        <select
                                            defaultValue=""
                                            required
                                            onChange={(e) => {
                                                addingApartament.blockId = Number(e.target.value);
                                            }}
                                            className="appearance-none w-full mb-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="" disabled hidden>
                                                Блок квартир
                                            </option>
                                            {loadedBlocks?.map((block) => {
                                                return (<option value={block.id} key={block.id}>Блок {block.name}</option>)
                                            })}
                                        </select>
                                        <input
                                            type="text"
                                            name="apartmentNumber"
                                            placeholder="Номер квартиры"
                                            required
                                            pattern="\d{1,5}"  // Только цифры, от 1 до 5 символов
                                            title="Введите только цифры (1–5 символов)"
                                            className="appearance-none w-full mb-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-white"
                                            onChange={(e) => {
                                                addingApartament.apartmentNumber = e.target.value;
                                            }}
                                        />
                                        <input
                                            onChange={(e) => {
                                                addingApartament.floor = Number(e.target.value);
                                            }}
                                            placeholder='Номер этажа' type='number' min={1} max={10} className="appearance-none w-full mb-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-white" />
                                        <select
                                            defaultValue=""
                                            required
                                            onChange={(e) => {
                                                const value = Number(e.target.value);
                                                switch (value) {
                                                    case 1:
                                                        addingApartament.model = 'https://sketchfab.com/models/cae2d96ede1d4112b1fd391099a43f77/embed?autostart=1&ui_hint=0&dnt=1'
                                                        addingApartament.typeId = 1;
                                                        break;
                                                    case 2:
                                                        addingApartament.model = 'https://sketchfab.com/models/bed4b9094fd14e838039177ff68e3ce9/embed'
                                                        addingApartament.typeId = 2;
                                                        break;
                                                    case 3:
                                                        addingApartament.model = 'https://sketchfab.com/models/c7e49702e77743e8948fe66b5969a1ab/embed'
                                                        addingApartament.typeId = 3;
                                                        break;
                                                    case 4:
                                                        addingApartament.model = 'https://sketchfab.com/models/bed4b9094fd14e838039177ff68e3ce9/embed'
                                                        addingApartament.typeId = 4;
                                                        break;
                                                    case 5:
                                                        addingApartament.model = 'https://sketchfab.com/models/bed4b9094fd14e838039177ff68e3ce9/embed'
                                                        addingApartament.typeId = 5;
                                                        break;
                                                    default:
                                                        console.warn("Неверное значение блока");
                                                        break;
                                                }
                                            }}
                                            className="appearance-none w-full mb-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value='' disabled hidden>
                                                Тип квартиры
                                            </option>
                                            <option value="1">Студия</option>
                                            <option value="2">1 комнаты</option>
                                            <option value="3">2 комнаты</option>
                                            <option value="4">3 комнаты</option>
                                            <option value="5">4 комнаты</option>
                                        </select>
                                        <Button className="w-full" type='submit' >Добавить квартиру</Button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section >
        </div >
    );
}
