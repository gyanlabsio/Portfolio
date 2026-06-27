import { useState } from 'react';
import { MessageSquare, User, Clock } from 'lucide-react';

const CommentSection = ({ comments, commentsLoading, onAddComment, commentStatus }) => {
    const [name, setName] = useState('');
    const [text, setText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim() && text.trim() && onAddComment) {
            onAddComment({ authorName: name, text });
            setName('');
            setText('');
        }
    };

    return (
        <div className="mt-12 pt-8 border-t border-[var(--line)]">
            <div className="flex items-center gap-2 mb-8">
                <MessageSquare className="w-6 h-6 text-[var(--accent)]" />
                <h3 className="display-title text-2xl text-[var(--ink)]">
                    Comments ({comments.length})
                </h3>
            </div>

            {/* Comment Form */}
            <form onSubmit={handleSubmit} className="mb-10 glass-card p-6 rounded-[24px]">
                <h4 className="font-semibold text-[var(--ink)] mb-4">Leave a thought</h4>
                <div className="space-y-4">
                    <input 
                        type="text" 
                        placeholder="Your Name" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-[var(--ink)] placeholder:text-[var(--ink-soft)] focus:border-[var(--accent)] focus:outline-none"
                    />
                    <textarea 
                        placeholder="Your Comment" 
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        required
                        rows={3}
                        className="w-full resize-none rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-[var(--ink)] placeholder:text-[var(--ink-soft)] focus:border-[var(--accent)] focus:outline-none"
                    />
                    
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-[var(--ink-soft)]">
                            {commentStatus === 'pending_approval' && (
                                <span className="text-emerald-500 font-semibold">Your comment is awaiting moderation.</span>
                            )}
                            {commentStatus === 'error' && (
                                <span className="text-[#ed4956] font-semibold">Failed to post comment. Please try again.</span>
                            )}
                        </span>
                        
                        <button 
                            type="submit" 
                            disabled={commentStatus === 'loading' || !name.trim() || !text.trim()}
                            className="rounded-full bg-[var(--accent)] px-6 py-2.5 text-sm font-bold tracking-wide text-white transition hover:brightness-110 disabled:opacity-50"
                        >
                            {commentStatus === 'loading' ? 'Posting...' : 'Post Comment'}
                        </button>
                    </div>
                </div>
            </form>

            {/* Comments List */}
            <div className="space-y-6">
                {commentsLoading ? (
                    <div className="flex justify-center py-8">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--accent)]/30 border-t-[var(--accent)]"></div>
                    </div>
                ) : comments.length === 0 ? (
                    <div className="text-center py-8 border border-dashed border-[var(--line)] rounded-3xl">
                        <p className="text-[var(--ink-soft)]">No comments yet. Be the first to share your thoughts!</p>
                    </div>
                ) : (
                    comments.map(comment => (
                        <div key={comment._id} className="group flex gap-4 p-5 rounded-[24px] border border-[var(--line)] bg-[var(--surface)] hover:border-[var(--accent-2)] transition-colors">
                            <div className="shrink-0">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent)]/10 text-[var(--accent)]">
                                    <User className="h-5 w-5" />
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <h5 className="font-semibold text-[var(--ink)] truncate">{comment.authorName}</h5>
                                    <span className="flex items-center gap-1 text-xs text-[var(--ink-soft)] shrink-0">
                                        <Clock className="w-3 h-3" />
                                        {new Date(comment.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-sm leading-relaxed text-[var(--ink-soft)]">
                                    {comment.text}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CommentSection;
