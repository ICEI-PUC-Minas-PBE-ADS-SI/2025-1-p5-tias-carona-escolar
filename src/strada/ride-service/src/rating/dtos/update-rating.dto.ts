import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, Min, Max } from 'class-validator';

export class UpdateRatingDto {
  @ApiProperty({
    description: 'Nova nota da avaliação (1-5)',
    example: 4,
    minimum: 1,
    maximum: 5,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  @ApiProperty({
    description: 'Novo comentário da avaliação',
    example: 'Experiência melhorada, muito obrigado!',
    required: false,
  })
  @IsOptional()
  comment?: string;
}