import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { LocationService } from './location.service';
import {
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AddressSuggestionResponseDto } from './dto/location.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Location')
@ApiBearerAuth('JWT-auth')
@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get('suggestions')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get location suggestions based on search query' })
  @ApiQuery({
    name: 'query',
    description: 'Text to search for location suggestions',
    type: String,
    required: true,
    example: 'Nguyen Hue Street',
  })
  @ApiResponse({
    status: 200,
    description: 'Location suggestions with detailed information',
    type: AddressSuggestionResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. User is not authenticated or token is invalid.',
  })
  async getSuggestions(
    @Query('query') query: string,
  ): Promise<AddressSuggestionResponseDto> {
    return this.locationService.getSuggestions(query);
  }
}
