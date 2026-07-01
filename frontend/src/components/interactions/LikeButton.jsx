import { useState } from 'react';
import { Heart } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const LikeButton = ({ initialLikesCount, initialIsLiked, onToggleLike }) => {
    const [isLiked, setIsLiked] = useState(initialIsLiked || false);
    const [likesCount, setLikesCount] = useState(initialLikesCount || 0);
    const [isAnimating, setIsAnimating] = useState(false);
    
    const [prevInitial, setPrevInitial] = useState({ initialIsLiked, initialLikesCount });
    
    // Update local state if props change (e.g. after fetch finishes)
    if (initialIsLiked !== prevInitial.initialIsLiked || initialLikesCount !== prevInitial.initialLikesCount) {
        setIsLiked(initialIsLiked);
        setLikesCount(initialLikesCount);
        setPrevInitial({ initialIsLiked, initialLikesCount });
    }

    const handleLike = () => {
        const newIsLiked = !isLiked;
        setIsLiked(newIsLiked);
        setLikesCount(prev => newIsLiked ? prev + 1 : prev - 1);
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 300); // Animation duration
        
        let vid = localStorage.getItem('visitorId');
        if (!vid) {
            vid = uuidv4();
            localStorage.setItem('visitorId', vid);
        }
        
        if (onToggleLike) {
            onToggleLike(vid);
        }
    };

    return (
        <button 
            onClick={handleLike}
            className="flex items-center gap-2 rounded-none border border-[var(--line)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold transition hover:border-[var(--accent)] group"
        >
            <div className="relative flex items-center justify-center w-6 h-6">
                <Heart 
                    className={`absolute inset-0 transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${
                        isLiked 
                        ? 'fill-[#ed4956] text-[#ed4956] scale-110' 
                        : 'text-[var(--ink-soft)] group-hover:text-[var(--accent)] scale-100'
                    } ${isAnimating && isLiked ? 'animate-ping' : ''}`}
                />
            </div>
            <span className={`transition-colors ${isLiked ? 'text-[#ed4956]' : 'text-[var(--ink)]'}`}>
                {likesCount} Likes
            </span>
        </button>
    );
};

export default LikeButton;
