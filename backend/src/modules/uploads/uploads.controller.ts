import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { AuthGuard } from '@nestjs/passport';
import { IsString, IsNotEmpty } from 'class-validator';

class SignedUrlDto {
    @IsString()
    @IsNotEmpty()
    filename: string;

    @IsString()
    @IsNotEmpty()
    contentType: string;
}

@Controller('api/uploads')
@UseGuards(AuthGuard('jwt'))
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('signed-url')
  async getSignedUrl(@Body() signedUrlDto: SignedUrlDto) {
    const { filename, contentType } = signedUrlDto;
    const { uploadUrl, fileKey } = await this.uploadsService.getSignedUrl(filename, contentType);
    return { success: true, data: { uploadUrl, fileKey } };
  }
}
