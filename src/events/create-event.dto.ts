import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, Length } from "class-validator";

export class CreateEventDto {
    id: number;

    @ApiProperty()
    @Length(5, 255)
    name: string;

    @ApiProperty()
    @Length(5, 255)
    description: string;

    @ApiProperty()
    @IsDateString()
    when: string;

    @ApiProperty()
    @Length(5, 255)
    address: string;
}