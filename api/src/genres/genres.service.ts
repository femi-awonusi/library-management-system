
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateGenreDto } from './dto/create-genre.dto.js';
import { UpdateGenreDto } from './dto/update-genre.dto.js';

@Injectable()
export class GenresService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateGenreDto) {
    try {
      return await this.prisma.genre.create({
        data: { name: dto.name },
      });
    } catch (error) {
      if ((error as { code?: string }).code === 'P2002') {
        throw new ConflictException('Genre already exists');
      }
      throw error;
    }
  }

  async findAll() {
    return this.prisma.genre.findMany({
      include: { _count: { select: { books: true } } },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: number) {
    const genre = await this.prisma.genre.findUnique({
      where: { id },
      include: { books: true },
    });

    if (!genre) {
      throw new NotFoundException(`Genre with ID ${id} not found`);
    }

    return genre;
  }

  async update(id: number, dto: UpdateGenreDto) {
    try {
      return await this.prisma.genre.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      const code = (error as { code?: string }).code;

      if (code === 'P2025') {
        throw new NotFoundException(`Genre with ID ${id} not found`);
      }

      if (code === 'P2002') {
        throw new ConflictException('Genre already exists');
      }

      throw error;
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.genre.delete({
        where: { id },
      });
    } catch (error) {
      const code = (error as { code?: string }).code;

      if (code === 'P2025') {
        throw new NotFoundException(`Genre with ID ${id} not found`);
      }

      if (code === 'P2003') {
        throw new ConflictException(
          'Cannot delete a genre that has associated books',
        );
      }

      throw error;
    }
  }
}
