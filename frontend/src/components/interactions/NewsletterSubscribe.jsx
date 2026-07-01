import { useState } from 'react';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import api from '../../api';

const NewsletterSubscribe = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState(null); // 'loading', 'success', 'error'
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim()) return;

        setStatus('loading');
        try {
            const { data } = await api.post('/subscribers/subscribe', { email });
            if (data.success) {
                setStatus('success');
                setMessage(data.message);
                setEmail('');
            }
        } catch (error) {
            setStatus('error');
            setMessage(error.response?.data?.message || 'Failed to subscribe. Please try again.');
        }
    };

    return (
        <div className=" rounded-none p-8 border border-[var(--line)] bg-[var(--surface)]  space-y-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-none bg-[var(--accent)]/10 text-[var(--accent)]">
                <Mail className="h-6 w-6" />
            </div>

            <div className="space-y-2">
                <h3 className="font-nevera text-2xl text-[var(--ink)] tracking-wide">
                    Weekly Insights
                </h3>
                <p className="text-sm text-[var(--ink-soft)] leading-relaxed">
                    Subscribe to receive my latest writing on software engineering, design patterns, and tech architecture. No spam.
                </p>
            </div>

            {status === 'success' ? (
                <div className="flex items-start gap-3 rounded-none bg-emerald-500/10 border border-emerald-500/20 p-4 text-emerald-500 text-sm">
                    <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                    <span>{message}</span>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="relative">
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={status === 'loading'}
                            className="w-full rounded-none border border-[var(--line)] bg-[var(--bg)] px-4 py-3.5 pr-12 text-sm text-[var(--ink)] placeholder:text-[var(--ink-soft)] focus:border-[var(--accent)] focus:outline-none transition"
                        />
                        <button
                            type="submit"
                            disabled={status === 'loading' || !email}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-none bg-[var(--accent)] text-white hover:brightness-110 disabled:opacity-50 transition"
                        >
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    </div>

                    {status === 'error' && (
                        <p className="text-xs font-semibold text-[#ed4956]">{message}</p>
                    )}
                </form>
            )}
        </div>
    );
};

export default NewsletterSubscribe;
