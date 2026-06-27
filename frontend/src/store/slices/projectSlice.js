import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/index';

export const fetchProject = createAsyncThunk('project/fetchProject', async (slug, { rejectWithValue }) => {
    try {
        const response = await api.get(`/projects/${slug}`);
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch project');
    }
});

export const toggleProjectLike = createAsyncThunk('project/toggleLike', async ({ id, visitorId }, { rejectWithValue }) => {
    try {
        const response = await api.post(`/projects/${id}/like`, { visitorId });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to toggle like');
    }
});

export const fetchProjectComments = createAsyncThunk('project/fetchComments', async (projectId, { rejectWithValue }) => {
    try {
        const response = await api.get(`/comments/project/${projectId}`);
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch comments');
    }
});

export const addProjectComment = createAsyncThunk('project/addComment', async ({ projectId, authorName, text }, { rejectWithValue }) => {
    try {
        const response = await api.post('/comments', { projectId, authorName, text });
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to add comment');
    }
});

const initialState = {
    activeProject: null,
    loading: false,
    error: null,
    comments: [],
    commentsLoading: false,
    commentStatus: null // 'success', 'pending_approval', 'error'
};

const projectSlice = createSlice({
    name: 'project',
    initialState,
    reducers: {
        clearProjectState: (state) => {
            state.activeProject = null;
            state.error = null;
            state.comments = [];
            state.commentStatus = null;
        },
        resetCommentStatus: (state) => {
            state.commentStatus = null;
        }
    },
    extraReducers: (builder) => {
        // Fetch project
        builder.addCase(fetchProject.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchProject.fulfilled, (state, action) => {
            state.loading = false;
            state.activeProject = action.payload;
        });
        builder.addCase(fetchProject.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        // Toggle like (Optimistic UI handled directly in components or here)
        builder.addCase(toggleProjectLike.fulfilled, (state, action) => {
            if (state.activeProject) {
                // The backend returns { success, liked, likesCount }
                // For a more robust optimistic update, the component might dispatch an action or we can just rely on this
                state.activeProject.likesCount = action.payload.likesCount;
            }
        });

        // Fetch comments
        builder.addCase(fetchProjectComments.pending, (state) => {
            state.commentsLoading = true;
        });
        builder.addCase(fetchProjectComments.fulfilled, (state, action) => {
            state.commentsLoading = false;
            state.comments = action.payload;
        });
        builder.addCase(fetchProjectComments.rejected, (state) => {
            state.commentsLoading = false;
        });

        // Add comment
        builder.addCase(addProjectComment.pending, (state) => {
            state.commentStatus = 'loading';
        });
        builder.addCase(addProjectComment.fulfilled, (state, action) => {
            state.commentStatus = 'pending_approval';
            // We do not add the comment to the array because it needs approval first.
        });
        builder.addCase(addProjectComment.rejected, (state) => {
            state.commentStatus = 'error';
        });
    }
});

export const { clearProjectState, resetCommentStatus } = projectSlice.actions;
export default projectSlice.reducer;
