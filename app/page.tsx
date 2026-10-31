'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/UI/Header';
import { CourseCard } from '@/components/UI/CourseCard';
import { getCourses, ApiCourse } from '@/lib/api';

export default function HomePage() {
  // Состояние для хранения списка курсов, полученных из внешнего REST API
  const [courses, setCourses] = useState<ApiCourse[]>([]);
  // Состояние индикатора первичной загрузки данных
  const [isLoading, setIsLoading] = useState(true);

  // Загружаем каталог курсов при монтировании компонента
  useEffect(() => {
    const fetchAllCourses = async () => {
      try {
        const data = await getCourses();
        setCourses(data);
      } catch {
        // В случае сетевой ошибки оставляем пустой массив
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllCourses();
  }, []);

  // Функция плавного скролла к началу страницы
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Header />
      <main className="max-w-[1160px] w-full mx-auto flex flex-col items-center md:items-stretch pb-[60px] md:pb-[81px] px-[16px] xl:px-0">
        {/* Верхний блок с главным заголовком и декоративным стикером */}
        <div className="w-[343px] md:w-full flex justify-between items-start mb-[34px] md:mb-[50px]">
          <h1 className="font-stratos text-[32px] md:text-[60px] font-medium text-black leading-[110%] max-w-[343px] md:max-w-[850px]">
            Начните заниматься спортом и улучшите качество жизни
          </h1>

          {/* Декоративный бейдж (отображается только на десктопе) */}
          <div className="hidden lg:flex relative bg-[#BCEC30] rounded-[5px] px-[20px] py-[16px] max-w-[288px] shrink-0">
            <span className="font-roboto text-[32px] font-normal text-black leading-[110%]">
              Измени своё тело за полгода!
            </span>
          </div>
        </div>

        {/* Сетка карточек курсов */}
        {isLoading ? (
          <div className="w-full py-[60px] text-center font-stratos text-[24px]">
            Загрузка курсов...
          </div>
        ) : (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px] md:gap-[40px] justify-items-center md:justify-items-stretch mb-[34px]">
            {courses.map((course) => (
              <CourseCard
                key={course._id}
                name_id={course._id}
                title={course.title}
                imageSrc={course.cardImageSrc}
              />
            ))}
          </div>
        )}

        {/* Кнопка возврата к началу страницы */}
        <div className="w-[343px] md:w-full flex justify-end md:justify-center mt-[10px]">
          <button
            type="button"
            onClick={scrollToTop}
            className="bg-[#BCEC30] hover:bg-[#C6FF00] active:bg-[#000000] active:text-white text-black font-roboto text-[18px] font-normal rounded-[46px] px-[24px] py-[12px] h-[52px] w-[127px] flex items-center justify-center transition-colors cursor-pointer"
          >
            Наверх ↑
          </button>
        </div>
      </main>
    </>
  );
}