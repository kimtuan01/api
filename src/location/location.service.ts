import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AddressSuggestionResponseDto } from './dto/location.dto';
import { AxiosResponse } from 'axios';

interface GeocodingResponse {
  status: string;
  results: Array<{
    place_id: string;
    formatted_address: string;
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
      location_type?: string;
      viewport?: {
        northeast: {
          lat: number;
          lng: number;
        };
        southwest: {
          lat: number;
          lng: number;
        };
      };
      bounds?: {
        northeast: {
          lat: number;
          lng: number;
        };
        southwest: {
          lat: number;
          lng: number;
        };
      };
    };
    address_components: Array<{
      long_name: string;
      short_name: string;
      types: string[];
    }>;
    types: string[];
  }>;
  error_message?: string;
}

@Injectable()
export class LocationService implements OnModuleInit {
  private readonly logger = new Logger(LocationService.name);
  private readonly apiKey: string;
  private readonly geocodingApiUrl: string =
    'https://maps.googleapis.com/maps/api/geocode/json';

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.apiKey = this.configService.get<string>('googleMaps.apiKey');
    this.logger.debug(`API Key: ${this.apiKey}`);
  }

  onModuleInit() {
    if (!this.apiKey) {
      this.logger.error(
        'Google Maps API Key is undefined. Make sure GOOGLE_MAPS_API_KEY is set in your .env file and googleMapsConfig is loaded in app.module.ts',
      );
    }
  }

  async getSuggestions(query: string): Promise<AddressSuggestionResponseDto> {
    if (!query || query.trim().length < 3) {
      return { results: [], status: 'ZERO_RESULTS' };
    }

    if (!this.apiKey) {
      this.logger.error(
        'Cannot fetch suggestions: Google Maps API Key is not configured',
      );
      return { results: [], status: 'ERROR' };
    }

    try {
      const { data } = await firstValueFrom<AxiosResponse<GeocodingResponse>>(
        this.httpService.get<GeocodingResponse>(this.geocodingApiUrl, {
          params: {
            address: query,
            key: this.apiKey,
          },
        }),
      );

      this.logger.debug(
        `Geocoding API response: ${JSON.stringify(data, null, 2)}`,
      );

      if (data.status !== 'OK' || !data.results || !data.results.length) {
        this.logger.warn(`Geocoding API returned no results: ${data.status}`);
        return { results: [], status: data.status || 'ZERO_RESULTS' };
      }

      return {
        results: data.results,
        status: data.status,
      };
    } catch (error) {
      this.logger.error('Error fetching address suggestions:', error);
      return { results: [], status: 'ERROR' };
    }
  }
}
