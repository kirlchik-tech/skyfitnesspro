import { CourseCard } from "@/components/UI/CourseCard";

export default function Home() {
  return (
    <main className="max-w-[1160px] mx-auto flex flex-col"> 
      <h1 className="mb-[60px] font-[500] text-[60px] leading-[100%] tracking-normal lining-nums proportional-nums">
       Начните заниматься спортом <br/> и улучшите качество жизни
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[40px]">
  <CourseCard title="Йога" bgClass="bg-[#FFC700]" />
  <CourseCard title="Стретчинг" bgClass="bg-[#26A5EB]" />
  <CourseCard title="Фитнес" bgClass="bg-[#F97316]" />
  <CourseCard title="Степ-аэробика" bgClass="bg-[#EC4899]" />
  <CourseCard title="Бодифлекс" bgClass="bg-[#7C3AED]" />
</div>
    </main>
  );
}