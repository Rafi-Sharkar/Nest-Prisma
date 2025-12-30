import { Module } from '@nestjs/common';

import { PrismaModule } from './lib/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
    }),
    PrismaModule,
    UserModule,
    AuthModule,
    JwtModule.register({
      secret: "",
      signOptions: {
        expiresIn: '1d'
      }
    })
  ]
})
export class AppModule {}
