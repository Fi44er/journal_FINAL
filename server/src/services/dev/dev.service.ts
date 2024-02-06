import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddStudentDto } from './dto/index.dto';

@Injectable()
export class DevService {
    constructor(private readonly prismaService: PrismaService) {}

    addClass() {

    }

    addStudent(dto: AddStudentDto) {
        return this.prismaService.student.create({
            data: {
                fio: dto.fio,
                classId: dto.classId
            }
        })
    }
}
