import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService) { }

    async save(user: Partial<User>) {
        const hashPassword = this.hashPassword(user.password)
        return await this.prismaService.user.create({
            data: {
                login: user.login,
                password: hashPassword
            }
        })
    }

    async findOne(idOrLogin: string) {
        const pattern = /^[0-9]+$/;
        return await this.prismaService.user.findFirst({
            where: {
                OR: [{ login: idOrLogin }, { id: pattern.test(idOrLogin)? Number(idOrLogin) : 1 }],
            },
        })
        
    }

    async delete(id: number) {
        return await this.prismaService.user.delete({ where: { id } })
    }

    removeAllRefresh() {
        // const deleteRefresh = this.prismaService.token.deleteMany()
        // await this.prismaService.$transaction([deleteRefresh])
        return this.prismaService.token.deleteMany()
    }

    private hashPassword(password: string) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
    }
}
