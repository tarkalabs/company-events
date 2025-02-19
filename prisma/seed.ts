import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const events = [
  {
    day: 1,
    time: "9:30 AM",
    session: "Ice breaker & Welcome Note",
    details: null
  },
  {
    day: 1,
    time: "9:45 AM",
    session: "Sneak peek into the next two days",
    details: "Agenda + ground rules"
  },
  {
    day: 1,
    time: "10:00 AM",
    session: "CFO's Sedin Vision - Setting the Pace for 2025",
    details: "Mani will present the Vision for 2025, plus Q&A"
  },
  {
    day: 1,
    time: "10:15 AM",
    session: "Hearing from our Core Operations",
    details: "IT, Finance, Admin, and Marketing will present recap and challenges needing attention"
  },
  {
    day: 1,
    time: "11:00 AM",
    session: "Coffee + Networking",
    details: null
  },
  {
    day: 1,
    time: "11:15 AM",
    session: "Panel Discussion - Performance at Sedin",
    details: "A discussion on the existing performance setup and what must change"
  },
  {
    day: 1,
    time: "12:00 PM",
    session: "Future of AI for SMB Orgs",
    details: "Industry veteran Dr. Rajasekar's speech about the Future of AI for small organizations"
  },
  {
    day: 1,
    time: "1:00 PM",
    session: "Lunch",
    details: null
  },
  {
    day: 1,
    time: "2:00 PM",
    session: "Quiz - Movie Trivia",
    details: "A fun trivia session"
  },
  {
    day: 1,
    time: "2:15 PM",
    session: "The New Sedin - An Operational Vision",
    details: "A presentation detailing the changes to come as we transform into a unified organization"
  },
  {
    day: 1,
    time: "3:15 PM",
    session: "BU Presentations 2 (30 Mins per BU)",
    details: "Presentations from BU heads on the year gone by and plans for the next year"
  },
  {
    day: 1,
    time: "4:15 PM",
    session: "Coffee",
    details: null
  },
  {
    day: 1,
    time: "4:30 PM",
    session: "BU Presentations 2 (30 Mins per BU)",
    details: "Presentations from BU heads on the year gone by and plans for the next year"
  },
  {
    day: 1,
    time: "5:30 PM",
    session: "Break",
    details: null
  },
  {
    day: 1,
    time: "5:40 PM",
    session: "AI We Should Do - A Tech Vision Exercise",
    details: "Part 1: Our learning journey, AI chapter, and initiatives so far. Part 2: Looking ahead on how we will be accountable for AI at Sedin."
  },
  {
    day: 1,
    time: "6:30 PM",
    session: "Closing Note",
    details: null
  },
  {
    day: 2,
    time: "9:30 AM",
    session: "BU Presentations 4 (30 Mins per BU)",
    details: "Presentations from BU heads on the year gone by and plans for the next year"
  },
  {
    day: 2,
    time: "11:30 AM",
    session: "Coffee",
    details: null
  },
  {
    day: 2,
    time: "11:45 AM",
    session: "DS, DC, and ES - The 'New' Sedin - How Do We Co-operate",
    details: "How can we all collaborate to make the vision a success"
  },
  {
    day: 2,
    time: "12:45 PM",
    session: "Lunch",
    details: null
  },
  {
    day: 2,
    time: "1:45 PM",
    session: "Fun Activity",
    details: "Another fun trivia session"
  },
  {
    day: 2,
    time: "2:00 PM",
    session: "Global Office Updates - Steve and Hari",
    details: "Middle East and Australia will present a recap and plans for their region"
  },
  {
    day: 2,
    time: "3:00 PM",
    session: "Panel: Our Collaboration Approach to Move Forward Smoothly",
    details: "A discussion on our rapport and communication, and what we can do better"
  },
  {
    day: 2,
    time: "3:45 PM",
    session: "Coffee + Networking",
    details: null
  },
  {
    day: 2,
    time: "4:15 PM",
    session: "Sedin @ 100 Mn - A Futurespective",
    details: "A future thinking exercise to hit our targets, intentions, and what will propel us forward"
  },
  {
    day: 2,
    time: "5:00 PM",
    session: "GTM/Sales Update",
    details: "A recap of the previous year by the sales teams, and their upcoming plans"
  },
  {
    day: 2,
    time: "6:00 PM",
    session: "Closing Note",
    details: null
  },
  {
    day: 2,
    time: "6:15 PM",
    session: "Dinner",
    details: null
  }
];

async function main() {
  console.log('Start seeding...');
  
  // Clear existing data
  await prisma.feedback.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();

  // Create events
  for (const event of events) {
    await prisma.event.create({
      data: {
        day: event.day,
        time: event.time,
        session: event.session,
        details: event.details,
      },
    });
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 