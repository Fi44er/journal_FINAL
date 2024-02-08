import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddClassDto, AddStudentDto } from './dto/index.dto';

@Injectable()
export class DevService {
    constructor(private readonly prismaService: PrismaService) {}

    // -------------------------------- Добавление класса -------------------------------- //
    addClass(dto: AddClassDto) {
        return this.prismaService.class.create({
            data: {
                letterClass: dto.letterClass,
                numberClass: dto.numberClass
            }
        })
    }

    // -------------------------------- Добавление студента -------------------------------- //
    addStudent(dto: AddStudentDto) {
        return this.prismaService.student.create({
            data: {
                fio: dto.fio,
                classId: dto.classId
            }
        })
    }
}
