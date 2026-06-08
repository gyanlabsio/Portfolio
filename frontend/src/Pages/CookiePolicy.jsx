import SEO from '../components/SEO';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const CookiePolicy = () => {
    return (
        <main className='pb-16 pt-8 md:pt-12'>
            <SEO title="Cookie Policy - Gyanaranjan Das" description="Cookie Policy for Gyanaranjan Das portfolio and services." />
            
            <div className='section-wrap'>
                <Link to='/' className='inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--ink)] transition hover:border-[var(--accent-2)] hover:text-[var(--accent-2)] mb-5'>
                    <ArrowLeft className='h-3.5 w-3.5' />
                    Back to Home
                </Link>

                <div className='glass-card rounded-[30px] p-6 md:p-10'>
                    <h1 className='display-title text-3xl leading-tight text-[var(--ink)] sm:text-5xl mb-4'>Cookie Policy</h1>
                    <p className='text-sm text-[var(--ink-soft)] mb-8'>Effective Date: June 8, 2026 | Last Updated: June 8, 2026</p>

                    <div className='prose prose-lg max-w-none text-[var(--ink)]
                        prose-headings:font-nevera prose-headings:text-[var(--ink)]
                        prose-p:leading-relaxed prose-a:text-[var(--accent-2)]
                        prose-strong:text-[var(--ink)] prose-ul:list-disc prose-ul:pl-6
                        prose-li:my-1'>

                        <h2>1. Introduction</h2>
                        <p>Welcome to the personal freelancer portfolio website of Gyanaranjan Das ("Website"). This Cookie Policy explains how and why cookies, web beacons, pixels, and other similar tracking technologies may be stored on and accessed from your device when you use or visit this Website. This policy should be read alongside my Privacy Policy.</p>

                        <h2>2. What Cookies Are</h2>
                        <p>Cookies are small text files stored on your computer, tablet, or mobile device by your web browser when you visit a website. They are widely used to make websites work efficiently, remember your preferences, and provide information to the owners of the site. They help ensure you get the best possible experience when browsing.</p>

                        <h2>3. Types Of Cookies Used</h2>
                        <p>This Website uses first-party cookies (set directly by my Website) and may use third-party cookies (set by external service providers). To provide you with a clean, privacy-respecting experience, I do not intentionally use advertising networks, behavioral tracking, or data broker services. The cookies used fall into the following necessary and functional categories.</p>

                        <h2>4. Essential Cookies</h2>
                        <p>These cookies are strictly necessary to provide you with services available through the Website and to use some of its core features. Because these cookies are essential to deliver the Website, you cannot refuse them without impacting how the site functions. They are used for:</p>
                        <ul>
                            <li><strong>Security:</strong> Protecting against malicious activity and safeguarding user interactions.</li>
                            <li><strong>Session Management:</strong> Keeping you logged in to administrative areas (if applicable) and routing traffic properly.</li>
                            <li><strong>Website Functionality:</strong> Ensuring core features, such as contact forms and file uploads, process requests correctly.</li>
                        </ul>

                        <h2>5. Analytics Cookies</h2>
                        <p>Analytics cookies collect information that is used in aggregate form to help me understand how the Website is being used and how effective my content is. Analytics data is generally anonymized and helps me improve the overall visitor experience. They track things like:</p>
                        <ul>
                            <li><strong>Page Views:</strong> Which blog articles, case studies, or portfolio items are visited most often.</li>
                            <li><strong>Navigation Tracking:</strong> How visitors move around the site, helping me improve site architecture.</li>
                            <li><strong>Performance Measurement:</strong> Tracking engagement metrics like time spent on a service page.</li>
                        </ul>

                        <h2>6. Performance Cookies</h2>
                        <p>These cookies are used to enhance the performance and functionality of the Website but are non-essential to its use. However, without these cookies, certain functionality may become unavailable. They assist with:</p>
                        <ul>
                            <li><strong>Site Optimization:</strong> Caching assets to ensure pages load quickly.</li>
                            <li><strong>Error Monitoring:</strong> Identifying and logging technical errors so they can be fixed promptly.</li>
                            <li><strong>Load Balancing:</strong> Distributing traffic to maintain site stability.</li>
                        </ul>

                        <h2>7. Preference Cookies</h2>
                        <p>Preference cookies enable a website to remember information that changes the way the website behaves or looks. These are designed to improve your user experience by remembering your specific choices. They handle:</p>
                        <ul>
                            <li><strong>User Preferences:</strong> Saving your name in the comment form for future visits.</li>
                            <li><strong>Interface Settings:</strong> Remembering if you dismissed a notification banner.</li>
                            <li><strong>Theme Preferences:</strong> Storing your choice of light mode or dark mode.</li>
                        </ul>

                        <h2>8. Third-Party Services</h2>
                        <p>In some cases, I use trusted third-party providers to enhance the Website's functionality. These providers may place cookies on your device when you interact with their services on my Website. These may include:</p>
                        <ul>
                            <li><strong>Analytics Providers:</strong> Tools used to gather aggregated traffic and usage statistics.</li>
                            <li><strong>CDN Providers:</strong> Content Delivery Networks that place functional cookies to optimize the delivery of images and scripts.</li>
                            <li><strong>Hosting Providers:</strong> Infrastructure providers that set security and load-balancing cookies.</li>
                            <li><strong>Embedded Content Providers:</strong> Third-party embeds (like external videos or code snippets) that may use their own functional cookies.</li>
                        </ul>

                        <h2>9. Managing Cookie Preferences</h2>
                        <p>You have the right to decide whether to accept or reject non-essential cookies. You can generally manage your cookie preferences by modifying your browser settings. Because the means by which you can refuse cookies through your web browser controls vary from browser to browser, you should visit your browser's help menu for more information.</p>

                        <h2>10. Browser Controls</h2>
                        <p>Most modern web browsers allow you to control cookies through their settings preferences. You can configure your browser to:</p>
                        <ul>
                            <li>Accept or reject all cookies.</li>
                            <li>Delete stored cookies.</li>
                            <li>Notify you when a cookie is issued.</li>
                            <li>Block third-party cookies.</li>
                        </ul>
                        <p>Please note that if you choose to reject or disable cookies, you may still use my Website, though your access to some functionality and areas may be restricted.</p>

                        <h2>11. Changes To This Cookie Policy</h2>
                        <p>I may update this Cookie Policy from time to time in order to reflect changes to the cookies I use or for other operational, legal, or regulatory reasons. Please revisit this Cookie Policy regularly to stay informed about my use of cookies and related technologies. The date at the top of this Policy indicates when it was last updated.</p>

                        <h2>12. Contact Information</h2>
                        <p>If you have any questions about my use of cookies or other technologies, please contact me at:</p>
                        <p><strong>Email:</strong> gyanlabs.io@gmail.com<br />
                        <strong>Website:</strong> <a href="https://gyanaranjandas.me">gyanaranjandas.me</a></p>

                    </div>
                </div>
            </div>
        </main>
    );
};

export default CookiePolicy;
