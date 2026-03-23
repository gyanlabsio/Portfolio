import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
import { login as loginApi } from '../../api/admin'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { loginAdmin } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            const { data } = await loginApi(email, password)
            loginAdmin(data.admin)
            navigate('/admin')
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='min-h-screen bg-[#f3f0e7] px-6 py-10'>
            <div className='pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_12%_10%,rgba(12,127,163,0.16),transparent_32%),radial-gradient(circle_at_88%_12%,rgba(239,62,47,0.18),transparent_30%)]' />

            <div className='mx-auto flex min-h-[80vh] w-full max-w-md items-center'>
                <div className='glass-card enter-fade w-full rounded-[30px] p-7 md:p-8'>
                    <h1 className='text-center font-nevera text-4xl tracking-[0.14em] text-[#ef3e2f]'>
                        CMS LOGIN
                    </h1>
                    <p className='mb-8 text-center text-sm text-[#5a6776]'>Portfolio Admin Panel</p>

                    <form onSubmit={handleSubmit} className='space-y-4'>
                        {error && (
                            <div className='rounded-2xl border border-red-600/20 bg-red-600/10 px-4 py-3 text-sm font-semibold text-red-600'>
                                {error}
                            </div>
                        )}
                        <label htmlFor='admin-email' className='sr-only'>Email</label>
                        <input
                            id='admin-email'
                            type='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder='Email'
                            autoComplete='email'
                            required
                            className='focus-ring w-full rounded-2xl border border-black/10 bg-white/85 px-4 py-3 text-[#1f2937] placeholder:text-[#748295] focus:border-[#0c7fa3]/55 focus:outline-none'
                        />
                        <label htmlFor='admin-password' className='sr-only'>Password</label>
                        <input
                            id='admin-password'
                            type='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder='Password'
                            autoComplete='current-password'
                            required
                            className='focus-ring w-full rounded-2xl border border-black/10 bg-white/85 px-4 py-3 text-[#1f2937] placeholder:text-[#748295] focus:border-[#0c7fa3]/55 focus:outline-none'
                        />
                        <button
                            type='submit'
                            disabled={loading}
                            className='focus-ring button-pop w-full rounded-full bg-[#ef3e2f] py-3 text-sm font-bold uppercase tracking-[0.12em] text-white hover:bg-[#d92f22] disabled:opacity-50'
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login
