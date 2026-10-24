import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';

export async function POST(request: Request) {
    try {
        await connectToDatabase();
        const { email, courseNameId } = await request.json();

        // $pull удаляет конкретное значение из массива
        await User.findOneAndUpdate(
            { email },
            { $pull: { purchasedCourses: courseNameId } }
        );

        return NextResponse.json({ message: 'Курс удален' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
    }
}