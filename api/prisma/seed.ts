
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';

const connectionString = process.env['DATABASE_URL'];

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined.');
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const genres = [
  'Fantasy',
  'Science Fiction',
  'Mystery',
  'Non-fiction',
];

const books = [
  // Fantasy
  { title: 'The Hobbit', author: 'J.R.R. Tolkien', publishedYear: 1937, genre: 'Fantasy' },
  { title: 'The Fellowship of the Ring', author: 'J.R.R. Tolkien', publishedYear: 1954, genre: 'Fantasy' },
  { title: 'A Wizard of Earthsea', author: 'Ursula K. Le Guin', publishedYear: 1968, genre: 'Fantasy' },
  { title: 'The Name of the Wind', author: 'Patrick Rothfuss', publishedYear: 2007, genre: 'Fantasy' },
  { title: 'The Lion, the Witch and the Wardrobe', author: 'C.S. Lewis', publishedYear: 1950, genre: 'Fantasy' },

  // Science Fiction
  { title: 'Dune', author: 'Frank Herbert', publishedYear: 1965, genre: 'Science Fiction' },
  { title: '1984', author: 'George Orwell', publishedYear: 1949, genre: 'Science Fiction' },
  { title: 'Foundation', author: 'Isaac Asimov', publishedYear: 1951, genre: 'Science Fiction' },
  { title: 'Fahrenheit 451', author: 'Ray Bradbury', publishedYear: 1953, genre: 'Science Fiction' },
  { title: 'The Martian', author: 'Andy Weir', publishedYear: 2011, genre: 'Science Fiction' },

  // Mystery
  { title: 'The Hound of the Baskervilles', author: 'Arthur Conan Doyle', publishedYear: 1902, genre: 'Mystery' },
  { title: 'The Murder of Roger Ackroyd', author: 'Agatha Christie', publishedYear: 1926, genre: 'Mystery' },
  { title: 'And Then There Were None', author: 'Agatha Christie', publishedYear: 1939, genre: 'Mystery' },
  { title: 'The Big Sleep', author: 'Raymond Chandler', publishedYear: 1939, genre: 'Mystery' },
  { title: 'Gone Girl', author: 'Gillian Flynn', publishedYear: 2012, genre: 'Mystery' },

  // Non-fiction
  { title: 'Sapiens', author: 'Yuval Noah Harari', publishedYear: 2011, genre: 'Non-fiction' },
  { title: 'Educated', author: 'Tara Westover', publishedYear: 2018, genre: 'Non-fiction' },
  { title: 'The Selfish Gene', author: 'Richard Dawkins', publishedYear: 1976, genre: 'Non-fiction' },
  { title: 'A Brief History of Time', author: 'Stephen Hawking', publishedYear: 1988, genre: 'Non-fiction' },
  { title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', publishedYear: 2011, genre: 'Non-fiction' },
];

async function main() {
  const genreRecords = await Promise.all(
    genres.map((name) =>
      prisma.genre.upsert({
        where: { name },
        update: {},
        create: { name },
      }),
    ),
  );

  const genreIds = new Map(
    genreRecords.map((genre) => [genre.name, genre.id]),
  );

  let createdCount = 0;
  let updatedCount = 0;

  for (const book of books) {
    const genreId = genreIds.get(book.genre);

    if (genreId === undefined) {
      throw new Error(`Genre not found: ${book.genre}`);
    }

    const existingBook = await prisma.book.findFirst({
      where: {
        title: book.title,
        author: book.author,
        genreId,
      },
    });

    if (existingBook) {
      await prisma.book.update({
        where: { id: existingBook.id },
        data: { publishedYear: book.publishedYear },
      });
      updatedCount++;
    } else {
      await prisma.book.create({
        data: {
          title: book.title,
          author: book.author,
          publishedYear: book.publishedYear,
          genreId,
        },
      });
      createdCount++;
    }
  }

  console.log(`Genres available: ${genreRecords.length}`);
  console.log(`Books created: ${createdCount}`);
  console.log(`Existing books updated: ${updatedCount}`);
  console.log(`Total books in seed: ${books.length}`);
}

main()
  .catch((error: unknown) => {
    console.error('Seeding failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
