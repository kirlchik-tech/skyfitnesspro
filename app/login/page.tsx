'use client';

import React, { useState } from "react";
import { Button } from "@/components/UI/Button";
import { MyInput } from "@/components/UI/Input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from '@/context/AuthContext';
import Home from "../page";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  // 2. Создаем состояния для хранения данных из инпутов
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorText, setErrorText] = useState(""); // Для ошибок от сервера

  // 3. Создаем функцию отправки данных
  const handleLogin = async () => {
    // Сбрасываем старую ошибку при новой попытке
    setErrorText("");

    try {
      const response = await fetch("/api/fitness/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password
        }),
      });

      // Если сервер ответил ошибкой (например, статус 400 или 401)
      if (!response.ok) {
        throw new Error("Неверный email или пароль");
      }

      // Если всё отлично, расшифровываем ответ сервера
      const data = await response.json();

      // Передаем имя или email в контекст авторизации
      login({ name: data.name || "Пользователь", email: email });

    } catch (error: unknown) {
      // Если что-то пошло не так (неверный пароль или упал интернет)
      if (error instanceof Error) {
        setErrorText(error.message);
      }
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Главная страница на фоне */}
      <div className="pointer-events-none select-none">
        <Home />
      </div>

      {/* Оверлей поверх главной страницы */}
      <div
        className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center px-[16px]"
        onClick={() => router.push('/')}
      >
        {/* Белая карточка (343px на мобилке, 366px на ПК) */}
        <div
          className="w-[343px] md:w-[366px] bg-white rounded-[30px] px-[31px] md:px-[40px] py-[30px] shadow-[0px_4px_67px_-12px_#00000021] flex flex-col items-center"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Логотип */}
          <div className="flex items-center mb-[36px] md:mb-[47px] justify-center w-full">
            <img src="/Logo.svg" alt="SkyFitnessPro" className="h-[35px] w-auto" />
          </div>

          {/* Поля ввода */}
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

          {/* Кнопки */}
          <div className="w-full flex flex-col gap-[10px] items-center">
            <Button onClick={handleLogin} variant="primary" className="w-[280px] h-[52px]">Войти</Button>

            {/* Ссылка переведет нас на страницу регистрации */}
            <Link href="/register" className="w-full flex justify-center">
              <Button variant="secondary" className="w-[280px] h-[52px]">Зарегистрироваться</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}