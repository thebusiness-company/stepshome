import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { girlCreateSchema, formatZodErrors } from '@/lib/schemas';

const INITIAL_GIRLS = [
  { name: 'Nisha', age: 21, description: '“A Dentist in the making” Nisha is currently in her 3rd year of study at Sree Balaji Dental College to become a dentist. Nisha is very passionate about music as well as creating her own songs.', img: '/profile/Nisha.png' },
  { name: 'Karunya', age: 20, description: 'Karu is currently pursuing her 2nd year at WCC with the dream of becoming a fashion designer. She is highly passionate about art and creativity, constantly exploring new ideas and designs to express her talent.', img: '/profile/Karunya.png' },
  { name: 'Sarah', age: 20, description: 'Sara is currently pursuing her 2nd year at Crown College with the goal of becoming a nurse. She is passionate about helping others and loves playing the drums in her free time.', img: '/profile/Sara.png' },
  { name: 'Pushpa', age: 21, description: 'Pushpa is a 3rd year student at WCC, and wants to be a photographer. She enjoys taking pictures and cooking. Her creativity and dedication make her passionate about pursuing her dreams.', img: '/profile/Pushpa.png' },
  { name: 'Meethu', age: 20, description: 'Meethu is currently pursuing B.Tech 2nd year at Karunya Institute of Technology and Sciences. She wants to be a doctor in the future. She likes dancing and taking part in various kinds of activities. She is hard-working and happy and tries her best to achieve her goals.', img: '/profile/Meethu.png' },
  { name: 'Punitha', age: 20, description: 'Punitha has completed her degree in Forensic Science from Karunya Institute of Technology and Sciences. Now she is training at an aviation academy to pursue her dream of becoming a cabin crew member. In her free time she enjoys reading books .', img: '/profile/Punitha.png' },
  { name: 'Angel', age: 17, description: 'Angel is a 12th grader who studies in a Science group. She dreams of becoming a doctor . She likes to read books in her spare time, which helps her learn new things and expand her knowledge.', img: '/profile/Angel.png' },
  { name: 'Jennifer', age: 18, description: 'Jennifer is currently studying in the 12th grade with Home Science. Her dream is to become a chef and is passionate about cooking. She loves trying new recipes and learning different cooking techniques.', img: '/profile/Jennifer.png' },
  { name: 'Theresa', age: 22, description: 'Theresa has completed her Home Science degree at Women\'s Christian College. She is now pursuing her dream of becoming a cabin crew member at an aviation academy. She enjoys cooking and loves helping and serving people .', img: '/profile/Theresa.png' },
  { name: 'Shreeja', age: 21, description: 'Shreeja has finished her studies in Home Science at Women\'s Christian College. She is presently employed as a hotel manager. She likes cooking very much and enjoys experimenting with new recipes.', img: '/profile/Shreeja.png' },
  { name: 'Mary', age: 20, description: 'Mary is currently studying nursing as a second year student in Madras Medical Mission College of Nursing. Her dream is to become a nurse.Mary likes baking and is fond of experimenting with various recipes.', img: '/profile/Mary.png' },
  { name: 'Saradha', age: 22, description: 'Saradha has graduated from her B.Sc in Media Production. She is currently pursuing her B.Ed. Her dream is to be a teacher and inspire children. She loves to teach kids in her spare time and edit videos and pictures.', img: '/profile/Saradha.png' },
  { name: 'Bharathi', age: 22, description: 'Bharathi graduated with a Bachelor of Science in Artificial Intelligence and is pursuing a Master’s degree in MBA from Saveetha Institute of Medical and Technical Sciences in her second year. She wishes to become a HR manager in the future. She loves cracking jokes and also loves trying different foods.', img: '/profile/Bharathi.png' },
  { name: 'Dhivya', age: 20, description: 'Dhivya is a 2nd year Physiotherapy student at the Union Christian College. Her aspiration is to be a nurse one day and she works hard towards realizing her dream. Dancing is another passion of hers.', img: '/profile/Dhivya.png' },
  { name: 'Hashini', age: 18, description: 'Hashini is currently studying in the 12th grade with the Science group. She dreams of becoming an engineer in the future. Her hobby is crocheting, and she enjoys creating beautiful handmade items in her free time', img: '/profile/Hashini.png' },
  { name: 'Kavinaya', age: 16, description: 'Kavi is currently studying in the 10th grade. She dreams of becoming a police officer. She enjoys playing games in her free time and loves taking on new challenges.', img: '/profile/Kavinaya.png' },
  { name: 'Gloria', age: 16, description: 'Gloria is currently studying in the 10th grade. She dreams of becoming an IT professional in the future. She enjoys playing and learning the guitar in her free time.', img: '/profile/Gloria.png' },
  { name: 'Bhuvana', age: 9, description: 'Bhuvana joined Steps Home about three months ago and is currently studying in the 7th grade. She dreams of becoming a police officer in the future. She enjoys reading books and playing games .', img: '/profile/Bhuvana.png' },
  { name: 'Gopika', age: 7, description: 'Gopika joined Steps Home about three months ago and is currently studying in the 5th grade. She dreams of becoming a Doctor in the future. She likes to play games and do coloring .', img: '/profile/Gopika.png' }
];

/** Public GET — lists all girls, ordered by sortOrder and name */
export async function GET() {
  try {
    let girls = await prisma.girl.findMany({
      orderBy: [
        { sortOrder: 'asc' },
        { name: 'asc' }
      ]
    });

    // Auto-seed if empty
    if (girls.length === 0) {
      await prisma.girl.createMany({
        data: INITIAL_GIRLS.map((g, idx) => ({
          ...g,
          sortOrder: idx
        }))
      });

      girls = await prisma.girl.findMany({
        orderBy: [
          { sortOrder: 'asc' },
          { name: 'asc' }
        ]
      });
    }

    return NextResponse.json({ success: true, data: girls });
  } catch (error) {
    console.error('[Girls API] GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch girls list.' }, { status: 500 });
  }
}

/** Admin-only POST — adds a new girl profile (protected by middleware) */
export async function POST(request: NextRequest) {
  try {
    const raw = await request.json();
    const result = girlCreateSchema.safeParse(raw);
    if (!result.success) {
      return NextResponse.json({ error: formatZodErrors(result.error) }, { status: 400 });
    }

    const { name, age, description, img } = result.data;
    
    // Find next sortOrder
    const maxSort = await prisma.girl.aggregate({
      _max: { sortOrder: true }
    });
    const nextSort = (maxSort._max.sortOrder ?? -1) + 1;

    const girl = await prisma.girl.create({
      data: {
        name,
        age,
        description,
        img,
        sortOrder: nextSort
      }
    });

    return NextResponse.json({ success: true, data: girl }, { status: 201 });
  } catch (error) {
    console.error('[Girls API] POST Error:', error);
    return NextResponse.json({ error: 'Failed to create girl profile.' }, { status: 500 });
  }
}
