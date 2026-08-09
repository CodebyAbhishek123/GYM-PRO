import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Configure dotenv
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../../.env") });

import User from "../models/user.model.js";
import Exercise from "../models/exercise.model.js";
import MembershipPlan from "../models/membershipPlan.model.js";

const exercisesData = [
  {
    name: "Bench Press",
    description: "A classic compound chest exercise targeting the pectorals, anterior deltoids, and triceps.",
    muscleGroup: "Chest",
    difficulty: "intermediate",
    equipment: ["Barbell"],
    sets: 4,
    reps: "10",
    restTime: 90,
    safetyInstructions: "Keep your feet flat on the floor and your lower back slightly arched. Ensure you have a spotter if lifting heavy.",
    commonMistakes: "Bouncing the bar off your chest or flaring your elbows out excessively.",
    youtubeUrl: "https://www.youtube.com/watch?v=gRVjAtPip0Y",
    gifUrl: "https://media.giphy.com/media/l0HlskDYh95FpGoec/giphy.gif"
  },
  {
    name: "Barbell Squat",
    description: "The king of lower body exercises, targeting quads, hamstrings, glutes, and lower back.",
    muscleGroup: "Legs",
    difficulty: "intermediate",
    equipment: ["Barbell"],
    sets: 4,
    reps: "8-10",
    restTime: 120,
    safetyInstructions: "Keep your knees tracking over your toes. Maintain a neutral spine throughout the movement.",
    commonMistakes: "Letting knees collapse inward or round the spine.",
    youtubeUrl: "https://www.youtube.com/watch?v=SW_C1A-T050",
    gifUrl: "https://media.giphy.com/media/26FPon5fbbqH2q880/giphy.gif"
  },
  {
    name: "Deadlift",
    description: "A premier full-body posterior chain movement targeting the hamstrings, glutes, lats, and traps.",
    muscleGroup: "Back",
    difficulty: "advanced",
    equipment: ["Barbell"],
    sets: 3,
    reps: "5",
    restTime: 150,
    safetyInstructions: "Engage your core and keep the bar close to your shins. Avoid rounding your lower back.",
    commonMistakes: "Lifting with your back instead of pushing through your legs, or rounding the back.",
    youtubeUrl: "https://www.youtube.com/watch?v=op9kVnSso6Q",
    gifUrl: "https://media.giphy.com/media/hFsGElH9SjPws/giphy.gif"
  },
  {
    name: "Dumbbell Shoulder Press",
    description: "An overhead press targeting the anterior and lateral deltoids, as well as triceps.",
    muscleGroup: "Shoulders",
    difficulty: "intermediate",
    equipment: ["Dumbbells"],
    sets: 4,
    reps: "10-12",
    restTime: 90,
    safetyInstructions: "Do not hyperextend your lower back at the top. Keep your core tight.",
    commonMistakes: "Not using a full range of motion or arching the back excessively.",
    youtubeUrl: "https://www.youtube.com/watch?v=HzIiRyZa5Cg",
    gifUrl: "https://media.giphy.com/media/xT1R9T9K6ZUK7dE8VO/giphy.gif"
  },
  {
    name: "Dumbbell Bicep Curl",
    description: "An isolation exercise focusing on the biceps brachii.",
    muscleGroup: "Biceps",
    difficulty: "beginner",
    equipment: ["Dumbbells"],
    sets: 3,
    reps: "12",
    restTime: 60,
    safetyInstructions: "Control the weight on the way down. Keep your elbows fixed to your sides.",
    commonMistakes: "Using momentum or swinging the body to lift the weight.",
    youtubeUrl: "https://www.youtube.com/watch?v=ykJmrZ5v0Oo",
    gifUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHIyaTZ1NXlqamgxdXo5ZTFpYTRuYXY2bmk0dzRhdnNnY24wdnR6dyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/L5aC2b3jA0880/giphy.gif"
  },
  {
    name: "Tricep Overhead Extension",
    description: "An isolation movement that targets the long head of the triceps.",
    muscleGroup: "Triceps",
    difficulty: "beginner",
    equipment: ["Dumbbells"],
    sets: 3,
    reps: "12",
    restTime: 60,
    safetyInstructions: "Keep your upper arms straight up and close to your ears.",
    commonMistakes: "Flaring the elbows out too much or dropping the head forward.",
    youtubeUrl: "https://www.youtube.com/watch?v=YbX7Wd8jQ-Q",
    gifUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaWN1MTd2am80eXpjdmptMDQ5ODhpdGdzcnA0ZW02MWJpNW1tZjN6OCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Hh8OgIqn4h93G/giphy.gif"
  },
  {
    name: "Lat Pulldown",
    description: "A machine-based compound movement targeting the latissimus dorsi and upper back.",
    muscleGroup: "Back",
    difficulty: "beginner",
    equipment: ["Cable"],
    sets: 4,
    reps: "10-12",
    restTime: 90,
    safetyInstructions: "Pull the bar down to your upper chest, not behind your neck. Control the eccentric phase.",
    commonMistakes: "Leaning back too far or pulling the bar down to the stomach.",
    youtubeUrl: "https://www.youtube.com/watch?v=CAwf7n6Luuc",
    gifUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHU1YzF3djN3bTBoYWtqMmxmb3RnaGtxNHJnYzNlYWJubHNrcWdudSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/k3xHnEw2fLpM4/giphy.gif"
  },
  {
    name: "Plank",
    description: "An isometric core exercise that builds endurance in the abs, obliques, and lower back.",
    muscleGroup: "Abs",
    difficulty: "beginner",
    equipment: ["Bodyweight"],
    sets: 3,
    reps: "60 seconds",
    restTime: 45,
    safetyInstructions: "Maintain a straight line from your head to your heels. Squeeze your glutes and core.",
    commonMistakes: "Letting the hips sag or pointing the butt too high in the air.",
    youtubeUrl: "https://www.youtube.com/watch?v=pSHjTRCQxIw",
    gifUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbDV2YnByODBhZ2t4MXpyeXp6ZWR2dWswbm5pajJnbzhmdWR3ZXp5eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/F0cOQdSRX90dy/giphy.gif"
  },
  {
    name: "Incline Dumbbell Press",
    description: "An upper chest compound movement that targets the clavicular head of the pectorals.",
    muscleGroup: "Chest",
    difficulty: "intermediate",
    equipment: ["Dumbbells", "Incline Bench"],
    sets: 4,
    reps: "10-12",
    restTime: 90,
    safetyInstructions: "Keep your shoulders retracted and pressed into the bench. Avoid lock-out at the very top.",
    commonMistakes: "Pressing the weights too far forward or bringing them too low.",
    youtubeUrl: "https://www.youtube.com/watch?v=8iPqpUpdPhE",
    gifUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3N5YTNodTdyZWdyYng4aXNuZnoybTAzMXozNHoyODFjYjEzbzhsZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3ornjV1r9S4XJpxTpe/giphy.gif"
  },
  {
    name: "Bent-Over Barbell Row",
    description: "A great posterior compound exercise targeting the latissimus dorsi, rhomboids, and mid-traps.",
    muscleGroup: "Back",
    difficulty: "intermediate",
    equipment: ["Barbell"],
    sets: 4,
    reps: "8-10",
    restTime: 90,
    safetyInstructions: "Keep your spine neutral and flat, and hinge at the hips. Do not round your back.",
    commonMistakes: "Using momentum by standing up during the pull.",
    youtubeUrl: "https://www.youtube.com/watch?v=6FZH158T48Y",
    gifUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHU1YzF3djN3bTBoYWtqMmxmb3RnaGtxNHJnYzNlYWJubHNrcWdudSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/v38Gk16h2U2/giphy.gif"
  },
  {
    name: "Dumbbell Lateral Raise",
    description: "An isolation shoulder movement targeting the lateral head of the deltoids.",
    muscleGroup: "Shoulders",
    difficulty: "beginner",
    equipment: ["Dumbbells"],
    sets: 4,
    reps: "12-15",
    restTime: 60,
    safetyInstructions: "Lead with your elbows and keep a slight bend in your arms. Do not raise above shoulder height.",
    commonMistakes: "Swinging the body or using too heavy of a weight.",
    youtubeUrl: "https://www.youtube.com/watch?v=3VcKaXtokVM",
    gifUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHIyaTZ1NXlqamgxdXo5ZTFpYTRuYXY2bmk0dzRhdnNnY24wdnR6dyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/9aefd861gV4V/giphy.gif"
  },
  {
    name: "Leg Press",
    description: "A machine-based leg exercise targeting the quadriceps, glutes, and hamstrings.",
    muscleGroup: "Legs",
    difficulty: "beginner",
    equipment: ["Leg Press Machine"],
    sets: 4,
    reps: "10-12",
    restTime: 90,
    safetyInstructions: "Do not lock out your knees at the top. Keep your back flat against the pad.",
    commonMistakes: "Allowing your lower back to lift off the seat at the bottom of the movement.",
    youtubeUrl: "https://www.youtube.com/watch?v=IZxyjW7MPOM",
    gifUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHIyaTZ1NXlqamgxdXo5ZTFpYTRuYXY2bmk0dzRhdnNnY24wdnR6dyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKrE1815HlR9gK8/giphy.gif"
  },
  {
    name: "Hanging Leg Raise",
    description: "An advanced core abdominal movement targeting lower abs and hip flexors.",
    muscleGroup: "Abs",
    difficulty: "advanced",
    equipment: ["Pull Up Bar"],
    sets: 3,
    reps: "12",
    restTime: 60,
    safetyInstructions: "Keep your shoulders engaged and avoid swinging. Raise legs slowly using your lower abs.",
    commonMistakes: "Using momentum or letting the shoulders go soft.",
    youtubeUrl: "https://www.youtube.com/watch?v=hdncA72lS6c",
    gifUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaWN1MTd2am80eXpjdmptMDQ5ODhpdGdzcnA0ZW02MWJpNW1tZjN6OCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/v5l5x2gLw/giphy.gif"
  }
];

const plansData = [
  {
    name: "Starter Monthly",
    description: "Perfect for beginners who want to try out our facilities.",
    duration: 1,
    price: 49,
    features: [
      "Access to gym floor & equipment",
      "Locker room & shower access",
      "1 Complementary trainer consultation",
      "Access hours: 6 AM - 10 PM"
    ],
    maxTrainerSessions: 1,
    freezeDays: 0,
    accessHours: "6:00 AM - 10:00 PM",
    status: "active"
  },
  {
    name: "Pro Quarterly",
    description: "Designed for individuals looking to make serious progress.",
    duration: 3,
    price: 129,
    features: [
      "Access to gym floor & equipment",
      "Locker room & shower access",
      "6 Personal trainer sessions included",
      "Personalized weekly diet consultation",
      "Access hours: 24/7"
    ],
    maxTrainerSessions: 6,
    freezeDays: 7,
    accessHours: "24/7",
    status: "active"
  },
  {
    name: "Elite VIP Annual",
    description: "The ultimate transformation package with premium perks.",
    duration: 12,
    price: 399,
    features: [
      "24/7 Unlimited access to all facilities",
      "24 Personal trainer sessions (2 per month)",
      "Continuous custom workout & diet plan customization",
      "Access to Steam room, sauna & juice bar discounts",
      "Free GYMPRO training kit (Hoodie + Shaker bottle)",
      "Ability to freeze membership for up to 30 days"
    ],
    maxTrainerSessions: 24,
    freezeDays: 30,
    accessHours: "24/7",
    status: "active"
  }
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI not specified in env configuration");
    }

    console.log("Connecting to Database...");
    await mongoose.connect(mongoUri);
    console.log("Connected. Clearing old collections...");

    await User.deleteMany({});
    await Exercise.deleteMany({});
    await MembershipPlan.deleteMany({});

    console.log("Creating standard users (Admin, Trainers, Members)...");
    
    // Create Admin
    const admin = await User.create({
      name: "GymPro Admin",
      email: "admin@gympro.com",
      password: "Password123",
      role: "admin",
      phone: "+1987654321",
      address: "100 Gym St, Fitness City",
      gender: "male"
    });
    console.log(`- Created Admin: ${admin.email}`);

    // Create Trainers
    const trainer1 = await User.create({
      name: "Alex Mercer",
      email: "trainer1@gympro.com",
      password: "Password123",
      role: "trainer",
      phone: "+1234567890",
      address: "Workout Blvd, Fitness City",
      gender: "male"
    });
    const trainer2 = await User.create({
      name: "Sarah Connor",
      email: "trainer2@gympro.com",
      password: "Password123",
      role: "trainer",
      phone: "+1234567891",
      address: "Core Ave, Fitness City",
      gender: "female"
    });
    console.log(`- Created Trainers: ${trainer1.email}, ${trainer2.email}`);

    // Create Members
    const member1 = await User.create({
      name: "John Doe",
      email: "member1@gympro.com",
      password: "Password123",
      role: "member",
      phone: "+15550199",
      address: "Resident Dr, Gym City",
      gender: "male",
      dateOfBirth: new Date("1995-05-15")
    });
    const member2 = await User.create({
      name: "Jane Smith",
      email: "member2@gympro.com",
      password: "Password123",
      role: "member",
      phone: "+15550299",
      address: "Main Rd, Gym City",
      gender: "female",
      dateOfBirth: new Date("1998-09-22")
    });
    console.log(`- Created Members: ${member1.email}, ${member2.email}`);

    console.log("Seeding exercise library...");
    const createdExercises = await Exercise.create(
      exercisesData.map(ex => ({ ...ex, createdBy: admin._id }))
    );
    console.log(`- Seeded ${createdExercises.length} exercises.`);

    console.log("Seeding membership plans...");
    const createdPlans = await MembershipPlan.create(plansData);
    console.log(`- Seeded ${createdPlans.length} membership plans.`);

    console.log("Database seeded successfully! 🎉");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedDB();
