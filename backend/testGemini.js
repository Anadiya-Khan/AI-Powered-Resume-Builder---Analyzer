import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize the client
const ai = new GoogleGenAI({});

async function testAPI() {
  try {
    console.log('🔍 Testing Gemini API...\n');
    
    // Check if API key exists
    if (!process.env.GEMINI_API_KEY) {
      console.error('❌ GEMINI_API_KEY not found in environment variables');
      return;
    }
    
    console.log('✅ API Key found');
    console.log('📝 API Key preview:', process.env.GEMINI_API_KEY.substring(0, 15) + '...\n');
    
    // Test API call
    console.log('📡 Sending test request...\n');
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Say hello in a creative way!",
    });
    
    console.log('✅ Success! Response:\n');
    console.log(response.text);
    console.log('\n🎉 Gemini API is working correctly!');
    
  } catch (error) {
    console.error('❌ Error occurred:\n');
    console.error('Message:', error.message);
    console.error('\nFull error:', error);
    
    // Provide helpful suggestions
    console.log('\n💡 Troubleshooting:');
    if (error.message?.includes('API key')) {
      console.log('- Check if your API key is valid');
      console.log('- Generate a new key at: https://aistudio.google.com/app/apikey');
    }
    if (error.message?.includes('location')) {
      console.log('- Gemini API might not be available in your region');
      console.log('- Try using a VPN or different AI service');
    }
    if (error.message?.includes('quota')) {
      console.log('- You have exceeded your API quota');
      console.log('- Check usage at: https://console.cloud.google.com/');
    }
  }
}

// Run the test
testAPI();