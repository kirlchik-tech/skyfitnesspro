import { CourseCard } from "@/components/UI/CourseCard";
import { Header } from "@/components/UI/Header";
import { ScrollToTop } from "@/components/UI/ScrollToTop";


export default function Home() {
  return (
    <>
      <Header />
      <main className="max-w-[1160px] w-full mx-auto flex flex-col px-[16px] xl:px-0">
        <div className="flex items-start justify-between gap-[20px] mb-[34px] md:mb-[60px] relative">

          {/* 1. ЗАГОЛОВОК ДЛЯ МОБИЛОК (ровно 3 строки) */}
          <h1 className="md:hidden font-[500] text-[32px] font-medium leading-[110%] tracking-normal">
            Начните заниматься<br />
            спортом и улучшите<br />
            качество жизни
          </h1>

          {/* 2. ЗАГОЛОВОК ДЛЯ ПЛАНШЕТОВ И ПК (ровно 2 строки, как было изначально) */}
          <h1 className="hidden md:flex font-[500] text-[44px] lg:text-[60px] font-medium leading-[100%] tracking-normal flex-row flex-wrap">
            <span>Начните заниматься спортом </span>
            <span>и улучшите качество жизни</span>
          </h1>

          {/* Бабл-текст позиционируем относительно этого флекс-контейнера */}
          <img className="hidden lg:block shrink-0" src="/Text.jpg" alt="Измени свое тело" />
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px] md:gap-[40px] justify-items-center md:justify-items-stretch">
          <CourseCard title="Йога" imageSrc="/Yellow.png" name_id="yoga" />
          <CourseCard title="Стретчинг" imageSrc="/Blue.png" name_id="stretching" />
          <CourseCard title="Фитнес" imageSrc="/Orange.png" name_id="fitness" />
          <CourseCard title="Степ-аэробика" imageSrc="/Pink.png" name_id="step" />
          <CourseCard title="Бодифлекс" imageSrc="/Purple.png" name_id="bodyflex" />
        </div>

        <div className="w-full flex justify-end md:justify-center mt-[24px] md:mt-[40px] pb-[40px]">
          <ScrollToTop />
        </div>
      </main>
    </>
  );
}