import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

const BASE_URL = "https://khoya.onrender.com";

// Types
export interface Author {
  id: number;
  name: string;
  email: string;
}

export interface Reply {
  id: number;
  content: string;
  alertId: number;
  parentId?: number;
  upvotes: number;
  downvotes: number;
  score: number;
  replyCount: number;
  isEdited: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  author: Author;
  canEdit: boolean;
  canDelete: boolean;
}

export interface Comment extends Reply {
  replies?: Reply[];
}

export interface CommentsState {
  comments: Comment[];
  status: "idle" | "loading" | "success" | "error";
  error: string | null;
  alertVotes: Record<number, VoteData>;
  commentVotes: Record<number, VoteData>;
}

export interface VoteData {
  score: number;
  upvotes: number;
  downvotes: number;
  userVote: "UP" | "DOWN" | null;
}

export interface PostCommentParams {
  alertId: number;
  content: string;
  accessToken: string;
}

export interface PostReplyParams extends PostCommentParams {
  parentId: number;
}

export interface FetchCommentsParams {
  alertId: number;
}

export interface VoteAlertParams {
  alertId: number;
  type: "UP" | "DOWN";
  accessToken: string;
}

export interface VoteCommentParams {
  commentId: number;
  type: "UP" | "DOWN";
  accessToken: string;
}

export interface FetchAlertVotesParams {
  alertId: number;
}

export interface FetchCommentVotesParams {
  commentId: number;
}

// Thunks for fetching votes
export const fetchAlertVotes = createAsyncThunk<
  VoteData & { alertId: number },
  FetchAlertVotesParams
>("comments/fetchAlertVotes", async ({ alertId }, thunkAPI) => {
  const res = await fetch(`${BASE_URL}/api/social/alerts/${alertId}/votes`);
  if (!res.ok) {
    return thunkAPI.rejectWithValue("Failed to fetch alert votes");
  }
  const data = await res.json();
  return { ...data, alertId };
});

export const fetchCommentVotes = createAsyncThunk<
  VoteData & { commentId: number },
  FetchCommentVotesParams
>("comments/fetchCommentVotes", async ({ commentId }, thunkAPI) => {
  const res = await fetch(`${BASE_URL}/api/social/comments/${commentId}/votes`);
  if (!res.ok) {
    return thunkAPI.rejectWithValue("Failed to fetch comment votes");
  }
  const data = await res.json();
  return { ...data, commentId };
});

export const postComment = createAsyncThunk<Comment, PostCommentParams>(
  "comments/postComment",
  async ({ alertId, content, accessToken }, thunkAPI) => {
    const res = await fetch(
      `${BASE_URL}/api/social/alerts/${alertId}/comments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ content }),
      }
    );
    if (!res.ok) {
      return thunkAPI.rejectWithValue("Failed to post comment");
    }
    return (await res.json()) as Comment;
  }
);

export const postReply = createAsyncThunk<Comment, PostReplyParams>(
  "comments/postReply",
  async ({ alertId, content, parentId, accessToken }, thunkAPI) => {
    const res = await fetch(
      `${BASE_URL}/api/social/alerts/${alertId}/comments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ content, parentId }),
      }
    );
    if (!res.ok) {
      return thunkAPI.rejectWithValue("Failed to post reply");
    }
    return (await res.json()) as Comment;
  }
);

export const fetchComments = createAsyncThunk<Comment[], FetchCommentsParams>(
  "comments/fetchComments",
  async ({ alertId }, thunkAPI) => {
    const res = await fetch(
      `${BASE_URL}/api/social/alerts/${alertId}/comments`
    );
    if (!res.ok) {
      return thunkAPI.rejectWithValue("Failed to fetch comments");
    }
    return (await res.json()) as Comment[];
  }
);

export interface VoteResponse {
  score: number;
  upvotes: number;
  downvotes: number;
  action: "added" | "changed";
  userVote: "UP" | "DOWN" | null;
}

export const voteAlert = createAsyncThunk<
  VoteResponse & { alertId: number },
  VoteAlertParams
>("alerts/voteAlert", async ({ alertId, type, accessToken }, thunkAPI) => {
  const res = await fetch(`${BASE_URL}/api/social/alerts/${alertId}/vote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ type }),
  });
  if (!res.ok) {
    return thunkAPI.rejectWithValue("Failed to vote on alert");
  }
  const data = await res.json();
  return { ...data, alertId };
});

export const voteComment = createAsyncThunk<
  VoteResponse & { commentId: number },
  VoteCommentParams
>(
  "comments/voteComment",
  async ({ commentId, type, accessToken }, thunkAPI) => {
    const res = await fetch(
      `${BASE_URL}/api/social/comments/${commentId}/vote`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ type }),
      }
    );
    if (!res.ok) {
      return thunkAPI.rejectWithValue("Failed to vote on comment");
    }
    const data = await res.json();
    return { ...data, commentId };
  }
);

// Slice
const initialState: CommentsState = {
  comments: [],
  status: "idle",
  error: null,
  alertVotes: {},
  commentVotes: {},
};

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchComments.fulfilled,
        (state, action: PayloadAction<Comment[]>) => {
          state.status = "success";
          state.comments = action.payload;
        }
      )
      .addCase(fetchComments.rejected, (state, action) => {
        state.status = "error";
        state.error = action.error.message || "Failed to fetch comments";
      })
      .addCase(
        postComment.fulfilled,
        (state, action: PayloadAction<Comment>) => {
          state.comments.push(action.payload);
        }
      )
      .addCase(postReply.fulfilled, (state, action: PayloadAction<Comment>) => {
        const parentId = action.payload.parentId;
        const parentComment = state.comments.find((c) => c.id === parentId);
        if (parentComment) {
          if (!parentComment.replies) parentComment.replies = [];
          parentComment.replies.push(action.payload);
        }
      })
      .addCase(fetchAlertVotes.fulfilled, (state, action) => {
        const { alertId, ...voteData } = action.payload;
        state.alertVotes[alertId] = voteData;
      })
      .addCase(fetchCommentVotes.fulfilled, (state, action) => {
        const { commentId, ...voteData } = action.payload;
        state.commentVotes[commentId] = voteData;
      })
      .addCase(voteAlert.fulfilled, (state, action) => {
        const { alertId, ...voteData } = action.payload;
        state.alertVotes[alertId] = voteData;
      })
      .addCase(voteComment.fulfilled, (state, action) => {
        const { commentId, ...voteData } = action.payload;
        state.commentVotes[commentId] = voteData;
      });
  },
});

export default commentsSlice.reducer;
