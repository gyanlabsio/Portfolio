import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { recordEvent } from '../api/analytics'
import { v4 as uuidv4 } from 'uuid'
import { UAParser } from 'ua-parser-js'

const AnalyticsTracker = () => {
    const location = useLocation()

    useEffect(() => {
        // We only want to track public facing routes, not the admin panel itself
        if (location.pathname.startsWith('/admin')) return;
        
        // Don't track the Admin's own traffic
        if (localStorage.getItem('admin_token')) return;

        const trackPageView = async () => {
            try {
                // Get or create Visitor ID
                let visitorId = localStorage.getItem('visitor_id')
                if (!visitorId) {
                    visitorId = uuidv4()
                    localStorage.setItem('visitor_id', visitorId)
                }

                // Generate a Friendly Label (e.g., "Windows Chrome User")
                let visitorLabel = localStorage.getItem('visitor_label')
                if (!visitorLabel) {
                    const parser = new UAParser()
                    const result = parser.getResult()
                    const os = result.os.name || 'Unknown OS'
                    const browser = result.browser.name || 'Unknown Browser'
                    visitorLabel = `${os} ${browser} User`
                    localStorage.setItem('visitor_label', visitorLabel)
                }

                const realName = localStorage.getItem('visitor_real_name') || null;

                await recordEvent({
                    type: 'PAGE_VIEW',
                    page: location.pathname,
                    module: 'OTHER',
                    visitorId,
                    visitorLabel,
                    realName
                })
            } catch (error) {
                // Fail silently to not disrupt UX
                console.error('Analytics tracking failed', error)
            }
        }

        trackPageView()
    }, [location.pathname])

    return null // Invisible component
}

export default AnalyticsTracker
