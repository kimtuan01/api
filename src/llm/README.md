# LLM Module

This module provides integration with Large Language Models (LLMs) for generating dynamic content within the Lunaria API.

## Overview

The LLM module uses LangChain and OpenAI to generate natural language content for various features in the application, including horoscopes. It provides a reusable service that other modules can leverage for AI-driven content generation.

## Architecture

- **LLMModule**: The main module that exports the LLM services.
- **LLMService**: The core service handling LLM interactions.
- **HoroscopeGeneratorService**: A specialized service for generating astrological predictions.
- **Prompts**: Templates for various types of content generation.

## Configuration

The module requires an OpenAI API key to function properly. The configuration is loaded from environment variables:

```
OPENAI_API_KEY=your-api-key
OPENAI_MODEL=gpt-3.5-turbo
OPENAI_TEMPERATURE=0.7
OPENAI_MAX_TOKENS=500
```

## Usage

To use this module in another module, import it as follows:

```typescript
import { Module } from '@nestjs/common';
import { LLMModule } from '../llm/llm.module';

@Module({
  imports: [LLMModule],
  // ...
})
export class YourModule {}
```

Then inject the services you need:

```typescript
import { Injectable } from '@nestjs/common';
import { HoroscopeGeneratorService } from '../llm/horoscope-generator.service';

@Injectable()
export class YourService {
  constructor(private readonly horoscopeGenerator: HoroscopeGeneratorService) {}

  async someMethod() {
    // Use the service
    const result = await this.horoscopeGenerator.generateHoroscope('Aries');
    // ...
  }
}
```

## Extending

To create new LLM-powered features:

1. Create a new prompt template in `src/llm/prompts/`
2. Create a new service that uses the LLMService for the specific use case
3. Add the service to the providers and exports arrays in the LLMModule