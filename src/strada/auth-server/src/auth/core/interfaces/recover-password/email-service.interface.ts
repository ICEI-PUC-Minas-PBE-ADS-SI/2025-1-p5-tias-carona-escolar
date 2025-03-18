export interface ImailData {
  to: string;
  subject: string;
  body: string;
}

export interface IEmailService {
  send(data: ImailData): Promise<void>;
}
