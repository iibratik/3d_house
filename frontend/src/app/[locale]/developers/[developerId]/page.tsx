"use client"
import React from 'react';


import { ArrowLeft, MapPin, Calendar, Users, Award, Phone, Mail, Globe } from 'lucide-react';
import { Button } from '../../../../shared/ui/Button/Button';
import { formatPrice } from '../../../../shared/lib/utils';
import { useParams, } from 'next/navigation';
import { Link, useRouter } from '@/i18n/navigation';



export default function DeveloperPage() {
    const router = useRouter();
    const { developerId, locale } = useParams<{ developerId: string, locale: string }>();

    const developer = mockDevelopers.find(d => d.id === Number(developerId));

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

                    <div className="flex items-start justify-center space-x-6">
                        <img
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
                                {/* <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <Building className="w-6 h-6 mx-auto mb-1 text-green-600" />
                                    <div className="font-semibold text-gray-900 dark:text-white">{developer.projectsCount}</div>
                                    <div className="text-xs text-gray-600 dark:text-gray-400">проектов</div>
                                </div> */}
                                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <Award className="w-6 h-6 mx-auto mb-1 text-purple-600" />
                                    <div className="font-semibold text-gray-900 dark:text-white">{developer.completedProjects}</div>
                                    <div className="text-xs text-gray-600 dark:text-gray-400">завершено проектов</div>
                                </div>
                                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <Users className="w-6 h-6 mx-auto mb-1 text-red-600" />
                                    <div className="font-semibold text-gray-900 dark:text-white">5000+</div>
                                    <div className="text-xs text-gray-600 dark:text-gray-400">клиентов</div>
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
                                    {developer.projects.map(project => (
                                        <Link key={project.id} href={`complex`}>
                                            <div
                                                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                                            >
                                                <img
                                                    src={project.image}
                                                    alt={project.name}
                                                    className="w-full h-48 object-cover"
                                                />
                                                <div className="p-4">
                                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                                        {project.name}
                                                    </h3>
                                                    <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
                                                        <MapPin className="w-4 h-4 mr-1" />
                                                        <span className="text-sm">{project.location}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className={`text-xs px-2 py-1 rounded ${project.status === 'Сдан'
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                                                            }`}>
                                                            {project.status}
                                                        </span>
                                                        <div className="font-semibold text-green-600 dark:text-green-400">
                                                            от {formatPrice(project.priceFrom)} млн
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Achievements */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
                                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Достижения</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {developer.achievements.map((achievement, index) => (
                                        <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                            <Award className="w-6 h-6 text-yellow-600 flex-shrink-0" />
                                            <span className="text-gray-900 dark:text-white">{achievement}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
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
                                            <div className="font-medium text-gray-900 dark:text-white">{developer.contact.phone}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Mail className="w-5 h-5 text-green-600" />
                                        <div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">Email</div>
                                            <div className="font-medium text-gray-900 dark:text-white">{developer.contact.email}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Globe className="w-5 h-5 text-purple-600" />
                                        <div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">Сайт</div>
                                            <div className="font-medium text-gray-900 dark:text-white">{developer.contact.website}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <MapPin className="w-5 h-5 text-red-600 mt-1" />
                                        <div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">Адрес</div>
                                            <div className="font-medium text-gray-900 dark:text-white">{developer.contact.address}</div>
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
