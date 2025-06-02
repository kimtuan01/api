import {
  Controller,
  Patch,
  Body,
  Req,
  UseGuards,
  Get,
  Post,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { UpdateNameDto } from './dto/update-name.dto';
import { UpdateGenderDto } from './dto/update-gender.dto';
import { UpdateBirthdateDto } from './dto/update-birthdate.dto';
import { UpdateBirthtimeDto } from './dto/update-birthtime.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { UpdateTimezoneDto } from './dto/update-timezone.dto';

@ApiTags('Users')
@Controller({
  version: '1',
  path: 'users/onboarding',
})
export class OnboardingController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Update user name' })
  @ApiResponse({ status: 200, description: 'Name updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Patch('name')
  async updateName(@Body() updateNameDto: UpdateNameDto, @Req() req) {
    const userId = req.user.id;
    return this.usersService.updateName(userId, updateNameDto);
  }

  @ApiOperation({ summary: 'Update user gender' })
  @ApiResponse({ status: 200, description: 'Gender updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Patch('gender')
  async updateGender(@Body() updateGenderDto: UpdateGenderDto, @Req() req) {
    const userId = req.user.id;
    return this.usersService.updateGender(userId, updateGenderDto);
  }

  @ApiOperation({ summary: 'Update user birthdate' })
  @ApiResponse({ status: 200, description: 'Birthdate updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Patch('birthdate')
  async updateBirthdate(
    @Body() updateBirthdateDto: UpdateBirthdateDto,
    @Req() req,
  ) {
    const userId = req.user.id;
    return this.usersService.updateBirthdate(userId, updateBirthdateDto);
  }

  @ApiOperation({ summary: 'Update user birth time' })
  @ApiResponse({ status: 200, description: 'Birth time updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Patch('birthtime')
  async updateBirthtime(
    @Body() updateBirthtimeDto: UpdateBirthtimeDto,
    @Req() req,
  ) {
    const userId = req.user.id;
    return this.usersService.updateBirthtime(userId, updateBirthtimeDto);
  }

  @ApiOperation({
    summary: 'Update user location (latitude, longitude) and address',
  })
  @ApiResponse({
    status: 200,
    description: 'Location and address updated successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Patch('location')
  async updateLocation(
    @Body() updateLocationDto: UpdateLocationDto,
    @Req() req,
  ) {
    const userId = req.user.id;
    return this.usersService.updateLocation(userId, updateLocationDto);
  }

  @ApiOperation({ summary: 'Update user timezone' })
  @ApiResponse({ status: 200, description: 'Timezone updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Patch('timezone')
  async updateTimezone(
    @Body() updateTimezoneDto: UpdateTimezoneDto,
    @Req() req,
  ) {
    const userId = req.user.id;
    return this.usersService.updateTimezone(userId, updateTimezoneDto);
  }

  @ApiOperation({ summary: 'Get user zodiac sign' })
  @ApiResponse({
    status: 200,
    description: 'Returns user zodiac sign based on birthdate',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get('zodiac')
  async getZodiacSign(@Req() req) {
    const userId = req.user.id;
    return this.usersService.getZodiacSign(userId);
  }

  @ApiOperation({ summary: 'Mark onboarding as completed' })
  @ApiResponse({
    status: 200,
    description: 'Onboarding marked as completed',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Post('complete')
  async completeOnboarding(@Req() req) {
    const userId = req.user.id;
    return this.usersService.completeOnboarding(userId);
  }
}
