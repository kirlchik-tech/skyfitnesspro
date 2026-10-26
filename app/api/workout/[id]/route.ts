import { NextResponse } from 'next/server';

const workoutData: Record<string, any> = {
    // === ФИТНЕС ===
    "17oz5f": {
        _id: "17oz5f",
        course: "Фитнес",
        name: "Тренировка мышц бедер",
        video: "https://www.youtube.com/embed/11NVhqp1r_A",
        exercises: [
            { name: "Ножницы горизонтальные (10 повторений)", quantity: 10 },
            { name: "Ножницы вертикальные (10 повторений)", quantity: 10 },
            { name: "Шлюпка (15 повторений)", quantity: 15 },
        ],
    },
    "pyvaec": {
        _id: "pyvaec",
        course: "Фитнес",
        name: "Тренировка мышц ягодиц",
        video: "https://www.youtube.com/embed/JTCaG3Y9xlM",
        exercises: [
            { name: "Крендель (15 повторений)", quantity: 15 },
            { name: "Собачка (20 повторений)", quantity: 20 },
            { name: "Кошка (15 повторений)", quantity: 15 },
        ],
    },

    // === ЙОГА ===
    "3yvozj": {
        _id: "3yvozj",
        course: "Йога",
        name: "Утренняя практика / Йога на каждый день / 1 день / Алексей Казубский",
        video: "https://www.youtube.com/embed/oqe98Dxivns",
        exercises: [
            { name: "Приветствие солнца (10 повторений)", quantity: 10 },
        ],
    },
    "hfgxlo": {
        _id: "hfgxlo",
        course: "Йога",
        name: "Красота и здоровье / Йога на каждый день / 2 день / Алексей Казубский",
        video: "https://www.youtube.com/embed/v-xTLFDhoD0",
        exercises: [
            { name: "Наклон вперед (10 повторений)", quantity: 10 },
            { name: "Наклон назад (10 повторений)", quantity: 10 },
            { name: "Поднятие ног, согнутых в коленях (5 повторений)", quantity: 5 },
        ],
    },
    "kcx5ai": {
        _id: "kcx5ai",
        course: "Йога",
        name: "Асаны стоя / Йога на каждый день / 3 день / Алексей Казубский",
        video: "https://www.youtube.com/embed/WxFz-4YsiEE",
        exercises: [
            { name: "Наклон к правой ноге (10 повторений)", quantity: 10 },
            { name: "Наклон к левой ноге (10 повторений)", quantity: 10 },
            { name: "Наклон к согнутой правой ноге (10 повторений)", quantity: 10 },
            { name: "Наклон к согнутой левой ноге (10 повторений)", quantity: 10 },
            { name: "Асана стоя (5 повторений)", quantity: 5 },
        ],
    },
    "kt6ah4": {
        _id: "kt6ah4",
        course: "Йога",
        name: "Растягиваем мышцы бедра / Йога на каждый день / 4 день / Алексей Казубский",
        video: "https://www.youtube.com/embed/09uGkAEQuZI",
        exercises: [
            { name: "Сесть на пятки с носками от себя (5 повторений)", quantity: 5 },
            { name: "Сесть на пятки с носками на себя (5 повторений)", quantity: 5 },
            { name: "Отпустить колено на пол из позы лотоса (10 повторений)", quantity: 10 },
            { name: "Отпустить колено на пол из позы лотоса с соединенными стопами (10 повторений)", quantity: 10 },
        ],
    },
    "mrhuag": {
        _id: "mrhuag",
        course: "Йога",
        name: "Гибкость спины / Йога на каждый день / 5 день / Алексей Казубский",
        video: "https://www.youtube.com/embed/MIvcMapie_A",
        exercises: [
            { name: "Округляем грудную клетку при выдохе (10 повторений)", quantity: 10 },
            { name: "Тянем левую руку в правую сторону (20 повторений)", quantity: 20 },
            { name: "Тянем правую руку в левую сторону (20 повторений)", quantity: 20 },
        ],
    },

    // === СТРЕТЧИНГ ===
    "9mefwq": {
        _id: "9mefwq",
        course: "Стретчинг",
        name: "Основы стретчинга",
        video: "https://www.youtube.com/embed/Ewm-Bfg5ncg",
        exercises: [
            { name: "Правильное дыхание (20 повторений)", quantity: 20 },
            { name: "Наклон вниз, правая рука тянется вверх (10 повторений)", quantity: 10 },
            { name: "Наклон вниз, левая рука тянется вверх (10 повторений)", quantity: 10 },
            { name: "Перенос веса с ноги на ногу в положении сидя (20 повторений)", quantity: 20 },
        ],
    },
    "9yolz2": {
        _id: "9yolz2",
        course: "Стретчинг",
        name: "Разогрев мышц",
        video: "https://www.youtube.com/embed/OsmUXpFqwT4",
        exercises: [
            { name: "Перекрестные взмахи руками (15 повторений)", quantity: 15 },
            { name: "Собака мордой вверх (10 повторений)", quantity: 10 },
            { name: "Скручивание лежа (5 повторений)", quantity: 5 },
        ],
    },
    "pi5vtr": {
        _id: "pi5vtr",
        course: "Стретчинг",
        name: "Разогрев мышц 2.0",
        video: "https://www.youtube.com/embed/0TI5Zt7vMfw",
        exercises: [
            { name: "Поперечная складка вперед (15 повторений)", quantity: 15 },
            { name: "Поза ребенка (5 повторений)", quantity: 5 },
            { name: "Растяжка трицепсов и плеч (20 повторений)", quantity: 20 },
        ],
    },


    "xlpkqy": {
        _id: "xlpkqy",
        course: "Бодифлекс",
        name: "Техника дыхания",
        video: "https://www.youtube.com/embed/HruMFn74NII",
        exercises: [
            { name: "Отведение рук назад (20 повторений)", quantity: 20 },
            { name: "Боковая растяжка (10 повторений)", quantity: 10 },
            { name: "Простой пресс (20 повторений)", quantity: 20 },
        ],
    },
    "gh7bd5": {
        _id: "gh7bd5",
        course: "Бодифлекс",
        name: "Урок 1. Основы",
        video: "https://www.youtube.com/embed/x6_8ZEYXPak",
        exercises: [
            { name: "Дыхание диафрагмой (15 повторений)", quantity: 15 },
            { name: "Подъем на полупальцы (20 повторений)", quantity: 20 },
            { name: "Прыжки с разминкой стоп (15 повторений)", quantity: 15 },
        ],
    },
    "hwsut5": {
        _id: "hwsut5",
        course: "Бодифлекс",
        name: "Урок 2. Основные движения",
        video: "https://www.youtube.com/embed/aurlDtCqmEk",
        exercises: [
            { name: "Втягивание живота на выдохе (15 повторений)", quantity: 15 },
            { name: "Алмаз для мышц рук (10 повторений)", quantity: 10 },
            { name: "Растяжка задней поверхности бедра (10 повторений)", quantity: 10 },
        ],
    },
    "n18r8v": {
        _id: "n18r8v",
        course: "Бодифлекс",
        name: "Урок 3. Новые движения",
        video: "https://www.youtube.com/embed/aGzkSr4WE9s",
        exercises: [
            { name: "Боковая растяжка в упоре (12 повторений)", quantity: 12 },
            { name: "Отведение ноги назад (15 повторений)", quantity: 15 },
            { name: "Скручивание на пресс (20 повторений)", quantity: 20 },
        ],
    },
    "t3cpno": {
        _id: "t3cpno",
        course: "Бодифлекс",
        name: "Урок 4. Продвинутые движения",
        video: "https://www.youtube.com/embed/mW-JxgmAUfw",
        exercises: [
            { name: "Вакуум в положении стоя (10 повторений)", quantity: 10 },
            { name: "Упражнение Сейко (15 повторений)", quantity: 15 },
            { name: "Растяжка спины Кошка (15 повторений)", quantity: 15 },
        ],
    },


    "e9ghsb": {
        _id: "e9ghsb",
        course: "Степ-аэробика",
        name: "Урок 1. Основы",
        video: "https://www.youtube.com/embed/gJPs7b8SpVw",
        exercises: [
            { name: "Базовый шаг Basic Step (30 повторений)", quantity: 30 },
            { name: "Шаг V-step (20 повторений)", quantity: 20 },
            { name: "Подъем колена Knee Up (20 повторений)", quantity: 20 },
        ],
    },
    "a1rqtt": {
        _id: "a1rqtt",
        course: "Степ-аэробика",
        name: "Урок 2. Основные движения",
        video: "https://www.youtube.com/embed/PGAQfXIAY7k",
        exercises: [
            { name: "Захлест голени Curl (20 повторений)", quantity: 20 },
            { name: "Шаг Мамбо на степе (15 повторений)", quantity: 15 },
            { name: "Мах ногой Kick Step (15 повторений)", quantity: 15 },
        ],
    },
    "mstcbg": {
        _id: "mstcbg",
        course: "Степ-аэробика",
        name: "Урок 3. Новые движения",
        video: "https://www.youtube.com/embed/1XWL2W2IcPk",
        exercises: [
            { name: "Переход через степ Over the Top (20 повторений)", quantity: 20 },
            { name: "Шаг Tap-Up с поворотом (20 повторений)", quantity: 20 },
            { name: "Выпады назад со степа (15 повторений)", quantity: 15 },
        ],
    },
    "dq9rzo": {
        _id: "dq9rzo",
        course: "Степ-аэробика",
        name: "Урок 4. Продвинутые движения",
        video: "https://www.youtube.com/embed/7vJL1_f_Uw0",
        exercises: [
            { name: "Прыжковый шаг на степ (20 повторений)", quantity: 20 },
            { name: "Связка Три колена Reversed (15 повторений)", quantity: 15 },
            { name: "Махи в сторону Side Leg Lift (20 повторений)", quantity: 20 },
        ],
    },
    "rr70ie": {
        _id: "rr70ie",
        course: "Степ-аэробика",
        name: "Урок 5. Мастер-класс",
        video: "https://www.youtube.com/embed/B1RdWRNQe2w",
        exercises: [
            { name: "Танцевальный квадрат 32 счета (10 повторений)", quantity: 10 },
            { name: "Скрестный шаг Cross Step (20 повторений)", quantity: 20 },
            { name: "Финальная растяжка икр на степе (15 повторений)", quantity: 15 },
        ],
    },
};

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;

    if (!workoutData[id]) {
        return NextResponse.json({ message: "Тренировка не найдена" }, { status: 404 });
    }

    return NextResponse.json(workoutData[id], { status: 200 });
}