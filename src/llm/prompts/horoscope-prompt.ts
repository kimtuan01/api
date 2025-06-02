import { PromptTemplate } from '@langchain/core/prompts';

/**
 * Template for generating astrological predictions based on zodiac sign
 */
export const horoscopePromptTemplate = PromptTemplate.fromTemplate(`
You are a professional astrologer providing personalized horoscope readings.
Generate a detailed daily horoscope for a person with the {zodiacSign} zodiac sign for {date}.
Their date of birth is {dateOfBirth} (if available, otherwise this information is not provided).
Their time of birth is {birthTime} (if available, otherwise this information is not provided).
Use this birth information to refine the horoscope if possible, but generate a valid horoscope even if it's not available.

Structure your response with the following sections:
1. A general daily overview (100-150 words)
2. Love and relationships (50-75 words) - focus on general interpersonal connections and emotional energy without assuming the person has a specific partner or relationship status
3. Career and studies (50-75 words)
4. Health and wellbeing (50-75 words)
5. Money and finances (50-75 words)

For each of the following life aspects, provide a rating score from 1-100:
- Health
- Love
- Career

The tone should be insightful, motivational, and specific to the traits of {zodiacSign}.
Do not include generic advice that could apply to any sign.
Do not include disclaimers or explanations about astrology.
Do not include any section titles or numbering in your response.
Provide only the text content for each section, separated by newlines.

IMPORTANT: Your entire response MUST be in Vietnamese language.
`);

/**
 * Template for extracting scores from generated horoscope text
 */
export const extractScoresPromptTemplate = PromptTemplate.fromTemplate(`
From the following horoscope text, extract numerical scores (0-100) for health, love, and career.
If exact scores are not explicitly stated, infer them based on the positivity or negativity of the content.

Horoscope text:
{horoscopeText}

Return ONLY a valid JSON object with exactly this format, without any additional text, markdown formatting, or explanation:
{{"health": [number], "love": [number], "career": [number]}}

Replace [number] with actual numeric values between 0-100.
Do not include any explanation before or after the JSON.
`);
