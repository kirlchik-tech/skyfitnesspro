import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';
import { Course } from '@/models/Course';

interface ExerciseSummary {
    quantity: number;
}

interface WorkoutSummary {
    _id: string;
    exercises: ExerciseSummary[];
}

interface LeanUser {
    email: string;
    purchasedCourses?: string[];
    workoutProgress?: Map<string, number[]> | Record<string, number[]>;
}

const workoutsData: Record<string, WorkoutSummary[]> = {
    yoga: [
        { _id: "3yvozj", exercises: [{ quantity: 10 }] },
        { _id: "hfgxlo", exercises: [{ quantity: 10 }, { quantity: 10 }, { quantity: 5 }] },
        { _id: "kcx5ai", exercises: [{ quantity: 10 }, { quantity: 10 }, { quantity: 10 }, { quantity: 10 }, { quantity: 5 }] },
        { _id: "kt6ah4", exercises: [{ quantity: 5 }, { quantity: 5 }, { quantity: 10 }, { quantity: 10 }] },
        { _id: "mrhuag", exercises: [{ quantity: 10 }, { quantity: 20 }, { quantity: 20 }] },
    ],
    stretching: [
        { _id: "9mefwq", exercises: [{ quantity: 20 }, { quantity: 10 }, { quantity: 10 }, { quantity: 20 }] },
        { _id: "9yolz2", exercises: [{ quantity: 15 }, { quantity: 10 }, { quantity: 5 }] },
        { _id: "pi5vtr", exercises: [{ quantity: 15 }, { quantity: 5 }, { quantity: 20 }] },
    ],
    fitness: [
        { _id: "17oz5f", exercises: [{ quantity: 10 }, { quantity: 10 }, { quantity: 15 }] },
        { _id: "pyvaec", exercises: [{ quantity: 15 }, { quantity: 20 }, { quantity: 15 }] },
    ],
    bodyflex: [
        { _id: "xlpkqy", exercises: [{ quantity: 20 }, { quantity: 10 }, { quantity: 20 }] },
        { _id: "gh7bd5", exercises: [{ quantity: 15 }, { quantity: 20 }, { quantity: 15 }] },
        { _id: "hwsut5", exercises: [{ quantity: 15 }, { quantity: 10 }, { quantity: 10 }] },
        { _id: "n18r8v", exercises: [{ quantity: 12 }, { quantity: 15 }, { quantity: 20 }] },
        { _id: "t3cpno", exercises: [{ quantity: 10 }, { quantity: 15 }, { quantity: 15 }] },
    ],
    step: [
        { _id: "e9ghsb", exercises: [{ quantity: 30 }, { quantity: 20 }, { quantity: 20 }] },
        { _id: "a1rqtt", exercises: [{ quantity: 20 }, { quantity: 15 }, { quantity: 15 }] },
        { _id: "mstcbg", exercises: [{ quantity: 20 }, { quantity: 20 }, { quantity: 15 }] },
        { _id: "dq9rzo", exercises: [{ quantity: 20 }, { quantity: 15 }, { quantity: 20 }] },
        { _id: "rr70ie", exercises: [{ quantity: 10 }, { quantity: 20 }, { quantity: 15 }] },
    ],
};

export async function POST(request: Request) {
    try {
        await connectToDatabase();
        const { email } = await request.json();

        const user = await User.findOne({ email }).lean<LeanUser>();
        if (!user) {
            return NextResponse.json({ message: 'Пользователь не найден' }, { status: 404 });
        }

        const courses = await Course.find({ name_id: { $in: user.purchasedCourses || [] } });

        const rawProgress = user.workoutProgress || {};
        const userProgress: Record<string, number[]> =
            rawProgress instanceof Map ? Object.fromEntries(rawProgress) : rawProgress;

        const coursesWithProgress = courses.map(course => {
            const courseObj = course.toObject();
            let totalCourseMax = 0;
            let totalCourseCurrent = 0;

            const courseWorkouts = workoutsData[courseObj.name_id] || [];

            courseWorkouts.forEach(workout => {
                if (workout.exercises) {
                    const workoutMax = workout.exercises.reduce((sum: number, ex: ExerciseSummary) => sum + ex.quantity, 0);
                    totalCourseMax += workoutMax;

                    const userSavedArray = userProgress[workout._id] || [];
                    const workoutCurrent = userSavedArray.reduce((sum: number, val: number) => sum + val, 0);

                    totalCourseCurrent += workoutCurrent;
                }
            });

            let finalPercent = 0;
            if (totalCourseMax > 0) {
                finalPercent = Math.min(100, Math.round((totalCourseCurrent / totalCourseMax) * 100));
            }

            return {
                ...courseObj,
                calculatedProgress: finalPercent
            };
        });

        return NextResponse.json(coursesWithProgress, { status: 200 });
    } catch {
        return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
    }
}