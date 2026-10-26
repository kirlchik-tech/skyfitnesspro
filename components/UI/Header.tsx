'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from './Button';
import { useRouter } from 'next/navigation';
import { ProfileIcon } from '../icons/ProfileIcon';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';


interface HeaderProps {
  hideSubtitle?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ hideSubtitle }) => {
  const { isLoggedIn, user, logout } = useAuth();
  const router = useRouter();

  // Стейт для открытия/закрытия выпадающего меню профиля
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Закрываем меню при клике вне его области
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleGoToProfile = () => {
    setIsMenuOpen(false);
    router.push('/profile');
  };

  const handleLogout = () => {
    setIsMenuOpen(false);
    logout();
    router.push('/');
  };

  return (
    // Ограничиваем максимальную ширину (max-w-[1160px]) и центрируем (mx-auto).
    <header className="w-full max-w-[1160px] mx-auto flex items-start justify-between pt-[30px] pb-[40px]">

      {/* ЛЕВЫЙ БЛОК: Логотип и текст под ним. Используем flex-col для колонки */}
      <div className="flex flex-col gap-[15px]">

        {/* логотип svg */}
        <Link href="/" className="flex items-center w-full">
          <img src="/Logo.svg" alt="SkyFitnessPro" className="h-[35px] w-auto" />
        </Link>


        {!hideSubtitle && (
          <span className="text-[#000000]/50 text-[14px] md:text-[18px] font-normal leading-[110%]">
            Онлайн-тренировки для занятий дома
          </span>
        )}
      </div>


      {/* ПРАВЫЙ БЛОК: Динамическая часть */}
      {isLoggedIn ? (
        <div className="relative" ref={menuRef}>
          {/* Кнопка-триггер в шапке: Аватарка + Имя + Стрелочка */}
          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="flex items-center gap-[12px] md:gap-[16px] cursor-pointer outline-none group"
          >
            <div className="w-[42px] h-[42px] bg-[#FFFFFF] rounded-full overflow-hidden flex justify-center items-center">
              <ProfileIcon color="#D9D9D9" />
            </div>
            <span className="text-[24px] font-normal text-black">{user?.name}</span>
            {/* Стрелочка вниз (поворачивается при открытии) */}
            <svg
              width="14"
              height="9"
              viewBox="0 0 14 9"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`}
            >
              <path d="M1 1L7 7L13 1" stroke="black" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>


          {isMenuOpen && (
            <div className="absolute right-0 top-[65px] w-[266px] bg-white rounded-[30px] p-[30px] shadow-[0px_4px_67px_-12px_#00000021] z-50 flex flex-col items-center">
              <span className="font-roboto text-[18px] font-normal text-black leading-[110%] mb-[10px] text-center break-all">
                {user?.name}
              </span>
              <span className="font-roboto text-[18px] font-normal text-[#999999] leading-[110%] mb-[34px] text-center break-all">
                {user?.email}
              </span>

              <div className="w-full flex flex-col gap-[10px]">
                <Button
                  onClick={handleGoToProfile}
                  variant="primary"
                  className="w-full h-[52px]"
                >
                  Мой профиль
                </Button>

                <Button
                  onClick={handleLogout}
                  variant="secondary"
                  className="w-full h-[52px]"
                >
                  Выйти
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <Link href="/login">
          <Button className="w-[85px] h-[36px] md:w-[103px] md:h-[52px]" variant="primary">
            Войти
          </Button>
        </Link>
      )}
    </header>
  );
};