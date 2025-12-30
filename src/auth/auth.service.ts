import { CreateUserDto } from '@/user/dto/create-user.dto';
import { UserService } from '@/user/user.service';
import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2'
import { AuthJwtPayload } from './types/auth-jwtPayload';
import { UserLoginDto } from './dto/user-login.dto';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}
    
    async userRegistration(createUserDto: CreateUserDto) {
        try {
            const user = await this.userService.findUserByEmail(createUserDto.email)

            if(user) {
                throw new ConflictException(`${createUserDto.email} already usered to create accound`)
            }
            return this.userService.createUser(createUserDto)
        } catch (err){
            if (err instanceof NotFoundException) {
                throw err;
            }
            throw new InternalServerErrorException("Failed to create Account")
        }

    }


    async validateUser(loginDto: UserLoginDto) {
        const user = await this.userService.findUserByEmail(loginDto.email);
        
        if (!user) {
            throw new UnauthorizedException('Invalid phone number or password');
        }
        
        const isMatch = await argon2.verify(user.password, loginDto.password);

        if (!isMatch || user.email !== loginDto.email) {
            throw new UnauthorizedException('Invalid phone number or password');
        }
        return this.userService.login(user);
    }

    async getUserInfo(phone: string) {
        return this.userService.findbyPhone(phone)
    }

}
