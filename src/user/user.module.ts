import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from '@/lib/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { CloudinaryModule } from '@/lib/cloudinary/cloudinary.module';
import { CloudinaryService } from '@/lib/cloudinary/cloudinary.service';


@Module({
  imports: [CloudinaryModule ],
  controllers: [UserController],
  providers: [UserService, PrismaService, JwtService,CloudinaryService],
})
export class UserModule {}
