import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {
  GuardianService,
  IGuardianRelationDto,
} from '../../core/use-cases/guardians.service';

@Controller('guardians')
export class GuardianController {
  constructor(private readonly guardianService: GuardianService) {}

  @Post('relations')
  @HttpCode(HttpStatus.CREATED)
  async addGuardianRelation(
    @Body() relationDto: IGuardianRelationDto,
  ): Promise<{ message: string }> {
    await this.guardianService.addGuardianRelation(relationDto);
    return { message: 'Guardian relation added successfully' };
  }

  @Delete('relations/:guardianId/:minorId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeGuardianRelation(
    @Param('guardianId') guardianId: string,
    @Param('minorId') minorId: string,
  ): Promise<void> {
    await this.guardianService.removeGuardianRelation(guardianId, minorId);
  }

  @Get('minors/:minorId/guardians')
  async findGuardiansByMinor(
    @Param('minorId') minorId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return await this.guardianService.findGuardiansByMinor(minorId, {
      page: Number(page),
      limit: Number(limit),
    });
  }

  @Get(':guardianId/minors')
  async findMinorsByGuardian(
    @Param('guardianId') guardianId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return await this.guardianService.findMinorsByGuardian(guardianId, {
      page: Number(page),
      limit: Number(limit),
    });
  }
}
