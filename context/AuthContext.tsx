'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// тип нашего пользователя(строчный)
export interface User {
  email: string;
  name: string;
}

// Описываем, какие данные и функции будут доступны во всем приложении
interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null; // храним объект пользователя целиком
  login: (userData: User) => void; // При логине передаем объект
  logout: () => void;
}

//  Создаем сам контекст
const AuthContext = createContext<AuthContextType | undefined>(undefined);

//  Создаем компонент-провайдер, который будет хранить состояние
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // Имитация проверки localStorage при загрузке (чтобы не разлогинивало при F5)
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
  }, []);

  // Функция входа
  const login = (userData: User) => {
    setIsLoggedIn(true);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData)); // Сохраняем, чтобы не сбросилось при F5
    router.push('/');
  };

  // Функция выхода
  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

//  Кастомный хук для удобного использования в любом компоненте
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return context;
};