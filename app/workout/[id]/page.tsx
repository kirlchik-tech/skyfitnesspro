'use client';

import React, { useState, useEffect, use } from 'react';
import { ProgressModal } from '@/components/UI/ProgressModal';
import { Header } from '@/components/UI/Header';
import { Button } from '@/components/UI/Button';
import { useAuth } from '@/context/AuthContext'; // ИМПОРТ АВТОРИЗАЦИИ

export default function SingleWorkoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuth(); // ДОСТАЕМ ЮЗЕРА

  const [workout, setWorkout] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [userProgress, setUserProgress] = useState<number[]>([]);

  // 1. Загружаем данные о тренировке и прогресс юзера из БД
  useEffect(() => {
    const fetchWorkoutAndProgress = async () => {
      try {
        // Грузим саму тренировку
        const resWorkout = await fetch(`/api/workout/${id}`);
        if (!resWorkout.ok) throw new Error('Not found');
        const workoutData = await resWorkout.json();
        setWorkout(workoutData);

        // Грузим прогресс из БД, если юзер авторизован
        if (user?.email) {
          const resProgress = await fetch(`/api/users/progress?email=${user.email}`);
          cache: 'no-store'
          if (resProgress.ok) {
            const progressData = await resProgress.json();
            // Если в БД уже есть данные для этой тренировки — ставим их, иначе нули
            if (progressData[id]) {
              setUserProgress(progressData[id]);
            } else if (workoutData.exercises) {
              setUserProgress(new Array(workoutData.exercises.length).fill(0));
            }
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchWorkoutAndProgress();
    }
  }, [id, user]);

  // 2. Отправляем новый прогресс в БД
  const handleProgressSubmit = async (values: number[]) => {
    setUserProgress(values); // Сразу обновляем интерфейс (Optimistic UI)

    if (!user?.email) return;

    try {
      await fetch('/api/users/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          workoutId: id,
          progress: values
        })
      });
    } catch (e) {
      console.error("Ошибка сохранения в БД:", e);
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center font-stratos text-2xl">Загрузка...</div>;
  if (!workout) return <div className="min-h-screen flex items-center justify-center font-stratos text-2xl">Тренировка не найдена</div>;

  const courseTitle = workout.course ? workout.course.replace(' на каждый день', '') : 'Тренировка';

  return (
    <>
      <Header hideSubtitle={true} />
      <main className="max-w-[1160px] w-full mx-auto flex flex-col pb-[100px] px-4 lg:px-0 mt-[40px]">

        <h1 className="font-stratos text-[40px] md:text-[60px] font-medium mb-[40px] leading-[110%]">
          {courseTitle}
        </h1>

        <div className="w-full aspect-video rounded-[30px] overflow-hidden mb-[40px] shadow-[0px_4px_67px_-12px_#00000021] bg-black">
          <iframe width="100%" height="100%" src={workout.video} title={workout.name} frameBorder="0" allowFullScreen></iframe>
        </div>

        {workout.exercises && workout.exercises.length > 0 && (
          <div className="w-full bg-white rounded-[30px] shadow-[0px_4px_67px_-12px_#00000021] p-[30px] md:p-[40px] flex flex-col gap-[30px]">
            <h2 className="font-stratos text-[32px] font-medium leading-[110%]">{workout.name}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-[40px] gap-y-[30px]">
              {workout.exercises.map((ex: any, idx: number) => {
                const exName = ex.name.split(' (')[0];
                const currentVal = Number(userProgress[idx]) || 0;
                const maxQuantity = Number(ex.quantity) || 1;

                // Считаем процент выполнения
                const percent = Math.min(100, Math.round((currentVal / maxQuantity) * 100));

                return (
                  <div key={idx} className="flex flex-col gap-[10px]">
                    <div className="flex justify-between items-center font-roboto text-[16px] font-normal text-black leading-[110%]">
                      <span>{exName}</span>
                      <span>{percent}%</span>
                    </div>
                    <div className="w-full bg-[#F4F5F6] h-[8px] rounded-[10px] overflow-hidden">
                      <div className="bg-[#00C1FF] h-full transition-all duration-500" style={{ width: `${percent}%` }}></div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Динамический текст кнопки */}
            <Button onClick={() => setIsProgressModalOpen(true)} variant="primary" className="w-full sm:w-[320px] h-[52px] mt-[10px]">
              {/* Проверяем сумму всех чисел в массиве */}
              {userProgress.reduce((sum, val) => sum + val, 0) > 0
                ? "Обновить свой прогресс"
                : "Заполнить свой прогресс"}
            </Button>
          </div>
        )}
      </main>

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