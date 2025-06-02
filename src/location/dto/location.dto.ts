import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AddressSuggestionQueryDto {
  @ApiProperty({
    description: 'Text input for location search',
    example: 'Nguyen Hue Street',
    minLength: 3,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  readonly query: string;
}

export class PlaceIdQueryDto {
  @ApiProperty({
    description: 'Place ID from Google Maps',
    example: 'ChIJrTLr-GyuEmsRBfy61i59si0',
  })
  @IsString()
  @IsNotEmpty()
  readonly placeId: string;
}

export class AddressComponent {
  @ApiProperty({
    example: 'Đường Nguyễn Huệ',
    description: 'Long name of the address component',
  })
  readonly long_name: string;

  @ApiProperty({
    example: 'Đ. Nguyễn Huệ',
    description: 'Short name of the address component',
  })
  readonly short_name: string;

  @ApiProperty({
    example: ['route'],
    description: 'Types categorizing this address component',
    isArray: true,
  })
  readonly types: string[];
}

export class GeometryBounds {
  @ApiProperty({
    example: { lat: 10.7768714, lng: 106.7065103 },
    description: 'Northeast coordinate boundary',
  })
  readonly northeast: { lat: number; lng: number };

  @ApiProperty({
    example: { lat: 10.7711015, lng: 106.7006138 },
    description: 'Southwest coordinate boundary',
  })
  readonly southwest: { lat: number; lng: number };
}

export class Geometry {
  @ApiProperty({ description: 'Boundary coordinates of the location' })
  readonly bounds?: GeometryBounds;

  @ApiProperty({
    example: { lat: 10.7738223, lng: 106.7036509 },
    description: 'Center coordinates of the location',
  })
  readonly location: { lat: number; lng: number };

  @ApiProperty({
    example: 'GEOMETRIC_CENTER',
    description: 'Type of location point',
  })
  readonly location_type?: string;

  @ApiProperty({ description: 'Viewport boundaries for the location' })
  readonly viewport?: GeometryBounds;
}

export class LocationResult {
  @ApiProperty({
    description: 'Address components broken down by type',
    type: [AddressComponent],
  })
  readonly address_components: AddressComponent[];

  @ApiProperty({
    example: 'Đ. Nguyễn Huệ, Bến Nghé, Quận 1, Hồ Chí Minh, Vietnam',
    description: 'Human-readable address',
  })
  readonly formatted_address: string;

  @ApiProperty({
    description: 'Geometry information including location coordinates',
    type: Geometry,
  })
  readonly geometry: Geometry;

  @ApiProperty({
    example: 'ChIJnRF9v0YvdTERcuW8mp0X9us',
    description: 'Unique identifier for the place',
  })
  readonly place_id: string;

  @ApiProperty({
    example: ['route'],
    description: 'Types categorizing this result',
    isArray: true,
  })
  readonly types: string[];
}

export class AddressSuggestionResponseDto {
  @ApiProperty({
    description: 'Array of location results',
    type: [LocationResult],
  })
  readonly results: LocationResult[];

  @ApiProperty({
    example: 'OK',
    description: 'Status of the API response',
  })
  readonly status: string;
}

export class CoordinatesDto {
  @ApiProperty({
    description: 'Latitude coordinate',
    example: 10.7766,
  })
  readonly lat: number;

  @ApiProperty({
    description: 'Longitude coordinate',
    example: 106.7019,
  })
  readonly lng: number;
}

export class LocationSuggestionDto {
  @ApiProperty({
    description: 'Google Maps Place ID',
    example: 'ChIJrTLr-GyuEmsRBfy61i59si0',
  })
  readonly placeId: string;

  @ApiProperty({
    description: 'Formatted address',
    example: 'Nguyen Hue Street, District 1, Ho Chi Minh City, Vietnam',
  })
  readonly address: string;

  @ApiProperty({
    description: 'Geographic coordinates',
    type: CoordinatesDto,
  })
  readonly coordinates: CoordinatesDto;
}
