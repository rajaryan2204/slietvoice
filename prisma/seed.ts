import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clean existing tables
  await prisma.notification.deleteMany();
  await prisma.pollVote.deleteMany();
  await prisma.pollOption.deleteMany();
  await prisma.poll.deleteMany();
  await prisma.news.deleteMany();
  await prisma.opinionSupport.deleteMany();
  await prisma.opinion.deleteMany();
  await prisma.escalation.deleteMany();
  await prisma.complaintEvidence.deleteMany();
  await prisma.complaintUpdate.deleteMany();
  await prisma.complaint.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.department.deleteMany();

  // 1. Create Departments
  const cse = await prisma.department.create({ data: { name: "Computer Science" } });
  const ee = await prisma.department.create({ data: { name: "Electrical Engineering" } });
  const me = await prisma.department.create({ data: { name: "Mechanical Engineering" } });
  const admin = await prisma.department.create({ data: { name: "Administration" } });
  const hostel = await prisma.department.create({ data: { name: "Hostel & Mess Management" } });

  console.log("Departments created.");

  const defaultPasswordHash = await bcrypt.hash("password123", 10);
  const adminPasswordHash = await bcrypt.hash("Aryan2204*", 10);

  // 2. Create Core Role Users
  const studentUser = await prisma.user.create({
    data: {
      email: "student@college.edu",
      name: "Alex Mercer",
      passwordHash: defaultPasswordHash,
      role: "STUDENT",
      departmentId: cse.id,
      profile: {
        create: {
          studentId: "STU-2026-0001",
          year: 3,
          departmentId: cse.id,
        },
      },
    },
  });

  const adminUser = await prisma.user.create({
    data: {
      email: "admin@college.edu",
      name: "Dr. Aris Vance",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
      departmentId: admin.id,
    },
  });

  const moderatorUser = adminUser;
  const facultyUser = adminUser;
  const directorUser = adminUser;

  console.log("Core users created.");

  // 3. Create Additional Students
  const studentNames = [
    { name: "Liam Johnson", email: "liam@college.edu", dept: cse.id, yr: 1, id: "STU-2026-0002" },
    { name: "Emma Smith", email: "emma@college.edu", dept: ee.id, yr: 2, id: "STU-2026-0003" },
    { name: "Noah Williams", email: "noah@college.edu", dept: me.id, yr: 4, id: "STU-2026-0004" },
    { name: "Olivia Brown", email: "olivia@college.edu", dept: cse.id, yr: 2, id: "STU-2026-0005" },
    { name: "James Miller", email: "james@college.edu", dept: ee.id, yr: 3, id: "STU-2026-0006" },
    { name: "Sophia Davis", email: "sophia@college.edu", dept: hostel.id, yr: 1, id: "STU-2026-0007" },
    { name: "Benjamin Wilson", email: "ben@college.edu", dept: cse.id, yr: 4, id: "STU-2026-0008" },
    { name: "Mia Taylor", email: "mia@college.edu", dept: me.id, yr: 3, id: "STU-2026-0009" },
    { name: "Lucas Anderson", email: "lucas@college.edu", dept: hostel.id, yr: 2, id: "STU-2026-0010" },
  ];

  const students: any[] = [studentUser];
  for (const s of studentNames) {
    const user = await prisma.user.create({
      data: {
        email: s.email,
        name: s.name,
        passwordHash: defaultPasswordHash,
        role: "STUDENT",
        departmentId: s.dept,
        profile: {
          create: {
            studentId: s.id,
            year: s.yr,
            departmentId: s.dept,
          },
        },
      },
    });
    students.push(user);
  }

  console.log("9 additional students created.");

  // 4. Create 15 Complaints
  const complaintsData = [
    {
      id: "CV-2026-00001",
      title: "Broken Wi-Fi Router in Block C Hostel",
      description: "The primary Wi-Fi router on the 3rd floor of Block C Hostel has been down for over 4 days. Students are unable to access class materials and online lectures.",
      category: "IT/Internet",
      priority: "HIGH",
      status: "SUBMITTED",
      isAnonymous: false,
      departmentId: hostel.id,
      studentIndex: 0,
    },
    {
      id: "CV-2026-00002",
      title: "Poor Food Quality in South Campus Mess",
      description: "The food served during dinner is often undercooked and has hygiene issues. Several students fell sick last Tuesday after consuming dinner.",
      category: "Mess",
      priority: "URGENT",
      status: "UNDER_REVIEW",
      isAnonymous: false,
      departmentId: hostel.id,
      studentIndex: 1,
    },
    {
      id: "CV-2026-00003",
      title: "Outdated Laboratory Equipment in EE Lab",
      description: "The oscilloscopes in the EE Core Lab are malfunctioning and show incorrect readings. This is severely affecting our lab experiments.",
      category: "Academics",
      priority: "MEDIUM",
      status: "ASSIGNED",
      isAnonymous: true,
      departmentId: ee.id,
      studentIndex: 2,
    },
    {
      id: "CV-2026-00004",
      title: "Water Leakage in Main Block Library Corridor",
      description: "There is a severe water pipe leakage near the entrance of the Library, causing a slippery floor and damaging adjacent wall paint.",
      category: "Infrastructure",
      priority: "LOW",
      status: "ACTION_TAKEN",
      isAnonymous: false,
      departmentId: admin.id,
      studentIndex: 3,
    },
    {
      id: "CV-2026-00005",
      title: "Errors in Semester Exam Hall Ticket Details",
      description: "Many students in the CSE department have wrong subjects listed on their semester exam hall tickets. We need an urgent correction window.",
      category: "Examination",
      priority: "URGENT",
      status: "RESOLVED",
      isAnonymous: false,
      departmentId: cse.id,
      studentIndex: 4,
    },
    {
      id: "CV-2026-00006",
      title: "Unresponsive Faculty Support for Projects",
      description: "We are not getting any feedback on our senior design projects from our guide. Requests for meetings are repeatedly ignored.",
      category: "Faculty",
      priority: "LOW",
      status: "ESCALATED",
      isAnonymous: true,
      departmentId: cse.id,
      studentIndex: 5,
    },
    {
      id: "CV-2026-00007",
      title: "Delayed Shuttle Bus Services to Railway Station",
      description: "The campus shuttle bus frequently leaves 15-20 minutes late, causing students to miss their transit links. There is no fixed timetable.",
      category: "Transport",
      priority: "MEDIUM",
      status: "SUBMITTED",
      isAnonymous: false,
      departmentId: admin.id,
      studentIndex: 6,
    },
    {
      id: "CV-2026-00008",
      title: "Lack of Ventilation in Hostel Gym",
      description: "The fans in the hostel gym are not working, and the room has no proper windows. It gets extremely suffocating during peak hours.",
      category: "Hostel",
      priority: "LOW",
      status: "SUBMITTED",
      isAnonymous: false,
      departmentId: hostel.id,
      studentIndex: 7,
    },
    {
      id: "CV-2026-00009",
      title: "Unfair Fine Levied for Late Hostel Check-in",
      description: "I was fined $50 for being 5 minutes late due to heavy traffic on the highway. There should be a grace period for genuine issues.",
      category: "Fees",
      priority: "LOW",
      status: "UNDER_REVIEW",
      isAnonymous: false,
      departmentId: hostel.id,
      studentIndex: 8,
    },
    {
      id: "CV-2026-00010",
      title: "Inoperative CCTV Cameras near Girls Hostel Gate",
      description: "The security cameras pointing towards the gate of the girls hostel are broken. This is a severe safety hazard that needs immediate fixing.",
      category: "Safety",
      priority: "URGENT",
      status: "ASSIGNED",
      isAnonymous: true,
      departmentId: hostel.id,
      studentIndex: 0,
    },
    {
      id: "CV-2026-00011",
      title: "Mess Plates and Utensils are Greasy",
      description: "The cleaning staff at the North Mess do not wash the plates properly. Greasy residue can be seen and smelled on most plates.",
      category: "Mess",
      priority: "MEDIUM",
      status: "RESOLVED",
      isAnonymous: false,
      departmentId: hostel.id,
      studentIndex: 1,
    },
    {
      id: "CV-2026-00012",
      title: "Stray Dogs inside Academic Blocks",
      description: "Several stray dogs enter the ground floor classrooms of Block A, creating panic among students during lectures. The campus security should address this.",
      category: "Infrastructure",
      priority: "MEDIUM",
      status: "SUBMITTED",
      isAnonymous: false,
      departmentId: admin.id,
      studentIndex: 2,
    },
    {
      id: "CV-2026-00013",
      title: "Classroom Air Conditioners Not Cooling",
      description: "The AC units in Block B room 202 are blowing hot air. In this summer heat, it is impossible to concentrate during 2-hour classes.",
      category: "Infrastructure",
      priority: "MEDIUM",
      status: "ESCALATED",
      isAnonymous: false,
      departmentId: admin.id,
      studentIndex: 3,
    },
    {
      id: "CV-2026-00014",
      title: "Non-responsive Support on Student Portal Login Issues",
      description: "The IT helpdesk is not responding to tickets regarding accounts locked due to two-factor authentication issues.",
      category: "IT/Internet",
      priority: "HIGH",
      status: "UNDER_REVIEW",
      isAnonymous: false,
      departmentId: admin.id,
      studentIndex: 4,
    },
    {
      id: "CV-2026-00015",
      title: "Academic Grade Discrepancy in Midterm Exams",
      description: "My marks in the Midterm DBMS paper were calculated incorrectly. The examiner marked me absent for Question 3, which I had fully answered.",
      category: "Academics",
      priority: "MEDIUM",
      status: "ASSIGNED",
      isAnonymous: false,
      departmentId: cse.id,
      studentIndex: 5,
    },
  ];

  for (const c of complaintsData) {
    const student = students[c.studentIndex];
    await prisma.complaint.create({
      data: {
        id: c.id,
        title: c.title,
        description: c.description,
        category: c.category,
        priority: c.priority,
        status: c.status,
        isAnonymous: c.isAnonymous,
        departmentId: c.departmentId,
        studentId: student.id,
      },
    });

    // Create a default initial update for each complaint
    await prisma.complaintUpdate.create({
      data: {
        complaintId: c.id,
        authorId: student.id,
        status: "SUBMITTED",
        message: "Grievance successfully registered on the portal.",
        isInternal: false,
      },
    });

    // Add specific updates based on current status
    if (c.status !== "SUBMITTED") {
      await prisma.complaintUpdate.create({
        data: {
          complaintId: c.id,
          authorId: moderatorUser.id,
          status: "UNDER_REVIEW",
          message: "Complaint has been reviewed and verified by student representative/moderator.",
          isInternal: false,
        },
      });
    }

    if (c.status === "ASSIGNED" || c.status === "ACTION_TAKEN" || c.status === "RESOLVED") {
      await prisma.complaintUpdate.create({
        data: {
          complaintId: c.id,
          authorId: facultyUser.id,
          status: "ASSIGNED",
          message: "Assigned to department faculty. Investigating the issue.",
          isInternal: false,
        },
      });
    }

    if (c.status === "ACTION_TAKEN" || c.status === "RESOLVED") {
      await prisma.complaintUpdate.create({
        data: {
          complaintId: c.id,
          authorId: facultyUser.id,
          status: "ACTION_TAKEN",
          message: "Action plan initiated. Ground staff dispatched to inspect and repair.",
          isInternal: false,
        },
      });
    }

    if (c.status === "RESOLVED") {
      await prisma.complaintUpdate.create({
        data: {
          complaintId: c.id,
          authorId: directorUser.id,
          status: "RESOLVED",
          message: "Verified and marked as fully resolved. Case closed.",
          isInternal: false,
        },
      });
    }

    if (c.status === "ESCALATED") {
      await prisma.complaintUpdate.create({
        data: {
          complaintId: c.id,
          authorId: directorUser.id,
          status: "ESCALATED",
          message: "Unresolved within the deadline. Escalated to higher college authority (Director).",
          isInternal: false,
        },
      });

      await prisma.escalation.create({
        data: {
          complaintId: c.id,
          previousAuthority: "Faculty Admin",
          currentAuthority: "Director",
          escalationLevel: 2,
          deadline: new Date(Date.now() + 86400000 * 3), // 3 days in future
          status: "PENDING",
        },
      });
    }
  }

  console.log("15 complaints and histories created.");

  // 5. Create 10 News items
  const newsCategories = [
    { cat: "Academics", title: "Autumn Semester Registration Open", desc: "Registration for the autumn semester is open starting next Monday. Students can choose their electives via the online portal." },
    { cat: "Examination", title: "DBMS Midterm Re-evaluation Schedule", desc: "Re-evaluation forms for the DBMS midterm can be submitted online before August 25. Standard fees apply." },
    { cat: "Hostel", title: "New Hostel Rules and Security Protocols", desc: "In light of recent upgrades, curfew timings are extended to 11 PM with valid library passes." },
    { cat: "Mess", title: "Weekly Menu Updates at North Mess", desc: "We are introducing protein-rich vegan options on Tuesdays and Thursdays. Feedback can be shared on the portal." },
    { cat: "Events", title: "Campus Fest 'Waves 2026' Initial Meeting", desc: "Join us in the auditorium this Friday at 4 PM to pitch event ideas and form organising committees." },
    { cat: "Administration", title: "Parking Space Expansion Complete", desc: "The new parking lot near the sports complex is open. Electric vehicles get charging slots." },
    { cat: "Emergency", title: "Temporary Power Shutdown on Sunday", desc: "Academic block B and C will experience power outages on Sunday from 9 AM to 1 PM due to substation repairs." },
    { cat: "Academics", title: "AI/ML Workshop by Google Engineers", desc: "A three-day workshop on modern deep learning models will be conducted next month. Seats are limited." },
    { cat: "Events", title: "Inter-College Sports Tournament Schedule", desc: "Check out the match timings for football, basketball, and table tennis teams representing our college." },
    { cat: "Hostel", title: "Routine Pest Control in Hostels B & C", desc: "Pest control operations will take place this Saturday. Please coordinate with floor supervisors." }
  ];

  for (const n of newsCategories) {
    await prisma.news.create({
      data: {
        title: n.title,
        content: n.desc,
        category: n.cat,
        authorId: directorUser.id,
        isVerified: true,
      },
    });
  }

  console.log("10 News items created.");

  // 6. Create 8 Student Opinions
  const opinions = [
    { title: "Library should remain open until 10 PM", desc: "Currently the library closes at 8 PM. With midterm exams approaching, staying open until 10 PM would greatly help students who do not have a quiet study space in hostels.", cat: "Academics", isAnon: false, authIndex: 0 },
    { title: "Improve gym equipment and working hours", desc: "Most machines are rusted or broken. The gym should also have a supervisor to assist beginners and maintain equipment.", cat: "Hostel", isAnon: false, authIndex: 1 },
    { title: "Add more healthy options in the food court", desc: "Currently we only have fast food options. Adding a salad bar or fresh juice stalls would be a wonderful addition to promote campus fitness.", cat: "Mess", isAnon: true, authIndex: 2 },
    { title: "Provide electric cycle rental service on campus", desc: "Walking from the hostels to academic block C takes 15 minutes. A cheap dockless cycle sharing app would save time.", cat: "Infrastructure", isAnon: false, authIndex: 3 },
    { title: "Switch all assignment submissions to PDF format", desc: "Printing papers for every small weekly assignment is a massive waste of paper and money. Let's make all submissions digital.", cat: "Academics", isAnon: false, authIndex: 4 },
    { title: "Hostel curfew should be relaxed during weekends", desc: "On Saturdays and Sundays, curfew should be extended from 10 PM to midnight to allow students to enjoy local events.", cat: "Hostel", isAnon: true, authIndex: 5 },
    { title: "Create dedicated coding lounge in library", desc: "We need rooms with whiteboard walls and plug points where coding teams can gather, brainstorm, and work on hackathons without disturbing others.", cat: "IT/Internet", isAnon: false, authIndex: 6 },
    { title: "Campus guards should be trained in emergency first aid", desc: "If a medical emergency occurs late at night, security guards are the first to arrive. Basic CPR and first-aid training is vital.", cat: "Safety", isAnon: false, authIndex: 7 }
  ];

  for (const op of opinions) {
    const opinionObj = await prisma.opinion.create({
      data: {
        title: op.title,
        description: op.desc,
        category: op.cat,
        isAnonymous: op.isAnon,
        authorId: op.isAnon ? null : students[op.authIndex].id,
      },
    });

    // Add upvotes/support from random students
    const voterCount = Math.floor(Math.random() * 8) + 3; // 3 to 10 upvotes
    const shuffledStudents = [...students].sort(() => 0.5 - Math.random());
    for (let i = 0; i < voterCount; i++) {
      try {
        await prisma.opinionSupport.create({
          data: {
            opinionId: opinionObj.id,
            studentId: shuffledStudents[i].id,
          },
        });
      } catch (e) {
        // Ignore duplicate key constraints
      }
    }
  }

  console.log("8 opinions and supports created.");

  // 7. Create 3 Polls
  const pollsData = [
    {
      question: "Should the library remain open until 10 PM during exam weeks?",
      options: ["YES", "NO"],
      creatorId: moderatorUser.id,
    },
    {
      question: "What is your preference for the upcoming Campus Fest theme?",
      options: ["Retro 80s Cyberpunk", "Cosmic Starlight Fantasy", "Neon Jungle Adventure"],
      creatorId: moderatorUser.id,
    },
    {
      question: "Would you support converting all exams to digital open-book exams?",
      options: ["Highly Support", "Neutral", "Strongly Oppose"],
      creatorId: directorUser.id,
    },
  ];

  for (const p of pollsData) {
    const createdPoll = await prisma.poll.create({
      data: {
        question: p.question,
        createdById: p.creatorId,
        isActive: true,
      },
    });

    for (const optText of p.options) {
      const option = await prisma.pollOption.create({
        data: {
          pollId: createdPoll.id,
          text: optText,
        },
      });

      // Add random votes
      const voteCount = Math.floor(Math.random() * 5) + 2; // 2 to 6 votes per option
      const shuffledStudents = [...students].sort(() => 0.5 - Math.random());
      for (let i = 0; i < voteCount; i++) {
        try {
          await prisma.pollVote.create({
            data: {
              optionId: option.id,
              studentId: shuffledStudents[i].id,
            },
          });
        } catch (e) {
          // Ignore duplicate keys
        }
      }
    }
  }

  console.log("3 Polls and votes created.");

  // 8. Create some initial Notifications
  await prisma.notification.create({
    data: {
      userId: studentUser.id,
      message: "Welcome to SLIETVoice! Your voice is now registered.",
      isRead: false,
    },
  });

  await prisma.notification.create({
    data: {
      userId: studentUser.id,
      message: "Your complaint CV-2026-00001 (Broken Wi-Fi Router) has been registered.",
      isRead: false,
    },
  });

  await prisma.notification.create({
    data: {
      userId: facultyUser.id,
      message: "New complaint assigned to Computer Science Department: CV-2026-00015.",
      isRead: false,
    },
  });

  console.log("Notifications created.");

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
