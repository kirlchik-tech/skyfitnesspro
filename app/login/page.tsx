'use client';

import React, { useState } from "react";
import { Button } from "@/components/UI/Button";
import { MyInput } from "@/components/UI/Input"
import Link from "next/link"; // Компонент Next.js для ссылок без перезагрузки страницы
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();

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
      login(data.name || email);

    } catch (error: any) {
      // Если что-то пошло не так (неверный пароль или упал интернет)
      setErrorText(error.message);
    }
  };
  return (

    // Контейнер на весь экран с центрированием
    <div className="min-h-screen w-full flex items-center justify-center bg-[#FAFAFA]">
      {/* Белая карточка */}
      <div className="w-[366px] bg-white rounded-[30px] px-[40px] py-[30px] shadow-[0px_4px_67px_-12px_#00000021] flex flex-col items-center">

        {/* Логотип */}
        <div className="flex items-center mb-[47px] justify-center w-full">
          <img src="/Logo.svg" alt="SkyFitnessPro" className="h-[35px] w-auto" />
        </div>


        {/* Поля ввода */}
        <div className="w-full flex flex-col gap-[10px] mb-[30px]">
          {/*  компонент <Input /> */}
          <MyInput
            type="email" // Для API нужен email
            placeholder="Эл. почта"
            value={email} // Привязываем значение
            onChange={(e) => setEmail(e.target.value)} // Обновляем стейт при вводе
          />
          <MyInput
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            errorText={errorText} // Прокидываем ошибку 
          />
        </div>

        {/* Кнопки */}
        <div className="w-full flex flex-col gap-[10px]">
          <Button onClick={handleLogin} variant="primary" className="w-[280px] h-[52px]">Войти</Button>

          {/* Ссылка переведет нас на страницу регистрации*/}
          <Link href="/register" className="w-full">
            <Button variant="secondary" className="w-[280px] h-[52px]">Зарегистрироваться</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}