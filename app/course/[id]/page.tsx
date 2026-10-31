'use client';

import React, { useState, useEffect, use } from 'react';
import { Header } from '@/components/UI/Header';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/UI/Button';
import Link from 'next/link';
import { getCourseById, ApiCourse } from '@/lib/api';

export default function CoursePage({ params }: { params: Promise<{ id: string }> }) {
    // Получаем состояние авторизации и методы управления подписками из контекста
    const { isLoggedIn, selectedCourses, addCourse, removeCourse } = useAuth();
    const { id } = use(params);
    const router = useRouter();

    // Состояние для хранения данных выбранного курса из API
    const [course, setCourse] = useState<ApiCourse | null>(null);
    // Состояние индикатора загрузки страницы
    const [isLoading, setIsLoading] = useState(true);
    // Состояние текста ошибки при загрузке
    const [error, setError] = useState('');
    // Состояние блокировки кнопки на время сетевого запроса
    const [isProcessing, setIsProcessing] = useState(false);

    // Проверяем, добавлен ли уже этот курс в профиль пользователя
    const isCourseAdded = isLoggedIn && selectedCourses.includes(id);

    // Обработчик добавления или удаления курса
    const handleCourseAction = async () => {
        if (!isLoggedIn) {
            window.dispatchEvent(new Event('open-auth-modal'));
            return;
        }

        setIsProcessing(true);
        try {
            if (isCourseAdded) {
                await removeCourse(id);
            } else {
                await addCourse(id);
                router.push('/profile');
            }
        } catch {
            alert('Произошла ошибка при обновлении курса');
        } finally {
            setIsProcessing(false);
        }
    };

    // Запрашиваем детальную информацию о курсе по его ID из внешнего API
    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const data = await getCourseById(id);
                setCourse(data);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourse();
    }, [id]);

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center">Загрузка...</div>;
    }

    if (error || !course) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <h1 className="text-2xl font-bold">Упс, такого курса нет!</h1>
                <Link href="/">
                    <Button variant="primary">На главную</Button>
                </Link>
            </div>
        );
    }

    // Формируем путь к мобильному изображению баннера
    const mobileImageSrc = course.cardImageSrc;

    // Перегруппировываем направления по колонкам для мобильной верстки
    const mobileDirections = [
        ...course.directions.filter((_, i) => i % 3 === 0),
        ...course.directions.filter((_, i) => i % 3 === 1),
        ...course.directions.filter((_, i) => i % 3 === 2),
    ];

    return (
        <>
            <Header />
            <main className="max-w-[1160px] w-full mx-auto flex flex-col items-center md:items-stretch pb-[60px] md:pb-[140px] px-[16px] xl:px-0 overflow-x-hidden">
                {/* 1. ВЕРХНИЙ БАННЕР КУРСА */}
                <div
                    className="relative w-[343px] md:w-full h-[389px] md:h-[310px] rounded-[30px] mb-[40px] md:mb-[60px] overflow-hidden flex items-end md:items-center justify-center md:px-[80px]"
                    style={{ backgroundColor: course.color }}
                >
                    <h1 className="hidden md:block font-roboto text-white text-[60px] font-medium leading-[110%] tracking-[0px] absolute left-[40px] top-[40px] z-10">
                        {course.title}
                    </h1>

                    {/* Картинка для мобилки */}
                    <img
                        src={mobileImageSrc}
                        alt={course.title}
                        className="md:hidden w-full h-[329px] object-cover object-top"
                    />

                    {/* Картинка для ПК */}
                    <img
                        src={course.imageSrc}
                        alt={course.title}
                        className="hidden md:block absolute right-0 top-0 h-full object-contain"
                    />
                </div>

                {/* 2. БЛОК: ПОДОЙДЕТ ДЛЯ ВАС, ЕСЛИ */}
                <div className="mb-[40px] md:mb-[60px] w-[343px] md:w-full">
                    <h2 className="font-roboto text-[24px] md:text-[40px] font-semibold mb-[24px] md:mb-[40px] leading-[110%]">
                        Подойдет для вас, если:
                    </h2>

                    <div className="flex flex-col md:flex-row md:flex-wrap md:justify-between lg:flex-nowrap gap-[17px]">
                        {/* Карточка 1 */}
                        <div className="bg-[#151720] w-[343px] md:w-[368px] h-[141px] rounded-[30px] p-[20px] flex items-center gap-[18px] md:gap-[25px] shrink-0">
                            <span className="font-roboto text-[#BCEC30] text-[75px] font-medium leading-[100%]">1</span>
                            <p className="font-roboto text-white text-[18px] md:text-[24px] font-normal leading-[110%]">
                                {course.fitting?.[0] || 'Давно хотели попробовать йогу, но не решались начать'}
                            </p>
                        </div>

                        {/* Карточка 2 */}
                        <div className="bg-[#151720] w-[343px] md:w-[431px] h-[141px] rounded-[30px] p-[20px] flex items-center gap-[18px] md:gap-[25px] shrink-0">
                            <span className="font-roboto text-[#BCEC30] text-[75px] font-medium leading-[100%]">2</span>
                            <p className="font-roboto text-white text-[18px] md:text-[24px] font-normal leading-[110%]">
                                {course.fitting?.[1] || 'Хотите укрепить позвоночник, избавиться от болей в спине и суставах'}
                            </p>
                        </div>

                        {/* Карточка 3 */}
                        <div className="bg-[#151720] w-[343px] md:w-[327px] h-[141px] rounded-[30px] p-[20px] flex items-center gap-[18px] md:gap-[25px] shrink-0">
                            <span className="font-roboto text-[#BCEC30] text-[75px] font-medium leading-[100%]">3</span>
                            <p className="font-roboto text-white text-[18px] md:text-[24px] font-normal leading-[110%]">
                                {course.fitting?.[2] || 'Ищете активность, полезную для тела и души'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* 3. БЛОК: НАПРАВЛЕНИЯ */}
                <div className="w-[343px] md:w-full mb-[155px] md:mb-[102px]">
                    <h2 className="font-roboto text-[24px] md:text-[40px] font-semibold leading-[110%]">Направления</h2>

                    {/* СПИСОК ДЛЯ МОБИЛКИ */}
                    <div className="md:hidden mt-[24px] w-full rounded-[30px] bg-[#BCEC30] p-[30px] flex flex-col gap-[24px]">
                        {course.directions.map((direction, index) => (
                            <span
                                key={index}
                                className="w-full font-roboto text-black text-[18px] font-normal leading-[110%] flex items-center gap-[8px]"
                            >
                                <svg className="w-[20px] h-[20px] shrink-0" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13 0.5L16.3761 9.62386L25.5 13L16.3761 16.3761L13 25.5L9.62386 16.3761L0.5 13L9.62386 9.62386L13 0.5Z" fill="black" />
                                </svg>
                                {direction}
                            </span>
                        ))}
                    </div>

                    {/* СПИСОК ДЛЯ ПК (3 колонки по 2 элемента сверху вниз, как в макете Figma) */}
                    <div className="hidden md:grid mt-[40px] w-full rounded-[30px] bg-[#BCEC30] p-[30px] grid-rows-2 grid-flow-col justify-between gap-y-[34px]">
                        {course.directions.map((direction, index) => (
                            <span
                                key={index}
                                className="w-[284px] font-roboto text-black text-[24px] font-normal leading-[110%] flex items-center gap-[8px]"
                            >
                                <svg className="w-[26px] h-[26px] shrink-0" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13 0.5L16.3761 9.62386L25.5 13L16.3761 16.3761L13 25.5L9.62386 16.3761L0.5 13L9.62386 9.62386L13 0.5Z" fill="black" />
                                </svg>
                                {direction}
                            </span>
                        ))}
                    </div>
                </div>

                {/* 4. БЛОК: ПРИЗЫВ К ДЕЙСТВИЮ (НАЧНИТЕ ПУТЬ) */}
                <div className="relative w-[343px] md:w-full">
                    <div className="md:hidden pointer-events-none">
                        <img
                            src="/BoyMobile.png"
                            alt="Спортсмен"
                            className="absolute top-[-254px] right-[-10px] w-auto h-auto z-10 object-contain"
                        />
                    </div>

                    <div className="relative z-20 rounded-[30px] p-[30px] sm:p-8 lg:p-10 bg-white shadow-[0px_4px_67px_-12px_rgba(0,0,0,0.13)] w-full lg:max-w-[1160px] md:max-h-[486px] flex items-center justify-between">
                        <div className="w-full sm:max-w-[500px] md:w-[400px] lg:w-[437px] flex flex-col gap-[28px] z-30">
                            <h2 className="md:hidden font-roboto text-black text-[32px] font-medium leading-[110%]">
                                Начните путь<br />
                                к новому телу
                            </h2>

                            <h2 className="hidden md:block font-roboto text-black w-[398px] text-[32px] sm:text-[44px] lg:text-[60px] font-medium leading-[100%]">
                                Начните путь к новому телу
                            </h2>

                            <ul className="font-roboto list-disc list-outside pl-[24px] md:pl-[30px] text-black/60 text-[18px] sm:text-xl lg:text-[24px] leading-[110%] marker:text-base">
                                <li className="pb-[10px]">проработка всех групп мышц</li>
                                <li className="pb-[10px]">тренировка суставов</li>
                                <li className="pb-[10px]">улучшение циркуляции крови</li>
                                <li className="pb-[10px]">упражнения заряжают бодростью</li>
                                <li className="pb-1">помогают противостоять стрессам</li>
                            </ul>

                            {isLoggedIn ? (
                                <Button
                                    onClick={handleCourseAction}
                                    disabled={isProcessing}
                                    className="w-[283px] max-w-full sm:w-[380px] lg:w-[437px] h-[50px] lg:h-[52px] text-black"
                                    variant="primary"
                                >
                                    {isProcessing
                                        ? 'Обновляем...'
                                        : isCourseAdded
                                            ? 'Удалить курс'
                                            : 'Добавить курс'}
                                </Button>
                            ) : (
                                <Button
                                    onClick={() => window.dispatchEvent(new Event('open-auth-modal'))}
                                    className="w-[283px] max-w-full sm:w-[380px] lg:w-[437px] h-[50px] lg:h-[52px] text-black text-[16px] md:text-[18px]"
                                    variant="primary"
                                >
                                    Войдите, чтобы добавить курс
                                </Button>
                            )}
                        </div>

                        <div className="hidden md:block pointer-events-none">
                            <div className="absolute inset-0 z-0 rounded-[30px] overflow-hidden">
                                <img
                                    src="/VectorGreen.png"
                                    alt=""
                                    className="absolute bottom-[-50px] right-[25px] w-auto h-auto z-0"
                                />
                            </div>
                            <img
                                src="/VectorBlack.png"
                                alt=""
                                className="absolute top-[30px] right-[280px] lg:right-[380px] w-[50px] h-auto z-10"
                            />
                            <img
                                src="/Boy.png"
                                alt="Спортсмен"
                                className="absolute bottom-[20px] right-[10px] lg:right-[30px] md:w-[360px] lg:w-auto h-auto z-20 object-contain"
                            />
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}