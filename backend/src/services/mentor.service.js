import ai from "../config/gemini.js";
import { buildMentorPrompt } from "../prompts/mentor.prompt.js";
export const mentorChat = async ({
  problem,
  conversation = [],
  userMessage,
  hintLevel = 1,
}) => {
  const prompt = buildMentorPrompt({
    problem,
    conversation,
    userMessage,
    hintLevel,
  });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text;
  } catch (err) {
    console.log("in mentor service, error is : ", err);
    throw new Error("failed to generate mentor response");
  }
};
