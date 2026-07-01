import SEO from '../components/SEO';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsConditions = () => {
    return (
        <main className='pb-16 pt-8 md:pt-12'>
            <SEO title="Terms and Conditions - Gyanaranjan Das" description="Terms and Conditions for Gyanaranjan Das portfolio and services." />
            
            <div className='section-wrap'>
                <Link to='/' className='inline-flex items-center gap-2 rounded-none border border-[var(--line)] bg-[var(--surface)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--ink)] transition hover:border-[var(--accent-2)] hover:text-[var(--accent-2)] mb-5'>
                    <ArrowLeft className='h-3.5 w-3.5' />
                    Back to Home
                </Link>

                <div className=' rounded-none p-6 md:p-10'>
                    <h1 className='display-title text-3xl leading-tight text-[var(--ink)] sm:text-5xl mb-4'>Terms and Conditions</h1>
                    <p className='text-sm text-[var(--ink-soft)] mb-8'>Effective Date: June 8, 2026 | Last Updated: June 8, 2026</p>

                    <div className='prose prose-lg max-w-none text-[var(--ink)]
                        prose-headings:font-nevera prose-headings:text-[var(--ink)]
                        prose-p:leading-relaxed prose-a:text-[var(--accent-2)]
                        prose-strong:text-[var(--ink)] prose-ul:list-disc prose-ul:pl-6
                        prose-li:my-1'>

                        <h2>1. Introduction</h2>
                        <p>Welcome to the personal freelancer portfolio and technical consulting website of Gyanaranjan Das ("Website"). By accessing or using this Website, you agree to be bound by these Terms and Conditions ("Terms").</p>

                        <h2>2. Acceptance Of Terms</h2>
                        <p>Please read these Terms carefully before using the Website. By accessing, browsing, or using this Website, you acknowledge that you have read, understood, and agree to be legally bound by these Terms. If you do not agree to these Terms, you must not access or use the Website.</p>

                        <h2>3. Website Purpose</h2>
                        <p>This Website serves as a digital portfolio and informational platform designed to showcase my skills, past projects, case studies, technical articles, and professional services, which include Full Stack Development, Web Development, Software Engineering, API Development, Technical Consulting, Product Development, UI/UX Implementation, and Custom Software Solutions.</p>

                        <h2>4. Use Of The Website</h2>
                        <p>You agree to use the Website only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the Website. Prohibited behavior includes harassing or causing distress or inconvenience to any person, transmitting obscene or offensive content, or disrupting the normal flow of dialogue within the Website.</p>

                        <h2>5. Intellectual Property Rights</h2>
                        <p>Unless otherwise stated, all intellectual property rights in the Website and material on the Website (including text, graphics, logos, images, software, and the compilation thereof) are owned by Gyanaranjan Das or my licensors. Visitors may not copy, reproduce, republish, download, post, broadcast, transmit, make available to the public, or otherwise use Website content in any way except for personal, non-commercial use without prior written permission.</p>

                        <h2>6. Portfolio Projects And Case Studies</h2>
                        <p>The portfolio projects and case studies displayed on this Website represent past work. Please note:</p>
                        <ul>
                            <li>These representations are for informational and demonstration purposes only.</li>
                            <li>Portfolio work may contain third-party trademarks or materials owned by their respective parties.</li>
                            <li>Results, metrics, or performance outcomes shown in case studies may not be typical. Past performance does not guarantee future outcomes.</li>
                            <li>Project details may be simplified, anonymized, or modified for presentation and confidentiality purposes.</li>
                        </ul>

                        <h2>7. Services Information Disclaimer</h2>
                        <p>The services listed on this Website are informational overviews of my capabilities. Displaying a service does not constitute an offer, nor does it create a contractual relationship. Service availability may change without notice. The final scope, pricing, and deliverables for any project are determined strictly through separate, mutually signed agreements.</p>

                        <h2>8. Quotations And Proposals Disclaimer</h2>
                        <p>Any quotes, estimates, or proposals provided via the Website, email, or contact forms are informational and non-binding until a formal agreement is executed. Scope, pricing, and timelines remain subject to change prior to the execution of a formal contract.</p>

                        <h2>9. Client Engagement Disclaimer</h2>
                        <p>Using this Website or submitting a project inquiry does not establish a client-consultant relationship. A formal client relationship is only established upon the execution of a separate, written contract. Furthermore, payment terms are defined separately within those client agreements; the information on this Website does not constitute a binding payment agreement.</p>

                        <h2>10. Third-Party Links And Resources</h2>
                        <p>This Website may contain links to third-party websites and resources (including GitHub repositories, live project links, or external articles). These links are provided for your convenience only. I have no control over the contents of those sites or resources and accept no responsibility for them or for any loss or damage that may arise from your use of them.</p>

                        <h2>11. User Communications And Contact Forms</h2>
                        <p>When you submit information via contact forms or lead management systems on the Website, you represent that the information is accurate. Submission of an inquiry does not guarantee an engagement or a response. Responses are provided entirely at my discretion.</p>

                        <h2>12. Limitation Of Liability</h2>
                        <p>To the maximum extent permitted by applicable law, in no event shall Gyanaranjan Das be liable for any indirect, punitive, incidental, special, consequential, or exemplary damages, including without limitation damages for loss of profits, goodwill, use, data, or other intangible losses, arising out of or relating to the use of, or inability to use, this Website.</p>

                        <h2>13. No Guarantees Or Warranties</h2>
                        <p>The Website and all information, content, materials, and services included on or otherwise made available to you through the Website are provided on an "as is" and "as available" basis, unless otherwise specified in writing. I make no representations or warranties of any kind, express or implied, as to the operation of the Website or the information, content, materials, or services included.</p>

                        <h2>14. Availability Of Services</h2>
                        <p>I reserve the right to withdraw or amend this Website, and any service or material I provide on the Website, in my sole discretion without notice. I will not be liable if for any reason all or any part of the Website is unavailable at any time or for any period.</p>

                        <h2>15. Termination Of Access</h2>
                        <p>I reserve the right, in my sole discretion, to terminate or restrict your access to all or part of the Website, without notice, for any or no reason, including without limitation, any violation of these Terms.</p>

                        <h2>16. Indemnification</h2>
                        <p>You agree to defend, indemnify, and hold harmless Gyanaranjan Das from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to your violation of these Terms or your use of the Website.</p>

                        <h2>17. Governing Law</h2>
                        <p>These Terms shall be governed by and construed in accordance with the applicable laws of your jurisdiction of residence or business operation, without giving effect to any choice or conflict of law provision or rule.</p>

                        <h2>18. Changes To These Terms</h2>
                        <p>I may revise and update these Terms from time to time in my sole discretion. All changes are effective immediately when posted and apply to all access to and use of the Website thereafter. Your continued use of the Website following the posting of revised Terms means that you accept and agree to the changes.</p>

                        <h2>19. Contact Information</h2>
                        <p>If you have any questions or comments about these Terms and Conditions, please contact me at:</p>
                        <p><strong>Email:</strong> hello@gyanaranjandas.me<br />
                        <strong>Website:</strong> <a href="https://gyanaranjandas.me">gyanaranjandas.me</a></p>

                    </div>
                </div>
            </div>
        </main>
    );
};

export default TermsConditions;
