import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Course } from '@/models/Course';

export async function GET(
    request: Request,
    // Указываем, что params - это Promise
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectToDatabase();

        // ждемсс (await) пока параметры распакуются
        const { id } = await params;

        // Ищем курс по id
        const course = await Course.findOne({ name_id: id });

        if (!course) {
            return NextResponse.json({ message: 'Курс не найден' }, { status: 404 });
        }

        return NextResponse.json(course, { status: 200 });

    } catch (error) {
        console.error("Ошибка при получении курса:", error);
        return NextResponse.json({ message: 'Внутренняя ошибка сервера' }, { status: 500 });
    }
}