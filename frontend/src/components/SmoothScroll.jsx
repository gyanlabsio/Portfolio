import { useEffect, useRef } from 'react'
import Lenis from 'lenis'

const SmoothScroll = ({ children }) => {
    const lenisRef = useRef(null)

    useEffect(() => {
        const lenis = new Lenis({
            duration: 2.5,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 0.6,
        })

        lenisRef.current = lenis
        window.lenis = lenis

        function raf(time) {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }

        requestAnimationFrame(raf)

        return () => {
            window.lenis = undefined
            lenis.destroy()
        }
    }, [])

    return children
}

export default SmoothScroll
