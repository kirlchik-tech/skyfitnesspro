import React from 'react';
import { Button } from './Button';
import { ProfileIcon } from '../icons/ProfileIcon';


interface HeaderProps {
  isLoggedIn?: boolean; 
  userName?: string;    
}

export const Header = ({ isLoggedIn = false, userName = 'Пользователь' }: HeaderProps) => {
  return (
    // Ограничиваем максимальную ширину (max-w-[1160px]) и центрируем (mx-auto).
    <header className="w-full max-w-[1160px] mx-auto flex items-start justify-between pt-[30px] pb-[40px]">
      
      {/* ЛЕВЫЙ БЛОК: Логотип и текст под ним. Используем flex-col для колонки */}
      <div className="flex flex-col gap-[15px]">
        
        {/* логотип svg */}
        <a href="/" className="no-underline flex items-center gap-[10px]">
          
          <img src="/Logo.svg" alt="Логотип SkyFitnessPro" />
          
          <span className="text-[24px] font-[900] tracking-tight text-[#000000]">
            SkyFitnessPro
          </span>
        </a>

        <p className="text-[18px] font-normal text-[#000000] opacity-50 tracking-tight">
          Онлайн-тренировки для занятий дома
        </p>
      </div>


      {/* ПРАВЫЙ БЛОК: Динамическая часть */}
      <div>
        {/* Условный рендеринг: если isLoggedIn равен true, показываем профиль */}
        {isLoggedIn ? (
          
          <div className="flex items-center gap-[12px] cursor-pointer">
            {/* Кружок аватарки */}
            <div className="w-[42px] h-[42px] bg-[#D9D9D9] rounded-full overflow-hidden flex justify-center items-center">
              {/* Иконка человечка */}
              <ProfileIcon color="#FFFFFF" />
            </div>
            
            {/* Имя и стрелочка */}
            <span className="text-[24px] font-normal text-black">{userName}</span>
            <img src="/Rectangle.svg" alt="Раскрыть меню">
            </img>
          </div>

        ) : (
          
          /* Если isLoggedIn равен false, показываем кнопку входа */
          <Button className="w-[103px] h-[52px]" variant="primary">Войти</Button>

        )}
      </div>

    </header>
  );
}