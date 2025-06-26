import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, IsEnum, Min, Max } from 'class-validator';
import { RatingType } from '@prisma/client';

export class CreateRatingDto {
  @ApiProperty({
    description: 'ID da corrida',
    example: 'clx1234567890abcdef',
  })
  @IsString()
  rideId: string;

  @ApiProperty({
    description: 'ID de quem está sendo avaliado',
    example: 'clx1234567890abcdef',
  })
  @IsString()
  ratedId: string;

  @ApiProperty({
    description: 'Nota da avaliação (1-5)',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({
    description: 'Comentário da avaliação (opcional)',
    example: 'Ótima experiência, motorista muito pontual!',
    required: false,
  })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiProperty({
    description: 'Tipo da avaliação',
    enum: RatingType,
    example: RatingType.PASSENGER_TO_DRIVER,
  })
  @IsEnum(RatingType)
  type: RatingType;
} 