import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { SignInDto } from './dto/sign-in.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './strategies/jwt.strategy';

/**
 * Authentication response interface
 */
export interface AuthResponse {
  accessToken: string;
  user: any;
  onboardingCompleted: boolean;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Register a new user with email and password
   * @param registerDto - The DTO containing user registration data
   * @returns The created user object without password
   */
  async register(registerDto: RegisterDto) {
    return this.usersService.register(registerDto);
  }

  /**
   * Authenticate a user with email and password
   * @param signInDto - The DTO containing sign-in data
   * @returns Access token and user data
   */
  async signIn(signInDto: SignInDto): Promise<AuthResponse> {
    const { email, password } = signInDto;

    // Validate user credentials
    const user = await this.usersService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Create JWT payload
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    // Generate JWT token
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user,
      onboardingCompleted: user.onboardingCompleted || false,
    };
  }
}
