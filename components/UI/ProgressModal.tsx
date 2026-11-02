'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from './Button';

export interface Exercise {
    _id?: string;
    name: string;
    quantity: number;
}

interface ProgressModalProps {
    isOpen: boolean;
    onClose: () => void;
    exercises: Exercise[];
    initialValues?: number[];
    onSubmit: (values: number[]) => void;
}

export const ProgressModal: React.FC<ProgressModalProps> = ({
    isOpen,
    onClose,
    exercises,
    initialValues = [],
    onSubmit,
}) => {
    const [values, setValues] = useState<string[]>([]);
    const [errorText, setErrorText] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    // Отслеживаем момент открытия модалки, чтобы обновление initialValues после сохранения не сбивало экран успеха
    const wasOpenRef = useRef(false);

    useEffect(() => {
        if (isOpen && !wasOpenRef.current) {
            wasOpenRef.current = true;
            setIsSuccess(false);
            setErrorText('');
            if (exercises && exercises.length > 0) {
                const mapped = exercises.map((_, idx) => {
                    const initVal = initialValues[idx];
                    return initVal !== undefined && initVal > 0 ? String(initVal) : '';
                });
                setValues(mapped);
            }
        } else if (!isOpen) {
            wasOpenRef.current = false;
        }
    }, [isOpen, exercises, initialValues]);

    // Автоматическое закрытие плашки «Ваш прогресс засчитан!» через 2.5 секунды
    useEffect(() => {
        if (!isSuccess) return;
        const timer = setTimeout(() => {
            setIsSuccess(false);
            onClose();
        }, 2500);

        return () => clearTimeout(timer);
    }, [isSuccess, onClose]);

    if (!isOpen) return null;

    const handleChange = (index: number, rawValue: string) => {
        setErrorText('');
        if (rawValue === '') {
            const updated = [...values];
            updated[index] = '';
            setValues(updated);
            return;
        }

        const num = Number(rawValue);
        if (Number.isNaN(num)) return;

        const maxQuantity = exercises[index]?.quantity ?? 100;
        const clamped = Math.max(0, Math.min(maxQuantity, num));

        const updated = [...values];
        updated[index] = String(clamped);
        setValues(updated);
    };

    const handleSubmit = () => {
        if (values.some((v) => v.trim() === '')) {
            setErrorText('Пожалуйста, заполните все поля!');
            return;
        }

        const numericValues = values.map((v) => Number(v) || 0);
        setIsSuccess(true);
        onSubmit(numericValues);
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-[16px]"
            onClick={() => {
                setIsSuccess(false);
                onClose();
            }}
        >
            {isSuccess ? (
                /* Плашка подтверждения «Ваш прогресс засчитан!» */
                <div
                    className="bg-white rounded-[30px] w-[343px] md:w-[426px] p-[40px] flex flex-col items-center text-center shadow-[0px_4px_67px_-12px_#00000021]"
                    onClick={(e) => e.stopPropagation()}
                >
                    <h2 className="font-roboto text-[32px] md:text-[40px] font-medium text-black leading-[110%] mb-[34px]">
                        Ваш прогресс
                        <br />
                        засчитан!
                    </h2>

                    <svg
                        width="68"
                        height="68"
                        viewBox="0 0 68 68"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M34.0003 62.3332C49.6484 62.3332 62.3337 49.6479 62.3337 33.9998C62.3337 18.3518 49.6484 5.6665 34.0003 5.6665C18.3523 5.6665 5.66699 18.3518 5.66699 33.9998C5.66699 49.6479 18.3523 62.3332 34.0003 62.3332ZM33.7549 45.7467L49.3383 27.33L45.0124 23.6697L31.556 39.5727L23.8076 30.7174L19.543 34.4489L29.4597 45.7823C30.0031 46.4033 30.7903 46.7566 31.6155 46.7497C32.4407 46.7429 33.2219 46.3766 33.7549 45.7467Z"
                            fillRule="evenodd"
                            clipRule="evenodd"
                            fill="#BCEC30"
                        />
                    </svg>
                </div>
            ) : (
                /* Форма ввода результатов тренировки */
                <div
                    className="bg-white rounded-[30px] w-[343px] md:w-[426px] p-[30px] md:p-[40px] flex flex-col items-start relative shadow-[0px_4px_67px_-12px_#00000021]"
                    onClick={(e) => e.stopPropagation()}
                >
                    <h2 className="font-roboto text-[32px] font-normal text-black mb-[30px] md:mb-[48px] leading-[110%]">
                        Мой прогресс
                    </h2>

                    <div className="w-full max-h-[320px] md:max-h-[360px] overflow-y-auto pr-2 mb-[24px] md:mb-[34px] custom-scrollbar flex flex-col gap-[20px]">
                        {exercises.map((ex, idx) => (
                            <div key={idx} className="flex flex-col gap-[10px] w-full">
                                <label className="font-roboto text-[16px] md:text-[18px] font-normal text-black leading-[110%]">
                                    Сколько раз вы сделали {ex.name.split(' (')[0].toLowerCase()}?
                                </label>
                                <input
                                    type="number"
                                    min={0}
                                    max={ex.quantity}
                                    placeholder="0"
                                    value={values[idx] ?? ''}
                                    onChange={(e) => handleChange(idx, e.target.value)}
                                    className="w-full h-[47px] md:h-[52px] rounded-[8px] border border-[#D0CECE] px-[18px] font-roboto text-[16px] md:text-[18px] text-black outline-none focus:border-black"
                                />
                            </div>
                        ))}
                    </div>

                    {errorText && (
                        <p className="font-roboto text-[14px] text-[#DB0030] mb-[16px] text-center w-full">
                            {errorText}
                        </p>
                    )}

                    <Button onClick={handleSubmit} variant="primary" className="w-full h-[52px]">
                        Сохранить
                    </Button>
                </div>
            )}
        </div>
    );
};