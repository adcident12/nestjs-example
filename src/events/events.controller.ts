import { Body, Controller, Delete, Get, HttpCode, Logger, NotFoundException, Param, ParseIntPipe, Patch, Post, ValidationPipe } from "@nestjs/common";
import { CreateEventDto } from "./create-event.dto";
import { UpdateEventDto } from "./update-event.dto";
import { Event } from "./event.entity";
import { Like, MoreThan, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags('Events')
@Controller('/events')
export class EventsController {
    private readonly logger = new Logger(EventsController.name);

    constructor(
        @InjectRepository(Event)
        private readonly repository: Repository<Event>
    ) { }

    @Get()
    @ApiResponse({ status: 200, description: 'Ok' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 404, description: 'Events not found' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    async findAll() {
        this.logger.log(`Hit the findAll route`);
        const event = await this.repository.find();
        this.logger.debug(`Found ${event.length} events`);
        return event;
    }

    @Get('/practice')
    @ApiResponse({ status: 200, description: 'Ok' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 404, description: 'Events not found' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    async practice() {
        return await this.repository.find({
            select: ['id', 'when'],
            where: [{
                id: MoreThan(3),
                when: MoreThan(new Date('2021-02-12T14:00:00.000Z'))
            }, {
                description: Like('%meet%')
            }],
            take: 2,
            order: {
                id: 'DESC'
            }
        });
    }

    @Get(':id')
    @ApiResponse({ status: 200, description: 'Ok' })
    @ApiResponse({ status: 400, description: 'Invalid ID supplied.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 404, description: 'Events not found' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    async findOne(@Param('id', ParseIntPipe) id: number) {
        const event = await this.repository.findOne({ where: { id } });

        if (!event) {
            throw new NotFoundException();
        }

        return event;
    }

    @Post()
    @ApiResponse({ status: 201, description: 'The record has been successfully created.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    async create(@Body() input: CreateEventDto) {
        return await this.repository.save({
            ...input,
            when: new Date(input.when)
        });
    }

    @Patch(':id')
    @ApiResponse({ status: 201, description: 'The record has been successfully updated.' })
    @ApiResponse({ status: 400, description: 'Invalid ID supplied.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    async update(@Param('id', ParseIntPipe) id: number, @Body() input: UpdateEventDto) {

        const event = await this.repository.findOne({ where: { id } });

        if (!event) {
            throw new NotFoundException();
        }

        return await this.repository.save({
            ...event,
            ...input,
            when: input.when ? new Date(input.when) : event.when
        });
    }

    @Delete(':id')
    @ApiResponse({ status: 201, description: 'The record has been successfully deleted.' })
    @ApiResponse({ status: 400, description: 'Invalid ID supplied.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    async remove(@Param('id', ParseIntPipe) id: number) {
        const event = await this.repository.findOne({ where: { id } });

        if (!event) {
            throw new NotFoundException();
        }

        await this.repository.remove(event);
    }
}