import { NextResponse } from 'next/server';

interface WorkoutExercise {
    name: string;
    quantity: number;
}

interface WorkoutListItem {
    _id: string;
    name: string;
    course: string;
    videoUrl: string;
    exercises?: WorkoutExercise[];
}

const workoutsData: Record<string, WorkoutListItem[]> = {
    yoga: [
        {
            _id: "3yvozj",
            name: "Утренняя практика",
            course: "Йога на каждый день",
            videoUrl: "https://www.youtube.com/embed/oqe98Dxivns",
            exercises: [
                { name: "Приветствие солнца (10 повторений)", quantity: 10 },
            ],
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
            videoUrl: "https://www.youtube.com/embed/OsmUXpFqwT4",
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
            videoUrl: "https://www.youtube.com/embed/0TI5Zt7vMfw",
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
            videoUrl: "https://www.youtube.com/embed/11NVhqp1r_A",
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
        {
            _id: "gh7bd5",
            name: "Урок 1. Основы",
            course: "Бодифлекс",
            videoUrl: "https://www.youtube.com/embed/x6_8ZEYXPak",
            exercises: [
                { name: "Дыхание диафрагмой (15 повторений)", quantity: 15 },
                { name: "Подъем на полупальцы (20 повторений)", quantity: 20 },
                { name: "Прыжки с разминкой стоп (15 повторений)", quantity: 15 },
            ],
        },
        {
            _id: "hwsut5",
            name: "Урок 2. Основные движения",
            course: "Бодифлекс",
            videoUrl: "https://www.youtube.com/embed/aurlDtCqmEk",
            exercises: [
                { name: "Втягивание живота на выдохе (15 повторений)", quantity: 15 },
                { name: "Алмаз для мышц рук (10 повторений)", quantity: 10 },
                { name: "Растяжка задней поверхности бедра (10 повторений)", quantity: 10 },
            ],
        },
        {
            _id: "n18r8v",
            name: "Урок 3. Новые движения",
            course: "Бодифлекс",
            videoUrl: "https://www.youtube.com/embed/aGzkSr4WE9s",
            exercises: [
                { name: "Боковая растяжка в упоре (12 повторений)", quantity: 12 },
                { name: "Отведение ноги назад (15 повторений)", quantity: 15 },
                { name: "Скручивание на пресс (20 повторений)", quantity: 20 },
            ],
        },
        {
            _id: "t3cpno",
            name: "Урок 4. Продвинутые движения",
            course: "Бодифлекс",
            videoUrl: "https://www.youtube.com/embed/mW-JxgmAUfw",
            exercises: [
                { name: "Вакуум в положении стоя (10 повторений)", quantity: 10 },
                { name: "Упражнение Сейко (15 повторений)", quantity: 15 },
                { name: "Растяжка спины Кошка (15 повторений)", quantity: 15 },
            ],
        },
    ],
    step: [
        {
            _id: "e9ghsb",
            name: "Урок 1. Основы",
            course: "Степ-аэробика",
            videoUrl: "https://www.youtube.com/embed/gJPs7b8SpVw",
            exercises: [
                { name: "Базовый шаг Basic Step (30 повторений)", quantity: 30 },
                { name: "Шаг V-step (20 повторений)", quantity: 20 },
                { name: "Подъем колена Knee Up (20 повторений)", quantity: 20 },
            ],
        },
        {
            _id: "a1rqtt",
            name: "Урок 2. Основные движения",
            course: "Степ-аэробика",
            videoUrl: "https://www.youtube.com/embed/PGAQfXIAY7k",
            exercises: [
                { name: "Захлест голени Curl (20 повторений)", quantity: 20 },
                { name: "Шаг Мамбо на степе (15 повторений)", quantity: 15 },
                { name: "Мах ногой Kick Step (15 повторений)", quantity: 15 },
            ],
        },
        {
            _id: "mstcbg",
            name: "Урок 3. Новые движения",
            course: "Степ-аэробика",
            videoUrl: "https://www.youtube.com/embed/1XWL2W2IcPk",
            exercises: [
                { name: "Переход через степ Over the Top (20 повторений)", quantity: 20 },
                { name: "Шаг Tap-Up с поворотом (20 повторений)", quantity: 20 },
                { name: "Выпады назад со степа (15 повторений)", quantity: 15 },
            ],
        },
        {
            _id: "dq9rzo",
            name: "Урок 4. Продвинутые движения",
            course: "Степ-аэробика",
            videoUrl: "https://www.youtube.com/embed/7vJL1_f_Uw0",
            exercises: [
                { name: "Прыжковый шаг на степ (20 повторений)", quantity: 20 },
                { name: "Связка Три колена Reversed (15 повторений)", quantity: 15 },
                { name: "Махи в сторону Side Leg Lift (20 повторений)", quantity: 20 },
            ],
        },
        {
            _id: "rr70ie",
            name: "Урок 5. Мастер-класс",
            course: "Степ-аэробика",
            videoUrl: "https://www.youtube.com/embed/B1RdWRNQe2w",
            exercises: [
                { name: "Танцевальный квадрат 32 счета (10 повторений)", quantity: 10 },
                { name: "Скрестный шаг Cross Step (20 повторений)", quantity: 20 },
                { name: "Финальная растяжка икр на степе (15 повторений)", quantity: 15 },
            ],
        },
    ],
};

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('course');

    if (!courseId || !workoutsData[courseId]) {
        return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(workoutsData[courseId], { status: 200 });
}