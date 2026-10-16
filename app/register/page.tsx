'use client';

import React, { useState } from "react";
import { Button } from "@/components/UI/Button";
import { MyInput } from "@/components/UI/Input"; 
import Link from "next/link"; // Компонент Next.js для ссылок
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const { login } = useAuth();

  // Правильно объявляем стейты
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorText, setErrorText] = useState(""); // Для ошибок от сервера
  const [repeatPassword, setRepeatPassword] = useState("")

  // Создаем функцию отправки данных
  const handleRegister = async () => {
    // Сбрасываем старую ошибку при новой попытке
    setErrorText("");
    //Проверяем пароли ДО запроса к серверу
    if (!email || !password) {
     setErrorText("Заполните все поля!");
     return;
      }

    //Провеярем пароли на сходство
    if (password !== repeatPassword) { setErrorText("Пароли не совпадают!"); return; }

    try {
      const response = await fetch("/api/fitness/auth/register", {
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
        throw new Error("Такое Email уже есть или данные некорректны!");
      }

      // Если всё отлично, расшифровываем ответ сервера
      const data = await response.json();
      
      // Передаем имя (или email) в наш контекст регистрации!
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
          <MyInput 
            type="email" // Для API обычно нужен email
            placeholder="Эл. почта" 
            value={email} // Привязываем значение
            onChange={(e) => setEmail(e.target.value)} // Обновляем стейт при вводе
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
            errorText={errorText} // Прокидываем ошибку (инпут покраснеет!)
          />
        </div>

        {/* Кнопки меняются ролями */}
        <div className="w-full flex flex-col gap-[10px]">
          <Button onClick={handleRegister} variant="primary" className="w-[280px] h-[52px]">Зарегистрироваться</Button>
          {/* Ссылка переведет нас обратно на страницу входа */}
          <Link href="/login" className="w-full">
            <Button variant="secondary" className="w-[280px] h-[52px]">Войти</Button>
          </Link>
        </div>

      </div>
    </div>
  );
}