import {
  Controller,
  Get,
  Logger,
  Req,
  UseGuards,
  Param,
  Post,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'; // Import AuthGuard
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { HoroscopeService } from './horoscope.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

// import { HoroscopeResponseDto } from './models/horoscope.dto';
import { User } from '../users/entities/user.entity';
import { Request } from 'express';
import { HoroscopeHistory } from './models/horoscope-history.entity';
import { GenerateHoroscopeDto } from './models/generate-horoscope.dto';

// Extended express Request interface to include user property
interface RequestWithUser extends Request {
  user: User;
}

@ApiTags('Horoscope')
@ApiBearerAuth('JWT-auth') // Indicate JWT auth is needed in Swagger
@Controller('horoscope')
@UseGuards(JwtAuthGuard)
export class HoroscopeController {
  private readonly logger = new Logger(HoroscopeController.name);

  constructor(private readonly horoscopeService: HoroscopeService) {}

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: 'Get horoscope for user with default birth date',
    description:
      'Retrieves the horoscope for the authenticated user using their default birth date',
  })
  @ApiOkResponse({
    description:
      'Successfully retrieved horoscope for user with default birth date',
    type: HoroscopeHistory,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  async getMyHoroscope(@Req() req: RequestWithUser): Promise<HoroscopeHistory> {
    return this.horoscopeService.getHoroscope(req.user);
  }

  /**
   * Generate and save horoscope (isSave=false) for a selected birth date
   */
  @Post('generate')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: 'Generate and save horoscope',
    description: 'Generates and saves a horoscope for a selected birth date',
  })
  @ApiBody({
    type: GenerateHoroscopeDto,
    description: 'Birth date for horoscope generation',
  })
  @ApiOkResponse({
    description: 'Successfully generated and saved horoscope',
    type: HoroscopeHistory,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  async generateHoroscope(
    @Req() req: RequestWithUser,
    @Body() generateHoroscopeDto: GenerateHoroscopeDto,
  ): Promise<HoroscopeHistory> {
    return this.horoscopeService.getHoroscopeWithOtherBirthDate(
      req.user,
      generateHoroscopeDto,
    );
  }

  @Post('save/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: 'Mark horoscope as saved',
    description: 'Marks a specific horoscope history entry as saved',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the horoscope history to save',
    type: String,
  })
  @ApiOkResponse({
    description: 'Successfully marked horoscope as saved',
    type: HoroscopeHistory,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  async saveHistory(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
  ): Promise<HoroscopeHistory> {
    return this.horoscopeService.updateIsSave(req.user.id, id);
  }

  @Get('history')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: 'Get saved horoscope history',
    description:
      'Retrieves all saved horoscope history entries for the authenticated user',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved horoscope history',
    type: [HoroscopeHistory],
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  async getMyHoroscopeHistory(
    @Req() req: RequestWithUser,
  ): Promise<HoroscopeHistory[]> {
    return this.horoscopeService.getSavedHoroscopeHistory(req.user.id);
  }

  @Get('history/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: 'Get specific horoscope by ID',
    description: "Retrieves a specific horoscope from user's history by ID",
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the horoscope to retrieve',
    type: String,
    example: '57361bae-17d2-4010-9ee7-f46b7a827f61',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved specific horoscope',
    type: HoroscopeHistory,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  async getHoroscopeById(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
  ): Promise<HoroscopeHistory> {
    return this.horoscopeService.getHoroscopeById(req.user.id, id);
  }
}
