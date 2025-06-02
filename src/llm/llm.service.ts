import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PromptTemplate } from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';

/**
 * Service for interacting with Large Language Models (LLMs)
 */
@Injectable()
export class LLMService {
  private readonly logger = new Logger(LLMService.name);
  private model: ChatOpenAI;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('llm.apiKey');
    const modelName = this.configService.get<string>('llm.model');
    const temperature = this.configService.get<number>('llm.temperature');
    const maxTokens = this.configService.get<number>('llm.maxTokens');

    if (!apiKey) {
      this.logger.warn(
        'OpenAI API key not provided. LLM functionality will be limited.',
      );
    }

    this.model = new ChatOpenAI({
      apiKey,
      modelName,
      temperature,
      maxTokens,
    });

    this.logger.log(`Initialized LLM service using model: ${modelName}`);
  }

  /**
   * Generate text from a prompt using the LLM
   *
   * @param prompt - The prompt template to use
   * @param variables - Variables to use in the prompt
   * @returns The generated text
   */
  async generateText(
    prompt: PromptTemplate,
    variables: Record<string, any>,
  ): Promise<string> {
    try {
      this.logger.debug(
        `Generating text with variables: ${JSON.stringify(variables)}`,
      );

      // Flatten nested properties to handle them in the prompt template
      const flattenedVariables = this.flattenVariables(variables);

      const formattedPrompt = await prompt.format(flattenedVariables);
      const response = await this.model.invoke(formattedPrompt);

      return response.content.toString();
    } catch (error) {
      this.logger.error(`Error generating text: ${error.message}`, error.stack);

      // Provide more context for template errors
      if (
        error.message.includes('f-string') ||
        error.message.includes('missing value')
      ) {
        this.logger.error(
          `Template error: Check that all variables referenced in the template are provided. Variables passed: ${JSON.stringify(variables)}`,
        );
      }

      throw error;
    }
  }

  /**
   * Flattens nested object properties into dot notation for template use
   *
   * @param obj - The object to flatten
   * @param prefix - The prefix to use for nested properties
   * @returns A flattened object with dot notation keys
   */
  private flattenVariables(
    obj: Record<string, any>,
    prefix: string = '',
  ): Record<string, any> {
    return Object.keys(obj).reduce(
      (acc, key) => {
        const newKey = prefix ? `${prefix}.${key}` : key;

        if (
          typeof obj[key] === 'object' &&
          obj[key] !== null &&
          !Array.isArray(obj[key])
        ) {
          Object.assign(acc, this.flattenVariables(obj[key], newKey));
        } else {
          acc[newKey] = obj[key];
        }

        return acc;
      },
      {} as Record<string, any>,
    );
  }
}
