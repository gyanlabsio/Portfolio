import { useState, useEffect } from 'react';
import { Heart, MessageSquare, Send } from 'lucide-react';
import { toggleLike } from '../api/blog';
import { getPostComments, addComment } from '../api/comments';

const BlogInteractions = ({ postId, initialLikes = [] }) => {
    const visitorId = localStorage.getItem('visitor_id');
    
    // Likes State
    const [likesCount, setLikesCount] = useState(initialLikes.length);
    const [isLiked, setIsLiked] = useState(visitorId ? initialLikes.includes(visitorId) : false);
    const [isLiking, setIsLiking] = useState(false);

    // Comments State
    const [comments, setComments] = useState([]);
    const [loadingComments, setLoadingComments] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [authorName, setAuthorName] = useState(localStorage.getItem('visitor_real_name') || '');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const { data } = await getPostComments(postId);
                setComments(data.data);
            } catch (error) {
                console.error('Failed to load comments', error);
            } finally {
                setLoadingComments(false);
            }
        };
        fetchComments();
    }, [postId]);

    const handleLike = async () => {
        if (!visitorId || isLiking) return;
        
        // Optimistic update
        setIsLiking(true);
        setIsLiked(!isLiked);
        setLikesCount(prev => isLiked ? prev - 1 : prev + 1);

        try {
            await toggleLike(postId, { visitorId });
        } catch (error) {
            // Revert on failure
            setIsLiked(isLiked);
            setLikesCount(prev => isLiked ? prev + 1 : prev - 1);
            console.error('Failed to toggle like', error);
        } finally {
            setIsLiking(false);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || !authorName.trim()) return;

        setIsSubmitting(true);
        try {
            await addComment({
                contentId: postId,
                authorName,
                text: newComment
            });
            setSubmitMessage('Comment submitted successfully! It is awaiting moderation.');
            setNewComment('');
            // Save name for future
            localStorage.setItem('visitor_real_name', authorName);
        } catch (error) {
            console.error('Failed to submit comment:', error);
            setSubmitMessage('Failed to submit comment. Please try again.');
        } finally {
            setIsSubmitting(false);
            setTimeout(() => setSubmitMessage(''), 5000);
        }
    };

    return (
        <div className="mt-12 border-t border-[var(--line)] pt-8">
            <div className="flex items-center gap-6 mb-10">
                <button 
                    onClick={handleLike}
                    className="flex items-center gap-2 group transition"
                    title={isLiked ? "Unlike" : "Like"}
                >
                    <div className={`p-3 rounded-none transition-all duration-300 ${isLiked ? 'bg-red-500/10' : 'bg-[var(--surface)] group-hover:bg-red-500/10'}`}>
                        <Heart 
                            className={`h-6 w-6 transition-all duration-300 ${isLiked ? 'fill-red-500 text-red-500 scale-110' : 'text-[var(--ink-soft)] group-hover:text-red-500 active:scale-95'}`} 
                        />
                    </div>
                    <span className={`font-semibold text-lg ${isLiked ? 'text-red-500' : 'text-[var(--ink-soft)]'}`}>
                        {likesCount}
                    </span>
                </button>

                <div className="flex items-center gap-2 text-[var(--ink-soft)]">
                    <div className="p-3 rounded-none bg-[var(--surface)]">
                        <MessageSquare className="h-6 w-6" />
                    </div>
                    <span className="font-semibold text-lg">{comments.length}</span>
                </div>
            </div>

            <div className=" rounded-none p-6 md:p-8">
                <h3 className="font-nevera text-2xl text-[var(--ink)] mb-6">Comments</h3>
                
                <form onSubmit={handleCommentSubmit} className="mb-10 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input 
                            type="text" 
                            placeholder="Your Name" 
                            value={authorName}
                            onChange={(e) => setAuthorName(e.target.value)}
                            required
                            maxLength={50}
                            className="w-full rounded-none border border-[var(--line)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--ink)] focus:border-[var(--accent-2)] focus:outline-none"
                        />
                    </div>
                    <div className="relative">
                        <textarea 
                            placeholder="Write a comment..." 
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            required
                            rows="3"
                            maxLength={500}
                            className="w-full rounded-none border border-[var(--line)] bg-[var(--bg)] px-4 py-3 pr-12 text-sm text-[var(--ink)] focus:border-[var(--accent-2)] focus:outline-none resize-none"
                        />
                        <button 
                            type="submit" 
                            disabled={isSubmitting || !newComment.trim() || !authorName.trim()}
                            className="absolute bottom-3 right-3 p-2 rounded-none bg-[var(--accent)] text-white hover:bg-[var(--accent-2)] disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            <Send className="h-4 w-4" />
                        </button>
                    </div>
                    {submitMessage && (
                        <p className={`text-sm font-semibold ${submitMessage.includes('awaiting') ? 'text-green-500' : 'text-red-500'}`}>
                            {submitMessage}
                        </p>
                    )}
                </form>

                <div className="space-y-6">
                    {loadingComments ? (
                        <div className="animate-pulse flex space-x-4">
                            <div className="rounded-none bg-[var(--surface)] h-10 w-10"></div>
                            <div className="flex-1 space-y-2 py-1">
                                <div className="h-3 bg-[var(--surface)] rounded w-1/4"></div>
                                <div className="h-3 bg-[var(--surface)] rounded w-3/4"></div>
                            </div>
                        </div>
                    ) : comments.length > 0 ? (
                        comments.map(comment => (
                            <div key={comment._id} className="flex gap-4">
                                <div className="flex-shrink-0 h-10 w-10 rounded-none bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center font-nevera text-lg">
                                    {comment.authorName.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-baseline gap-2 mb-1">
                                        <h4 className="font-semibold text-[var(--ink)]">{comment.authorName}</h4>
                                        <span className="text-xs text-[var(--ink-soft)]">
                                            {new Date(comment.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-[var(--ink)] whitespace-pre-wrap">{comment.text}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-[var(--ink-soft)] text-sm text-center py-4">No comments yet. Be the first to share your thoughts!</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BlogInteractions;
