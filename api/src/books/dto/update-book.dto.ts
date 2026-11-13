
import {
  IsString,
  IsInt,
  IsOptional,
  IsPositive,
  Min,
  MaxLength,
} from 'class-validator';

export class UpdateBookDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  author?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  isbn?: string | null;

  @IsOptional()
  @IsInt()
  @Min(0)
  totalCopies?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  genreId?: number;
}
