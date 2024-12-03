// /app/api/user-recipe/route.js
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY;

const openai = new OpenAI({
  apiKey: apiKey,
});

export async function POST(request) {
  try {
    const { query } = await request.json();

    if (!query) {
      return NextResponse.json(
        { error: 'Query not provided' },
        { status: 400 }
      );
    }

    // Construct the messages for OpenAI Chat API
    const messages = [
      {
        role: 'system',
        content:
          'You are a helpful assistant that provides recipes based on user preferences. Output only the raw JSON data as specified, without any additional formatting or text.',
      },
      {
        role: 'user',
        content: `Please provide a recipe that matches the following description: "${query}". Include the following information:

- Name of the dish
- Country of origin
- A brief description of the dish
- Ingredients (as a list)
- Cooking time
- Detailed step-by-step cooking instructions (as a numbered list)

Ensure the recipe is authentic and accurately represents the dish. Output only the JSON object, without any Markdown formatting, code blocks, or additional text. The JSON object should contain the fields: 'name', 'country', 'description', 'ingredients', 'cooking_time', and 'steps'.`,
      },
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      temperature: 0.5,
    });

    const aiResponse = completion.choices[0].message.content.trim();

    // Clean the AI response
    const cleanedResponse = cleanAIResponse(aiResponse);

    // Attempt to parse the AI's response
    let recipe;
    try {
      recipe = JSON.parse(cleanedResponse);
    } catch (error) {
      console.error('Failed to parse AI response as JSON:', aiResponse);
      return NextResponse.json(
        {
          error: 'Failed to parse AI response as JSON',
          details: aiResponse,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ recipe });
  } catch (error) {
    console.error('Error fetching recipe:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching the recipe' },
      { status: 500 }
    );
  }
}

// Function to clean the AI response
function cleanAIResponse(response) {
  // Remove any Markdown code block formatting
  return response.replace(/```json\s*([\s\S]*?)```/g, '$1').trim();
}
