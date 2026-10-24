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

    // РЕНДЕРИНГ:
    return (
        <>
            <Header />
            <main className="max-w-[1160px] w-full mx-auto flex flex-col pb-[140px]">
                {/* 1. ВЕРХНИЙ БАННЕР КУРСА */}
                <div
                    className="relative w-full h-[310px] rounded-[30px] mb-[60px] overflow-hidden flex items-center px-[30px] md:px-[80px]"
                    style={{ backgroundColor: course.color }} // ЦВЕТ ИЗ БАЗЫ!
                >
                    <h1 className="text-white text-[64px] font-medium absolute left-[40px] top-[30px]">
                        {course.title} {/* НАЗВАНИЕ ИЗ БАЗЫ */}
                    </h1>
                    <img
                        src={course.imageSrc} // КАРТИНКА ИЗ БАЗЫ
                        alt={course.title}
                        className="absolute right-0 top-0 h-full object-contain"
                    />
                </div>

                {/* 2. БЛОК: ПОДОЙДЕТ ДЛЯ ВАС, ЕСЛИ */}
                <div className="mb-[75px] w-full">
                    <h2 className="text-[40px] font-semibold mb-[40px]">Подойдет для вас, если:</h2>
                    {/* Используем flex-wrap на случай, если экраны будут меньше */}
                    <div className="flex flex-wrap lg:flex-nowrap gap-[15px]">
                        {/* Карточка 1 */}
                        <div className="bg-[#151720] lg:w-[368px] h-[141px] rounded-[30px] px-[20px] py-[31px] flex items-center gap-[25px] shrink-0">
                            <span className="text-[#BCEC30] text-[75px] font-medium leading-[1]">1</span>
                            <p className="text-white flex flex-row flex-wrap text-[22px] leading-[22px] break-words">
                                <span>Давно хотели</span>
                                <span>попробовать йогу,</span>
                                <span>но не решались начать</span>
                            </p>
                        </div>
                        {/* Карточка 2 */}
                        <div className="bg-[#151720] lg:w-[431px] h-[141px] rounded-[30px] px-[20px] py-[31px] flex items-center gap-[25px] shrink-0">
                            <span className="text-[#BCEC30]  text-[75px] font-medium leading-[1]">2</span>
                            <p className="text-white flex flex-row flex-wrap text-[24px] leading-[22px] break-words">
                                <span>Хотите укрепить</span>
                                <span>позвоночник, избавиться</span>
                                <span>от болей в спине и суставах</span>
                            </p>
                        </div>
                        {/* Карточка 3 */}
                        <div className="bg-[#151720] lg:w-[327px] h-[141px] rounded-[30px] px-[20px] py-[31px] flex items-center gap-[25px] shrink-0">
                            <span className="text-[#BCEC30] text-[75px] font-medium leading-[1]">3</span>
                            <p className="text-white flex flex-row flex-wrap text-[24px] leading-[22px] break-words">
                                <span>Ищете активность,</span>
                                <span>полезную для тела</span>
                                <span>и души</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* 3. БЛОК: НАПРАВЛЕНИЯ */}
                <div className="mx-auto w-full px-4 lg:px-0 mb-[75px]">
                    <h2 className="text-[24px] md:text-[40px] font-semibold">Направления</h2>
                    <div className="mt-6 md:mt-10 w-full rounded-[30px] bg-[#BCEC30] p-7 flex flex-col md:flex-row md:flex-wrap gap-6 md:gap-x-[124px] md:gap-y-[34px]">
                        {/* Рендерим направления динамически из базы */}
                        {course.directions.map((direction, index) => (
                            <span key={index} className="w-[284px] text-black text-lg md:text-2xl">
                                ✦ {direction}
                            </span>
                        ))}
                    </div>
                </div>

                {/* 4. БЛОК: НАЧНИТЕ ПУТЬ */}
                <div className="relative w-full">
                    {/* Белый блок с тенью. */}
                    <div className="relative mx-4 sm:mx-8 lg:mx-auto z-10 rounded-[30px] p-[30px] sm:p-8 lg:p-10 bg-white shadow-[0px_4px_67px_-12px_rgba(0,0,0,0.13)] lg:max-w-[1160px] max-h-[486px] overflow-hidden lg:overflow-visible flex items-center justify-between">

                        {/* Контентная (текстовая) часть */}
                        <div className="w-full sm:max-w-[500px] lg:w-[437px] flex flex-col gap-7 z-30">
                            <h2 className="text-black w-[398px] text-[32px] sm:text-[44px] lg:text-6xl font-medium leading-[38px] sm:leading-[52px] lg:leading-[60px]">
                                Начните путь к новому телу
                            </h2>
                            <ul className="list-disc list-outside pl-[30px] text-black/60 text-lg sm:text-xl lg:text-2xl leading-snug lg:leading-7 marker:text-base">
                                <li className="pb-[10px]">проработка всех групп мышц</li>
                                <li className="pb-[10px]">тренировка суставов</li>
                                <li className="pb-[10px]">улучшение циркуляции крови</li>
                                <li className="pb-[10px]">упражнения заряжают бодростью</li>
                                <li className="pb-1">помогают противостоять стрессам</li>
                            </ul>

                            {isLoggedIn ? (
                                <Button
                                    onClick={handleAddCourse}
                                    disabled={isAdding} // Блокируем кнопку, пока идет запрос
                                    className="w-full sm:w-[380px] lg:w-[437px] h-[50px] lg:h-[52px] text-black"
                                    variant="primary"
                                >
                                    {isAdding ? "Добавляем..." : "Добавить курс"}
                                </Button>
                            ) : (
                                <Link href="/login">
                                    <Button className="w-full sm:w-[380px] lg:w-[437px] h-[50px] lg:h-[52px] text-black" variant="primary">
                                        Войдите, чтобы добавить курс
                                    </Button>
                                </Link>
                            )}
                        </div>

                        {/* ДЕКОРАТИВНАЯ ЧАСТЬ: Векторы и Парень */}
                        <div className="hidden lg:block pointer-events-none">
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
                                className="absolute top-[30px] right-[380px] w-[50px] h-auto z-10"
                            />

                            {/* Фото бегуна в стартовой позиции */}
                            <img
                                src="/Boy.png"
                                alt="Спортсмен"
                                className="absolute bottom-[20px] right-[30px] h-auto w-auto z-20 object-contain"
                            />
                        </div>

                    </div>
                </div>

            </main>
        </>
    );
}