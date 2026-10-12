import comment from "../Modals/comment.js";
import mongoose from "mongoose";

const ABUSIVE_WORDS = [
  "abuse",
  "stupid",
  "idiot",
  "hate",
  "scam",
  "cheat",
  "fool",
  "trash",
  "dumb",
  "nasty",
];

const checkContentModeration = (text) => {
  if (!text || typeof text !== "string") return { allowed: true };

  const lower = text.toLowerCase();

  // 1. Check abusive word list
  for (const word of ABUSIVE_WORDS) {
    const regex = new RegExp(`\\b${word}\\b`, "i");
    if (regex.test(lower)) {
      return {
        allowed: false,
        reason: `Comment contains blocked inappropriate language ("${word}").`,
      };
    }
  }

  // 2. Check for excessive repeated special characters (e.g., !!!, ???, ****)
  const specialCharRepeats = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{4,}/;
  if (specialCharRepeats.test(text)) {
    return {
      allowed: false,
      reason: "Comment contains excessive repeated special characters.",
    };
  }

  // 3. Check for excessive single character repeats (e.g. aaaaaaa)
  const charRepeats = /(.)\1{5,}/;
  if (charRepeats.test(text)) {
    return {
      allowed: false,
      reason: "Spam detected: repeated characters detected.",
    };
  }

  return { allowed: true };
};

export const postcomment = async (req, res) => {
  const commentdata = req.body;

  // Run Moderation Check
  const modResult = checkContentModeration(commentdata.commentbody);
  if (!modResult.allowed) {
    return res.status(400).json({ message: modResult.reason, blocked: true });
  }

  try {
    const newComment = new comment({
      ...commentdata,
      likes: [],
      dislikes: [],
      isReported: false,
      reports: [],
    });
    await newComment.save();
    return res.status(200).json({ comment: true, data: newComment });
  } catch (error) {
    console.error("error posting comment:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getallcomment = async (req, res) => {
  const { videoid } = req.params;
  try {
    if (!videoid) return res.status(200).json([]);
    let comments = [];
    if (mongoose.Types.ObjectId.isValid(videoid)) {
      comments = await comment.find({ videoid: videoid }).sort({ createdAt: -1 });
    }
    return res.status(200).json(comments || []);
  } catch (error) {
    console.error("error fetching comments:", error);
    return res.status(200).json([]);
  }
};

export const deletecomment = async (req, res) => {
  const { id: _id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("comment unavailable");
  }
  try {
    await comment.findByIdAndDelete(_id);
    return res.status(200).json({ comment: true });
  } catch (error) {
    console.error("error deleting comment:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const editcomment = async (req, res) => {
  const { id: _id } = req.params;
  const { commentbody } = req.body;

  const modResult = checkContentModeration(commentbody);
  if (!modResult.allowed) {
    return res.status(400).json({ message: modResult.reason, blocked: true });
  }

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("comment unavailable");
  }
  try {
    const updatecomment = await comment.findByIdAndUpdate(
      _id,
      { $set: { commentbody: commentbody } },
      { new: true }
    );
    res.status(200).json(updatecomment);
  } catch (error) {
    console.error("error editing comment:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const likeComment = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  if (!userId) return res.status(401).json({ message: "Authentication required" });

  try {
    const targetComment = await comment.findById(id);
    if (!targetComment) return res.status(404).json({ message: "Comment not found" });

    const likedIndex = targetComment.likes.indexOf(userId);
    const dislikedIndex = targetComment.dislikes.indexOf(userId);

    if (likedIndex > -1) {
      targetComment.likes.splice(likedIndex, 1);
    } else {
      targetComment.likes.push(userId);
      if (dislikedIndex > -1) targetComment.dislikes.splice(dislikedIndex, 1);
    }

    await targetComment.save();
    return res.status(200).json(targetComment);
  } catch (error) {
    console.error("error liking comment:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const dislikeComment = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  if (!userId) return res.status(401).json({ message: "Authentication required" });

  try {
    const targetComment = await comment.findById(id);
    if (!targetComment) return res.status(404).json({ message: "Comment not found" });

    const dislikedIndex = targetComment.dislikes.indexOf(userId);
    const likedIndex = targetComment.likes.indexOf(userId);

    if (dislikedIndex > -1) {
      targetComment.dislikes.splice(dislikedIndex, 1);
    } else {
      targetComment.dislikes.push(userId);
      if (likedIndex > -1) targetComment.likes.splice(likedIndex, 1);
    }

    await targetComment.save();
    return res.status(200).json(targetComment);
  } catch (error) {
    console.error("error disliking comment:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const reportComment = async (req, res) => {
  const { id } = req.params;
  const { userId, reason } = req.body;

  try {
    const targetComment = await comment.findById(id);
    if (!targetComment) return res.status(404).json({ message: "Comment not found" });

    targetComment.isReported = true;
    targetComment.reports.push({
      userId: userId || "Anonymous",
      reason: reason || "Inappropriate content",
      reportedAt: new Date(),
    });

    await targetComment.save();
    return res.status(200).json({
      message: "Comment reported successfully and flagged for moderator review.",
      comment: targetComment,
    });
  } catch (error) {
    console.error("error reporting comment:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const translateComment = async (req, res) => {
  const { text, targetLang } = req.body;

  if (!text) return res.status(400).json({ message: "Text required" });

  try {
    // Translation dictionary helper for common demo translations
    const sampleTranslations = {
      hi: {
        "Great video!": "शानदार वीडियो!",
        "Awesome content": "अद्भुत सामग्री",
        "Hello world": "नमस्ते दुनिया",
        "Very helpful, thanks!": "बहुत उपयोगी, धन्यवाद!",
      },
      es: {
        "Great video!": "¡Excelente video!",
        "Awesome content": "Contenido impresionante",
        "Hello world": "Hola Mundo",
        "Very helpful, thanks!": "¡Muy útil, gracias!",
      },
      fr: {
        "Great video!": "Super vidéo !",
        "Awesome content": "Contenu impressionnant",
        "Hello world": "Bonjour le monde",
        "Very helpful, thanks!": "Très utile, merci !",
      },
    };

    const target = targetLang || "hi";
    let translated = sampleTranslations[target]?.[text];

    if (!translated) {
      translated = `[Translated to ${target.toUpperCase()}]: ${text}`;
    }

    return res.status(200).json({ translatedText: translated, targetLang: target });
  } catch (error) {
    console.error("Error translating comment:", error);
    return res.status(500).json({ message: "Translation service error" });
  }
};
