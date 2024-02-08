import { IsNumber, IsString } from "class-validator"

export class AddStudentDto {
    @IsString()
    fio: string
    
    @IsNumber()
    classId: number
}

export class AddClassDto {
    @IsNumber()
    numberClass: number

    @IsString()
    letterClass: string
}