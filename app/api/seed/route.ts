import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Course } from '@/models/Course';

interface SeedCourse {
    name_id: string;
    title: string;
    color: string;
    imageSrc: string;
    directions: string[];
}

const coursesData: SeedCourse[] = [
    {
        name_id: 'yoga',
        title: 'Йога',
        color: '#FFC700',
        imageSrc: '/Yellows.png',
        directions: ['Йога для новичков', 'Кундалини-йога', 'Хатха-йога', 'Классическая йога', 'Йогатерапия', 'Аштанга-йога']
    },
    {
        name_id: 'stretching',
        title: 'Стретчинг',
        color: '#2491D2',
        imageSrc: '/Blues.png',
        directions: ['Растяжка всего тела', 'Шпагат', 'Здоровая спина']
    },
    {
        name_id: 'fitness',
        title: 'Фитнес',
        color: '#F7A012',
        imageSrc: '/Oranges.png',
        directions: ['Кардио', 'Силовые тренировки', 'Жиросжигание']
    },
    {
        name_id: 'step',
        title: 'Степ-аэробика',
        color: '#FF7E65',
        imageSrc: '/Pinks.png',
        directions: ['Ритмика', 'Развитие выносливости']
    },
    {
        name_id: 'bodyflex',
        title: 'Бодифлекс',
        color: '#7D458C',
        imageSrc: '/Purples.png',
        directions: ['Дыхательные практики', 'Вакуум', 'Подтяжка мышц живота']
    }
];

export async function GET() {
    try {
        await connectToDatabase();
        await Course.deleteMany({});
        await Course.insertMany(coursesData);

        return NextResponse.json({ message: 'Успех! База курсов заполнена.' }, { status: 200 });
    } catch {
        return NextResponse.json({ message: 'Ошибка при заполнении базы' }, { status: 500 });
    }
}