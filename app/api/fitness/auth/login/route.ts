import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';

export async function POST(request: Request) {
  try {
    // 1. Открываем соединение с MongoDB
    await connectToDatabase();

    const { email, password } = await request.json();

    // 2. Ищем юзера по совпадению И почты, И пароля одновременно
    const user = await User.findOne({ email: email, password: password });

    // 3. Если нашли — пускаем!
    if (user) {
      return NextResponse.json(
        {
          id: user._id, // У MongoDB автоматически создается уникальный _id
          name: user.name,
          email: user.email,
          token: 'fake-jwt-token-123'
        },
        { status: 200 }
      );
    }

    // 4. Если не нашли — отказ
    return NextResponse.json(
      { message: 'Неверный email или пароль' },
      { status: 401 }
    );

  } catch (error) {
    console.error("Ошибка БД при логине:", error);
    return NextResponse.json(
      { message: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}