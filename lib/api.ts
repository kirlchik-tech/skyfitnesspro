const BASE_URL = 'https://wedev-api.sky.pro/api/fitness';

export interface Exercise {
    _id?: string;
    name: string;
    quantity: number;
}

export interface Workout {
    _id: string;
    name: string;
    video: string;
    exercises: Exercise[];
}

export interface ApiCourse {
    _id: string;
    nameRU: string;
    nameEN: string;
    description: string;
    directions: string[];
    fitting: string[];
    workouts: string[];
    // Наши визуальные поля для карточек и баннеров
    name_id: string;
    title: string;
    color: string;
    imageSrc: string;
    cardImageSrc: string;
}

export interface WorkoutProgressItem {
    workoutId: string;
    workoutCompleted: boolean;
    progressData: number[];
}

export interface CourseProgressItem {
    courseId: string;
    courseCompleted: boolean;
    workoutsProgress: WorkoutProgressItem[];
}

export interface ApiUserProfile {
    email: string;
    selectedCourses: string[];
    courseProgress: CourseProgressItem[];
}

// Привязываем цвета и картинки из макета к курсам 
function mapCourseVisuals(raw: {
    _id: string;
    nameRU: string;
    nameEN: string;
    description?: string;
    directions?: string[];
    fitting?: string[];
    workouts?: string[];
}): ApiCourse {
    const key = (raw.nameEN || raw.nameRU || '').toLowerCase();

    let color = '#FFC700';
    let imageSrc = '/Yellows.png';
    let cardImageSrc = '/Yellow.png';

    if (key.includes('stretch') || key.includes('стретч')) {
        color = '#2491D2';
        imageSrc = '/Blues.png';
        cardImageSrc = '/Blue.png';
    } else if (key.includes('fitness') || key.includes('фитнес')) {
        color = '#F7A012';
        imageSrc = '/Oranges.png';
        cardImageSrc = '/Orange.png';
    } else if (key.includes('step') || key.includes('степ')) {
        color = '#FF7E65';
        imageSrc = '/Pinks.png';
        cardImageSrc = '/Pink.png';
    } else if (key.includes('body') || key.includes('боди')) {
        color = '#7D458C';
        imageSrc = '/Purples.png';
        cardImageSrc = '/Purple.png';
    }

    return {
        _id: raw._id,
        name_id: raw._id,
        nameRU: raw.nameRU,
        nameEN: raw.nameEN,
        title: raw.nameRU,
        description: raw.description || '',
        directions: raw.directions || [],
        fitting: raw.fitting || [],
        workouts: raw.workouts || [],
        color,
        imageSrc,
        cardImageSrc,
    };
}

// 1. Получить все курсы
export async function getCourses(): Promise<ApiCourse[]> {
    const res = await fetch(`${BASE_URL}/courses`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Не удалось загрузить курсы');
    const data = await res.json();
    return Array.isArray(data) ? data.map(mapCourseVisuals) : [];
}

// 2. Получить один курс по ID
export async function getCourseById(id: string): Promise<ApiCourse> {
    const res = await fetch(`${BASE_URL}/courses/${id}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Курс не найден');
    const data = await res.json();
    return mapCourseVisuals(data);
}

// 3. Регистрация
export async function apiRegister(email: string, password: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Такой email уже существует или данные некорректны');
    }
}

// 4. Вход (возвращает JWT токен)
export async function apiLogin(email: string, password: string): Promise<string> {
    const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Неверный логин или пароль');
    }
    const data = await res.json();
    return data.token;
}

// 5. Получить данные текущего пользователя (/users/me)
export async function getUserMe(token: string): Promise<ApiUserProfile> {
    const res = await fetch(`${BASE_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
    });
    if (!res.ok) throw new Error('Ошибка авторизации');
    const data = await res.json();
    const userObj = data.user || data;
    return {
        email: userObj.email || '',
        selectedCourses: userObj.selectedCourses || [],
        courseProgress: userObj.courseProgress || [],
    };
}

// 6. Добавить курс пользователю
export async function apiAddCourse(token: string, courseId: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/users/me/courses`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ courseId }),
    });
    if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Не удалось добавить курс');
    }
}

// 7. Удалить курс у пользователя
export async function apiRemoveCourse(token: string, courseId: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/users/me/courses/${courseId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
        throw new Error('Не удалось удалить курс');
    }
}

// 8. Получить список тренировок курса
export async function getCourseWorkouts(token: string, courseId: string): Promise<Workout[]> {
    const res = await fetch(`${BASE_URL}/courses/${courseId}/workouts`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
    });
    if (!res.ok) throw new Error('Не удалось загрузить тренировки');
    return res.json();
}

// 9. Получить одну тренировку по ID
export async function getWorkoutById(token: string, workoutId: string): Promise<Workout> {
    const res = await fetch(`${BASE_URL}/workouts/${workoutId}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
    });
    if (!res.ok) throw new Error('Тренировка не найдена');
    return res.json();
}

// 10. Получить прогресс конкретной тренировки
export async function getWorkoutProgress(
    token: string,
    courseId: string,
    workoutId: string
): Promise<number[]> {
    const res = await fetch(
        `${BASE_URL}/users/me/progress?courseId=${courseId}&workoutId=${workoutId}`,
        {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store',
        }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data.progressData) ? data.progressData : [];
}

// 11. Сохранить прогресс тренировки
export async function saveWorkoutProgress(
    token: string,
    courseId: string,
    workoutId: string,
    progressData: number[]
): Promise<void> {
    const res = await fetch(`${BASE_URL}/courses/${courseId}/workouts/${workoutId}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ progressData }),
    });
    if (!res.ok) throw new Error('Ошибка сохранения прогресса');
}

// 12. Сбросить прогресс курса ("Начать заново")
export async function resetCourseProgress(token: string, courseId: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/courses/${courseId}/reset`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Ошибка сброса прогресса');
}

// ПРОВЕРКА: Выполнена ли тренировка на 100%
export function isWorkoutCompletedCheck(
    workout: Workout,
    wp?: WorkoutProgressItem
): boolean {
    if (!wp) return false;
    if (!workout.exercises || workout.exercises.length === 0) {
        return Boolean(wp.workoutCompleted);
    }
    if (!Array.isArray(wp.progressData) || wp.progressData.length === 0) {
        return false;
    }
    return workout.exercises.every(
        (ex, idx) => (Number(wp.progressData[idx]) || 0) >= ex.quantity
    );
}

// РАСЧЕТ ПРОГРЕССА КУРСА 
export function calculateCourseProgressPercent(
    courseWorkouts: Workout[],
    courseProgress?: CourseProgressItem
): number {
    const totalWorkouts = courseWorkouts.length;
    if (totalWorkouts === 0 || !courseProgress) return 0;

    let completedWorkoutsCount = 0;
    courseWorkouts.forEach((workout) => {
        const wp = courseProgress.workoutsProgress?.find(
            (item) => item.workoutId === workout._id
        );
        if (isWorkoutCompletedCheck(workout, wp)) {
            completedWorkoutsCount += 1;
        }
    });

    return Math.round((completedWorkoutsCount / totalWorkouts) * 100);
}