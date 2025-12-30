import { PrismaService } from '@/lib/prisma/prisma.service';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as argon2 from 'argon2'
import { JwtService } from '@nestjs/jwt';
import { CloudinaryService } from '@/lib/cloudinary/cloudinary.service';


@Injectable()
export class UserService {
    
    constructor(private readonly prisma: PrismaService, private readonly jwtService: JwtService, private readonly cloudinary: CloudinaryService) {}

    async createUser(createUserDto: CreateUserDto) {
        const hashpassword = await argon2.hash(createUserDto.password)
        try {
            const user = await this.prisma.client.user.create({
                data: {...createUserDto, password: hashpassword}
            })
            return {id: user.id, name: user.name, email: user.email, phone: user.phone, createAt: user.createdAt}
        } catch(err){
            if(err instanceof NotFoundException){
                throw err
            }
            throw new InternalServerErrorException("Failed to add info in database !!")
        }
    }

    async findUser(id: string) {
        try {
            const user = await this.prisma.client.user.findUnique({
                where: {id}
            })

            return user
        } catch (err) {
            if(err instanceof NotFoundException) {
                throw err;
            }
            throw new InternalServerErrorException(`Failed to fetch user`)
        }
    }

    async findUserByEmail(email: string) {
        try {
            const user = await this.prisma.client.user.findUnique({
                where: {email}
            })

            return user
        } catch (err) {
            if(err instanceof NotFoundException) {
                throw err;
            }
            throw new InternalServerErrorException(`Failed to fetch user`)
        }
    }

    async findbyPhone(phone: string) {
        try {
            const user = await this.prisma.client.user.findUnique({
                where: { phone},
                select: {
                    id: true, 
                    name: true,
                    email: true,
                    phone: true,
                    role: true,
                    profilePictureId: true,
                    createdAt: true,
                    isVerified: true,
                    lastActiveAt: true,
                    lastLoginAt: true,
                }
            })
            return user
        } catch (err) {
            if(err instanceof NotFoundException) {
                throw err;
            }
            throw new InternalServerErrorException(`Failed to fetch user`)
        }
    }



    async login(user: any) {
        const { id, name, phone, role, profilePictureId } = user;
        const payload = { id, name, phone, role, profilePictureId }

        const access_token = this.jwtService.sign(payload, {
            algorithm: 'HS256',
            expiresIn: '72h',
            secret: process.env.JWT_SECRET
        });
        return access_token
    }

async updateProfilePhoto(userId: string, file: Express.Multer.File) {
    try {
      // Upload to Cloudinary
      const uploadResult: any = await this.cloudinary.uploadFile(
        file.buffer,
        `user-${userId}-${Date.now()}`
      );
      console.log(uploadResult);

      // Create FileInstance record
      const fileInstance = await this.prisma.client.fileInstance.create({
        data: {
          filename: uploadResult.public_id,
          originalFilename: file.originalname,
          url: uploadResult.secure_url,
          mimeType: file.mimetype,
          size: file.size,
          fileType: 'image',
        },
      });
      console.log(fileInstance);

      // Update user with FileInstance reference
      const updatedUser = await this.prisma.client.user.update({
        where: { id: userId },
        data: {
          profilePictureId: fileInstance.id,
        },
      });

      return { 
        id: updatedUser.id, 
        profilePictureUrl: fileInstance.url 
      };
    } catch (err) {
      throw new InternalServerErrorException('Failed to upload profile photo');
    }
  }

  async deleteProfilePhoto(userId: string) {
    try {
    const ppID = await this.prisma.client.user.findUnique({
        where: { id: userId },
        select: { profilePictureId: true },
    })

    if (!ppID || !ppID.profilePictureId) {
        throw new NotFoundException('User or profile picture not found');
    }

    const public_id = await this.prisma.client.fileInstance.findUnique({
        where: { id: ppID.profilePictureId },
        select: { filename: true },
    })

    // Delete from Cloudinary
    if (public_id && public_id.filename) {
      await this.cloudinary.deleteFile(public_id.filename);
    }

    // Remove profilePictureId from user
    await this.prisma.client.user.update({
        where: { id: userId },
        data: {
          profilePictureId: null,
        },
      });
    } catch(err) {
      throw new InternalServerErrorException('Failed to delete profile photo');
    }
  }


}

