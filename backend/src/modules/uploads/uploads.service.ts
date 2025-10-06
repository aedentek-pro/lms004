import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadsService {
  private storage: Storage;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    this.storage = new Storage({
      projectId: this.configService.get<string>('GCS_PROJECT_ID'),
      credentials: {
        client_email: this.configService.get<string>('GCS_CLIENT_EMAIL'),
        private_key: this.configService.get<string>('GCS_PRIVATE_KEY').replace(/\\n/g, '\n'),
      },
    });
    this.bucketName = this.configService.get<string>('GCS_BUCKET_NAME');
  }

  async getSignedUrl(filename: string, contentType: string) {
    const fileKey = `uploads/${uuidv4()}-${filename}`;

    const options = {
      version: 'v4' as const,
      action: 'write' as const,
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      contentType,
    };

    const [uploadUrl] = await this.storage
      .bucket(this.bucketName)
      .file(fileKey)
      .getSignedUrl(options);

    return { uploadUrl, fileKey };
  }
}
