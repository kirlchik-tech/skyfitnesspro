'use client';

import React from 'react';
import { Header } from '@/components/UI/Header';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/UI/Button';
import Link from 'next/link';

export default function CoursePage({ params }: { params: { id: string } }) {
    const { isLoggedIn } = useAuth(); // Проверяем, авторизован ли юзер

    return (
        <>
            <Header />
            <main className="max-w-[1160px] w-full mx-auto flex flex-col pb-[100px]">
                {/* ВЕРХНИЙ БАННЕР КУРСА */}
                <div className="relative w-full h-[310px] bg-[#FFC700] rounded-[30px] mb-[60px] overflow-hidden flex items-center px-[30px] md:px-[80px]">
                    {/* Название курса */}
                    <h1 className="text-white text-[64px] font-medium absolute left-[40px] top-[30px]">Йога</h1>
                    <img
                        src="/Yellow2.png"
                        alt="Йога"
                        className="absolute right-0 top-0 h-full object-contain"
                    />
                </div>

                {/* БЛОК: ПОДОЙДЕТ ДЛЯ ВАС, ЕСЛИ */}
                <div className="mb-[75px] w-full">
                    <h2 className="text-[40px] font-semibold mb-[40px]">Подойдет для вас, если:</h2>
                    <div className="flex flex-col lg:flex-row gap-[15px]">

                        {/* Карточка 1 */}
                        <div className="bg-[#151720] rounded-[30px] p-[30px] flex items-center gap-[20px] flex-1">
                            <span className="text-[#BCEC30] text-[64px] font-normal leading-[1]">1</span>
                            <p className="text-white text-[18px] leading-[22px]">
                                Давно хотели попробовать йогу, но не решались начать
                            </p>
                        </div>

                        {/* Карточка 2 */}
                        <div className="bg-[#151720] rounded-[30px] p-[30px] flex items-center gap-[20px] flex-1">
                            <span className="text-[#BCEC30] text-[64px] font-normal leading-[1]">2</span>
                            <p className="text-white text-[18px] leading-[22px]">
                                Хотите укрепить позвоночник, избавиться от болей в спине и суставах
                            </p>
                        </div>

                        {/* Карточка 3 */}
                        <div className="bg-[#151720] rounded-[30px] p-[30px] flex items-center gap-[20px] flex-1">
                            <span className="text-[#BCEC30] text-[64px] font-normal leading-[1]">3</span>
                            <p className="text-white text-[18px] leading-[22px]">
                                Ищете активность, полезную для тела и души
                            </p>
                        </div>

                    </div>
                </div>

                {/* Блок: Направления */}
                <div className="mx-auto w-full px-4 lg:px-0 mb-10">
                    <h2 className="text-[24px] md:text-[40px] font-semibold">Направления</h2>
                    <div className="mt-6 md:mt-10 w-full rounded-[28px] bg-[#BCEC30] p-7 flex flex-col md:flex-row md:flex-wrap gap-6 md:gap-x-[124px] md:gap-y-[34px]">
                        <span className="w-[284px] text-black text-lg md:text-2xl">✦ Йога для новичков</span>
                        <span className="w-[284px] text-black text-lg md:text-2xl">✦ Кундалини-йога</span>
                        <span className="w-[284px] text-black text-lg md:text-2xl">✦ Хатха-йога</span>
                        <span className="w-[284px] text-black text-lg md:text-2xl">✦ Классическая йога</span>
                        <span className="w-[284px] text-black text-lg md:text-2xl">✦ Йогатерапия</span>
                        <span className="w-[284px] text-black text-lg md:text-2xl">✦ Аштанга-йога</span>
                    </div>
                </div>

                {/* Блок: Начните путь */}
                <div className="relative w-full">
                    {/* Белый блок с тенью */}
                    <div className="relative mx-4 sm:mx-8 lg:mx-auto z-10 rounded-[30px] p-[30px] sm:p-8 lg:p-10 bg-white shadow-[0px_4px_67px_-12px_rgba(0,0,0,0.13)] lg:max-w-[1160px] overflow-hidden lg:overflow-visible">
                        <div className="w-full sm:max-w-[500px] lg:w-[437px] flex flex-col gap-7">
                            <h2 className="text-black text-[32px] sm:text-[44px] lg:text-6xl font-medium leading-[38px] sm:leading-[52px] lg:leading-[70px]">
                                Начните путь к новому телу
                            </h2>
                            <ul className="list-disc list-outside pl-[30px] text-black/60 text-lg sm:text-xl lg:text-2xl leading-snug lg:leading-7">
                                <li className="pb-1">проработка всех групп мышц</li>
                                <li className="pb-1">тренировка суставов</li>
                                <li className="pb-1">улучшение циркуляции крови</li>
                                <li className="pb-1">упражнения заряжают бодростью</li>
                                <li className="pb-1">помогают противостоять стрессам</li>
                            </ul>

                            {/* Логика кнопки на основе состояния авторизации */}
                            {isLoggedIn ? (
                                <Button className="w-full sm:w-[380px] lg:w-[437px] h-[50px] lg:h-[52px] text-black" variant="primary">
                                    Добавить курс
                                </Button>
                            ) : (
                                <Link href="/login">
                                    <Button className="w-full sm:w-[380px] lg:w-[437px] h-[50px] lg:h-[52px] text-black" variant="primary">
                                        Войдите, чтобы добавить курс
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

            </main>
        </>
    );
}