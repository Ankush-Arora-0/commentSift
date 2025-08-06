import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config({path:'.env'})
const HUGGINGFACE_API_URL = 'https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2';
const HUGGINGFACE_API_KEY = process.env.HUG_SECRET; // Replace with your key

export const checkRelevance = async (comment, topic) => {
  try {
    const response = await axios.post(
      HUGGINGFACE_API_URL,
      {
        inputs: {
          source_sentence: comment,
          sentences: [topic]
        }
      },
      {
        headers: {
          Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const similarity = response.data[0]; // It's a number between 0 and 1
    return similarity;
  } catch (err) {
    console.error("Error checking relevance:", err.response?.data || err.message);
    return 0; // Default to 0 similarity if error
  }
};

