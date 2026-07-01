const Loader = ({ text }) => {
    return (
        <div className='flex flex-col items-center justify-center py-10 gap-3 w-full'>
            <div className='h-8 w-8 animate-spin rounded-none border-2 border-[var(--accent)]/30 border-t-[var(--accent)]'></div>
            {text && <p className='text-sm text-[var(--ink-soft)] animate-pulse'>{text}</p>}
        </div>
    )
}

export default Loader
