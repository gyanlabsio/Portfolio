import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/index';

export const fetchBlog = createAsyncThunk('blog/fetchBlog', async (slug, { rejectWithValue }) => {
    try {
        const response = await api.get(`/blog/${slug}`);
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch blog');
    }
});

export const toggleBlogLike = createAsyncThunk('blog/toggleLike', async ({ id, visitorId }, { rejectWithValue }) => {
    try {
        const response = await api.post(`/blog/${id}/like`, { visitorId });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to toggle like');
    }
});

export const fetchBlogComments = createAsyncThunk('blog/fetchComments', async (contentId, { rejectWithValue }) => {
    try {
        const response = await api.get(`/comments/post/${contentId}`);
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch comments');
    }
});

export const addBlogComment = createAsyncThunk('blog/addComment', async ({ contentId, authorName, text }, { rejectWithValue }) => {
    try {
        const response = await api.post('/comments', { contentId, authorName, text });
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to add comment');
    }
});

const initialState = {
    activeBlog: null,
    loading: false,
    error: null,
    comments: [],
    commentsLoading: false,
    commentStatus: null // 'success', 'pending_approval', 'error'
};

const blogSlice = createSlice({
    name: 'blog',
    initialState,
    reducers: {
        clearBlogState: (state) => {
            state.activeBlog = null;
            state.error = null;
            state.comments = [];
            state.commentStatus = null;
        },
        resetCommentStatus: (state) => {
            state.commentStatus = null;
        }
    },
    extraReducers: (builder) => {
        // Fetch blog
        builder.addCase(fetchBlog.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchBlog.fulfilled, (state, action) => {
            state.loading = false;
            state.activeBlog = action.payload;
        });
        builder.addCase(fetchBlog.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        // Toggle like
        builder.addCase(toggleBlogLike.fulfilled, (state, action) => {
            if (state.activeBlog) {
                state.activeBlog.likesCount = action.payload.likesCount;
            }
        });

        // Fetch comments
        builder.addCase(fetchBlogComments.pending, (state) => {
            state.commentsLoading = true;
        });
        builder.addCase(fetchBlogComments.fulfilled, (state, action) => {
            state.commentsLoading = false;
            state.comments = action.payload;
        });
        builder.addCase(fetchBlogComments.rejected, (state) => {
            state.commentsLoading = false;
        });

        // Add comment
        builder.addCase(addBlogComment.pending, (state) => {
            state.commentStatus = 'loading';
        });
        builder.addCase(addBlogComment.fulfilled, (state, action) => {
            state.commentStatus = 'pending_approval';
        });
        builder.addCase(addBlogComment.rejected, (state) => {
            state.commentStatus = 'error';
        });
    }
});

export const { clearBlogState, resetCommentStatus } = blogSlice.actions;
export default blogSlice.reducer;
