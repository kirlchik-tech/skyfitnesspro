// Файл: app/register/page.tsx
import React from "react";
import { Button } from "@/components/UI/Button";
import { MyInput } from "@/components/UI/Input"; 
import Link from "next/link"; // Компонент Next.js для ссылок

export default function RegisterPage() {
  return (
    // Контейнер на весь экран с центрированием
    <div className="min-h-screen w-full flex items-center justify-center bg-[#FAFAFA]">
      
      {/* Белая карточка */}
      <div className="w-[366px] bg-white rounded-[30px] px-[40px] py-[30px] shadow-[0px_4px_67px_-12px_#00000021] flex flex-col items-center">
        
        {/* Логотип */}
        <div className="flex items-center gap-[10px] mb-[30px]">
   <div className="flex justify-center mb-[5px]">
  <img src="/Logo.svg" alt="Логотип SkyFitnessPro" />
  </div>
  <Link href="/" className="flex items-center">
  <img src="/SkyFitnessPro.svg" alt="SkyFitnessPro" className="h-[29px] w-auto" />
</Link>
</div>

        {/* Поля ввода (здесь их 3, как в макете) */}
        <div className="w-full flex flex-col gap-[10px] mb-[30px]">
          <MyInput type="email" placeholder="Эл. почта" />
          <MyInput type="password" placeholder="Пароль" />
          <MyInput type="password" placeholder="Повторите пароль" />
        </div>

        {/* Кнопки меняются ролями */}
        <div className="w-full flex flex-col gap-[10px]">
          <Button variant="primary" className="w-[280px] h-[52px]">Зарегистрироваться</Button>
          
          {/* Ссылка переведет нас обратно на страницу входа */}
          <Link href="/login" className="w-full">
            <Button variant="secondary" className="w-[280px] h-[52px]">Войти</Button>
          </Link>
        </div>

      </div>
    </div>
  );
}