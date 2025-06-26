import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RatingService } from '../services/rating.service';
import { CreateRatingDto, UpdateRatingDto } from '../dtos';
import { RatingType } from '@prisma/client';
import { RatingFilters } from '../repositories/rating.repository';

@ApiTags('ratings')
@Controller('ratings')
@ApiBearerAuth()
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova avaliação' })
  @ApiResponse({ status: 201, description: 'Avaliação criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'Avaliação já existe para esta combinação' })
  @ApiBody({ type: CreateRatingDto })
  async createRating(
    @Body() createRatingDto: CreateRatingDto,
    @Request() req: any,
  ) {
    // Em um ambiente real, você obteria o userId do token JWT
    const raterId = req.user?.id || 'temp-user-id';
    return await this.ratingService.createRating(createRatingDto, raterId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter avaliação por ID' })
  @ApiResponse({ status: 200, description: 'Avaliação encontrada' })
  @ApiResponse({ status: 404, description: 'Avaliação não encontrada' })
  @ApiParam({ name: 'id', description: 'ID da avaliação' })
  async getRatingById(@Param('id') id: string) {
    return await this.ratingService.getRatingById(id);
  }

  @Get('ride/:rideId')
  @ApiOperation({ summary: 'Obter todas as avaliações de uma corrida' })
  @ApiResponse({ status: 200, description: 'Lista de avaliações da corrida' })
  @ApiParam({ name: 'rideId', description: 'ID da corrida' })
  async getRatingsByRideId(@Param('rideId') rideId: string) {
    return await this.ratingService.getRatingsByRideId(rideId);
  }

  @Get('user/:ratedId')
  @ApiOperation({ summary: 'Obter avaliações de um usuário' })
  @ApiResponse({ status: 200, description: 'Lista de avaliações do usuário' })
  @ApiParam({ name: 'ratedId', description: 'ID do usuário avaliado' })
  @ApiQuery({
    name: 'type',
    enum: RatingType,
    required: false,
    description: 'Tipo de avaliação (DRIVER_TO_PASSENGER ou PASSENGER_TO_DRIVER)',
  })
  async getRatingsByRatedId(
    @Param('ratedId') ratedId: string,
    @Query('type') type?: RatingType,
  ) {
    return await this.ratingService.getRatingsByRatedId(ratedId, type);
  }

  @Get('my-ratings')
  @ApiOperation({ summary: 'Obter avaliações feitas pelo usuário logado' })
  @ApiResponse({ status: 200, description: 'Lista de avaliações do usuário' })
  async getMyRatings(@Request() req: any) {
    const raterId = req.user?.id || 'temp-user-id';
    return await this.ratingService.getRatingsByRaterId(raterId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar uma avaliação' })
  @ApiResponse({ status: 200, description: 'Avaliação atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Avaliação não encontrada' })
  @ApiResponse({ status: 400, description: 'Não autorizado para editar esta avaliação' })
  @ApiParam({ name: 'id', description: 'ID da avaliação' })
  @ApiBody({ type: UpdateRatingDto })
  async updateRating(
    @Param('id') id: string,
    @Body() updateRatingDto: UpdateRatingDto,
    @Request() req: any,
  ) {
    const userId = req.user?.id || 'temp-user-id';
    return await this.ratingService.updateRating(id, updateRatingDto, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir uma avaliação' })
  @ApiResponse({ status: 200, description: 'Avaliação excluída com sucesso' })
  @ApiResponse({ status: 404, description: 'Avaliação não encontrada' })
  @ApiResponse({ status: 400, description: 'Não autorizado para excluir esta avaliação' })
  @ApiParam({ name: 'id', description: 'ID da avaliação' })
  async deleteRating(@Param('id') id: string, @Request() req: any) {
    const userId = req.user?.id || 'temp-user-id';
    return await this.ratingService.deleteRating(id, userId);
  }

  @Get('search/filters')
  @ApiOperation({ summary: 'Buscar avaliações com filtros' })
  @ApiResponse({ status: 200, description: 'Lista de avaliações filtradas' })
  @ApiQuery({ name: 'rideId', required: false, description: 'ID da corrida' })
  @ApiQuery({ name: 'raterId', required: false, description: 'ID de quem avaliou' })
  @ApiQuery({ name: 'ratedId', required: false, description: 'ID de quem foi avaliado' })
  @ApiQuery({
    name: 'type',
    enum: RatingType,
    required: false,
    description: 'Tipo de avaliação',
  })
  @ApiQuery({ name: 'minRating', type: Number, required: false, description: 'Nota mínima' })
  @ApiQuery({ name: 'maxRating', type: Number, required: false, description: 'Nota máxima' })
  @ApiQuery({ name: 'page', type: Number, required: false, description: 'Página' })
  @ApiQuery({ name: 'limit', type: Number, required: false, description: 'Limite por página' })
  async getRatingsWithFilters(@Query() filters: RatingFilters) {
    return await this.ratingService.getRatingsWithFilters(filters);
  }

  @Get('user/:ratedId/statistics')
  @ApiOperation({ summary: 'Obter estatísticas de avaliação de um usuário' })
  @ApiResponse({ status: 200, description: 'Estatísticas de avaliação' })
  @ApiParam({ name: 'ratedId', description: 'ID do usuário' })
  @ApiQuery({
    name: 'type',
    enum: RatingType,
    required: false,
    description: 'Tipo de avaliação',
  })
  async getRatingStatistics(
    @Param('ratedId') ratedId: string,
    @Query('type') type?: RatingType,
  ) {
    const statistics = await this.ratingService.getRatingStatistics(ratedId, type);
    return {
      success: true,
      data: statistics,
    };
  }

  @Get('user/:ratedId/average')
  @ApiOperation({ summary: 'Obter nota média de um usuário' })
  @ApiResponse({ status: 200, description: 'Nota média do usuário' })
  @ApiParam({ name: 'ratedId', description: 'ID do usuário' })
  @ApiQuery({
    name: 'type',
    enum: RatingType,
    required: false,
    description: 'Tipo de avaliação',
  })
  async getAverageRating(
    @Param('ratedId') ratedId: string,
    @Query('type') type?: RatingType,
  ) {
    const averageRating = await this.ratingService.getAverageRating(ratedId, type);
    return {
      success: true,
      data: { averageRating },
    };
  }

  @Get('user/:ratedId/summary')
  @ApiOperation({ summary: 'Obter resumo completo de avaliações de um usuário' })
  @ApiResponse({ status: 200, description: 'Resumo de avaliações' })
  @ApiParam({ name: 'ratedId', description: 'ID do usuário' })
  async getRatingSummary(@Param('ratedId') ratedId: string) {
    return await this.ratingService.getRatingSummary(ratedId);
  }
}