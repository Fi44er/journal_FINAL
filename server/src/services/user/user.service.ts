import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService) { }

    save(user: Partial<User>) {
        const hashPassword = this.hashPassword(user.password)
        return this.prismaService.user.create({
            data: {
                login: user.login,
                password: hashPassword
            }
        })
    }

    findOne(login: string) {
        return this.prismaService.user.findFirst({ where: { login } })
    }

    delete(id: number) {
        return this.prismaService.user.delete({ where: { id } })
    }

    private hashPassword(password: string) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
    }
}
