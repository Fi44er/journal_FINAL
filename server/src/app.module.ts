import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './services/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './services/auth/auth.module';

@Module({
  imports: [PrismaModule, UserModule, AuthModule, ConfigModule.forRoot({ isGlobal: true })]
})
export class AppModule { }
