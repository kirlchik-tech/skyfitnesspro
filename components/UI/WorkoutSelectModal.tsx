import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { useRouter } from 'next/navigation';

interface Workout {
    _id: string;
    name: string;
    course: string;
}

interface WorkoutSelectModalProps {
    isOpen: boolean;
    onClose: () => void;
    courseId: string | null; // ID курса, по которому кликнули (например, "yoga")
}

export const WorkoutSelectModal: React.FC<WorkoutSelectModalProps> = ({ isOpen, onClose, courseId }) => {
    const router = useRouter();
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(null);


    // Как только окно открывается и у нас есть courseId — запрашиваем список уроков
    useEffect(() => {
        if (isOpen && courseId) {
            const fetchWorkouts = async () => {
                setIsLoading(true);
                try {
                    // Делаем запрос к внешнему API, используя courseId
                    const res = await fetch(`/api/workouts?course=${courseId}`);

                    if (!res.ok) throw new Error('Ошибка загрузки');

                    const data = await res.json();
                    // Предположим, API возвращает объект { data: [...] } или массив напрямую
                    const fetchedWorkouts = data.data || data;
                    setWorkouts(fetchedWorkouts);

                    // По умолчанию ничего не выбрано, пока пользователь не кликнет
                    setSelectedWorkoutId(null);
                } catch (error) {
                    console.error("Ошибка при получении уроков:", error);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchWorkouts();
        }
    }, [isOpen, courseId]);

    // Если окно закрыто — не рендерим ничего
    if (!isOpen) return null;

    // Обработчик кнопки "Начать"
    const handleStart = () => {
        if (selectedWorkoutId) {
            // Перекидываем пользователя на страницу конкретной тренировки
            router.push(`/workout/${selectedWorkoutId}`);
        }
    };

    return (
        <div
            className="fixed  inset-0 bg-black/50 z-50 flex items-center justify-center"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-[30px] w-[460px] p-[40px] flex flex-col items-center relative"
                onClick={(e) => e.stopPropagation()}
            >

                <h2 className="font-stratos text-black text-[32px] font-medium mb-[40px] text-center leading-[110%]">
                    Выберите тренировку
                </h2>

                <div className="w-full max-h-[350px] overflow-y-auto pr-4 mb-[48px] custom-scrollbar flex flex-col gap-[10px]">
                    {isLoading ? (
                        <div className="text-center text-black/50">Загрузка тренировок...</div>
                    ) : workouts.length === 0 ? (
                        <div className="text-center text-black/50">Для этого курса пока нет уроков</div>
                    ) : (
                        workouts.map((workout, index) => {
                            const isSelected = selectedWorkoutId === workout._id;

                            return (
                                <div
                                    key={workout._id}
                                    onClick={() => setSelectedWorkoutId(workout._id)}

                                    className="w-full border-b border-[#C4C4C4] pb-[10px] flex items-center gap-[17px] cursor-pointer hover:bg-gray-50 px-1 transition-colors"
                                >
                                    {isSelected ? (
                                        <svg width="20" height="20" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                                            <circle cx="14" cy="14" r="13" stroke="#BCEC30" strokeWidth="2" />
                                            <circle cx="14" cy="14" r="14" fill="#BCEC30" />
                                            <path d="M8.40039 15.3996L12.6004 18.1996L19.6004 11.1992" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    ) : (
                                        <svg width="20" height="20" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                                            <circle cx="14" cy="14" r="13" stroke="black" strokeWidth="2" />
                                        </svg>
                                    )}

                                    <div className="flex flex-col">

                                        <span className="font-['Roboto'] text-[24px] font-normal text-black leading-[110%] mb-[6px]">
                                            {workout.name}
                                        </span>

                                        <span className="font-['Roboto'] text-[16px] font-normal text-black leading-[110%]">
                                            {workout.course} / {index + 1} день
                                        </span>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>

                <Button
                    onClick={handleStart}
                    variant="primary"
                    className="w-[380px] h-[52px]"
                    disabled={!selectedWorkoutId}
                >
                    Начать
                </Button>
            </div>
        </div>
    );
};