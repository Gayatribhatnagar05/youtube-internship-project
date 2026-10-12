"use client";

import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { formatDistanceToNow } from "date-fns";
import { useUser } from "@/lib/AuthContext";
import axiosInstance from "@/lib/axiosinstance";
import {
  ThumbsUp,
  ThumbsDown,
  Flag,
  Languages,
  ShieldAlert,
  MapPin,
  Check,
  X,
} from "lucide-react";
import { toast } from "sonner";

interface Comment {
  _id: string;
  videoid: string;
  userid: string;
  commentbody: string;
  usercommented: string;
  commentedon: string;
  likes?: string[];
  dislikes?: string[];
  isReported?: boolean;
  language?: string;
  location?: {
    city?: string;
    state?: string;
    showLocation?: boolean;
  };
}

const LANGUAGES = [
  { code: "hi", name: "Hindi (हिन्दी)" },
  { code: "es", name: "Spanish (Español)" },
  { code: "fr", name: "French (Français)" },
  { code: "de", name: "German (Deutsch)" },
  { code: "te", name: "Telugu (తెలుగు)" },
  { code: "ta", name: "Tamil (தமிழ்)" },
];

export default function Comments({ videoId }: { videoId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [showLocation, setShowLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [loading, setLoading] = useState(true);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  // Translation State per comment
  const [translations, setTranslations] = useState<{ [commentId: string]: string }>({});
  const [translatingId, setTranslatingId] = useState<string | null>(null);
  const [selectedLang, setSelectedLang] = useState<{ [commentId: string]: string }>({});

  // Report Modal State
  const [reportModalCommentId, setReportModalCommentId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState("");

  const { user } = useUser();

  useEffect(() => {
    loadComments();
  }, [videoId]);

  const loadComments = async () => {
    if (!videoId) {
      setComments([]);
      setLoading(false);
      return;
    }
    try {
      const res = await axiosInstance.get(`/comment/${videoId}`);
      setComments(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error loading comments:", error);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!user || !newComment.trim()) return;

    setWarningMessage(null);
    setIsSubmitting(true);

    try {
      const payload = {
        videoid: videoId,
        userid: user._id || user.id,
        commentbody: newComment.trim(),
        usercommented: user.name || user.email,
        location: {
          city: "New Delhi",
          state: "Delhi",
          showLocation: showLocation,
        },
      };

      const res = await axiosInstance.post("/comment/postcomment", payload);

      if (res.data.comment) {
        toast.success("Comment posted successfully!");
        setNewComment("");
        loadComments();
      }
    } catch (error: any) {
      if (error.response?.data?.blocked) {
        setWarningMessage(error.response.data.message);
        toast.error("Comment blocked by community moderation guidelines.");
      } else {
        toast.error("Failed to post comment.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (!user) {
      toast.error("Please sign in to like comments.");
      return;
    }
    try {
      const res = await axiosInstance.post(`/comment/like/${commentId}`, {
        userId: user._id || user.id,
      });
      setComments((prev) => prev.map((c) => (c._id === commentId ? res.data : c)));
    } catch (error) {
      console.error("Like error:", error);
    }
  };

  const handleDislikeComment = async (commentId: string) => {
    if (!user) {
      toast.error("Please sign in to dislike comments.");
      return;
    }
    try {
      const res = await axiosInstance.post(`/comment/dislike/${commentId}`, {
        userId: user._id || user.id,
      });
      setComments((prev) => prev.map((c) => (c._id === commentId ? res.data : c)));
    } catch (error) {
      console.error("Dislike error:", error);
    }
  };

  const handleTranslate = async (commentId: string, text: string) => {
    const lang = selectedLang[commentId] || "hi";
    setTranslatingId(commentId);

    try {
      const res = await axiosInstance.post("/comment/translate", {
        text,
        targetLang: lang,
      });

      setTranslations((prev) => ({
        ...prev,
        [commentId]: res.data.translatedText,
      }));
    } catch (error) {
      toast.error("Failed to translate comment.");
    } finally {
      setTranslatingId(null);
    }
  };

  const handleReportComment = async () => {
    if (!reportModalCommentId) return;

    try {
      const res = await axiosInstance.post(`/comment/report/${reportModalCommentId}`, {
        userId: user?._id || "Anonymous",
        reason: reportReason || "Inappropriate content",
      });

      toast.success(res.data.message);
      setReportModalCommentId(null);
      setReportReason("");
      loadComments();
    } catch (error) {
      toast.error("Failed to report comment.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await axiosInstance.delete(`/comment/deletecomment/${id}`);
      if (res.data.comment) {
        setComments((prev) => prev.filter((c) => c._id !== id));
        toast.success("Comment deleted.");
      }
    } catch (error) {
      console.error("Delete comment error:", error);
    }
  };

  if (loading) {
    return <div className="p-4 text-gray-500 text-sm">Loading comments...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">{comments.length} Comments</h2>

      {/* Moderation Block Warning Banner */}
      {warningMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start gap-3 text-sm animate-pulse">
          <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold">Comment Blocked by Automated Moderation</h4>
            <p className="text-xs mt-0.5">{warningMessage}</p>
          </div>
        </div>
      )}

      {/* Add Comment Input */}
      {user ? (
        <div className="flex gap-4">
          <Avatar className="w-10 h-10">
            <AvatarImage src={user.image || ""} />
            <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <Textarea
              placeholder="Add a comment... (Multilingual supported)"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[80px] resize-none border-0 border-b-2 rounded-none focus-visible:ring-0"
            />

            <div className="flex items-center justify-between pt-2">
              {/* Optional Location Toggle */}
              <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showLocation}
                  onChange={(e) => setShowLocation(e.target.checked)}
                  className="rounded border-gray-300 accent-red-600"
                />
                <MapPin className="w-3.5 h-3.5 text-gray-500" />
                <span>Show state location publicly</span>
              </label>

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setNewComment("");
                    setWarningMessage(null);
                  }}
                  disabled={!newComment.trim()}
                >
                  Cancel
                </Button>
                <Button onClick={handleSubmitComment} disabled={!newComment.trim() || isSubmitting}>
                  Comment
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-500 italic">Sign in to add a comment.</p>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => {
            const likeCount = comment.likes?.length || 0;
            const dislikeCount = comment.dislikes?.length || 0;
            const isLiked = user && comment.likes?.includes(user._id || user.id);
            const isDisliked = user && comment.dislikes?.includes(user._id || user.id);

            return (
              <div key={comment._id} className="flex gap-4 group">
                <Avatar className="w-10 h-10 shrink-0">
                  <AvatarFallback className="bg-red-100 text-red-600 font-bold">
                    {comment.usercommented?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-gray-900">{comment.usercommented}</span>

                    {/* Optional Privacy Location Display */}
                    {comment.location?.showLocation && (
                      <span className="inline-flex items-center gap-1 text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        <MapPin className="w-3 h-3 text-red-500" />
                        {comment.location.state || "Delhi, IN"}
                      </span>
                    )}

                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(comment.commentedon))} ago
                    </span>

                    {/* Reported Badge */}
                    {comment.isReported && (
                      <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded">
                        Under Review
                      </span>
                    )}
                  </div>

                  {/* Comment Content */}
                  <p className="text-sm text-gray-800 break-words">{comment.commentbody}</p>

                  {/* Translated Text Display */}
                  {translations[comment._id] && (
                    <div className="mt-2 p-2.5 bg-gray-50 border-l-2 border-red-500 rounded text-xs text-gray-700 font-medium">
                      <span className="font-bold text-red-600 block mb-0.5">Translation:</span>
                      {translations[comment._id]}
                    </div>
                  )}

                  {/* Interactive Action Bar */}
                  <div className="flex items-center gap-4 pt-1 text-xs text-gray-600">
                    <button
                      onClick={() => handleLikeComment(comment._id)}
                      className={`flex items-center gap-1.5 hover:text-red-600 transition-colors ${
                        isLiked ? "text-red-600 font-bold" : ""
                      }`}
                    >
                      <ThumbsUp className="w-4 h-4" /> {likeCount > 0 && likeCount}
                    </button>

                    <button
                      onClick={() => handleDislikeComment(comment._id)}
                      className={`flex items-center gap-1.5 hover:text-red-600 transition-colors ${
                        isDisliked ? "text-red-600 font-bold" : ""
                      }`}
                    >
                      <ThumbsDown className="w-4 h-4" /> {dislikeCount > 0 && dislikeCount}
                    </button>

                    {/* Translation Dropdown */}
                    <div className="flex items-center gap-1">
                      <select
                        value={selectedLang[comment._id] || "hi"}
                        onChange={(e) =>
                          setSelectedLang({ ...selectedLang, [comment._id]: e.target.value })
                        }
                        className="text-[11px] bg-gray-100 border border-gray-200 rounded px-1.5 py-0.5 focus:outline-none"
                      >
                        {LANGUAGES.map((l) => (
                          <option key={l.code} value={l.code}>
                            {l.name}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() => handleTranslate(comment._id, comment.commentbody)}
                        disabled={translatingId === comment._id}
                        className="flex items-center gap-1 text-red-600 hover:underline font-semibold"
                      >
                        <Languages className="w-3.5 h-3.5" />
                        {translatingId === comment._id ? "Translating..." : "Translate"}
                      </button>
                    </div>

                    {/* Report Button */}
                    <button
                      onClick={() => setReportModalCommentId(comment._id)}
                      className="flex items-center gap-1 hover:text-amber-600 transition-colors text-gray-400"
                      title="Report Comment"
                    >
                      <Flag className="w-3.5 h-3.5" /> Report
                    </button>

                    {comment.userid === user?._id && (
                      <button onClick={() => handleDelete(comment._id)} className="text-red-500 hover:underline">
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Report Modal */}
      {reportModalCommentId && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-gray-900 rounded-2xl max-w-sm w-full p-5 shadow-2xl relative border">
            <button
              onClick={() => setReportModalCommentId(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-base text-gray-900 mb-2">Report Comment</h3>
            <p className="text-xs text-gray-500 mb-4">
              Reported comments will be flagged for review by community moderators.
            </p>

            <textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="Reason for reporting (e.g. Hate speech, Spam, Misinformation)..."
              className="w-full h-24 p-3 bg-gray-50 border rounded-xl text-xs focus:outline-none focus:border-red-500 mb-4 resize-none"
            />

            <div className="flex gap-2 justify-end">
              <Button variant="ghost" size="sm" onClick={() => setReportModalCommentId(null)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleReportComment} className="bg-red-600 hover:bg-red-700 text-white">
                Submit Report
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
