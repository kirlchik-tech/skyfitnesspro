'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserMe, getCourses, resolveCourse, apiAddCourse, apiRemoveCourse } from '@/lib/api';

interface User {
  name: string;
  email: string;
  token?: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  token: string | null;
  selectedCourses: string[];
  login: (userData: User, token?: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  addCourse: (courseId: string) => Promise<void>;
  removeCourse: (courseId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  user: null,
  token: null,
  selectedCourses: [],
  login: async () => { },
  logout: () => { },
  refreshUser: async () => { },
  addCourse: async () => { },
  removeCourse: async () => { },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

  // Синхронизируем выбранные курсы пользователя вместе с локальными идентификаторами верстки
  const fetchUserCourses = async (jwt: string) => {
    try {
      const [profile, allCourses] = await Promise.all([getUserMe(jwt), getCourses()]);
      const expandedKeys = new Set<string>();

      (profile.selectedCourses || []).forEach((id) => {
        expandedKeys.add(id);
        const matched = allCourses.find((c) => c._id === id);
        if (matched) {
          matched.aliases.forEach((alias) => expandedKeys.add(alias));
        }
      });

      setSelectedCourses(Array.from(expandedKeys));
    } catch {
      // Игнорируем ошибку при первоначальной проверке
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('skyfitness_user');
    const savedToken = localStorage.getItem('skyfitness_token');
    if (savedUser && savedToken) {
      const parsedUser: User = JSON.parse(savedUser);
      setUser(parsedUser);
      setToken(savedToken);
      fetchUserCourses(savedToken);
    }
  }, []);

  const login = async (userData: User, jwt?: string) => {
    const activeToken = jwt || userData.token || '';
    const displayName = userData.email ? userData.email.split('@')[0] : userData.name;
    const finalUser = { ...userData, name: displayName, token: activeToken };

    setUser(finalUser);
    setToken(activeToken);
    localStorage.setItem('skyfitness_user', JSON.stringify(finalUser));
    if (activeToken) {
      localStorage.setItem('skyfitness_token', activeToken);
      await fetchUserCourses(activeToken);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setSelectedCourses([]);
    localStorage.removeItem('skyfitness_user');
    localStorage.removeItem('skyfitness_token');
  };

  const refreshUser = async () => {
    if (token) {
      await fetchUserCourses(token);
    }
  };

  const addCourse = async (courseId: string) => {
    if (!token) return;
    const resolved = await resolveCourse(courseId);
    const keysToAdd = resolved ? resolved.aliases : [courseId];

    setSelectedCourses((prev) => Array.from(new Set([...prev, ...keysToAdd])));
    try {
      await apiAddCourse(token, courseId);
    } catch (err) {
      await fetchUserCourses(token);
      throw err;
    }
  };

  const removeCourse = async (courseId: string) => {
    if (!token) return;
    const resolved = await resolveCourse(courseId);
    const keysToRemove = new Set(resolved ? resolved.aliases : [courseId]);

    setSelectedCourses((prev) => prev.filter((id) => !keysToRemove.has(id)));
    try {
      await apiRemoveCourse(token, courseId);
    } catch (err) {
      await fetchUserCourses(token);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!user && !!token,
        user,
        token,
        selectedCourses,
        login,
        logout,
        refreshUser,
        addCourse,
        removeCourse,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);