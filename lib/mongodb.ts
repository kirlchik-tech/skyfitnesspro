// Файл: lib/mongodb.ts
import mongoose from 'mongoose';

//локальная база данных на диске 
const MONGODB_URI = 'mongodb://127.0.0.1:27017/skyfitnesspro';

// Глобальная переменная для сохранения подключения при перезагрузках Next.js
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  // Если подключение уже есть — возвращаем его
  if (cached.conn) {
    return cached.conn;
  }

  // Если в процессе подключения — ждем
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ Подключено к MongoDB на диске F!');
      return mongoose;
    });
  }
  
  cached.conn = await cached.promise;
  return cached.conn;
}