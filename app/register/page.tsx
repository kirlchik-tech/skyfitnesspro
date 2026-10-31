'use client';

import React, { useState } from 'react';
import { Button } from '@/components/UI/Button';
import { MyInput } from '@/components/UI/Input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Home from '../page';
import { apiRegister, apiLogin } from '@/lib/api';

export default function RegisterPage() {
  // Достаем метод авторизации из глобального контекста
  const { login } = useAuth();
  const router = useRouter();

  // Состояния для полей формы регистрации и текста ошибки валидации
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [errorText, setErrorText] = useState('');

  // Обработчик отправки формы регистрации
  const handleRegister = async () => {
    setErrorText('');

    // 1. Проверка на заполненность обязательных полей
    if (!email || !password) {
      setErrorText('Заполните все поля!');
      return;
    }

    // 2. Валидация формата электронной почты регулярным выражением
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email.trim())) {
      setErrorText('Введите корректный email (например, name@mail.ru или name@gmail.com)');
      return;
    }

    // 3. Проверка совпадения введенных паролей
    if (password !== repeatPassword) {
      setErrorText('Пароли не совпадают!');
      return;
    }

    try {
      // Регистрируем нового пользователя через внешний REST API
      await apiRegister(email.trim(), password);
      // Сразу выполняем вход для получения JWT-токена сессии
      const token = await apiLogin(email.trim(), password);
      // Сохраняем данные в глобальный контекст и переходим в профиль
      await login({ name: email.split('@')[0], email: email.trim() }, token);
      router.push('/profile');
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorText(error.message);
      }
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Фоновое отображение главной страницы */}
      <div className="pointer-events-none select-none">
        <Home />
      </div>

      {/* Затемняющий оверлей модального окна */}
      <div
        className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center px-[16px]"
        onClick={() => router.push('/')}
      >
        {/* Карточка формы регистрации */}
        <div
          className="w-[343px] md:w-[366px] bg-white rounded-[30px] px-[31px] md:px-[40px] py-[30px] shadow-[0px_4px_67px_-12px_#00000021] flex flex-col items-center"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Логотип */}
          <div className="flex items-center mb-[36px] md:mb-[47px] justify-center w-full">
            <img src="/Logo.svg" alt="SkyFitnessPro" className="h-[35px] w-auto" />
          </div>

          {/* Поля ввода почты, пароля и подтверждения пароля */}
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

          {/* Кнопки управления */}
          <div className="w-full flex flex-col gap-[10px] items-center">
            <Button onClick={handleRegister} variant="primary" className="w-[280px] h-[52px]">
              Зарегистрироваться
            </Button>

            <Link href="/login" className="w-full flex justify-center">
              <Button variant="secondary" className="w-[280px] h-[52px]">
                Войти
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}