// app/api/recipes/route.js
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY;

const openai = new OpenAI({
  apiKey: apiKey,
});

export async function POST(request) {
  try {
    const { country } = await request.json();

    console.log('Received country:', country);

    if (!country) {
      console.error('Country not provided in request');
      return NextResponse.json(
        { error: 'Country not provided' },
        { status: 400 }
      );
    }

    // Construct the messages for OpenAI Chat API
    const messages = [
      {
        role: 'system',
        content:
          'You are a helpful assistant that provides traditional and authentic recipes from different countries. When providing responses, output only the raw JSON data as specified, without any additional formatting or text.',
      },
      {
        role: 'user',
        content: `As a culinary expert, please provide a list of 3 authentic and traditional dishes from ${country} that are culturally significant and have historical roots in the country's cuisine. Avoid modern or widely internationalized dishes.

For each dish, include the following information:

- Name
- A brief description highlighting its cultural significance
- Ingredients (as a list)
- Cooking time
- Detailed step-by-step cooking instructions (as a numbered list). Each step should be thorough and easy to follow, including specific details and tips where appropriate.

Ensure that the dishes are genuine to ${country}'s heritage. Output only the JSON array, without any Markdown formatting, code blocks, or additional text. The JSON array should contain objects with the fields: 'name', 'description', 'ingredients', 'cooking_time', and 'steps'.`,
      },
    ];

    console.log('Sending request to OpenAI API');

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      temperature: 0.5,
    });

    console.log('Received response from OpenAI API');

    const aiResponse = completion.choices[0].message.content.trim();

    // Clean the AI response
    const cleanedResponse = cleanAIResponse(aiResponse);

    // Attempt to parse the AI's response
    let recipes;
    try {
      recipes = JSON.parse(cleanedResponse);
    } catch (error) {
      console.error('Failed to parse AI response as JSON:', aiResponse);
      return NextResponse.json(
        { error: 'Failed to parse AI response', details: aiResponse },
        { status: 500 }
      );
    }

    return NextResponse.json({ recipes });
  } catch (error) {
    console.error(
      'Error fetching recipes:',
      error.response ? error.response.data : error.message
    );
    return NextResponse.json(
      { error: 'An error occurred while fetching recipes' },
      { status: 500 }
    );
  }
}

// Function to clean the AI response
function cleanAIResponse(response) {
  // Remove any Markdown code block formatting
  return response.replace(/```json\s*([\s\S]*?)```/g, '$1').trim();
}
