import SEO from '../components/SEO';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
    return (
        <main className='pb-16 pt-8 md:pt-12'>
            <SEO title="Privacy Policy - Gyanaranjan Das" description="Privacy Policy for Gyanaranjan Das portfolio and services." />
            
            <div className='section-wrap'>
                <Link to='/' className='inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--ink)] transition hover:border-[var(--accent-2)] hover:text-[var(--accent-2)] mb-5'>
                    <ArrowLeft className='h-3.5 w-3.5' />
                    Back to Home
                </Link>

                <div className='glass-card rounded-[30px] p-6 md:p-10'>
                    <h1 className='display-title text-3xl leading-tight text-[var(--ink)] sm:text-5xl mb-4'>Privacy Policy</h1>
                    <p className='text-sm text-[var(--ink-soft)] mb-8'>Effective Date: June 8, 2026 | Last Updated: June 8, 2026</p>

                    <div className='prose prose-lg max-w-none text-[var(--ink)]
                        prose-headings:font-nevera prose-headings:text-[var(--ink)]
                        prose-p:leading-relaxed prose-a:text-[var(--accent-2)]
                        prose-strong:text-[var(--ink)] prose-ul:list-disc prose-ul:pl-6
                        prose-li:my-1'>
                        
                        <h2>1. Introduction</h2>
                        <p>Welcome to my personal freelancer portfolio and technical consulting website ("Website"). I am committed to respecting your privacy and protecting your personal data. This Privacy Policy ("Policy") explains how I collect, use, disclose, and safeguard your information when you visit my Website, read my blog, view my portfolio, or engage my professional services (collectively, the "Services").</p>
                        <p>Please read this Privacy Policy carefully. By accessing or using the Website, you acknowledge that you have read, understood, and agree to be bound by all the terms outlined in this Privacy Policy. If you do not agree with these terms, please do not access the Website.</p>

                        <h2>2. Information We Collect</h2>
                        <p>I collect personal information that you voluntarily provide to me when expressing an interest in obtaining information about me or my products and services, or otherwise contacting me. I also automatically collect certain information when you visit, use, or navigate the Website.</p>

                        <h2>3. Information You Voluntarily Provide</h2>
                        <p>The personal information that I collect depends on the context of your interactions with the Website. This information may include:</p>
                        <ul>
                            <li><strong>Contact Form Data:</strong> When you reach out via contact forms, I collect your Name, Email Address, Phone Number, Company Name, and any text you provide in your Messages.</li>
                            <li><strong>Lead Management Data:</strong> When you inquire about potential projects or consulting services, I collect project requirements, budget information, timelines, and keep a record of our communications to better serve your needs.</li>
                            <li><strong>User Interactions:</strong> Comments on blog posts, testimonials you submit, or files and documents you upload as part of a project inquiry.</li>
                        </ul>
                        <p><em>Note: I do not intentionally collect or process payment card information, government identification documents, biometric data, or other highly sensitive personal information through this Website.</em></p>

                        <h2>4. Information Automatically Collected</h2>
                        <p>I automatically collect certain information when you visit, use, or navigate the Website. This information does not reveal your specific identity (like your name or contact information) but may include device and usage information, such as:</p>
                        <ul>
                            <li><strong>Log and Usage Data:</strong> Service-related, diagnostic, usage, and performance information collected when you access or use the Website, including page visits, click events, referring pages, and exit pages.</li>
                            <li><strong>Device Data:</strong> Information about your computer, phone, tablet, or other device you use to access the Website, including your IP address, browser type, and operating system.</li>
                        </ul>

                        <h2>5. How We Use Information</h2>
                        <p>I use personal information collected via the Website for a variety of business purposes described below:</p>
                        <ul>
                            <li><strong>To Respond to Inquiries and Provide Services:</strong> To respond to your questions, evaluate project requirements, and provide requested technical consulting, web development, or software engineering services.</li>
                            <li><strong>To Manage Client Relationships:</strong> To organize and manage leads, proposals, and communications efficiently.</li>
                            <li><strong>To Improve the Website:</strong> To analyze usage trends, understand how users interact with portfolio items and blog articles, and improve the overall user experience and Website functionality.</li>
                            <li><strong>To Protect the Website:</strong> To keep the Website safe and secure, including fraud monitoring and prevention.</li>
                            <li><strong>To Publish Testimonials:</strong> With your explicit consent, I may post testimonials on the Website that may contain personal information like your name or company.</li>
                        </ul>

                        <h2>6. Legal Basis For Processing (Where Applicable)</h2>
                        <p>If you are located in the European Economic Area (EEA) or the United Kingdom (UK), my legal basis for collecting and using the personal information described above depends on the personal information concerned and the specific context in which it is collected:</p>
                        <ul>
                            <li><strong>Consent:</strong> I may process your data if you have given me specific consent to use your personal information for a specific purpose (e.g., publishing a testimonial).</li>
                            <li><strong>Performance of a Contract:</strong> Where I have entered into a contract with you, I may process your personal information to fulfill the terms of our contract (e.g., providing freelance development services).</li>
                            <li><strong>Legitimate Interests:</strong> I may process your data when it is reasonably necessary to achieve my legitimate business interests, provided those interests do not outweigh your fundamental rights and freedoms (e.g., website analytics and lead management).</li>
                        </ul>

                        <h2>7. Cookies And Tracking Technologies</h2>
                        <p>I may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. Cookies are small data files stored on your hard drive or in device memory that help me improve the Website and your experience. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, some portions of the Website may not function properly.</p>

                        <h2>8. Analytics And Website Performance Monitoring</h2>
                        <p>I utilize analytics tracking software to monitor and analyze web traffic and user behavior on the Website. This allows me to understand which blog articles, case studies, or portfolio items are most engaging. The analytics data collected (such as page visits, click events, and browser information) is generally aggregated and anonymized, helping to guide the future content and design of the Website without tracking you across the wider internet.</p>

                        <h2>9. Third-Party Services</h2>
                        <p>To operate this Website efficiently, I utilize select third-party service providers. These third parties have access to your Personal Data only to perform these tasks on my behalf and are obligated not to disclose or use it for any other purpose. These may include:</p>
                        <ul>
                            <li><strong>Cloudinary:</strong> For image optimization and file storage (e.g., portfolio images or file uploads).</li>
                            <li><strong>Hosting & Infrastructure Providers:</strong> To securely host the Website and deliver content globally (CDN).</li>
                            <li><strong>Email Service Providers:</strong> To route and manage emails sent via contact forms.</li>
                            <li><strong>Analytics Providers:</strong> To track and report website traffic.</li>
                        </ul>

                        <h2>10. Data Sharing And Disclosure</h2>
                        <p>I do not sell, rent, or trade your personal information. I may share information in the following situations:</p>
                        <ul>
                            <li><strong>With Service Providers:</strong> I may share your information with third-party vendors, service providers, or contractors who perform services for me or on my behalf and require access to such information to do that work (as listed in Section 9).</li>
                            <li><strong>For Legal Obligations:</strong> I may disclose your information where I am legally required to do so in order to comply with applicable law, governmental requests, a judicial proceeding, court order, or legal process.</li>
                            <li><strong>To Protect Rights:</strong> I may disclose your information where I believe it is necessary to investigate, prevent, or take action regarding potential violations of my policies, suspected fraud, situations involving potential threats to the safety of any person, or as evidence in litigation in which I am involved.</li>
                        </ul>

                        <h2>11. Data Retention</h2>
                        <p>I will only keep your personal information for as long as it is necessary for the purposes set out in this Privacy Policy, unless a longer retention period is required or permitted by law (such as tax, accounting, or other legal requirements). When I have no ongoing legitimate business need to process your personal information, I will either delete or anonymize such information.</p>

                        <h2>12. Data Security</h2>
                        <p>I have implemented commercially reasonable and appropriate technical and organizational security measures designed to protect the security of any personal information I process. However, despite my safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure. Therefore, while I strive to use commercially acceptable means to protect your personal information, I cannot guarantee its absolute security.</p>

                        <h2>13. International Data Transfers</h2>
                        <p>The Website is accessible globally. If you are accessing the Website from outside the region where my servers or third-party service providers are located, please be aware that your information may be transferred to, stored, and processed in a country whose data protection laws may differ from those in your jurisdiction. By using the Website, you consent to the transfer of your information to these facilities.</p>

                        <h2>14. Your Privacy Rights</h2>
                        <p>Depending on your geographic location, you may have certain rights regarding your personal information. These may include the right to: request access and obtain a copy of your personal information, request rectification of inaccurate information, request erasure of your personal information, restrict the processing of your personal information, or object to the processing of your information. To exercise these rights, please contact me.</p>

                        <h2>15. GDPR Rights</h2>
                        <p>If you are a resident of the European Economic Area (EEA) or the United Kingdom (UK), you have the right to complain to a data protection authority about my collection and use of your personal information. Furthermore, you have the right to withdraw your consent at any time if I am relying on consent to process your personal information.</p>

                        <h2>16. CCPA Rights</h2>
                        <p>If you are a resident of California, the California Consumer Privacy Act (CCPA) grants you specific rights regarding your personal information. You have the right to request that I disclose certain information to you about my collection and use of your personal information over the past 12 months. You also have the right to request the deletion of your personal information, subject to certain exceptions. I will not discriminate against you for exercising any of your CCPA rights.</p>

                        <h2>17. Children's Privacy</h2>
                        <p>The Website and my services are not directed to or intended for children under the age of 16. I do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided me with personal information, please contact me immediately so that I can take steps to securely delete such data from my records.</p>

                        <h2>18. Third-Party Links</h2>
                        <p>The Website, particularly the blog and portfolio sections, may contain links to third-party websites, applications, or services that are not owned or controlled by me. I am not responsible for the privacy practices or the content of these third-party sites. I encourage you to read the privacy policies of any third-party websites you visit.</p>

                        <h2>19. Changes To This Privacy Policy</h2>
                        <p>I may update this Privacy Policy from time to time to reflect changes to my practices or for other operational, legal, or regulatory reasons. The updated version will be indicated by an updated "Last Updated" date and the updated version will be effective as soon as it is accessible. I encourage you to review this Privacy Policy frequently to be informed of how I am protecting your information.</p>

                        <h2>20. Contact Information</h2>
                        <p>If you have questions, comments, or concerns about this Privacy Policy, or if you would like to exercise your privacy rights, please contact me at:</p>
                        <p><strong>Email:</strong> hello@gyanaranjandas.me<br />
                        <strong>Website:</strong> <a href="https://gyanaranjandas.me">gyanaranjandas.me</a></p>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default PrivacyPolicy;
