'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Header } from '@/components/UI/Header';
import { Button } from '@/components/UI/Button';
import { PurchasedCourseCard } from '@/components/UI/PurchasedCourseCard';
import { WorkoutSelectModal } from '@/components/UI/WorkoutSelectModal';

export default function ProfilePage() {
  const { isLoggedIn, user, logout } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  // Стейт для реальных курсов из БД
  const [myCourses, setMyCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCourseForModal, setSelectedCourseForModal] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Функция для загрузки купленных курсов
  const fetchMyCourses = async () => {
    if (!user?.email) return;
    try {
      const res = await fetch('/api/users/my-courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email })
      });
      if (res.ok) {
        const data = await res.json();
        setMyCourses(data);
      }
    } catch (error) {
      console.error("Ошибка загрузки курсов", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Вызываем загрузку курсов, когда юзер авторизовался
  useEffect(() => {
    if (isClient && isLoggedIn && user) {
      fetchMyCourses();
    }
  }, [isClient, isLoggedIn, user]);

  // Функция удаления курса 
  const handleRemoveCourse = async (courseNameId: string) => {
    // 1. Сохраняем копию текущего списка курсов ДО удаления
    const previousCourses = [...myCourses];

    // 2. Оптимистичное удаление из UI (мгновенно прячем карточку)
    setMyCourses((prev) => prev.filter(c => c.name_id !== courseNameId));

    try {
      const res = await fetch('/api/users/remove-course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user?.email, courseNameId })
      });

      // Если запрос прошел, но сервер вернул ошибку (например, 500)
      if (!res.ok) {
        throw new Error("Сервер не смог удалить курс");
      }
    } catch (error) {
      console.error("Ошибка при удалении:", error);

      // 3. Откат изменений: возвращаем курсы из "слепка" обратно в UI
      setMyCourses(previousCourses);
      alert("Не удалось удалить курс. Проверьте интернет и попробуйте еще раз.");
    }
  };

  // ЗАЩИТА МАРШРУТА
  useEffect(() => {
    if (isClient && !isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, isClient, router]);

  if (!isClient || !isLoggedIn) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <>
      <Header />
      <main className="max-w-[1160px] w-full mx-auto flex flex-col items-center md:items-stretch pb-[60px] md:pb-[100px] px-[16px] xl:px-0 mt-[16px] md:mt-[40px]">

        <h1 className="w-[343px] md:w-full text-[24px] md:text-[48px] font-medium mb-[24px] md:mb-[40px] leading-[110%]">
          Профиль
        </h1>

        <div className="bg-white w-[343px] md:w-full max-w-[1160px] h-auto md:h-[257px] rounded-[30px] p-[30px] shadow-[0px_4px_67px_-12px_#00000021] flex flex-col md:flex-row items-center gap-[30px] md:gap-[33px] mb-[24px] md:mb-[60px]">
          <div className="w-[141px] h-[141px] md:w-[197px] md:h-[197px] overflow-hidden flex items-center justify-center shrink-0">
            <img src="/Profile.svg" alt="Иконка убрать курс" className="w-full h-full object-contain" />
          </div>
          <div className="w-full md:w-auto flex flex-col items-start">
            <h2 className="text-[24px] md:text-[32px] weight-[500] font-medium mb-[20px] leading-[110%]">{user?.name}</h2>
            <p className="text-[16px] md:text-[18px] text-black mb-[30px] md:mb-[44px] leading-[110%] break-all">Логин: {user?.email}</p>
            <Button onClick={handleLogout} variant="secondary" className="w-full md:w-[192px] h-[52px]">
              Выйти
            </Button>
          </div>
        </div>

        <h2 className="w-[343px] md:w-full text-[24px] md:text-[48px] font-medium mb-[24px] md:mb-[40px] leading-[110%]">
          Мои курсы
        </h2>

        {/* СЕТКА ДЛЯ КУПЛЕННЫХ КУРСОВ */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px] md:gap-[40px] justify-items-center md:justify-items-stretch">
          {myCourses.map((course) => (
            <PurchasedCourseCard
              key={course.name_id}
              title={course.title}
              imageSrc={course.imageSrc}
              name_id={course.name_id}
              progress={course.calculatedProgress || 0}
              onRemove={handleRemoveCourse}
              onStart={(id) => setSelectedCourseForModal(id)}
            />
          ))}
        </div>

      </main>
      {/* Рендерим модалку поверх всего. Передаем ID выбранного курса */}
      <WorkoutSelectModal
        isOpen={!!selectedCourseForModal}
        onClose={() => setSelectedCourseForModal(null)}
        courseId={selectedCourseForModal}
      />
    </>
  );
}