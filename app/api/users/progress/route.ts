import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';

export const dynamic = 'force-dynamic'; // Запрещаем Next.js кэшировать этот роут

export async function POST(request: Request) {
    try {
        await connectToDatabase();
        const { email, workoutId, progress } = await request.json();

        if (!email || !workoutId || !progress) {
            return NextResponse.json({ message: 'Неверные данные' }, { status: 400 });
        }

        // Напрямую записываем массив в поле workoutProgress.<id_тренировки> в MongoDB
        const updatedUser = await User.findOneAndUpdate(
            { email },
            { $set: { [`workoutProgress.${workoutId}`]: progress } },
            { new: true, strict: false }
        ).lean();

        if (!updatedUser) {
            return NextResponse.json({ message: 'Пользователь не найден' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Прогресс успешно сохранен' }, { status: 200 });
    } catch (error) {
        console.error('Ошибка POST /api/users/progress:', error);
        return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');

        if (!email) return NextResponse.json({ message: 'Email не передан' }, { status: 400 });

        // .lean() возвращает чистый JS-объект напрямую из базы без оберток Mongoose
        const user: any = await User.findOne({ email }).lean();
        if (!user) return NextResponse.json({ message: 'Пользователь не найден' }, { status: 404 });

        // На случай если в базе со старых попыток остался Map, конвертируем его
        const rawProgress = user.workoutProgress || {};
        const plainProgress = rawProgress instanceof Map ? Object.fromEntries(rawProgress) : rawProgress;

        return NextResponse.json(plainProgress, { status: 200 });
    } catch (error) {
        console.error('Ошибка GET /api/users/progress:', error);
        return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
    }
}