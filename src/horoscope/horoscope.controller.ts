import {
  Controller,
  Get,
  Logger,
  NotFoundException,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'; // Import AuthGuard
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { HoroscopeService } from './horoscope.service';
import { HoroscopeResponseDto } from './models/horoscope.dto';
import { ZodiacSign } from '../users/entities/zodiac-sign.enum'; // Import shared enum
import { User } from '../users/entities/user.entity'; // Import User entity
import { Request } from 'express';

// Extended express Request interface to include user property
interface RequestWithUser extends Request {
  user: User;
}

@ApiTags('Horoscope')
@ApiBearerAuth('JWT-auth') // Indicate JWT auth is needed in Swagger
@Controller('horoscope')
export class HoroscopeController {
  private readonly logger = new Logger(HoroscopeController.name);

  constructor(private readonly horoscopeService: HoroscopeService) {}

  /**
   * Retrieves the daily horoscope for the authenticated user.
   */
  @Get('me') // Changed route to /me
  @UseGuards(AuthGuard('jwt')) // Protect route
  @ApiOperation({ summary: "Get the authenticated user's daily horoscope" })
  @ApiOkResponse({
    description: "Successfully retrieved the user's horoscope data.",
    type: HoroscopeResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. User is not authenticated or token is invalid.',
  })
  async getMyHoroscope(
    @Req() req: RequestWithUser,
  ): Promise<HoroscopeResponseDto> {
    // Now req.user is the full User entity with zodiacSign property
    const { user } = req;
    this.logger.log(`User ${user.id} requested their daily horoscope`);

    if (!user.zodiacSign || user.zodiacSign === ZodiacSign.UNKNOWN) {
      this.logger.warn(
        `User ${user.id} has no zodiac sign or unknown sign set in their profile`,
      );
      throw new NotFoundException(
        'Zodiac sign not found or is unknown for the user. Please update your profile.',
      );
    }

    this.logger.debug(
      `Retrieving horoscope for user ${user.id} with sign ${user.zodiacSign}`,
    );

    try {
      const horoscope = await this.horoscopeService.getHoroscope(user);
      this.logger.log(
        `Successfully retrieved horoscope for user ${user.id} (sign: ${user.zodiacSign})`,
      );
      return horoscope;
    } catch (error) {
      this.logger.error(
        `Failed to retrieve horoscope for user ${user.id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
