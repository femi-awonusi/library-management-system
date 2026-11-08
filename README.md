# Library Management System

A backend application for managing library users, books, and genres, built with NestJS, Prisma ORM, and PostgreSQL.

## Technologies

- Node.js
- TypeScript
- NestJS
- Prisma ORM
- PostgreSQL
- Neon (hosted PostgreSQL)
- Git and GitHub

## Project Structure

```text
library-management-system/
├── api/
│   ├── prisma/
│   │   ├── migrations/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/
│   ├── .env.example
│   ├── package.json
│   └── prisma7.config.ts
├── .gitignore
└── README.md
```

## Database Schema

The database includes three core models:

- **User:** Stores user information and assigns each user a role.
- **Genre:** Stores unique book genre categories.
- **Book:** Stores book information and references its genre.

The `Role` enum defines two permitted user roles:

- `PATRON`
- `LIBRARIAN`

New users default to the `PATRON` role.

## Schema Decisions

### Why Book references Genre

The `Book` model references the `Genre` model through a `genreId` foreign key instead of embedding genre information directly in every book record.

This relational design was selected for the following reasons:

1. **Data consistency:** A genre is stored once and referenced by multiple books.
2. **Reduced duplication:** Genre names do not need to be repeated in every book record.
3. **Referential integrity:** The foreign key relationship ensures that a book references an existing genre.
4. **Maintainability:** Updating a genre name does not require updating every associated book.
5. **Query efficiency:** Prisma relations make it straightforward to retrieve books together with their associated genres.

The relationship is one-to-many: one genre can have multiple books, while each book belongs to one genre.

### Prisma versus a Document Database

Prisma models relational data using structured models, fields, and explicit relationships. A document database, such as MongoDB, can store related information as embedded documents or references within flexible JSON-like documents.

For this application, PostgreSQL with Prisma was selected because the library data has clear relationships and benefits from relational constraints and structured queries.

## Database Seeding

The seed script is located at `api/prisma/seed.ts`.

It creates:

- 4 genres: Fantasy, Science Fiction, Mystery, and Non-fiction.
- 20 books distributed across the four genres.

The seed script uses existing-record checks and upsert operations to reduce duplicate records when it is run repeatedly.

Run the seed script from the `api` directory:

```powershell
npm run db:seed
```

## Setup Instructions

### 1. Clone the repository

```powershell
git clone https://github.com/femi-awonusi/library-management-system.git
cd library-management-system
```

### 2. Install dependencies

```powershell
cd api
npm ci
```

### 3. Configure environment variables

Create a local `.env` file using `.env.example` as a template.

Configure:

- `DATABASE_URL`: Neon pooled PostgreSQL connection string.
- `DIRECT_URL`: Neon direct PostgreSQL connection string.

Keep your actual credentials private. Never commit `.env` to GitHub.

### 4. Generate Prisma Client

```powershell
npx prisma generate
```

### 5. Apply database migrations

```powershell
npx prisma migrate deploy
```

### 6. Seed the database

```powershell
npm run db:seed
```

### 7. Build the application

```powershell
npm run build
```

## Verification

Validate the Prisma schema:

```powershell
npx prisma validate
```

Check migration status:

```powershell
npx prisma migrate status
```

Build the NestJS application:

```powershell
npm run build
```

## Project Status

The core database modelling, migrations, and seed data have been implemented. The project uses a hosted Neon PostgreSQL database for persistence.

Clinical or other external validation is not applicable to this library management assignment.# library-management-system
