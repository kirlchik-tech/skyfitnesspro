import React, { useState, useEffect } from 'react';
import { Button } from './Button';

export interface Exercise {
    name: string;
    quantity: number;
}

interface ProgressModalProps {
    isOpen: boolean;
    onClose: () => void;
    exercises: Exercise[];
    initialValues: number[];
    onSubmit: (values: number[]) => void;
}

export const ProgressModal: React.FC<ProgressModalProps> = ({ isOpen, onClose, exercises, initialValues, onSubmit }) => {
    const [values, setValues] = useState<string[]>([]);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    // 1. ИНИЦИАЛИЗАЦИЯ (Срабатывает ТОЛЬКО при открытии окна)
    useEffect(() => {
        if (isOpen) {
            setValues(exercises.map((_, index) => {
                const savedVal = initialValues[index];
                return savedVal && savedVal > 0 ? savedVal.toString() : '';
            }));
            setIsSuccess(false);
            setError('');
        }
    }, [isOpen, exercises, initialValues]);

    // 2. АВТО-ЗАКРЫТИЕ (Если успех = true, ждем 3 секунды и закрываем)
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isSuccess) {
            timer = setTimeout(() => {
                onClose(); // Закрываем окно
            }, 3000); // 3000 мс = 3 секунды
        }
        return () => clearTimeout(timer);
    }, [isSuccess, onClose]);

    if (!isOpen) return null;

    const handleChange = (index: number, val: string) => {
        const newValues = [...values];
        const max = exercises[index].quantity;

        if (val === '') {
            newValues[index] = '';
        } else {
            const num = parseInt(val, 10);
            if (num > max) {
                newValues[index] = max.toString();
            } else if (num < 0) {
                newValues[index] = '0';
            } else {
                newValues[index] = num.toString();
            }
        }
        setValues(newValues);
        setError('');
    };

    const handleSubmit = () => {
        if (values.some(v => v === '')) {
            setError('Пожалуйста, заполните все поля!');
            return;
        }

        const numericValues = values.map(v => Number(v));
        onSubmit(numericValues);
        setIsSuccess(true);
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-[16px] transition-opacity" onClick={onClose}>
            <div className="bg-white rounded-[30px] w-[343px] md:w-[460px] p-[30px] md:p-[40px] flex flex-col items-center relative" onClick={(e) => e.stopPropagation()}>

                {isSuccess ? (
                    <div className="flex flex-col items-center justify-center py-[10px] md:py-[20px]">
                        <h2 className="font-stratos text-[32px] md:text-[40px] font-normal text-center leading-[110%] tracking-[0px] lining-nums proportional-nums mb-[30px] md:mb-[40px]">
                            Ваш прогресс<br />засчитан!
                        </h2>
                        <svg width="57" height="57" viewBox="0 0 57 57" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M28.3333 56.6667C43.9814 56.6667 56.6667 43.9814 56.6667 28.3333C56.6667 12.6853 43.9814 0 28.3333 0C12.6853 0 0 12.6853 0 28.3333C0 43.9814 12.6853 56.6667 28.3333 56.6667ZM28.0879 40.0802L43.6713 21.6635L39.3454 18.0032L25.889 33.9062L18.1406 25.0509L13.876 28.7824L23.7927 40.1158C24.3361 40.7368 25.1233 41.0901 25.9485 41.0832C26.7737 41.0764 27.5549 40.7101 28.0879 40.0802Z" fillRule="evenodd" clipRule="evenodd" fill="#BCEC30" />
                        </svg>
                    </div>
                ) : (
                    <>
                        <h2 className="font-stratos text-[32px] font-normal mb-[30px] md:mb-[40px] leading-[110%] tracking-[0px] lining-nums proportional-nums w-full text-left">
                            Мой прогресс
                        </h2>

                        <div className="w-full flex flex-col gap-[20px] mb-[30px] md:mb-[40px] max-h-[340px] md:max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                            {exercises.map((ex: Exercise, index: number) => {
                                const exName = ex.name.split(' (')[0];
                                return (
                                    <div key={index} className="flex flex-col gap-[10px]">
                                        <label className="font-roboto text-[16px] md:text-[18px] text-black leading-[110%]">
                                            Сколько раз вы сделали {exName.toLowerCase()}?
                                        </label>
                                        <input
                                            type="number"
                                            className="w-full border border-[#D0CECE] rounded-[8px] h-[46px] px-[15px] text-[16px] md:text-[18px] outline-none focus:border-[#BCEC30] transition-colors"
                                            placeholder="0"
                                            value={values[index] ?? ''}
                                            onChange={(e) => handleChange(index, e.target.value)}
                                        />
                                    </div>
                                );
                            })}
                        </div>

                        {error && <span className="text-red-500 text-[14px] mb-[15px]">{error}</span>}

                        <Button onClick={handleSubmit} variant="primary" className="w-full h-[52px]">
                            Сохранить
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
};