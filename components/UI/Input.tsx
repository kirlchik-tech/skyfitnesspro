import React from 'react';

// Интерфейс будет принимать текст ошибки
interface MyInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  errorText?: string; // Текст ошибки, который придет снаружи 
}

export const MyInput = ({ errorText, className, ...restProps }: MyInputProps) => {
  // 2. Вычисляем наличие ошибки: если текст передали, значит ошибка есть
  const hasError = Boolean(errorText);

  // 3. Базовые классы Tailwind (ширина, паддинги, скругления, рамка по умолчанию)
  const baseInputStyles = "w-[280px] max-w-full h-[52px] rounded-lg px-[18px] py-[16px] text-[16px] md:text-[18px] border outline-none ";

  // 4. Тернарник с классами Tailwind. Если ошибка есть -> красная рамка, иначе -> серая
  const borderStyles = hasError ? "border-[#DB0030]" : "border-[#D0CECE]";

  return (
    // 5. Оборачиваем всё в flex-контейнер, чтобы расположить элементы колонкой
    <div className="flex flex-col gap-2 w-full items-center">

      <input
        className={`${baseInputStyles} ${borderStyles} ${className || ''}`}
        {...restProps}
      />

      {/*6. Условный рендеринг: если hasError === true, рисуем span с текстом */}
      {hasError && (
        <span className="text-sm text-[#DB0030] text-center max-w-[280px]">
          {errorText}
        </span>
      )}

    </div>
  );
};