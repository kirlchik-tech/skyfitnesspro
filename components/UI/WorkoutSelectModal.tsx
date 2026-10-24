import React from 'react';
import { Button } from './Button';

interface WorkoutSelectModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const WorkoutSelectModal: React.FC<WorkoutSelectModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        // Полупрозрачный темный фон на весь экран
        <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
            onClick={onClose} // Закрываем при клике на фон
        >
            {/* Само белое окно */}
            <div
                className="bg-white rounded-[30px] w-[460px] p-[40px] flex flex-col items-center relative"
                onClick={(e) => e.stopPropagation()} // Чтобы клик по окну не закрывал его
            >
                <h2 className="text-[32px] font-medium mb-[40px]">
                    Выберите тренировку
                </h2>

                {/* Контейнер для скролла списка */}
                <div className="w-full max-h-[350px] overflow-y-auto pr-4 mb-[40px] custom-scrollbar flex flex-col gap-3">

                    {/* Элемент списка (Выполненный) */}
                    <div className="w-full border-b border-black/10 pb-3 flex items-center gap-[15px] cursor-pointer">
                        {/* Зеленая галочка (выполнено) */}
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="14" cy="14" r="13" stroke="#BCEC30" strokeWidth="2" />
                            <circle cx="14" cy="14" r="14" fill="#BCEC30" />
                            <path d="M8.40039 15.3996L12.6004 18.1996L19.6004 11.1992" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="flex flex-col">
                            <span className="text-[20px] text-black">Утренняя практика</span>
                            <span className="text-[14px] text-black/50">Йога на каждый день / 1 день</span>
                        </div>
                    </div>

                    {/* Элемент списка (Невыполненный) */}
                    <div className="w-full border-b border-black/10 pb-3 flex items-center gap-[15px] cursor-pointer">
                        {/* Пустой кружок */}
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="14" cy="14" r="13" stroke="black" strokeWidth="2" />
                        </svg>
                        <div className="flex flex-col">
                            <span className="text-[20px] text-black">Асаны стоя</span>
                            <span className="text-[14px] text-black/50">Йога на каждый день / 3 день</span>
                        </div>
                    </div>

                </div>

                <Button variant="primary" className="w-[280px] h-[52px]">
                    Начать
                </Button>
            </div>
        </div>
    );
};