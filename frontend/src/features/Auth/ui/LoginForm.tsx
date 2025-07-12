'use client';

import { useAuthStore } from '../model/store';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeClosed } from 'lucide-react';

export function LoginForm() {
    const [inputUsername, setInputUsername] = useState('');
    const [inputPassword, setInputPassword] = useState('');
    const [showHidePassword, setShowHidePassword] = useState(false);
    const { login, } = useAuthStore();
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(inputUsername, inputPassword);
            const redirect = searchParams.get('from') || '/dashboard';
            console.log('redirect:', redirect);
            router.push(redirect);
        } catch {

        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-primary-dark p-6 rounded-xl shadow w-96">
            <h1 className="text-xl font-bold mb-4">Вход</h1>
            <input
                className="w-full border p-2 mb-4 rounded-xl"
                placeholder="Логин"
                value={inputUsername}
                onChange={(e) => setInputUsername(e.target.value)}
            />
            <div className="input relative">
                <input
                    className="w-full border p-2 mb-4 rounded-xl "
                    type={showHidePassword ? 'text' : 'password'}
                    placeholder="Пароль"
                    value={inputPassword}
                    onChange={(e) => setInputPassword(e.target.value)}
                />
                <button type='button' onClick={() => {
                    setShowHidePassword(!showHidePassword)
                }} className=" text-white p-2 absolute right-0">
                    {showHidePassword ? <Eye /> : <EyeClosed />}
                </button>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-xl cursor-pointer">
                Войти
            </button>
            {/* {error && <p className="text-red-500 mt-2">{error}</p>} */}
        </form>
    );
}
