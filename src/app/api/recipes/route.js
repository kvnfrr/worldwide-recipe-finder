export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Load environment variables
const apiKey = process.env.OPENAI_API_KEY;

console.log('API Key Loaded:', apiKey ? 'Yes' : 'No'); // Log whether API key is loaded

const openai = new OpenAI({
  apiKey: apiKey,
});

export async function POST(request) {
  try {
    const { country } = await request.json();
    console.log('Received country:', country); // Log the received country

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
          'You are a helpful assistant that provides traditional recipes from different countries. When providing responses, output only the raw JSON data as specified, without any additional formatting or text.',
      },
      {
            role: 'user',
            content: `As a culinary expert, please provide a list of 3 authentic and traditional dishes from ${country} that are culturally significant and have historical roots in the country's cuisine. Avoid modern or widely internationalized dishes.
          
          For example, if the country is Italy, an appropriate dish would be:
          
          {
            "name": "Risotto alla Milanese",
            "description": "A classic Italian dish from Milan made with Arborio rice, saffron, and Parmesan cheese, reflecting the rich culinary traditions of Northern Italy.",
            "ingredients": ["Arborio rice", "saffron threads", "butter", "onion", "white wine", "chicken broth", "Parmesan cheese"],
            "cooking_time": "45 minutes",
            "steps": ["Sauté onion in butter", "Add rice and toast", "Deglaze with white wine", "Gradually add broth while stirring", "Add saffron", "Stir in Parmesan cheese before serving"]
          }
          
          Now, please provide the dishes for ${country} in the same format. Output only the JSON array, without any Markdown formatting, code blocks, or additional text.`,
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

    // Clean the AI response in case of unexpected formatting
    const cleanedResponse = cleanAIResponse(aiResponse);

    // Attempt to parse the AI's response
    let recipes;
    try {
      recipes = JSON.parse(cleanedResponse);
    } catch (error) {
      console.error('Failed to parse AI response as JSON:', aiResponse);
      recipes = [{ error: 'Failed to parse AI response', details: aiResponse }];
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
