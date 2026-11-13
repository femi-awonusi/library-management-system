
import {
  IsString,
  IsInt,
  IsOptional,
  IsPositive,
  Min,
  MaxLength,
} from 'class-validator';

export class CreateBookDto {
  @IsString()
  @MaxLength(255)
  title!: string;

  @IsString()
  @MaxLength(255)
  author!: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  isbn?: string;

  @IsInt()
  @Min(0)
  totalCopies!: number;

  @IsInt()
  @IsPositive()
  genreId!: number;
}
