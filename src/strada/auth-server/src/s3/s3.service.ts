import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly bucketRegion: string;

  constructor(private readonly configService: ConfigService) {
    this.bucketRegion = this.configService.get<string>('AWS_REGION');
    this.s3Client = new S3Client({
      region: this.configService.get<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
        ),
      },
    });

    this.bucketName = this.configService.get<string>('AWS_S3_BUCKET');
    if (!this.bucketName) {
      throw new Error('AWS_S3_BUCKET não está configurado.');
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const ext = getExtension(file.originalname);
    const fileKey = `${new Date().getTime().toString()}${ext}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    try {
      await this.s3Client.send(command);
      return `https://${this.bucketName}.s3.${this.bucketRegion}.amazonaws.com/${fileKey}`;
    } catch (error) {
      console.error('Erro ao fazer upload para o S3:', error);
      throw new Error('Falha no upload do arquivo.');
    }

    function getExtension(filename) {
      const ext = filename.split('.').pop();
      return ext ? `.${ext}` : '';
    }
  }
}
