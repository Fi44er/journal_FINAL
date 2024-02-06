import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './services/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './services/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './services/auth/guards/jwt-auth.guard';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { DevModule } from './services/dev/dev.module';

@Module({
  imports: [PrismaModule, UserModule, AuthModule, DevModule , ConfigModule.forRoot({ isGlobal: true })],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    }, AppService
  ],
  controllers: [AppController],
})
export class AppModule { }
