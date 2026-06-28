import { mentorChat } from "../services/mentor.service.js";
import { sendSuccess, sendError } from "../utils/response.js";
export const chatWithMentor = async (req, res, next) => {
  try {
    const { problem, conversation, userMessage, hintLevel } = req.body;

    if (!problem || !userMessage) {
      return res.status(400).json({
        success: false,
        message: "Problem and userMessage are required.",
      });
    }

    const reply = await mentorChat({
      problem,
      conversation,
      userMessage,
      hintLevel,
    });

    return sendSuccess(
      res,
      { reply },
      "Mentor response generated successfully.",
    );
  } catch (error) {
    next(error);
  }
};
