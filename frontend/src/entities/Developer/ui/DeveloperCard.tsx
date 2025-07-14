"use client"
import { Building2 } from "lucide-react";
import { DeveloperProps, } from '../model/types';
import { useRouter } from 'next/navigation';
import Image from "next/image";

export function DeveloperCard({ developer }: DeveloperProps) {
    const router = useRouter()
    return (
        <>
            <div
                onClick={() => {
                    router.push(`/developers/${developer.id}`)
                    setTimeout(() => {
                        window.scrollTo(0, 0);
                    }, 100);
                }}
                className="flex items-center mb-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 -m-2 rounded-lg transition-colors"
            >
                {developer ? (
                    <>
                        <Image
                            src={developer.logo}
                            alt={developer.name || 'Логотип застройщика'}
                            width={32}
                            height={32}
                            className="w-8 h-8 rounded-full object-cover mr-2"
                        />
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            <Building2 className="w-4 h-4 mr-1" />
                            <span>{developer.name}</span>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="w-8 h-8 rounded-full bg-gray-300 mr-2 animate-pulse" />
                        <div className="h-4 w-24 bg-gray-300 rounded animate-pulse" />
                    </>
                )}
            </div>
        </>
    )
}