'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from './Button';
import { MyInput } from './Input';
import { useRouter } from 'next/navigation';
import { ProfileIcon } from '../icons/ProfileIcon';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { apiLogin, apiRegister } from '@/lib/api';

interface HeaderProps {
  hideSubtitle?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ hideSubtitle }) => {
  const { isLoggedIn, user, login, logout } = useAuth();
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    const handleOpenAuthModal = () => {
      setErrorText('');
      setAuthModalMode('login');
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('open-auth-modal', handleOpenAuthModal);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('open-auth-modal', handleOpenAuthModal);
    };
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

  const handleLoginSubmit = async () => {
    setErrorText('');
    if (!email || !password) {
      setErrorText('Заполните все поля!');
      return;
    }
    try {
      const token = await apiLogin(email.trim(), password);
      await login({ name: email.split('@')[0], email: email.trim() }, token);
      setAuthModalMode(null);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorText(error.message);
      }
    }
  };

  const handleRegisterSubmit = async () => {
    setErrorText('');
    if (!email || !password) {
      setErrorText('Заполните все поля!');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email.trim())) {
      setErrorText('Введите корректный email (например, name@mail.ru или name@gmail.com)');
      return;
    }

    if (password !== repeatPassword) {
      setErrorText('Пароли не совпадают!');
      return;
    }

    try {
      await apiRegister(email.trim(), password);
      const token = await apiLogin(email.trim(), password);
      await login({ name: email.split('@')[0], email: email.trim() }, token);
      setAuthModalMode(null);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorText(error.message);
      }
    }
  };

  return (
    <>
      <header className="w-full max-w-[1160px] mx-auto flex items-center md:items-start justify-between pt-[46px] pb-[40px] md:pt-[30px] md:pb-[40px] px-[16px] xl:px-0">
        <div className="flex flex-col gap-[15px]">
          <Link href="/" className="flex items-center w-full">
            <img src="/Logo.svg" alt="SkyFitnessPro" className="md:h-[35px] w-auto" />
          </Link>

          {!hideSubtitle && (
            <span className="hidden md:block text-[#000000]/50 text-[14px] md:text-[18px] font-normal leading-[110%]">
              Онлайн-тренировки для занятий дома
            </span>
          )}
        </div>

        {isLoggedIn ? (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="flex items-center gap-[12px] md:gap-[16px] cursor-pointer outline-none group"
            >
              <div className="w-[36px] h-[36px] md:w-[42px] md:h-[42px] bg-[#FFFFFF] rounded-full overflow-hidden flex justify-center items-center">
                <ProfileIcon color="#D9D9D9" />
              </div>
              <span className="hidden md:inline text-[24px] font-normal text-black">{user?.name}</span>

              <svg
                width="10"
                height="7"
                viewBox="0 0 10 7"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`md:hidden transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`}
              >
                <path d="M8.70715 0.707031L4.70715 4.70703L0.707153 0.707031" strokeWidth="2" stroke="black" />
              </svg>

              <svg
                width="14"
                height="9"
                viewBox="0 0 14 9"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`hidden md:block transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`}
              >
                <path d="M1 1L7 7L13 1" stroke="black" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 top-[50px] md:top-[65px] w-[266px] bg-white rounded-[30px] p-[30px] shadow-[0px_4px_67px_-12px_#00000021] z-50 flex flex-col items-center">
                <span className="font-roboto text-[18px] font-normal text-black leading-[110%] mb-[10px] text-center break-all">
                  {user?.name}
                </span>
                <span className="font-roboto text-[18px] font-normal text-[#999999] leading-[110%] mb-[34px] text-center break-all">
                  {user?.email}
                </span>

                <div className="w-full flex flex-col gap-[10px]">
                  <Button onClick={handleGoToProfile} variant="primary" className="w-full h-[52px]">
                    Мой профиль
                  </Button>
                  <Button onClick={handleLogout} variant="secondary" className="w-full h-[52px]">
                    Выйти
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Button
            onClick={() => {
              setErrorText('');
              setAuthModalMode('login');
            }}
            className="w-[83px] h-[36px] md:w-[103px] md:h-[52px]"
            variant="primary"
          >
            Войти
          </Button>
        )}
      </header>

      {authModalMode && !isLoggedIn && (
        <div
          className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center px-[16px]"
          onClick={() => setAuthModalMode(null)}
        >
          <div
            className="w-[343px] md:w-[366px] bg-white rounded-[30px] px-[31px] md:px-[40px] py-[30px] shadow-[0px_4px_67px_-12px_#00000021] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center mb-[36px] md:mb-[47px] justify-center w-full">
              <img src="/Logo.svg" alt="SkyFitnessPro" className="h-[35px] w-auto" />
            </div>

            {authModalMode === 'login' ? (
              <>
                <div className="w-full flex flex-col gap-[10px] mb-[30px] items-center">
                  <MyInput
                    type="email"
                    placeholder="Эл. почта"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <MyInput
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    errorText={errorText}
                  />
                </div>

                <div className="w-full flex flex-col gap-[10px] items-center">
                  <Button onClick={handleLoginSubmit} variant="primary" className="w-[280px] h-[52px]">
                    Войти
                  </Button>
                  <Button
                    onClick={() => {
                      setErrorText('');
                      setAuthModalMode('register');
                    }}
                    variant="secondary"
                    className="w-[280px] h-[52px]"
                  >
                    Зарегистрироваться
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="w-full flex flex-col gap-[10px] mb-[30px] items-center">
                  <MyInput
                    type="email"
                    placeholder="Эл. почта"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <MyInput
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <MyInput
                    type="password"
                    placeholder="Повторите пароль"
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    errorText={errorText}
                  />
                </div>

                <div className="w-full flex flex-col gap-[10px] items-center">
                  <Button onClick={handleRegisterSubmit} variant="primary" className="w-[280px] h-[52px]">
                    Зарегистрироваться
                  </Button>
                  <Button
                    onClick={() => {
                      setErrorText('');
                      setAuthModalMode('login');
                    }}
                    variant="secondary"
                    className="w-[280px] h-[52px]"
                  >
                    Войти
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};