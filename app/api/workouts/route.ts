import { NextResponse } from 'next/server';

// Строго оригинальные данные из webdev-hw-api (AlenaSol)
const workoutsData: Record<string, any[]> = {
    yoga: [
        {
            _id: "3yvozj",
            name: "Утренняя практика",
            course: "Йога на каждый день",
            videoUrl: "https://www.youtube.com/embed/oqe98Dxivns",
            exercises: [{ name: "Приветствие солнца (10 повторений)", quantity: 10 }],
        },
        {
            _id: "hfgxlo",
            name: "Красота и здоровье",
            course: "Йога на каждый день",
            videoUrl: "https://www.youtube.com/embed/v-xTLFDhoD0",
            exercises: [
                { name: "Наклон вперед (10 повторений)", quantity: 10 },
                { name: "Наклон назад (10 повторений)", quantity: 10 },
                { name: "Поднятие ног, согнутых в коленях (5 повторений)", quantity: 5 },
            ],
        },
        {
            _id: "kcx5ai",
            name: "Асаны стоя",
            course: "Йога на каждый день",
            videoUrl: "https://www.youtube.com/embed/WxFz-4YsiEE",
            exercises: [
                { name: "Наклон к правой ноге (10 повторений)", quantity: 10 },
                { name: "Наклон к левой ноге (10 повторений)", quantity: 10 },
                { name: "Наклон к согнутой правой ноге (10 повторений)", quantity: 10 },
                { name: "Наклон к согнутой левой ноге (10 повторений)", quantity: 10 },
                { name: "Асана стоя (5 повторений)", quantity: 5 },
            ],
        },
        {
            _id: "kt6ah4",
            name: "Растягиваем мышцы бедра",
            course: "Йога на каждый день",
            videoUrl: "https://www.youtube.com/embed/09uGkAEQuZI",
            exercises: [
                { name: "Сесть на пятки с носками от себя (5 повторений)", quantity: 5 },
                { name: "Сесть на пятки с носками на себя (5 повторений)", quantity: 5 },
                { name: "Отпустить колено на пол из позы лотоса (10 повторений)", quantity: 10 },
                { name: "Отпустить колено на пол из позы лотоса с соединенными стопами (10 повторений)", quantity: 10 },
            ],
        },
        {
            _id: "mrhuag",
            name: "Гибкость спины",
            course: "Йога на каждый день",
            videoUrl: "https://www.youtube.com/embed/MIvcMapie_A",
            exercises: [
                { name: "Округляем грудную клетку при выдохе (10 повторений)", quantity: 10 },
                { name: "Тянем левую руку в правую сторону (20 повторений)", quantity: 20 },
                { name: "Тянем правую руку в левую сторону (20 повторений)", quantity: 20 },
            ],
        },
    ],
    stretching: [
        {
            _id: "9mefwq",
            name: "Основы стретчинга",
            course: "Стретчинг",
            videoUrl: "https://www.youtube.com/embed/Ewm-Bfg5ncg",
            exercises: [
                { name: "Правильное дыхание (20 повторений)", quantity: 20 },
                { name: "Наклон вниз, правая рука тянется вверх (10 повторений)", quantity: 10 },
                { name: "Наклон вниз, левая рука тянется вверх (10 повторений)", quantity: 10 },
                { name: "Перенос веса с ноги на ногу в положении сидя (20 повторений)", quantity: 20 },
            ],
        },
        {
            _id: "9yolz2",
            name: "Разогрев мышц",
            course: "Стретчинг",
            videoUrl: "https://www.youtube.com/embed/IISxKE3LGSE",
            exercises: [
                { name: "Перекрестные взмахи руками (15 повторений)", quantity: 15 },
                { name: "Собака мордой вверх (10 повторений)", quantity: 10 },
                { name: "Скручивание лежа (5 повторений)", quantity: 5 },
            ],
        },
        {
            _id: "pi5vtr",
            name: "Разогрев мышц 2.0",
            course: "Стретчинг",
            videoUrl: "https://www.youtube.com/embed/HKB89EIJ2J0",
            exercises: [
                { name: "Поперечная складка вперед (15 повторений)", quantity: 15 },
                { name: "Поза ребенка (5 повторений)", quantity: 5 },
                { name: "Растяжка трицепсов и плеч (20 повторений)", quantity: 20 },
            ],
        },
    ],
    fitness: [
        {
            _id: "17oz5f",
            name: "Тренировка мышц бедер",
            course: "Фитнес",
            videoUrl: "https://www.youtube.com/embed/zxaoes0JQ5g",
            exercises: [
                { name: "Ножницы горизонтальные (10 повторений)", quantity: 10 },
                { name: "Ножницы вертикальные (10 повторений)", quantity: 10 },
                { name: "Шлюпка (15 повторений)", quantity: 15 },
            ],
        },
        {
            _id: "pyvaec",
            name: "Тренировка мышц ягодиц",
            course: "Фитнес",
            videoUrl: "https://www.youtube.com/embed/JTCaG3Y9xlM",
            exercises: [
                { name: "Крендель (15 повторений)", quantity: 15 },
                { name: "Собачка (20 повторений)", quantity: 20 },
                { name: "Кошка (15 повторений)", quantity: 15 },
            ],
        },
    ],
    bodyflex: [
        {
            _id: "xlpkqy",
            name: "Техника дыхания",
            course: "Бодифлекс",
            videoUrl: "https://www.youtube.com/embed/HruMFn74NII",
            exercises: [
                { name: "Отведение рук назад (20 повторений)", quantity: 20 },
                { name: "Боковая растяжка (10 повторений)", quantity: 10 },
                { name: "Простой пресс (20 повторений)", quantity: 20 },
            ],
        },
        { _id: "gh7bd5", name: "Урок 1. Основы", course: "Бодифлекс", videoUrl: "https://www.youtube.com/embed/x6_8ZEYXPak" },
        { _id: "hwsut5", name: "Урок 2. Основные движения", course: "Бодифлекс", videoUrl: "https://youtu.be/embed/UjVtcMD4On4" },
        { _id: "n18r8v", name: "Урок 3. Новые движения", course: "Бодифлекс", videoUrl: "https://www.youtube.com/embed/gvL27uHhKz4" },
        { _id: "t3cpno", name: "Урок 4. Продвинутые движения", course: "Бодифлекс", videoUrl: "https://www.youtube.com/embed/zuBLSarZuyk" },
    ],
    step: [
        { _id: "e9ghsb", name: "Урок 1. Основы", course: "Степ-аэробика", videoUrl: "https://www.youtube.com/embed/oK2mdodtPY4" },
        { _id: "a1rqtt", name: "Урок 2. Основные движения", course: "Степ-аэробика", videoUrl: "https://www.youtube.com/embed/gJPs7b8SpVw" },
        { _id: "mstcbg", name: "Урок 3. Новые движения", course: "Степ-аэробика", videoUrl: "https://www.youtube.com/embed/PGAQfXIAY7k" },
        { _id: "dq9rzo", name: "Урок 4. Продвинутые движения", course: "Степ-аэробика", videoUrl: "https://www.youtube.com/embed/3RPauxe4SeE" },
        { _id: "rr70ie", name: "Урок 5. Мастер-класс", course: "Степ-аэробика", videoUrl: "https://www.youtube.com/embed/_78_OGLyy9Y" },
    ],
};

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('course');

    // Отдаем массив тренировок по выбранному курсу
    if (!courseId || !workoutsData[courseId]) {
        return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(workoutsData[courseId], { status: 200 });
}