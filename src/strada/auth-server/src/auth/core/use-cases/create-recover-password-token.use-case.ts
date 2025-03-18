import { randomBytes } from 'crypto';
import { IRecoveryPasswordRepository } from '../interfaces/repositories/recovery-password.repository';
import { FindUserByEmailUseCase } from '@/src/user/core/use-cases/find-user-by-email.use-case';
import { IEmailService } from '../interfaces/recover-password/email-service.interface';
import { RecoverPasswordMapper } from '../mappers/recover-password.mapper';

export class CreateRecoverPasswordTokenUseCase {
  constructor(
    private readonly recoveryPasswordRepository: IRecoveryPasswordRepository,
    private readonly findByEmailUseCase: FindUserByEmailUseCase,
    private readonly emailService: IEmailService,
  ) {}

  async execute({ email }): Promise<void> {
    const user = await this.findByEmailUseCase.execute(email.email);

    const token = this.generateToken();
    const recoveryToken = RecoverPasswordMapper.toEntity({
      userId: user.id,
      email: user.email,
      token,
    });
    await this.recoveryPasswordRepository.create(recoveryToken);

    await this.sendEmail(user.email, token);
  }

  private generateToken(): string {
    return randomBytes(32).toString('hex');
  }

  private async sendEmail(email: string, token: string): Promise<void> {
    const url = process.env.FRONTEND_URL;
    const resetUrl = `${url}/reset-password?token=${token}&email=${email}`;
    const emailBody = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #4A90E2;">Recuperação de Senha</h2>
        <p>Olá,</p>
        <p>Recebemos uma solicitação para redefinir sua senha. Clique no link abaixo para definir uma nova senha:</p>
        <p>
          <a href="${resetUrl}" style="color: #ffffff; background-color: #4A90E2; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Redefinir Senha</a>
        </p>
        <p>Ou copie e cole o link abaixo no seu navegador:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>Se você não solicitou a alteração de senha, por favor ignore este email. Sua senha permanecerá inalterada.</p>
        <p>Atenciosamente,</p>
        <p><strong>Sua equipe de suporte</strong></p>
      </div>
    `;

    await this.emailService.send({
      to: email,
      subject: 'Instruções para redefinição de senha',
      body: emailBody,
    });
  }
}
