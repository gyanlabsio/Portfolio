import { useState, useEffect } from 'react';
import { MessageSquare, CheckCircle2, XCircle, Trash2, ExternalLink } from 'lucide-react';
import { getAllComments, updateCommentStatus, deleteComment } from '../../api/comments';
import { Link } from 'react-router-dom';

const CommentsAdmin = () => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAll = async () => {
        try {
            setLoading(true);
            const { data } = await getAllComments();
            setComments(data.data);
        } catch (error) {
            console.error('Failed to load comments', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAll();
    }, []);

    const handleUpdateStatus = async (id, status) => {
        try {
            await updateCommentStatus(id, { status });
            fetchAll();
        } catch (error) {
            console.error('Failed to update status', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this comment?')) {
            try {
                await deleteComment(id);
                fetchAll();
            } catch (error) {
                console.error('Failed to delete comment', error);
            }
        }
    };

    const pendingCount = comments.filter(c => c.status === 'PENDING').length;

    return (
        <div className='space-y-6'>
            <div className='glass-card flex flex-wrap items-center justify-between gap-4 rounded-3xl p-5 md:p-6'>
                <div>
                    <h1 className='font-nevera text-3xl tracking-[0.08em] text-[var(--ink)] flex items-center gap-3'>
                        Comments
                        {pendingCount > 0 && (
                            <span className="text-xs font-semibold bg-yellow-500/20 text-yellow-600 px-3 py-1 rounded-full font-sans tracking-normal">
                                {pendingCount} Pending
                            </span>
                        )}
                    </h1>
                    <p className='mt-1 text-sm text-[var(--ink-soft)]'>Moderate and review blog comments.</p>
                </div>
            </div>

            {loading ? (
                <div className='glass-card rounded-2xl py-14'>
                    <div className='mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)]/30 border-t-[var(--accent)]'></div>
                </div>
            ) : comments.length === 0 ? (
                <div className='glass-card rounded-2xl py-16 text-center'>
                    <MessageSquare className='mx-auto h-8 w-8 text-[var(--accent-2)]' />
                    <p className='mt-2 text-[var(--ink-soft)]'>No comments have been posted yet.</p>
                </div>
            ) : (
                <div className='space-y-4'>
                    {comments.map(c => (
                        <div key={c._id} className={`glass-card rounded-2xl p-5 transition hover:border-[var(--accent)]/30 ${c.status === 'PENDING' ? 'border-yellow-500/30 bg-yellow-500/5' : ''}`}>
                            <div className='flex items-start justify-between mb-3'>
                                <div className='flex items-center gap-3'>
                                    <div className='flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface)] font-nevera text-lg text-[var(--accent)]'>
                                        {c.authorName.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className='font-semibold text-[var(--ink)]'>
                                            {c.authorName}
                                            <span className={`ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                                c.status === 'APPROVED' ? 'bg-green-500/10 text-green-500' :
                                                c.status === 'REJECTED' ? 'bg-red-500/10 text-red-500' :
                                                'bg-yellow-500/10 text-yellow-500'
                                            }`}>
                                                {c.status}
                                            </span>
                                        </h3>
                                        <div className='text-xs text-[var(--ink-soft)] flex items-center gap-2'>
                                            {new Date(c.createdAt).toLocaleString()}
                                            {c.contentId && (
                                                <>
                                                    <span>&bull;</span>
                                                    <Link to={`/Blog/${c.contentId.slug}`} target="_blank" className='flex items-center gap-1 hover:text-[var(--accent-2)] transition'>
                                                        {c.contentId.title} <ExternalLink className="h-3 w-3" />
                                                    </Link>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className='flex items-center gap-2'>
                                    {c.status !== 'APPROVED' && (
                                        <button 
                                            onClick={() => handleUpdateStatus(c._id, 'APPROVED')} 
                                            title="Approve"
                                            className='rounded-lg p-2 text-green-500 hover:bg-green-500/10 transition'
                                        >
                                            <CheckCircle2 className='h-5 w-5' />
                                        </button>
                                    )}
                                    {c.status !== 'REJECTED' && (
                                        <button 
                                            onClick={() => handleUpdateStatus(c._id, 'REJECTED')} 
                                            title="Reject"
                                            className='rounded-lg p-2 text-yellow-500 hover:bg-yellow-500/10 transition'
                                        >
                                            <XCircle className='h-5 w-5' />
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => handleDelete(c._id)} 
                                        title="Delete"
                                        className='rounded-lg p-2 text-red-500 hover:bg-red-500/10 transition'
                                    >
                                        <Trash2 className='h-5 w-5' />
                                    </button>
                                </div>
                            </div>
                            <p className='text-sm text-[var(--ink)] whitespace-pre-wrap pl-13'>{c.text}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CommentsAdmin;
