'use client';

import React from 'react';
import { Button } from './Button';
import { ProfileIcon } from '../icons/ProfileIcon';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';


export const Header = () => {
  const { isLoggedIn, user, logout } = useAuth();
  return (
    // Ограничиваем максимальную ширину (max-w-[1160px]) и центрируем (mx-auto).
    <header className="w-full max-w-[1160px] mx-auto flex items-start justify-between pt-[30px] pb-[40px]">

      {/* ЛЕВЫЙ БЛОК: Логотип и текст под ним. Используем flex-col для колонки */}
      <div className="flex flex-col gap-[15px]">

        {/* логотип svg */}
        <Link href="/" className="flex items-center w-full">
          <img src="/Logo.svg" alt="SkyFitnessPro" className="h-[35px] w-auto" />
        </Link>


        <p className="text-[18px] font-normal text-[#000000] opacity-50 tracking-tight">
          Онлайн-тренировки для занятий дома
        </p>
      </div>


      {/* ПРАВЫЙ БЛОК: Динамическая часть */}
      <div>
        {isLoggedIn ? (
          // Если залогинен — показываем аватарку и имя 
          <div
            onClick={logout}
            title="Нажмите, чтобы выйти"
            className="flex items-center gap-[17px] cursor-pointer"
          >
            <div className="w-[42px] h-[42px] bg-[#FFFFFF] rounded-full overflow-hidden flex justify-center items-center">
              <ProfileIcon color="#D9D9D9" />
            </div>
            <span className="text-[24px] font-normal text-black">{user?.name}</span>
            <img src="/Rectangle.svg" alt="Раскрыть меню" />
          </div>
        ) : (
          // Если не залогинен — кнопка "Войти" ведет на страницу /login
          <Link href="/login">
            <Button className="w-[103px] h-[52px]" variant="primary">
              Войти
            </Button>
          </Link>
        )}
      </div>

    </header>
  );
};