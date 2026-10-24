import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';
import { Course } from '@/models/Course';

export async function POST(request: Request) {
    try {
        await connectToDatabase();
        const { email } = await request.json();

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ message: 'Пользователь не найден' }, { status: 404 });
        }

        // Ищем все курсы, чьи name_id находятся в массиве user.purchasedCourses
        const courses = await Course.find({ name_id: { $in: user.purchasedCourses } });

        return NextResponse.json(courses, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
    }
}