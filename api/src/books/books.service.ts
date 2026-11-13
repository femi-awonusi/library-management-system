
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateBookDto } from './dto/create-book.dto.js';
import { UpdateBookDto } from './dto/update-book.dto.js';

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateBookDto) {
    try {
      return await this.prisma.book.create({
        data: dto,
        include: { genre: true },
      });
    } catch (error) {
      const code = (error as { code?: string }).code;

      if (code === 'P2002') {
        throw new ConflictException('A book with this ISBN already exists');
      }

      if (code === 'P2003') {
        throw new NotFoundException('Genre not found');
      }

      throw error;
    }
  }

  async findAll(
    genreId?: number,
    search?: string,
    page = 1,
    limit = 10,
  ) {
    const where = {
      ...(genreId !== undefined && { genreId }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { author: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const skip = (page - 1) * limit;

    const [books, total] = await Promise.all([
  this.prisma.book.findMany({
    where,
    skip,
    take: limit,
    include: { genre: true },
    orderBy: { title: 'asc' },
  }),
  this.prisma.book.count({ where }),
]);

    return {
      data: books,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: { genre: true },
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    return book;
  }

  async update(id: number, dto: UpdateBookDto) {
    try {
      return await this.prisma.book.update({
        where: { id },
        data: dto,
        include: { genre: true },
      });
    } catch (error) {
      const code = (error as { code?: string }).code;

      if (code === 'P2025' || code === 'P2003') {
        throw new NotFoundException(
          code === 'P2025' ? 'Book not found' : 'Genre not found',
        );
      }

      if (code === 'P2002') {
        throw new ConflictException('A book with this ISBN already exists');
      }

      throw error;
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.book.delete({
        where: { id },
      });
    } catch (error) {
      if ((error as { code?: string }).code === 'P2025') {
        throw new NotFoundException(`Book with ID ${id} not found`);
      }

      throw error;
    }
  }
}
