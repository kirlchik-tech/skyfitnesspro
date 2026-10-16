// Файл: models/User.ts
import mongoose from 'mongoose';

// Описываем схему: какие поля есть у пользователя и какие они 
const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true // Mongo сама не даст создать двух юзеров с одинаковой почтой!
  },
  password: { 
    type: String, 
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  }
}, {
  timestamps: true // Автоматически добавит дату регистрации (createdAt)
});

//Проверяем, создана ли уже модель User, чтобы не создать её дважды
export const User = mongoose.models.User || mongoose.model('User', userSchema);