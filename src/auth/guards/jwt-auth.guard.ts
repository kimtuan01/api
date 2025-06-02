import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard that checks if the request has a valid JWT token
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
