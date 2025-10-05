"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAlerts } from "@/redux/alertsSlice";
import {
  fetchComments,
  postComment,
  postReply,
  voteAlert,
  voteComment,
  fetchAlertVotes,
  fetchCommentVotes,
} from "@/redux/commentsSlice";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  MapPin,
  User,
  Calendar,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  RefreshCw,
} from "lucide-react";
import Image from "next/image";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    setIsMobile(mediaQuery.matches);

    const listener = (event) => setIsMobile(event.matches);
    mediaQuery.addEventListener("change", listener);

    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  return isMobile;
}

export default function MissingPersonTab() {
  const dispatch = useDispatch();
  const { alerts, status, error } = useSelector((state) => state.alerts);
  const {
    comments,
    alertVotes,
    commentVotes,
    status: commentsStatus,
    error: commentsError,
  } = useSelector((state) => state.comments);
  const accessToken = useSelector((state) => state.auth.accessToken);

  const [activeAlertId, setActiveAlertId] = useState(null);
  const [commentInput, setCommentInput] = useState("");
  const [replyInput, setReplyInput] = useState("");
  const [replyParentId, setReplyParentId] = useState(null);

  const isMobile = useIsMobile();

  // FIXED: Only fetch once on mount, not on every navigation
  useEffect(() => {
    dispatch(fetchAlerts());
  }, []); // Empty dependency array - fetch only once

  useEffect(() => {
    if (activeAlertId) {
      dispatch(fetchComments({ alertId: activeAlertId }));
      dispatch(fetchAlertVotes({ alertId: activeAlertId }));
    }
  }, [activeAlertId, dispatch]);

  useEffect(() => {
    if (comments && comments.length > 0) {
      comments.forEach((comment) => {
        dispatch(fetchCommentVotes({ commentId: comment.id }));
        if (comment.replies) {
          comment.replies.forEach((reply) => {
            dispatch(fetchCommentVotes({ commentId: reply.id }));
          });
        }
      });
    }
  }, [comments, dispatch]);

  useEffect(() => {
    if (alerts.length > 0) {
      alerts.forEach((alert) => {
        dispatch(fetchAlertVotes({ alertId: alert.id }));
      });
    }
  }, [alerts, dispatch]);

  // Manual refresh function
  const handleManualRefresh = () => {
    dispatch(fetchAlerts({ forceRefresh: true }));
  };

  if (status === "loading" && alerts.length === 0) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <Skeleton className="h-64 md:h-48 w-full md:w-80" />
              <div className="flex-1 p-6 space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Error loading alerts: {error}</AlertDescription>
      </Alert>
    );
  }

  if (alerts.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardHeader>
          <CardTitle className="text-2xl">
            No Missing Persons Reported
          </CardTitle>
          <CardDescription className="text-base">
            There are currently no active missing person alerts in your area.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // FIXED: Removed setTimeout, direct dispatch after action
  const handleCommentSubmit = async (alertId, e) => {
    e.preventDefault();
    if (!commentInput.trim() || !accessToken) return;

    await dispatch(
      postComment({ alertId, content: commentInput, accessToken })
    );
    setCommentInput("");
    // Comment is already added to state by the reducer
  };

  const handleReplySubmit = async (alertId, parentId, e) => {
    e.preventDefault();
    if (!replyInput.trim() || !accessToken) return;

    await dispatch(
      postReply({ alertId, content: replyInput, parentId, accessToken })
    );
    setReplyInput("");
    setReplyParentId(null);
    // Reply is already added to state by the reducer
  };

  // FIXED: Removed setTimeout - optimistic updates handle this
  const handleVoteAlert = (alertId, type) => {
    if (!accessToken) return;
    dispatch(voteAlert({ alertId, type, accessToken }));
    // Vote count updates immediately via optimistic update in reducer
  };

  const handleVoteComment = (commentId, type) => {
    if (!accessToken) return;
    dispatch(voteComment({ commentId, type, accessToken }));
    // Vote count updates immediately via optimistic update in reducer
  };

  // FIXED: Pass alertId as parameter
  const renderCommentsSection = (alertId) => (
    <div className="mt-4 border-t pt-4 space-y-4 bg-muted/20 -mx-6 px-6 py-4 rounded-b-lg">
      {/* Comment List */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {commentsStatus === "loading" ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))}
          </div>
        ) : commentsError ? (
          <Alert variant="destructive">
            <AlertDescription>{commentsError}</AlertDescription>
          </Alert>
        ) : comments && comments.length > 0 ? (
          comments.map((comment) => {
            const commentVoteData = commentVotes[comment.id];

            return (
              <div
                key={comment.id}
                className="bg-background rounded-lg p-4 space-y-3 shadow-sm"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-semibold text-sm">
                      {comment.author.name}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed">{comment.content}</p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1 bg-muted/50 rounded-md p-0.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVoteComment(comment.id, "UP")}
                      disabled={!accessToken}
                      className="h-7 px-2 hover:bg-green-100 hover:text-green-700"
                    >
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      <span className="text-xs font-semibold">
                        {commentVoteData?.upvotes ?? comment.upvotes}
                      </span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVoteComment(comment.id, "DOWN")}
                      disabled={!accessToken}
                      className="h-7 px-2 hover:bg-red-100 hover:text-red-700"
                    >
                      <ThumbsDown className="h-3 w-3 mr-1" />
                      <span className="text-xs font-semibold">
                        {commentVoteData?.downvotes ?? comment.downvotes}
                      </span>
                    </Button>
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 bg-muted/50 rounded-md">
                    Score: {commentVoteData?.score ?? comment.score}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setReplyParentId(comment.id)}
                    className="h-7 text-xs ml-auto"
                  >
                    Reply
                  </Button>
                </div>

                {/* Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="ml-4 mt-3 space-y-3 border-l-2 border-primary/20 pl-4">
                    {comment.replies.map((reply) => {
                      const replyVoteData = commentVotes[reply.id];

                      return (
                        <div
                          key={reply.id}
                          className="bg-muted/30 rounded-lg p-3 space-y-2"
                        >
                          <div className="flex flex-col gap-1">
                            <span className="font-semibold text-xs">
                              {reply.author.name}
                            </span>
                            <p className="text-xs leading-relaxed">
                              {reply.content}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 bg-background/50 rounded-md p-0.5">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleVoteComment(reply.id, "UP")
                                }
                                disabled={!accessToken}
                                className="h-6 px-2 hover:bg-green-100 hover:text-green-700"
                              >
                                <ThumbsUp className="h-3 w-3 mr-1" />
                                <span className="text-xs">
                                  {replyVoteData?.upvotes ?? reply.upvotes}
                                </span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleVoteComment(reply.id, "DOWN")
                                }
                                disabled={!accessToken}
                                className="h-6 px-2 hover:bg-red-100 hover:text-red-700"
                              >
                                <ThumbsDown className="h-3 w-3 mr-1" />
                                <span className="text-xs">
                                  {replyVoteData?.downvotes ?? reply.downvotes}
                                </span>
                              </Button>
                            </div>
                            <span className="text-xs font-semibold">
                              Score: {replyVoteData?.score ?? reply.score}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Reply Form */}
                {replyParentId === comment.id && (
                  <form
                    onSubmit={(e) => handleReplySubmit(alertId, comment.id, e)}
                    className="flex gap-2 mt-3"
                  >
                    <Input
                      type="text"
                      value={replyInput}
                      onChange={(e) => setReplyInput(e.target.value)}
                      placeholder="Write a reply..."
                      className="flex-1"
                    />
                    <Button type="submit" size="sm">
                      Send
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setReplyParentId(null)}
                    >
                      Cancel
                    </Button>
                  </form>
                )}
              </div>
            );
          })
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>

      {/* New Comment Form */}
      {accessToken ? (
        <form
          onSubmit={(e) => handleCommentSubmit(alertId, e)}
          className="flex gap-2 pt-4 border-t"
        >
          <Input
            type="text"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1"
          />
          <Button type="submit" size="sm">
            Post
          </Button>
        </form>
      ) : (
        <p className="text-xs text-muted-foreground text-center py-4 border-t">
          Please log in to comment and vote
        </p>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Refresh Button */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={handleManualRefresh}
          disabled={status === "loading"}
          className="gap-2"
        >
          <RefreshCw
            className={`h-4 w-4 ${status === "loading" ? "animate-spin" : ""}`}
          />
          Refresh Alerts
        </Button>
      </div>

      {alerts.map((alert) => {
        const alertVoteData = alertVotes[alert.id];
        const isExpanded = activeAlertId === alert.id;

        return (
          <Card
            key={alert.id}
            className="overflow-hidden hover:shadow-xl transition-all duration-300 border-l-4 border-l-primary"
          >
            <div className="flex flex-col md:flex-row">
              {/* Image Section */}
              <div className="relative h-64 md:h-auto md:w-80 lg:w-96 bg-muted flex-shrink-0">
                <Image
                  src={alert.imageUrl || "/placeholder-user.jpg"}
                  alt={alert.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 right-4">
                  <Badge
                    variant={
                      alert.status === "active" ? "default" : "secondary"
                    }
                    className="text-sm px-3 py-1 shadow-lg"
                  >
                    {alert.status}
                  </Badge>
                </div>
              </div>

              {/* Content Section */}
              <div className="flex-1 flex flex-col">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl mb-2">{alert.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {alert.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex-1 space-y-4">
                  {/* Info Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="truncate">{alert.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="truncate">{alert.postedBy.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
                      <span>
                        {new Date(alert.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="flex flex-wrap items-center gap-3 pt-3 border-t">
                    {/* Voting Buttons */}
                    <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVoteAlert(alert.id, "UP")}
                        disabled={!accessToken}
                        className="h-8 px-3 hover:bg-green-100 hover:text-green-700"
                      >
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        <span className="font-semibold">
                          {alertVoteData?.upvotes ?? 0}
                        </span>
                      </Button>
                      <div className="h-6 w-px bg-border" />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVoteAlert(alert.id, "DOWN")}
                        disabled={!accessToken}
                        className="h-8 px-3 hover:bg-red-100 hover:text-red-700"
                      >
                        <ThumbsDown className="h-4 w-4 mr-1" />
                        <span className="font-semibold">
                          {alertVoteData?.downvotes ?? 0}
                        </span>
                      </Button>
                    </div>

                    <div className="flex items-center gap-2 text-sm font-semibold px-3 py-1 bg-muted/50 rounded-lg">
                      Score: {alertVoteData?.score ?? 0}
                    </div>

                    {/* Comments Toggle */}
                    <Button
                      variant={isExpanded ? "default" : "outline"}
                      size="sm"
                      onClick={() =>
                        setActiveAlertId(isExpanded ? null : alert.id)
                      }
                      className="ml-auto flex items-center gap-2"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>{isExpanded ? "Hide" : "Show"} Comments</span>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  {/* Comments Section - FIXED: Pass alert.id */}
                  {isExpanded && (
                    <div className="mt-4 border-t pt-4 space-y-4 bg-muted/20 -mx-6 px-6 py-4 rounded-b-lg">
                      {renderCommentsSection(alert.id)}
                    </div>
                  )}
                </CardContent>
              </div>
            </div>

            {/* Mobile Comments Modal - Clean white modal */}
            {isMobile && (
              <Dialog
                open={isExpanded}
                onOpenChange={(open) => {
                  if (!open) setActiveAlertId(null);
                }}
              >
                <DialogContent
                  className="w-[95vw] h-[85vh] max-w-lg p-0 flex flex-col"
                  onInteractOutside={(e) => e.preventDefault()}
                >
                  <DialogHeader className="px-6 pt-6 pb-4 border-b">
                    <DialogTitle className="text-xl font-semibold">
                      Comments
                    </DialogTitle>
                  </DialogHeader>
                  <div className="flex-1 overflow-hidden">
                    {renderCommentsSection(alert.id)}
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </Card>
        );
      })}
    </div>
  );
}
