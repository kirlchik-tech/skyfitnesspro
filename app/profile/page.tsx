'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Header } from '@/components/UI/Header';
import { Button } from '@/components/UI/Button';
import { PurchasedCourseCard } from '@/components/UI/PurchasedCourseCard';
import { WorkoutSelectModal } from '@/components/UI/WorkoutSelectModal';
import {
  getCourses,
  getUserMe,
  getCourseWorkouts,
  resetCourseProgress,
  calculateCourseProgressPercent,
} from '@/lib/api';

interface UserCourse {
  name_id: string;
  title: string;
  imageSrc: string;
  calculatedProgress: number;
}

export default function ProfilePage() {
  // Достаем данные авторизации, токен и методы из глобального контекста
  const { isLoggedIn, user, token, logout, removeCourse } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  // Состояние для списка приобретенных курсов с рассчитанным процентом прохождения
  const [myCourses, setMyCourses] = useState<UserCourse[]>([]);
  // ID выбранного курса для отображения модального окна выбора тренировки
  const [selectedCourseForModal, setSelectedCourseForModal] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Загружаем профиль пользователя, список его курсов и считаем прогресс по завершенным тренировкам
  const fetchMyCourses = useCallback(async () => {
    if (!token) return;
    try {
      const [allCourses, profile] = await Promise.all([
        getCourses(),
        getUserMe(token),
      ]);

      // Фильтруем только те курсы, которые добавлены пользователем
      const userAddedCourses = allCourses.filter((c) =>
        profile.selectedCourses.includes(c._id)
      );

      // Для каждого курса загружаем список его тренировок и считаем процент полностью пройденных уроков
      const coursesWithProgress: UserCourse[] = await Promise.all(
        userAddedCourses.map(async (course) => {
          try {
            const workouts = await getCourseWorkouts(token, course._id);
            const courseProg = profile.courseProgress.find(
              (cp) => cp.courseId === course._id
            );
            const percent = calculateCourseProgressPercent(workouts, courseProg);

            return {
              name_id: course._id,
              title: course.title,
              imageSrc: course.cardImageSrc,
              calculatedProgress: percent,
            };
          } catch {
            return {
              name_id: course._id,
              title: course.title,
              imageSrc: course.cardImageSrc,
              calculatedProgress: 0,
            };
          }
        })
      );

      setMyCourses(coursesWithProgress);
    } catch {
      // Сетевая ошибка обрабатывается сохранением текущего состояния
    }
  }, [token]);

  useEffect(() => {
    if (isClient && isLoggedIn && token) {
      fetchMyCourses();
    }
  }, [isClient, isLoggedIn, token, fetchMyCourses]);

  // Оптимистичное удаление курса из профиля с откатом при ошибке
  const handleRemoveCourse = async (courseId: string) => {
    const previousCourses = [...myCourses];
    setMyCourses((prev) => prev.filter((c) => c.name_id !== courseId));

    try {
      await removeCourse(courseId);
    } catch {
      setMyCourses(previousCourses);
      alert('Не удалось удалить курс. Проверьте соединение и попробуйте снова.');
    }
  };

  // Обработка нажатия на кнопку карточки курса (если прогресс 100% — сбрасываем прогресс через API)
  const handleStartOrResetCourse = async (course: UserCourse) => {
    if (course.calculatedProgress >= 100 && token) {
      setMyCourses((prev) =>
        prev.map((c) =>
          c.name_id === course.name_id ? { ...c, calculatedProgress: 0 } : c
        )
      );
      try {
        await resetCourseProgress(token, course.name_id);
      } catch {
        // В случае ошибки продолжаем открытие модального окна
      }
    }
    setSelectedCourseForModal(course.name_id);
  };

  // Защита приватного маршрута: перенаправляем неавторизованных пользователей
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

        {/* Карточка с данными пользователя */}
        <div className="bg-white w-[343px] md:w-full max-w-[1160px] h-auto md:h-[257px] rounded-[30px] p-[30px] shadow-[0px_4px_67px_-12px_#00000021] flex flex-col md:flex-row items-center gap-[30px] md:gap-[33px] mb-[24px] md:mb-[60px]">
          <div className="w-[141px] h-[141px] md:w-[197px] md:h-[197px] overflow-hidden flex items-center justify-center shrink-0">
            <img src="/Profile.svg" alt="Аватар профиля" className="w-full h-full object-contain" />
          </div>
          <div className="w-full md:w-auto flex flex-col items-start">
            <h2 className="text-[24px] md:text-[32px] font-medium mb-[20px] leading-[110%]">
              {user?.name}
            </h2>
            <p className="text-[16px] md:text-[18px] text-black mb-[30px] md:mb-[44px] leading-[110%] break-all">
              Логин: {user?.email}
            </p>
            <Button onClick={handleLogout} variant="secondary" className="w-full md:w-[192px] h-[52px]">
              Выйти
            </Button>
          </div>
        </div>

        <h2 className="w-[343px] md:w-full text-[24px] md:text-[48px] font-medium mb-[24px] md:mb-[40px] leading-[110%]">
          Мои курсы
        </h2>

        {/* Сетка добавленных курсов */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px] md:gap-[40px] justify-items-center md:justify-items-stretch">
          {myCourses.map((course) => (
            <PurchasedCourseCard
              key={course.name_id}
              title={course.title}
              imageSrc={course.imageSrc}
              name_id={course.name_id}
              progress={course.calculatedProgress}
              onRemove={handleRemoveCourse}
              onStart={() => handleStartOrResetCourse(course)}
            />
          ))}
        </div>
      </main>

      {/* Модальное окно выбора урока */}
      <WorkoutSelectModal
        isOpen={!!selectedCourseForModal}
        onClose={() => setSelectedCourseForModal(null)}
        courseId={selectedCourseForModal}
      />
    </>
  );
}