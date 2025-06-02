<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Lunaria API

A modern API built with NestJS for the Lunaria platform.

## Description

Lunaria API is a backend service that provides authentication, user management, and health monitoring endpoints. The API is built using [NestJS](https://github.com/nestjs/nest), a progressive Node.js framework for building efficient and scalable server-side applications.

## Features

- User management with onboarding flows
- JWT-based authentication
- API versioning
- Swagger API documentation
- TypeORM with PostgreSQL
- Health checks
- AI-powered daily horoscopes via LangChain and OpenAI

## Project setup

```bash
$ npm install
```

## Environment Setup

Create a `.env` file in the root directory based on the provided `.env.example`:

```bash
$ cp .env.example .env
```

Make sure to add your OpenAI API key to the `.env` file to enable the horoscope generation feature.

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Development with Cursor

This project works well with [Cursor](https://cursor.sh/), an AI-powered IDE that enhances developer productivity:

- Open the project with `cursor .` in the project root directory
- Use Cursor's AI capabilities to:
  - Generate NestJS controllers, services, and modules following the project conventions
  - Debug complex TypeScript errors
  - Refactor code to follow the established patterns
- Press `Cmd+K` (Mac) or `Ctrl+K` (Windows/Linux) to access Cursor's AI chat for code-related questions
- Use Cursor's semantic code search to quickly find relevant code segments in the codebase

### Cursor Best Practices & Contributions

To improve the team's productivity with Cursor:

#### Best Practices
- Create custom instructions in Cursor settings that reflect our NestJS and TypeScript conventions
- Use specific, detailed prompts that reference our project structure and naming conventions
- Save useful prompts to the team's shared prompt library
- When generating code, always specify the project's patterns (e.g., "Follow our RO-RO pattern for input/output objects")

#### Contributing to Cursor Rules
- Store helpful Cursor custom instructions in `.cursor/team_instructions.md`
- When you discover an effective prompt pattern, add it to `.cursor/prompt_templates.md`
- Share custom settings that improve Cursor's code generation in team meetings
- Document language-specific instructions for generating controllers, services, DTOs, and entities

#### Submitting Improvements
1. Create clear, concise custom instructions that follow our coding standards
2. Test your custom instructions on real coding tasks
3. Submit a PR that updates the `.cursor/` directory with your improvements
4. Include examples of generated code that demonstrate the value of your changes

## API Documentation

The API documentation is available at `/api/docs` when the server is running.

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Project Structure

```
src/
├── auth/          # Authentication module
├── config/        # Configuration module
├── health/        # Health check module
├── horoscope/     # Daily horoscope module
├── llm/           # LLM integration module
│   ├── prompts/   # Prompt templates for LLMs
├── users/         # User management module
│   ├── dto/       # Data Transfer Objects
│   ├── entities/  # Database entities
│   └── services/  # Additional user-related services
├── app.module.ts  # Main application module
└── main.ts        # Application entry point
```

## Technologies

- NestJS
- TypeScript
- PostgreSQL
- TypeORM
- Passport JWT
- Swagger/OpenAPI
- Jest
- LangChain
- OpenAI

## License

This project is [UNLICENSED](LICENSE).
