import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from '@/components/UI/Button';
import { MyInput } from '@/components/UI/Input';
import { ProgressModal } from '@/components/UI/ProgressModal';

// 1. ТЕСТЫ БАЗОВЫХ UI-КОМПОНЕНТОВ
describe('UI Компоненты (Button & MyInput)', () => {
    it('Кнопка корректно рендерит текст и реагирует на клик', () => {
        const handleClick = vi.fn();
        render(<Button onClick={handleClick}>Начать тренировки</Button>);

        const btn = screen.getByText('Начать тренировки');
        expect(btn).toBeInTheDocument();

        fireEvent.click(btn);
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('Инпут показывает текст ошибки и включает красную рамку при передаче errorText', () => {
        render(
            <MyInput
                placeholder="Пароль"
                errorText="Пароли не совпадают!"
            />
        );

        const input = screen.getByPlaceholderText('Пароль');
        const errorSpan = screen.getByText('Пароли не совпадают!');

        expect(errorSpan).toBeInTheDocument();
        expect(input.className).toContain('border-[#DB0030]');
    });
});

// 2. ТЕСТЫ ДВИЖКА ПРОГРЕССА ТРЕНИРОВОК (ProgressModal)
describe('Движок заполнения прогресса (ProgressModal)', () => {
    const mockExercises = [
        { name: 'Наклон вперед (10 повторений)', quantity: 10 },
        { name: 'Наклон назад (10 повторений)', quantity: 10 },
        { name: 'Поднятие ног, согнутых в коленях (5 повторений)', quantity: 5 },
    ];

    it('Не дает отправить пустые поля и выводит ошибку валидации', () => {
        const handleSubmit = vi.fn();

        render(
            <ProgressModal
                isOpen={true}
                onClose={vi.fn()}
                exercises={mockExercises}
                initialValues={[0, 0, 0]}
                onSubmit={handleSubmit}
            />
        );

        const saveBtn = screen.getByText('Сохранить');
        fireEvent.click(saveBtn);

        expect(screen.getByText('Пожалуйста, заполните все поля!')).toBeInTheDocument();
        expect(handleSubmit).not.toHaveBeenCalled();
    });

    it('Ограничивает ввод числа максимумом упражнения (защита от 101% прогресса)', () => {
        render(
            <ProgressModal
                isOpen={true}
                onClose={vi.fn()}
                exercises={mockExercises}
                initialValues={[0, 0, 0]}
                onSubmit={vi.fn()}
            />
        );

        const inputs = screen.getAllByPlaceholderText('0') as HTMLInputElement[];

        // Пытаемся ввести 61 наклон при максимуме 10
        fireEvent.change(inputs[0], { target: { value: '61' } });
        expect(inputs[0].value).toBe('10');

        // Пытаемся ввести отрицательное число
        fireEvent.change(inputs[1], { target: { value: '-5' } });
        expect(inputs[1].value).toBe('0');
    });

    it('Подтягивает ранее сохраненный прогресс (initialValues) и успешно отправляет новые числа', () => {
        const handleSubmit = vi.fn();

        render(
            <ProgressModal
                isOpen={true}
                onClose={vi.fn()}
                exercises={mockExercises}
                initialValues={[6, 7, 2]}
                onSubmit={handleSubmit}
            />
        );

        const inputs = screen.getAllByPlaceholderText('0') as HTMLInputElement[];

        // Проверяем, что старый прогресс подтянулся в поля ввода
        expect(inputs[0].value).toBe('6');
        expect(inputs[1].value).toBe('7');
        expect(inputs[2].value).toBe('2');

        // Обновляем первое поле до 10 и жмем Сохранить
        fireEvent.change(inputs[0], { target: { value: '10' } });
        fireEvent.click(screen.getByText('Сохранить'));

        // Проверяем, что в БД ушел массив строгих чисел [10, 7, 2]
        expect(handleSubmit).toHaveBeenCalledWith([10, 7, 2]);

        // Проверяем, что появилось окно успеха с галочкой
        expect(screen.getByText(/Ваш прогресс/i)).toBeInTheDocument();
    });
});

// 3. ТЕСТЫ БИЗНЕС-ЛОГКИ (Математика процентов и валидация Email)
describe('Бизнес-логика: Расчет процентов и валидация почты', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    it('Пропускает корректные email и блокирует логины без @ и домена', () => {
        expect(emailRegex.test('sergey.petrov96@mail.ru')).toBe(true);
        expect(emailRegex.test('user@gmail.com')).toBe(true);

        expect(emailRegex.test('ppopopopo')).toBe(false);
        expect(emailRegex.test('user@mail')).toBe(false);
        expect(emailRegex.test('user@mail.r')).toBe(false);
    });

    it('Корректно считает процент выполнения упражнения и курса (не превышая 100%)', () => {
        const calcExercisePercent = (current: number, max: number) =>
            Math.min(100, Math.round((current / (max || 1)) * 100));

        expect(calcExercisePercent(0, 20)).toBe(0);
        expect(calcExercisePercent(5, 10)).toBe(50);
        expect(calcExercisePercent(10, 10)).toBe(100);
        expect(calcExercisePercent(25, 10)).toBe(100); // Защита от превышения 100%
    });
});