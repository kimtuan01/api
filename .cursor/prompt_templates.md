# Prompt Templates for Lunaria API

This document contains useful prompt templates to help standardize code generation using Cursor for the Lunaria API project.

## NestJS Component Generation

### Controller Generation

```
Generate a NestJS controller for [feature] with the following requirements:
- File should be named [feature].controller.ts in the src/[feature] directory
- Include Swagger documentation with appropriate tags and descriptions
- Implement CRUD endpoints with proper DTOs
- Include JWT authentication with the proper guards
- Follow our error handling patterns with try/catch blocks
- Follow our project's TypeScript and NestJS conventions
```

### Service Generation

```
Create a NestJS service for [feature] with the following specifications:
- File should be named [feature].service.ts in the src/[feature] directory
- Implement repository pattern with TypeORM
- Include proper error handling with custom exceptions
- Implement methods for CRUD operations
- Follow our project's RO-RO pattern for input/output objects
- Make sure all database operations are wrapped in try/catch blocks
```

### DTO Generation

```
Create DTOs for [entity] with the following requirements:
- Create files in the src/[feature]/dto directory
- Include a Create[Entity]Dto with proper class-validator decorators
- Include an Update[Entity]Dto extending PartialType from @nestjs/swagger
- Include a [Entity]ResponseDto for standardized responses
- Follow our naming conventions and documentation standards
```

### Entity Generation

```
Create a TypeORM entity for [entity] with the following specifications:
- File should be in src/[feature]/entities directory
- Include proper TypeORM decorators for columns and relations
- Implement soft delete pattern
- Add created_at and updated_at timestamp columns
- Add proper indexes for frequently queried fields
- Include Swagger property decorators for documentation
```

## Code Modification Templates

### Adding Authentication

```
Add JWT authentication to this controller with the following requirements:
- Use the @UseGuards(JwtAuthGuard) decorator
- Add the @ApiBearerAuth('JWT-auth') Swagger decorator
- Make sure to exclude any public endpoints using @Public() decorator
- Implement proper role-based authorization if needed
```

### Adding Validation

```
Enhance this DTO with proper validation using class-validator with the following requirements:
- Add validation for all fields with appropriate error messages
- Use IsNotEmpty(), IsString(), IsEmail() and other relevant decorators
- Add proper length validations for string fields
- Add @ApiProperty() decorators with descriptions for Swagger
```

### Implementing Error Handling

```
Refactor this service to follow our error handling patterns:
- Replace direct throws with custom exceptions
- Wrap database operations in try/catch blocks
- Add proper error context to caught exceptions
- Use our standard error codes for different error types
- Log errors appropriately
```

### Adding Swagger Documentation

```
Add Swagger documentation to this controller with the following requirements:
- Use @ApiTags('[feature]') for grouping
- Add @ApiOperation() with descriptions for each endpoint
- Include @ApiResponse() for success and error cases
- Add @ApiParam() and @ApiQuery() for parameters
- Document security requirements with @ApiBearerAuth() where needed
```

## Testing Templates

### Controller Testing

```
Generate a unit test for [feature] controller with the following requirements:
- Use Jest testing framework
- Mock the service dependencies
- Test all endpoints with various input scenarios
- Follow the AAA (Arrange-Act-Assert) pattern
- Test both success and error cases
```

### Service Testing

```
Create unit tests for [feature] service with the following specifications:
- Mock the repository layer
- Test all public methods
- Include error case tests
- Follow our naming conventions for test variables (inputX, mockX, actualX, expectedX)
- Use descriptive test names that explain what is being tested
```