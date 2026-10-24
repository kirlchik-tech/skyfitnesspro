import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';

export async function POST(request: Request) {
    try {
        await connectToDatabase();

        // Получаем email пользователя и id курса, которые фронтенд пришлет при клике на кнопку
        const { email, courseNameId } = await request.json();

        // Ищем юзера по email и добавляем курс в массив
        // Оператор $addToSet ащитит нас от дублирования, если юзер кликнет на кнопку 10 раз
        const updatedUser = await User.findOneAndUpdate(
            { email: email },
            { $addToSet: { purchasedCourses: courseNameId } },
            { new: true } // Возвращает обновленный документ
        );

        if (!updatedUser) {
            return NextResponse.json({ message: 'Пользователь не найден' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Курс успешно добавлен!' }, { status: 200 });

    } catch (error) {
        console.error("Ошибка при добавлении курса:", error);
        return NextResponse.json({ message: 'Внутренняя ошибка сервера' }, { status: 500 });
    }
}