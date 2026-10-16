import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb'; // Наш мост к базе
import { User } from '@/models/User'; // Наш чертеж юзера

export async function POST(request: Request) {
  try {
    // 1. Открываем соединение с MongoDB
    await connectToDatabase();

    const body = await request.json();
    const { email, password } = body;

    // 3. Если почта свободна — создаем нового пользователя
    const newName = email.split('@')[0];
    
    // Метод .create сам сохранит данные в MongoDB 
    const newUser = await User.create({
      email: email,
      password: password, 
      name: newName
    });

    // 4. Отвечаем успехом
    return NextResponse.json(
      { 
        message: 'Регистрация успешна!',
        name: newUser.name,
        email: newUser.email,
        token: 'new-user-jwt-token' 
      }, 
      { status: 201 }
    );

  } catch (error) {
    console.error("Ошибка БД при регистрации:", error); // Выведет ошибку в терминал VS Code, если что-то сломается
    return NextResponse.json(
      { message: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}