import { Controller, Patch, UseGuards, Request, UseInterceptors, UploadedFile, Body, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '@/auth/guards/local-auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Patch("edit-profile")
  @UseInterceptors(FileInterceptor('profilePhoto'))
  async updateUserProfile(@Request() req: any, @UploadedFile() file: Express.Multer.File) {
    return this.userService.updateProfilePhoto(req.user.id, file);
  }

  @UseGuards(JwtAuthGuard)
  @Delete("delete-photo")
  async deleteUserProfilePhoto(@Request() req: any) {
    return this.userService.deleteProfilePhoto(req.user.id);
  }

}
