import { ForbiddenException, Injectable } from '@nestjs/common';
import { Role, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt'
import { jwtPayload } from '../auth/interfaces/jwt-payload.interface';

@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService) { }

    // Сохранение пользователя
    async save(user: Partial<User>) {
        const hashPassword = this.hashPassword(user.password)
        return await this.prismaService.user.create({
            data: {
                login: user.login,
                password: hashPassword
            }
        })
    }

    // Поиск пользователя по id или login
    async findOne(idOrLogin: string) {
        const pattern = /^[0-9]+$/;
        return await this.prismaService.user.findFirst({
            where: {
                OR: [{ login: String(idOrLogin) }, { id: pattern.test(idOrLogin) ? Number(idOrLogin) : 1 }],
            },
        })
    }

    // Удаление пользователя
    async delete(id: number, user: jwtPayload) {
        if (user.id !== id && !user.roles.includes(Role.ADMIN)) throw new ForbiddenException()
        return await this.prismaService.user.delete({ where: { id }, select: { id: true } })
    }

    // Удаление всех Refresh токенов
    removeAllRefresh() {
        return this.prismaService.token.deleteMany()
    }

    // Хэширование пароля
    private hashPassword(password: string) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
    }
}
