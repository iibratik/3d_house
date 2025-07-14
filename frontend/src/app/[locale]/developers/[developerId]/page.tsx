"use client"
import React, { useEffect, useState } from 'react';


import { ArrowLeft, MapPin, Calendar, Award, Phone, Mail, Globe, Building } from 'lucide-react';
import { Button } from '@/shared/ui/Button/Button';
// import { formatPrice } from '@/shared/lib/utils';
import { useParams, } from 'next/navigation';
import { Link, useRouter } from '@/i18n/navigation';
import { Developer } from '../../../../entities/Developer/model/types';
import { useDeveloperStore } from '@/entities/Developer/model/store';
import { ComplexCard } from '@/entities/Complex';
import Image from 'next/image';



export default function DeveloperPage() {
    const router = useRouter();
    const { developerId, locale } = useParams<{ developerId: string, locale: string }>();
    const { getDeveloperById, getDeveloperComplexes, } = useDeveloperStore()
    const developerStore = useDeveloperStore()
    const [developer, setDeveloper] = useState<Developer | null>(null);
    const [loadingDeveloper, setLoadingDeveloper] = useState<boolean>(true);
    const [loadingCount, setLoadingCount] = useState(0);
    const [loaded, setLoaded] = useState<boolean[]>([]);
    const [activeModelIndex, setActiveModelIndex] = useState<number | null>(null);

    const handleLoaded = (index: number) => {
        setLoaded((prev) => {
            const copy = [...prev];
            copy[index] = true;
            return copy;
        });
    };
    function getComplitedProjects() {
        return developerStore.developerComplexes.filter(c => c.status === 'ready').length;
    }
    useEffect(() => {
        const fetchDeveloper = async () => {
            setLoadingDeveloper(true);
            if (developerId) {
                const result = await getDeveloperById(Number(developerId));
                if (result === 'success') {
                    const loadedDeveloper = useDeveloperStore.getState().currentDeveloper;
                    setDeveloper(loadedDeveloper);

                } else {
                    setDeveloper(null);
                }
            }
            setLoadingDeveloper(false);
        };
        async function fetchComplexes() {
            getDeveloperComplexes(Number(developerId))
        };

        fetchComplexes()
        fetchDeveloper();
    }, [developerId, getDeveloperById, getDeveloperComplexes])

    if (loadingDeveloper) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center text-lg text-gray-500 dark:text-gray-300">
                    Загрузка...
                </div>
            </div>
        );
    }
    if (!developer) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Застройщик не найден</h1>
                    <Link href={'/'} locale={locale}>
                        <Button >Вернуться на главную</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <section className="bg-white dark:bg-gray-800 py-8">
                <div className="container mx-auto px-4">
                    <div className="flex items-center mb-6">
                        <Button
                            variant="secondary"
                            onClick={() => router.back()}
                            className="flex items-center gap-2 mr-4"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Назад
                        </Button>
                    </div>

                    <div className="flex lg:flex-row flex-col lg:items-start items-center text-center gap-3 justify-center space-x-6">
                        <Image
                            src={developer.logo}
                            width='200'
                            height='200'
                            alt={developer.name}
                            className="w-24 h-24 rounded-xl object-cover"
                        />
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                {developer.name}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                {developer.description}
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <Calendar className="w-6 h-6 mx-auto mb-1 text-blue-600" />
                                    <div className="font-semibold text-gray-900 dark:text-white">{developer.founded}</div>
                                    <div className="text-xs text-gray-600 dark:text-gray-400">год основания</div>
                                </div>
                                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <Building className="w-6 h-6 mx-auto mb-1 text-green-600" />
                                    <div className="font-semibold text-gray-900 dark:text-white">{20}</div>
                                    <div className="text-xs text-gray-600 dark:text-gray-400">проектов</div>
                                </div>
                                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <Award className="w-6 h-6 mx-auto mb-1 text-purple-600" />
                                    <div className="font-semibold text-gray-900 dark:text-white">{getComplitedProjects()}</div>
                                    <div className="text-xs text-gray-600 dark:text-gray-400">завершено проектов</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            {/* Projects */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-8">
                                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Проекты</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {developerStore.developerComplexes.map((complex, index) => (
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
                            </div>

                            {/* Achievements */}
                            {/* <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
                                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Достижения</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                     {developer.achievements.map((achievement, index) => (
                                        <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                            <Award className="w-6 h-6 text-yellow-600 flex-shrink-0" />
                                            <span className="text-gray-900 dark:text-white">{achievement}</span>
                                        </div>
                                    ))}
                                </div>
                            </div> */}
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            {/* Contact Info */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6">
                                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Контакты</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <Phone className="w-5 h-5 text-blue-600" />
                                        <div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">Телефон</div>
                                            <div className="font-medium text-gray-900 dark:text-white">{developer.phoneNumber}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Mail className="w-5 h-5 text-green-600" />
                                        <div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">Email</div>
                                            <div className="font-medium text-gray-900 dark:text-white">{developer.email}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Globe className="w-5 h-5 text-purple-600" />
                                        <div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">Сайт</div>
                                            <div className="font-medium text-gray-900 dark:text-white">{developer.website}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <MapPin className="w-5 h-5 text-red-600 mt-1" />
                                        <div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">Адрес</div>
                                            <div className="font-medium text-gray-900 dark:text-white">{developer.address}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Form */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
                                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Связаться с застройщиком</h3>
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
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Сообщение
                                        </label>
                                        <textarea
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>
                                    <Button className="w-full">
                                        Отправить сообщение
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
