import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createHash } from 'crypto';
import { User } from './entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ZodiacService } from './services/zodiac.service';
import { UpdateNameDto } from './dto/update-name.dto';
import { UpdateGenderDto } from './dto/update-gender.dto';
import { UpdateBirthdateDto } from './dto/update-birthdate.dto';
import { UpdateBirthtimeDto } from './dto/update-birthtime.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { UpdateTimezoneDto } from './dto/update-timezone.dto';
import { ZodiacSign } from './entities/zodiac-sign.enum';
import { ChangePasswordDto } from './dto/change-password.dto';

interface RegisterUserDto {
  email: string;
  password: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly zodiacService: ZodiacService,
  ) {}

  /**
   * Register a new user with email and password
   * @param userDto - The DTO containing user registration data (email and password)
   * @returns The created user object without password
   */
  async register(userDto: RegisterUserDto): Promise<Omit<User, 'password'>> {
    const { email, password } = userDto;

    // Check if user with the email already exists
    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Hash the password using SHA-256
    const hashedPassword = createHash('sha256').update(password).digest('hex');

    // Create a new user
    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      name: email.split('@')[0], // Default name from email
      onboardingCompleted: false, // Mark as not completed onboarding
    });

    // Save the user to the database
    await this.usersRepository.save(user);

    // Return user without password
    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;
    return userWithoutPassword;
  }

  /**
   * Find a user by their email address
   * @param email - The email address to search for
   * @returns The user object if found, null otherwise
   */
  async findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  /**
   * Find a user by their ID
   * @param id - The user ID to search for
   * @returns The user object if found, null otherwise
   */
  async findOneById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  /**
   * Validate user credentials for authentication
   * @param email - The user's email address
   * @param password - The plaintext password to validate
   * @returns The user object without password if valid, null otherwise
   */
  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'> | null> {
    // Find user with password included
    const user = await this.usersRepository.findOne({
      where: { email },
      select: [
        'id',
        'email',
        'name',
        'password',
        'createdAt',
        'updatedAt',
        'onboardingCompleted',
      ],
    });

    if (!user) {
      return null;
    }

    // Hash the provided password and compare
    const hashedPassword = createHash('sha256').update(password).digest('hex');
    if (user.password !== hashedPassword) {
      return null;
    }

    // Return user without password
    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;
    return userWithoutPassword;
  }

  /**
   * Update user profile information
   * @param userId - The ID of the user to update
   * @param updateProfileDto - The DTO containing profile update data
   * @returns The updated user object
   */
  async updateProfile(
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update user with profile information
    Object.assign(user, updateProfileDto);

    // Calculate and set zodiac sign
    if (updateProfileDto.dateOfBirth) {
      user.zodiacSign = this.zodiacService.calculateZodiacSign(
        updateProfileDto.dateOfBirth,
      );
    }

    // Mark onboarding as completed when all required fields are set
    if (user.gender && user.dateOfBirth && user.birthTime) {
      user.onboardingCompleted = true;
    }

    // Save user with updated profile
    return this.usersRepository.save(user);
  }

  /**
   * Check if a user has completed onboarding
   * @param userId - The ID of the user to check
   * @returns Boolean indicating if onboarding is completed
   */
  async hasCompletedOnboarding(userId: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user.onboardingCompleted;
  }

  /**
   * Update user's name
   * @param userId - The ID of the user
   * @param updateNameDto - The DTO containing the name to update
   * @returns The updated user object
   */
  async updateName(
    userId: string,
    updateNameDto: UpdateNameDto,
  ): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.name = updateNameDto.name;
    return this.usersRepository.save(user);
  }

  /**
   * Update user's gender
   * @param userId - The ID of the user
   * @param updateGenderDto - The DTO containing the gender to update
   * @returns The updated user object
   */
  async updateGender(
    userId: string,
    updateGenderDto: UpdateGenderDto,
  ): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.gender = updateGenderDto.gender;
    return this.usersRepository.save(user);
  }

  /**
   * Update user's birthdate
   * @param userId - The ID of the user
   * @param updateBirthdateDto - The DTO containing the birthdate to update
   * @returns The updated user object
   */
  async updateBirthdate(
    userId: string,
    updateBirthdateDto: UpdateBirthdateDto,
  ): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.dateOfBirth = updateBirthdateDto.dateOfBirth;

    // Update zodiac sign when birthdate changes
    user.zodiacSign = this.zodiacService.calculateZodiacSign(user.dateOfBirth);

    return this.usersRepository.save(user);
  }

  /**
   * Update user's birth time
   * @param userId - The ID of the user
   * @param updateBirthtimeDto - The DTO containing the birth time to update
   * @returns The updated user object
   */
  async updateBirthtime(
    userId: string,
    updateBirthtimeDto: UpdateBirthtimeDto,
  ): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.birthTime = updateBirthtimeDto.birthTime;
    return this.usersRepository.save(user);
  }

  /**
   * Update user's location (latitude, longitude)
   * @param userId - The ID of the user
   * @param updateLocationDto - The DTO containing the latitude, longitude, and optional address to update
   * @returns The updated user object
   */
  async updateLocation(
    userId: string,
    updateLocationDto: UpdateLocationDto,
  ): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.latitude = updateLocationDto.latitude;
    user.longitude = updateLocationDto.longitude;

    if (updateLocationDto.address) {
      user.address = updateLocationDto.address;
    }

    return this.usersRepository.save(user);
  }

  /**
   * Update user's timezone
   * @param userId - The ID of the user
   * @param updateTimezoneDto - The DTO containing the timezone to update
   * @returns The updated user object
   */
  async updateTimezone(
    userId: string,
    updateTimezoneDto: UpdateTimezoneDto,
  ): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.timezone = updateTimezoneDto.timezone;
    return this.usersRepository.save(user);
  }

  /**
   * Get user's zodiac sign
   * @param userId - The ID of the user
   * @returns Object containing the user's zodiac sign
   */
  async getZodiacSign(userId: string): Promise<{ zodiacSign: ZodiacSign }> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.dateOfBirth) {
      throw new BadRequestException('Birthdate not set');
    }

    return { zodiacSign: user.zodiacSign };
  }

  /**
   * Mark onboarding as completed
   * @param userId - The ID of the user
   * @returns Object indicating successful completion
   */
  async completeOnboarding(userId: string): Promise<{ completed: boolean }> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if all required fields are set
    if (!user.name) {
      throw new BadRequestException('Name is required');
    }
    if (!user.gender) {
      throw new BadRequestException('Gender is required');
    }
    if (!user.dateOfBirth) {
      throw new BadRequestException('Birthdate is required');
    }
    if (!user.birthTime) {
      throw new BadRequestException('Birth time is required');
    }
    if (user.latitude === null || user.longitude === null) {
      throw new BadRequestException('Location is required');
    }
    if (!user.address) {
      throw new BadRequestException('Address is required');
    }
    if (!user.timezone) {
      throw new BadRequestException('Timezone is required');
    }

    // Mark onboarding as completed
    user.onboardingCompleted = true;
    await this.usersRepository.save(user);

    return { completed: true };
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (changePasswordDto.password !== changePasswordDto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }
    user.password = createHash('sha256')
      .update(changePasswordDto.password)
      .digest('hex');
    return this.usersRepository.save(user);
  }

  // async updateResetToken(userId: string, resetToken: string, resetTokenExpires: Date) {
  //   const user = await this.usersRepository.findOne({ where: { id: userId } });
  //   if (!user) {
  //     throw new NotFoundException('User not found');
  //   }

  //   user.resetToken = resetToken;
  //   user.resetTokenExpires = resetTokenExpires;
  //   return this.usersRepository.save(user);
  // }

  // async findByResetToken(token: string): Promise<User | null> {
  //   return this.usersRepository.findOne({
  //     where: { resetToken: token },
  //   });
  // }

  async updatePassword(userId: string, newPassword: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const hashedPassword = createHash('sha256').update(newPassword).digest('hex');
    user.password = hashedPassword;
    return this.usersRepository.save(user);
  }

  // async clearResetToken(userId: string) {
  //   const user = await this.usersRepository.findOne({ where: { id: userId } });
  //   if (!user) {
  //     throw new NotFoundException('User not found');
  //   }

  //   user.resetToken = null;
  //   user.resetTokenExpires = null;
  //   return this.usersRepository.save(user);
  // }
}
