'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

// 1. Описываем, какие данные и функции будут доступны во всем приложении
interface AuthContextType {
  isLoggedIn: boolean;
  userName: string;
  login: (name?: string) => void;
  logout: () => void;
}

// 2. Создаем сам контекст
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Создаем компонент-провайдер, который будет хранить состояние
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('Алексей');
  const router = useRouter();

  // Функция входа: меняет стейт и перекидывает на главную
  const login = (name: string = 'Алексей') => {
    setIsLoggedIn(true);
    setUserName(name);
    router.push('/'); // редирект на главную страницу после входа
  };

  // Функция выхода
  const logout = () => {
    setIsLoggedIn(false);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 4. Кастомный хук для удобного использования в любом компоненте
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return context;
};