import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [CacheModule.register()], // добавление chach module
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule { }
