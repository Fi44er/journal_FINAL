import { IsNumber, IsString } from "class-validator"

export class AddStudentDto {
    @IsString()
    fio: string
    
    @IsNumber()
    classId: number
}

export class AddClass {
    
}