import { Body, Controller, Post } from '@nestjs/common';
import { DevService } from './dev.service';
import { AddClassDto, AddStudentDto } from './dto/index.dto';
import { Public } from '@common/decorators/public.decorator';

@Public()
@Controller('dev')
export class DevController {
    constructor(private readonly devService: DevService) {}

    @Post('add-class')
    addClass(@Body() dto: AddClassDto) {
        return this.devService.addClass(dto)
    }

    @Post('add-student')
    addStudent(@Body() dto: AddStudentDto) {
        return this.devService.addStudent(dto)
    }
}
