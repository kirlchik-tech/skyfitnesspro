import mongoose from 'mongoose';

// Описываем, из чего состоит курс
const courseSchema = new mongoose.Schema({
    name_id: {
        type: String,
        required: true,
        unique: true // Уникальный идентификатор для URL 
    },
    title: {
        type: String,
        required: true // Название ("Йога", "Стретчинг")
    },
    color: {
        type: String,
        required: true // HEX-код цвета фона карточки и баннера
    },
    imageSrc: {
        type: String,
        required: true // Ссылка на картинку из папки public
    },
    directions: [{
        type: String // Массив строк 
    }]
});

export const Course = mongoose.models.Course || mongoose.model('Course', courseSchema);