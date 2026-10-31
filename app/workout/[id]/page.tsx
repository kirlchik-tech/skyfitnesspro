'use client';

import React, { useState, useEffect, use } from 'react';
import { ProgressModal, Exercise } from '@/components/UI/ProgressModal';
import { Header } from '@/components/UI/Header';
import { Button } from '@/components/UI/Button';
import { useAuth } from '@/context/AuthContext';
import {
  getWorkoutById,
  getWorkoutProgress,
  saveWorkoutProgress,
  getCourses,
  Workout,
} from '@/lib/api';

export default function SingleWorkoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const { token } = useAuth();

  // Состояние текущей тренировки, названия курса и массива прогресса по упражнениям
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [activeCourseId, setActiveCourseId] = useState<string>('');
  const [courseTitle, setCourseTitle] = useState<string>('Тренировка');
  const [isLoading, setIsLoading] = useState(true);
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [userProgress, setUserProgress] = useState<number[]>([]);

  // 1. Загружаем данные тренировки и текущий прогресс пользователя из REST API
  useEffect(() => {
    if (!token) return;

    const queryCourseId = new URLSearchParams(window.location.search).get('courseId');

    const fetchWorkoutAndProgress = async () => {
      try {
        const [workoutData, allCourses] = await Promise.all([
          getWorkoutById(token, id),
          getCourses(),
        ]);

        setWorkout(workoutData);

        // Определяем курс, к которому относится данная тренировка
        const parentCourse =
          allCourses.find((c) => c._id === queryCourseId) ||
          allCourses.find((c) => c.workouts.includes(id));

        const resolvedCourseId = parentCourse?._id || queryCourseId || '';
        setActiveCourseId(resolvedCourseId);
        if (parentCourse) {
          setCourseTitle(parentCourse.title);
        }

        // Загружаем сохраненный прогресс пользователя по этой тренировке
        if (resolvedCourseId) {
          const savedProgress = await getWorkoutProgress(token, resolvedCourseId, id);
          if (savedProgress.length > 0) {
            setUserProgress(savedProgress);
          } else if (workoutData.exercises) {
            setUserProgress(new Array(workoutData.exercises.length).fill(0));
          }
        }
      } catch {
        // Ошибка обрабатывается экраном "Тренировка не найдена"
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkoutAndProgress();
  }, [id, token]);

  // 2. Отправляем обновленный прогресс упражнений в API
  const handleProgressSubmit = async (values: number[]) => {
    setUserProgress(values); // Оптимистичное обновление шкалы прогресса в интерфейсе

    if (!token || !activeCourseId) return;

    try {
      await saveWorkoutProgress(token, activeCourseId, id, values);
    } catch {
      // Игнорируем ошибку при фоновом сохранении
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-stratos text-2xl">
        Загрузка...
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="min-h-screen flex items-center justify-center font-stratos text-2xl">
        Тренировка не найдена
      </div>
    );
  }

  return (
    <>
      <Header hideSubtitle={true} />
      <main className="max-w-[1160px] w-full mx-auto flex flex-col items-center md:items-stretch pb-[60px] md:pb-[100px] px-[16px] xl:px-0 mt-[16px] md:mt-[40px]">
        {/* Заголовок курса */}
        <h1 className="w-[343px] md:w-full font-stratos text-[24px] md:text-[60px] font-normal md:font-medium mb-[24px] md:mb-[40px] leading-[110%] tracking-[0px] lining-nums proportional-nums">
          {courseTitle}
        </h1>

        {/* Блок видеоплеера */}
        <div className="w-[343px] md:w-full h-[189px] md:h-auto md:aspect-video rounded-[15px] md:rounded-[30px] overflow-hidden mb-[24px] md:mb-[40px] shadow-[0px_4px_67px_-12px_#00000021] bg-black">
          <iframe
            width="100%"
            height="100%"
            src={workout.video}
            title={workout.name}
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>

        {/* Блок упражнений и прогресс-баров (если в уроке есть упражнения) */}
        {workout.exercises && workout.exercises.length > 0 && (
          <div className="w-[343px] md:w-full bg-white rounded-[30px] shadow-[0px_4px_67px_-12px_#00000021] p-[30px] md:p-[40px] flex flex-col gap-[24px] md:gap-[30px]">
            <h2 className="font-stratos text-[32px] font-normal leading-[110%] tracking-[0px] lining-nums proportional-nums">
              Упражнения тренировки
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-[40px] gap-y-[24px] md:gap-y-[30px]">
              {workout.exercises.map((ex: Exercise, idx: number) => {
                const exName = ex.name.split(' (')[0];
                const currentVal = Number(userProgress[idx]) || 0;
                const maxQuantity = Number(ex.quantity) || 1;

                // Расчет процента выполнения конкретного упражнения (не более 100%)
                const percent = Math.min(100, Math.round((currentVal / maxQuantity) * 100));

                return (
                  <div key={idx} className="flex flex-col gap-[10px]">
                    <div className="flex justify-between items-center font-roboto text-[16px] md:text-[18px] font-normal text-black leading-[110%]">
                      <span>
                        {exName} {percent}%
                      </span>
                    </div>
                    <div className="w-full bg-[#F7F7F7] h-[6px] rounded-[50px] overflow-hidden">
                      <div
                        className="bg-[#00C1FF] h-full rounded-[50px] transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

            <Button
              onClick={() => setIsProgressModalOpen(true)}
              variant="primary"
              className="w-full sm:w-[320px] h-[52px] mt-[10px]"
            >
              {userProgress.reduce((sum, val) => sum + val, 0) > 0
                ? 'Обновить свой прогресс'
                : 'Заполнить свой прогресс'}
            </Button>
          </div>
        )}
      </main>

      {/* Модальное окно ввода результатов */}
      {workout && workout.exercises && (
        <ProgressModal
          isOpen={isProgressModalOpen}
          onClose={() => setIsProgressModalOpen(false)}
          exercises={workout.exercises}
          initialValues={userProgress}
          onSubmit={handleProgressSubmit}
        />
      )}
    </>
  );
}