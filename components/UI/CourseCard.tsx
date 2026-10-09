import React from 'react';

// 1. Описываем, какие данные принимает карточка
interface CourseCardProps {
  title: string;        // Название 
  bgClass: string;      // Класс для цвета фона картинки (например, "bg-[#FFC700]")
  // imageSrc?: string; // Позже добавим путь к картинке
}

export const CourseCard = ({ title, bgClass }: CourseCardProps) => {
  return (
    // Главный белый контейнер карточки
    <div className="w-[360px] bg-white rounded-[30px] p-[30px] shadow-sm flex flex-col gap-[20px] relative transition-transform hover:scale-[1.02]">
      
      {/* Плюсик в правом верхнем углу картинки (абсолютное позиционирование) */}
      <div className="absolute top-[40px] right-[40px] z-10 cursor-pointer">
        {/* SVG иконка плюсика  */}
        <div className="w-[27px] h-[27px] bg-white/80 rounded-full flex justify-center items-center font-bold text-black">
          +
        </div>
      </div>

      {/* Цветной блок для картинки */}
      <div className={`w-full h-[300px] ${bgClass} rounded-[20px] overflow-hidden relative flex justify-center items-center`}>
         {/* В будущем тут будет тег <img /> с прозрачным фоном */}
         <span className="text-white/50 font-bold">Картинка курса</span>
      </div>

      {/* Текстовый блок */}
      <h3 className="text-[32px] font-[900] text-black leading-tight">
        {title}
      </h3>

      {/* Плашки с информацией */}
      <div className="flex gap-[10px] text-[16px] text-black font-normal">
        <div className="bg-[#F4F5F6] rounded-[50px] px-[14px] py-[6px] flex items-center gap-[6px]">
          {/* Иконка календаря */}
          <span>📅</span> 25 дней
        </div>
        <div className="bg-[#F4F5F6] rounded-[50px] px-[14px] py-[6px] flex items-center gap-[6px]">
          {/* Иконка часов */}
          <span>⏱</span> 20-50 мин/день
        </div>
      </div>

    </div>
  );
};