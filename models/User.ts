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
  },
  // name_id курсов (["yoga", "fitness"])
  purchasedCourses: {
    type: [String],
    default: []
  },
  workoutProgress: {
    type: Object,
    default: {}
  }
}, {
  timestamps: true,
  minimize: false // Чтобы MongoDB не удаляла пустой объект workoutProgress
});

// Сбрасываем старый кэш модели в режиме разработки, чтобы схема обновилась
if (mongoose.models.User) {
  delete mongoose.models.User;
}

//Проверяем, создана ли уже модель User, чтобы не создать её дважды
export const User = mongoose.models.User || mongoose.model('User', userSchema);