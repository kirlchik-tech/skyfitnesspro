import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        await connectToDatabase();
        const { email, workoutId, progress, resetWorkoutIds } = await request.json();

        // Если передан массив ID тренировок для сброса прогресса курса ("Начать заново")
        if (email && Array.isArray(resetWorkoutIds)) {
            const unsetFields: Record<string, string> = {};
            resetWorkoutIds.forEach((id: string) => {
                unsetFields[`workoutProgress.${id}`] = '';
            });

            await User.findOneAndUpdate(
                { email },
                { $unset: unsetFields },
                { new: true, strict: false }
            ).lean();

            return NextResponse.json({ message: 'Прогресс курса сброшен' }, { status: 200 });
        }

        if (!email || !workoutId || !progress) {
            return NextResponse.json({ message: 'Неверные данные' }, { status: 400 });
        }

        const updatedUser = await User.findOneAndUpdate(
            { email },
            { $set: { [`workoutProgress.${workoutId}`]: progress } },
            { new: true, strict: false }
        ).lean();

        if (!updatedUser) {
            return NextResponse.json({ message: 'Пользователь не найден' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Прогресс успешно сохранен' }, { status: 200 });
    } catch {
        return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');

        if (!email) return NextResponse.json({ message: 'Email не передан' }, { status: 400 });

        const user = await User.findOne({ email }).lean<{
            workoutProgress?: Map<string, number[]> | Record<string, number[]>;
        }>();
        if (!user) return NextResponse.json({ message: 'Пользователь не найден' }, { status: 404 });

        const rawProgress = user.workoutProgress || {};
        const plainProgress = rawProgress instanceof Map ? Object.fromEntries(rawProgress) : rawProgress;

        return NextResponse.json(plainProgress, { status: 200 });
    } catch {
        return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
    }
}