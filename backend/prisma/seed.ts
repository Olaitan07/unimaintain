import bcrypt from 'bcryptjs';
import { PrismaClient, UserRole, RequestStatus, Priority } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = bcrypt.hashSync('Password123!', 10);

  const admins = await Promise.all([
    prisma.user.create({
      data: { name: 'Alice Admin', email: 'alice.admin@unimaintain.edu', passwordHash, role: UserRole.ADMIN }
    }),
    prisma.user.create({
      data: { name: 'Bob Admin', email: 'bob.admin@unimaintain.edu', passwordHash, role: UserRole.ADMIN }
    })
  ]);

  const officers = await Promise.all([
    prisma.user.create({
      data: { name: 'Officer Olivia', email: 'olivia.officer@unimaintain.edu', passwordHash, role: UserRole.OFFICER }
    }),
    prisma.user.create({
      data: { name: 'Officer Owen', email: 'owen.officer@unimaintain.edu', passwordHash, role: UserRole.OFFICER }
    }),
    prisma.user.create({
      data: { name: 'Officer Opal', email: 'opal.officer@unimaintain.edu', passwordHash, role: UserRole.OFFICER }
    })
  ]);

  const students = await Promise.all([
    prisma.user.create({
      data: { name: 'Student Sam', email: 'sam.student@unimaintain.edu', passwordHash, role: UserRole.STUDENT }
    }),
    prisma.user.create({
      data: { name: 'Student Sara', email: 'sara.student@unimaintain.edu', passwordHash, role: UserRole.STUDENT }
    }),
    prisma.user.create({
      data: { name: 'Student Sean', email: 'sean.student@unimaintain.edu', passwordHash, role: UserRole.STUDENT }
    }),
    prisma.user.create({
      data: { name: 'Student Sky', email: 'sky.student@unimaintain.edu', passwordHash, role: UserRole.STUDENT }
    }),
    prisma.user.create({
      data: { name: 'Student Stella', email: 'stella.student@unimaintain.edu', passwordHash, role: UserRole.STUDENT }
    })
  ]);

  const categories = await Promise.all([
    prisma.category.create({ data: { name: 'Electrical', description: 'Electrical issues, lighting, and wiring.' } }),
    prisma.category.create({ data: { name: 'Plumbing', description: 'Leaks, drains, toilets, and water fixtures.' } }),
    prisma.category.create({ data: { name: 'Cleaning', description: 'Janitorial requests and waste removal.' } }),
    prisma.category.create({ data: { name: 'Heating', description: 'HVAC, heating, and cooling problems.' } }),
    prisma.category.create({ data: { name: 'Furniture', description: 'Furniture repair and replacement.' } })
  ]);

  const sampleRequests = [
    {
      title: 'Dorm room light flickering',
      description: 'The desk lamp and overhead light flicker when turned on.',
      category: categories[0],
      status: RequestStatus.PENDING,
      priority: Priority.HIGH,
      location: 'Dormitory A, Room 205',
      imageUrl: 'https://example.com/images/light.jpg',
      createdBy: students[0]
    },
    {
      title: 'Bathroom sink clogged',
      description: 'The sink is draining very slowly and emits a bad odor.',
      category: categories[1],
      status: RequestStatus.ASSIGNED,
      priority: Priority.MEDIUM,
      location: 'Student Center, 1st Floor',
      imageUrl: 'https://example.com/images/sink.jpg',
      createdBy: students[1],
      assignedTo: officers[0]
    },
    {
      title: 'Lecture hall carpet stain',
      description: 'There is a large spill stain in Lecture Hall B.',
      category: categories[2],
      status: RequestStatus.IN_PROGRESS,
      priority: Priority.LOW,
      location: 'Lecture Hall B',
      imageUrl: 'https://example.com/images/stain.jpg',
      createdBy: students[2],
      assignedTo: officers[1]
    },
    {
      title: 'AC blowing warm air',
      description: 'The air conditioning unit is not cooling properly.',
      category: categories[3],
      status: RequestStatus.PENDING,
      priority: Priority.HIGH,
      location: 'Library, Main Reading Room',
      imageUrl: 'https://example.com/images/ac.jpg',
      createdBy: students[3]
    },
    {
      title: 'Broken chair in cafeteria',
      description: 'One of the chairs in the dining area is cracked and unsafe.',
      category: categories[4],
      status: RequestStatus.COMPLETED,
      priority: Priority.MEDIUM,
      location: 'Campus Cafeteria',
      imageUrl: 'https://example.com/images/chair.jpg',
      createdBy: students[4],
      assignedTo: officers[2]
    },
    {
      title: 'Outlet sparks when used',
      description: 'A wall outlet sparks when plugging in a device.',
      category: categories[0],
      status: RequestStatus.ASSIGNED,
      priority: Priority.HIGH,
      location: 'Arts Building, Studio 3',
      imageUrl: 'https://example.com/images/outlet.jpg',
      createdBy: students[0],
      assignedTo: officers[0]
    },
    {
      title: 'Overflowing trash bins',
      description: 'Trash bins in the engineering hall are overflowing.',
      category: categories[2],
      status: RequestStatus.IN_PROGRESS,
      priority: Priority.MEDIUM,
      location: 'Engineering Hall, 2nd Floor',
      imageUrl: 'https://example.com/images/trash.jpg',
      createdBy: students[1],
      assignedTo: officers[1]
    },
    {
      title: 'Window stuck open',
      description: 'A classroom window will not close properly.',
      category: categories[4],
      status: RequestStatus.PENDING,
      priority: Priority.MEDIUM,
      location: 'Classroom 105',
      imageUrl: 'https://example.com/images/window.jpg',
      createdBy: students[2]
    },
    {
      title: 'Heating unit noisy',
      description: 'The dormitory heating unit makes loud knocking sounds.',
      category: categories[3],
      status: RequestStatus.ASSIGNED,
      priority: Priority.HIGH,
      location: 'Dormitory C, Room 111',
      imageUrl: 'https://example.com/images/heater.jpg',
      createdBy: students[3],
      assignedTo: officers[2]
    },
    {
      title: 'Broken shelf in locker room',
      description: 'A shelf in the locker room has cracked and needs repair.',
      category: categories[4],
      status: RequestStatus.PENDING,
      priority: Priority.LOW,
      location: 'Gym Locker Room',
      imageUrl: 'https://example.com/images/shelf.jpg',
      createdBy: students[4]
    }
  ];

  await Promise.all(
    sampleRequests.map((request) =>
      prisma.serviceRequest.create({
        data: {
          title: request.title,
          description: request.description,
          categoryId: request.category.id,
          status: request.status,
          priority: request.priority,
          location: request.location,
          imageUrl: request.imageUrl,
          createdById: request.createdBy.id,
          assignedToId: request.assignedTo?.id
        }
      })
    )
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
