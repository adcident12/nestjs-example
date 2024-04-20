import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, Length } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";
import { CreateEventDto } from "./create-event.dto";

export class UpdateEventDto extends PartialType(CreateEventDto) { 
    id: number;

    @ApiProperty()
    @Length(5, 255)
    name?: string;

    @ApiProperty()
    @Length(5, 255)
    description?: string;

    @ApiProperty()
    @IsDateString()
    when?: string;

    @ApiProperty()
    @Length(5, 255)
    address?: string;
}