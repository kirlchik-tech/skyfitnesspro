import { CourseCard } from "@/components/UI/CourseCard";
import { Header } from "@/components/UI/Header";
import { Button } from "@/components/UI/Button";


export default function Home() {
  return (
    <>
    <Header />
    <main className="max-w-[1160px] w-full  mx-auto flex flex-col"> 
      <div className="flex items-start gap-[20px] mb-[60px] relative">
  <h1 className="font-[500] text-[60px] leading-[100%] tracking-normal">
     Начните заниматься спортом <br/> и улучшите качество жизни
  </h1>
  {/* Бабл-текст позиционируем относительно этого флекс-контейнера */}
  <img src="/Text.jpg" alt="Измени свое тело"/>
</div>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[40px]">
  <CourseCard title="Йога" imageSrc="/Yellow.png"/>
  <CourseCard title="Стретчинг" imageSrc="/Blue.png"/>
  <CourseCard title="Фитнес" imageSrc="/Orange.png"/>
  <CourseCard title="Степ-аэробика" imageSrc="/Pink.png"/>
  <CourseCard title="Бодифлекс" imageSrc="/Purple.png"/>
</div>
<div className="w-full flex justify-center mt-[40px]">
    <Button className="w-[127px] h-[52px] text-[#000000]" variant="primary"
    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
      Наверх ↑
    </Button>
  </div>
    </main>
    </>
  );
}