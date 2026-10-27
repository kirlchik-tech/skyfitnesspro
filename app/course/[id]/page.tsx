'use client';

import React, { useState, useEffect, use } from 'react';
import { Header } from '@/components/UI/Header';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/UI/Button';
import Link from 'next/link';

// Описываем тип данных курса из БД
interface CourseData {
    title: string;
    color: string;
    imageSrc: string;
    directions: string[];
}

export default function CoursePage({ params }: { params: Promise<{ id: string }> }) {
    const { isLoggedIn, user } = useAuth();
    const { id } = use(params);
    const router = useRouter();

    // Стейт для хранения данных курса
    const [course, setCourse] = useState<CourseData | null>(null);

    // Стейт для загрузки
    const [isLoading, setIsLoading] = useState(true);

    // Стейт для ошибки
    const [error, setError] = useState('');

    // Стейт для загрузки при нажатии на кнопку добавления
    const [isAdding, setIsAdding] = useState(false);

    //Фунцкия добавления курса
    const handleAddCourse = async () => {
        // Проверяем, есть ли у нас email юзера
        if (!user || !user.email) {
            console.error("Ошибка: в AuthContext нет данных пользователя (user.email)");
            alert("Ошибка авторизации. Пожалуйста, перезайдите в аккаунт.");
            return;
        }

        setIsAdding(true);
        try {
            const res = await fetch('/api/users/add-course', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: user.email,
                    courseNameId: id // Передаем id курса из URL (например, "yoga")
                })
            });

            if (res.ok) {
                // Если база успешно сохранила курс — летим в профиль!
                router.push('/profile');
            } else {
                const data = await res.json();
                alert(data.message || 'Произошла ошибка при добавлении');
            }
        } catch (error) {
            console.error(error);
            alert('Ошибка сети');
        } finally {
            setIsAdding(false);
        }
    };

    // Делаем запрос к нашему API при загрузке страницы
    useEffect(() => {
        const fetchCourse = async () => {
            try {
                // Обращаемся к API, передавая ID из URL (params.id)
                const res = await fetch(`/api/courses/${id}`);

                if (!res.ok) {
                    throw new Error('Курс не найден');
                }

                const data = await res.json();
                setCourse(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourse();
    }, [id]);

    // Показываем загрузку, пока данные летят с сервера
    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center">Загрузка...</div>;
    }

    // Если курс не найден (или ошибка БД)
    if (error || !course) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <h1 className="text-2xl font-bold">Упс, такого курса нет!</h1>
                <Link href="/"><Button variant="primary">На главную</Button></Link>
            </div>
        )
    }

    // Для мобилки убираем букву "s" перед расширением файла (например, "/Yellows.png" -> "/Yellow.png")
    const mobileImageSrc = course.imageSrc.replace(/s\.(png|jpg|jpeg|svg|webp)$/i, '.$1');

    // Перегруппировываем направления из БД по колонкам для мобильной верстки (как в макете Figma)
    const mobileDirections = [
        ...course.directions.filter((_, i) => i % 3 === 0),
        ...course.directions.filter((_, i) => i % 3 === 1),
        ...course.directions.filter((_, i) => i % 3 === 2),
    ];

    // РЕНДЕРИНГ:
    return (
        <>
            <Header />
            <main className="max-w-[1160px] w-full mx-auto flex flex-col items-center md:items-stretch pb-[60px] md:pb-[140px] px-[16px] xl:px-0 overflow-x-hidden">

                {/* 1. ВЕРХНИЙ БАННЕР КУРСА (343x389 на мобилке, 1160x310 на ПК) */}
                <div
                    className="relative w-[343px] md:w-full h-[389px] md:h-[310px] rounded-[30px] mb-[40px] md:mb-[60px] overflow-hidden flex items-end md:items-center justify-center md:px-[80px]"
                    style={{ backgroundColor: course.color }} // ЦВЕТ ИЗ БАЗЫ!
                >
                    <h1 className="hidden md:block text-white text-[64px] font-medium absolute left-[40px] top-[30px] z-10">
                        {course.title} {/* НАЗВАНИЕ ИЗ БАЗЫ */}
                    </h1>

                    {/* Картинка для МОБИЛКИ (обычная без s, например /Yellow.png) */}
                    <img
                        src={mobileImageSrc}
                        alt={course.title}
                        className="md:hidden w-full h-[329px] object-cover object-top"
                    />

                    {/* Картинка для ПК (расширенная из базы) */}
                    <img
                        src={course.imageSrc}
                        alt={course.title}
                        className="hidden md:block absolute right-0 top-0 h-full object-contain"
                    />
                </div>

                {/* 2. БЛОК: ПОДОЙДЕТ ДЛЯ ВАС, ЕСЛИ */}
                <div className="mb-[40px] md:mb-[75px] w-[343px] md:w-full">
                    <h2 className="text-[24px] md:text-[40px] font-semibold mb-[24px] md:mb-[40px] leading-[110%]">
                        Подойдет для вас, если:
                    </h2>

                    {/* На планшете (md:) flex-row flex-wrap justify-center ставит 3-й блок по центру на новой строке */}
                    <div className="flex flex-col md:flex-row md:flex-wrap md:justify-center lg:flex-nowrap gap-[17px] lg:gap-[15px]">
                        {/* Карточка 1 */}
                        <div className="bg-[#151720] w-[343px] md:w-[368px] h-[141px] rounded-[30px] p-[20px] md:py-[31px] flex items-center gap-[18px] md:gap-[25px] shrink-0">
                            <span className="text-[#BCEC30] text-[75px] font-medium leading-[1]">1</span>

                            {/* Текст для МОБИЛКИ */}
                            <p className="md:hidden text-white text-[18px] font-normal leading-[110%] whitespace-nowrap">
                                Давно хотели попробовать<br />
                                йогу, но не решались начать
                            </p>

                            {/* Текст для ПЛАНШЕТА и ПК */}
                            <p className="hidden md:flex text-white flex-col text-[22px] leading-[110%]">
                                <span>Давно хотели</span>
                                <span>попробовать йогу,</span>
                                <span>но не решались начать</span>
                            </p>
                        </div>

                        {/* Карточка 2 */}
                        <div className="bg-[#151720] w-[343px] md:w-[431px] h-[141px] rounded-[30px] p-[20px] md:py-[31px] flex items-center gap-[18px] md:gap-[25px] shrink-0">
                            <span className="text-[#BCEC30] text-[75px] font-medium leading-[1]">2</span>

                            {/* Текст для МОБИЛКИ */}
                            <p className="md:hidden text-white text-[18px] font-normal leading-[110%] whitespace-nowrap">
                                Хотите укрепить<br />
                                позвоночник, избавиться<br />
                                от болей в спине<br />
                                и суставах
                            </p>

                            {/* Текст для ПЛАНШЕТА и ПК */}
                            <p className="hidden md:flex text-white flex-col text-[24px] leading-[110%]">
                                <span>Хотите укрепить</span>
                                <span>позвоночник, избавиться</span>
                                <span>от болей в спине и суставах</span>
                            </p>
                        </div>

                        {/* Карточка 3 */}
                        <div className="bg-[#151720] w-[343px] md:w-[327px] h-[141px] rounded-[30px] p-[20px] md:py-[31px] flex items-center gap-[18px] md:gap-[25px] shrink-0">
                            <span className="text-[#BCEC30] text-[75px] font-medium leading-[1]">3</span>

                            {/* Текст для МОБИЛКИ */}
                            <p className="md:hidden text-white text-[18px] font-normal leading-[110%] whitespace-nowrap">
                                Ищете активность,<br />
                                полезную для тела и души
                            </p>

                            {/* Текст для ПЛАНШЕТА и ПК */}
                            <p className="hidden md:flex text-white flex-col text-[24px] leading-[110%]">
                                <span>Ищете активность,</span>
                                <span>полезную для тела</span>
                                <span>и души</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* 3. БЛОК: НАПРАВЛЕНИЯ */}
                <div className="w-[343px] md:w-full mb-[155px] md:mb-[75px]">
                    <h2 className="text-[24px] md:text-[40px] font-semibold leading-[110%]">Направления</h2>

                    {/* СПИСОК ДЛЯ МОБИЛКИ \ */}
                    <div className="md:hidden mt-[24px] w-full rounded-[30px] bg-[#BCEC30] p-[30px] flex flex-col gap-[24px]">
                        {mobileDirections.map((direction, index) => (
                            <span key={index} className="w-full text-black text-[18px] font-normal leading-[110%] flex items-center gap-[8px]">
                                <svg className="w-[20px] h-[20px] shrink-0" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13 0.5L16.3761 9.62386L25.5 13L16.3761 16.3761L13 25.5L9.62386 16.3761L0.5 13L9.62386 9.62386L13 0.5Z" fill="black" />
                                </svg>
                                {direction}
                            </span>
                        ))}
                    </div>

                    {/* СПИСОК ДЛЯ ПЛАНШЕТА И ПК (оригинальный порядок из БД) */}
                    <div className="hidden md:flex mt-10 w-full rounded-[30px] bg-[#BCEC30] p-7 flex-row flex-wrap gap-x-[124px] gap-y-[34px]">
                        {course.directions.map((direction, index) => (
                            <span key={index} className="w-[284px] text-black text-2xl font-normal leading-[110%] flex items-center gap-[8px]">
                                <svg className="w-[26px] h-[26px] shrink-0" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13 0.5L16.3761 9.62386L25.5 13L16.3761 16.3761L13 25.5L9.62386 16.3761L0.5 13L9.62386 9.62386L13 0.5Z" fill="black" />
                                </svg>
                                {direction}
                            </span>
                        ))}
                    </div>
                </div>

                {/* 4. БЛОК: НАЧНИТЕ ПУТЬ */}
                <div className="relative w-[343px] md:w-full">

                    {/* === ДЕКОРАТИВНАЯ ЧАСТЬ ДЛЯ МОБИЛКИ (Только до md) === */}
                    <div className="md:hidden pointer-events-none">
                        {/* 3. Парень для мобилки BoyMobile.png */}
                        <img
                            src="/BoyMobile.png"
                            alt="Спортсмен"
                            className="absolute top-[-254px] right-[-10px] w-auto h-auto z-10 object-contain"
                        />
                    </div>

                    {/* Белый блок с тенью (z-20, чтобы на мобилке лежать ПОВЕРХ парня BoyMobile) */}
                    <div className="relative z-20 rounded-[30px] p-[30px] sm:p-8 lg:p-10 bg-white shadow-[0px_4px_67px_-12px_rgba(0,0,0,0.13)] w-full lg:max-w-[1160px] md:max-h-[486px] flex items-center justify-between">

                        {/* Контентная (текстовая) часть */}
                        <div className="w-full sm:max-w-[500px] md:w-[400px] lg:w-[437px] flex flex-col gap-[28px] z-30">

                            {/* Заголовок для МОБИЛКИ (ровно в 2 строки) */}
                            <h2 className="md:hidden text-black text-[32px] font-medium leading-[110%]">
                                Начните путь<br />
                                к новому телу
                            </h2>

                            {/* Заголовок для ПЛАНШЕТА и ПК */}
                            <h2 className="hidden md:block text-black w-[398px] text-[32px] sm:text-[44px] lg:text-6xl font-medium leading-[38px] sm:leading-[52px] lg:leading-[60px]">
                                Начните путь к новому телу
                            </h2>

                            <ul className="list-disc list-outside pl-[24px] md:pl-[30px] text-black/60 text-[18px] sm:text-xl lg:text-2xl leading-[110%] lg:leading-7 marker:text-base">
                                <li className="pb-[10px]">проработка всех групп мышц</li>
                                <li className="pb-[10px]">тренировка суставов</li>
                                <li className="pb-[10px]">улучшение циркуляции крови</li>
                                <li className="pb-[10px]">упражнения заряжают бодростью</li>
                                <li className="pb-1">помогают противостоять стрессам</li>
                            </ul>

                            {isLoggedIn ? (
                                <Button
                                    onClick={handleAddCourse}
                                    disabled={isAdding}
                                    className="w-[283px] max-w-full sm:w-[380px] lg:w-[437px] h-[50px] lg:h-[52px] text-black"
                                    variant="primary"
                                >
                                    {isAdding ? "Добавляем..." : "Добавить курс"}
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

                        {/* === ДЕКОРАТИВНАЯ ЧАСТЬ ДЛЯ ПЛАНШЕТА И ПК: Векторы и Парень внутри белого блока === */}
                        <div className="hidden md:block pointer-events-none">
                            {/* Зеленый вектор на заднем плане */}
                            <div className="absolute inset-0 z-0 rounded-[30px] overflow-hidden">
                                <img
                                    src="/VectorGreen.png"
                                    alt=""
                                    className="absolute bottom-[-50px] right-[25px] w-auto h-auto z-0" />
                            </div>

                            {/* Черный дугообразный штрих у плеча парня */}
                            <img
                                src="/VectorBlack.png"
                                alt=""
                                className="absolute top-[30px] right-[280px] lg:right-[380px] w-[50px] h-auto z-10"
                            />

                            {/* Фото бегуна в стартовой позиции */}
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