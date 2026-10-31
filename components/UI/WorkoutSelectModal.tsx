import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
    getCourseWorkouts,
    getUserMe,
    isWorkoutCompletedCheck,
    Workout,
    WorkoutProgressItem,
} from '@/lib/api';

interface WorkoutSelectModalProps {
    isOpen: boolean;
    onClose: () => void;
    courseId: string | null;
}

export const WorkoutSelectModal: React.FC<WorkoutSelectModalProps> = ({
    isOpen,
    onClose,
    courseId,
}) => {
    const router = useRouter();
    const { token } = useAuth();

    // Список тренировок выбранного курса
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    // Прогресс по тренировкам данного курса из профиля пользователя
    const [workoutsProgress, setWorkoutsProgress] = useState<WorkoutProgressItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(null);

    // При открытии модального окна запрашиваем тренировки курса и прогресс пользователя
    useEffect(() => {
        if (isOpen && courseId && token) {
            const fetchWorkoutsAndProgress = async () => {
                setIsLoading(true);
                try {
                    const [fetchedWorkouts, userProfile] = await Promise.all([
                        getCourseWorkouts(token, courseId),
                        getUserMe(token),
                    ]);

                    setWorkouts(fetchedWorkouts);
                    setSelectedWorkoutId(null);

                    const courseProg = userProfile.courseProgress.find(
                        (cp) => cp.courseId === courseId
                    );
                    setWorkoutsProgress(courseProg?.workoutsProgress || []);
                } catch {
                    setWorkouts([]);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchWorkoutsAndProgress();
        }
    }, [isOpen, courseId, token]);

    if (!isOpen) return null;

    // Проверяем, завершена ли конкретная тренировка на 100%
    const isCompleted = (workout: Workout): boolean => {
        const wp = workoutsProgress.find((item) => item.workoutId === workout._id);
        return isWorkoutCompletedCheck(workout, wp);
    };

    // Переход к выбранной тренировке с передачей ID курса в query-параметре
    const handleStart = () => {
        if (selectedWorkoutId && courseId) {
            router.push(`/workout/${selectedWorkoutId}?courseId=${courseId}`);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-[16px]"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-[30px] w-[343px] md:w-[460px] p-[30px] md:p-[40px] flex flex-col items-center relative"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="font-stratos text-black text-[32px] font-normal mb-[30px] md:mb-[40px] w-full text-left md:text-center leading-[110%] tracking-[0px] lining-nums proportional-nums">
                    Выберите тренировку
                </h2>

                <div className="w-full max-h-[310px] md:max-h-[350px] overflow-y-auto pr-3 md:pr-4 mb-[34px] md:mb-[48px] custom-scrollbar flex flex-col gap-[10px]">
                    {isLoading ? (
                        <div className="text-center text-black/50">Загрузка тренировок...</div>
                    ) : workouts.length === 0 ? (
                        <div className="text-center text-black/50">Для этого курса пока нет уроков</div>
                    ) : (
                        workouts.map((workout, index) => {
                            const isSelected = selectedWorkoutId === workout._id;
                            const completed = isCompleted(workout);

                            return (
                                <div
                                    key={workout._id}
                                    onClick={() => setSelectedWorkoutId(workout._id)}
                                    className={`w-full border-b border-[#C4C4C4] pb-[10px] pt-[6px] flex items-center gap-[15px] md:gap-[17px] cursor-pointer px-2 rounded-t-[8px] transition-colors ${isSelected ? 'bg-[#F4F5F6]' : 'hover:bg-gray-50'
                                        }`}
                                >
                                    {isSelected || completed ? (
                                        <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 28 28"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="shrink-0"
                                        >
                                            <circle cx="14" cy="14" r="13" stroke="#BCEC30" strokeWidth="2" />
                                            <circle cx="14" cy="14" r="14" fill="#BCEC30" />
                                            <path
                                                d="M8.40039 15.3996L12.6004 18.1996L19.6004 11.1992"
                                                stroke="white"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    ) : (
                                        <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 28 28"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="shrink-0"
                                        >
                                            <circle cx="14" cy="14" r="13" stroke="black" strokeWidth="2" />
                                        </svg>
                                    )}

                                    <div className="flex flex-col">
                                        <span className="font-['Roboto'] text-[18px] md:text-[24px] font-normal text-black leading-[110%] mb-[6px]">
                                            {workout.name}
                                        </span>
                                        <span className="font-['Roboto'] text-[14px] md:text-[16px] font-normal text-black leading-[110%]">
                                            Урок {index + 1}
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                <Button
                    onClick={handleStart}
                    variant="primary"
                    className="w-full md:w-[380px] h-[52px]"
                    disabled={!selectedWorkoutId}
                >
                    Начать
                </Button>
            </div>
        </div>
    );
};