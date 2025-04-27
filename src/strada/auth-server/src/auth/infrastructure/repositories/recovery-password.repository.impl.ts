import { Injectable } from '@nestjs/common';
import { RecoverPassword } from '@/src/auth/core/entities/recover-password.entity';
import { IRecoveryPasswordRepository } from '@/src/auth/core/interfaces/repositories/recovery-password.repository';
import { PrismaService } from '@/src/utils/prisma.service';

@Injectable()
export class RecoveryPasswordRepository implements IRecoveryPasswordRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async create(recoveryPassword: RecoverPassword): Promise<RecoverPassword> {
    return await this.prismaService.passwordRecovery.create({
      data: recoveryPassword,
    });
  }
  async revoke(id: string): Promise<RecoverPassword> {
    return await this.prismaService.passwordRecovery.update({
      where: { id },
      data: { revoked: true },
    });
  }
  async findOne(token: string, email: string): Promise<RecoverPassword> {
    return await this.prismaService.passwordRecovery.findFirst({
      where: {
        AND: [{ token: token }, { email: email }],
      },
    });
  }
}
