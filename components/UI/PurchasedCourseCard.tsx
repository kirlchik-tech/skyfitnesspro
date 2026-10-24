import React from 'react';
import Link from 'next/link';
import { Button } from './Button';

interface PurchasedCourseCardProps {
    title: string;
    imageSrc: string;
    name_id: string;
    progress: number;
    onRemove: (id: string) => void;
    onStart: (id: string) => void;
}

export const PurchasedCourseCard: React.FC<PurchasedCourseCardProps> = ({ title, imageSrc, name_id, progress, onRemove, onStart }) => {
    return (
        <div className="w-full bg-white rounded-[30px] shadow-[0px_4px_67px_-12px_#00000021] relative flex flex-col overflow-hidden group transition-transform hover:scale-[1.02]">

            {/* ИКОНКА МИНУСА (Удаление курса) */}
            <button onClick={() => onRemove(name_id)} className="absolute top-[20px] right-[20px] z-20 opacity-80 hover:opacity-100 hover:scale-110 transition-all cursor-pointer">
                <img src="/Minus.svg" alt="Минус" />
            </button>

            {/* Картинка курса */}
            <div className="w-full h-[325px] rounded-[20px] overflow-hidden relative flex justify-center items-end">
                <img className="w-full h-full object-contain" src={imageSrc} alt={title} />
            </div>

            {/* Текстовый блок и прогресс */}
            <div className="flex flex-col px-[30px] pt-[20px] pb-[30px]">
                <h3 className="text-[32px] font-[500] text-black leading-[35px] mb-[20px]">
                    {title}
                </h3>

                {/* Прогресс бар */}
                <div className="flex flex-col gap-2 mb-[30px]">
                    <span className="text-[18px] font-normal text-black/70">Прогресс {progress}%</span>
                    <div className="w-full h-[10px] bg-[#F4F5F6] rounded-[20px] overflow-hidden">
                        {/* Динамическая синяя полоска */}
                        <div
                            className="h-full bg-[#00C1FF] rounded-[20px] transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>

                {/* ВЫЗЫВАЕМ ПОПАП ВМЕСТО ПРЯМОГО ПЕРЕХОДА */}
                <Button onClick={() => onStart(name_id)} variant="primary" className="w-full h-[52px] text-black">
                    {progress === 100 ? "Начать заново" : progress > 0 ? "Продолжить" : "Начать тренировки"}
                </Button>
            </div>
        </div>
    );
};