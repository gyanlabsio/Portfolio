const crypto = require('crypto');
const Subscriber = require('../models/Subscriber');
const sendEmail = require('../utils/sendEmail');

// Helper to compile newsletter blocks into table-based responsive HTML
const compileBlocksToHTML = (blocks, themeColor, unsubscribeLink) => {
    let contentHtml = '';

    blocks.forEach(block => {
        switch (block.type) {
            case 'header':
                contentHtml += `
                    <tr>
                        <td align="center" style="padding: 20px 0; background-color: #f8fafc; border-bottom: 2px solid ${themeColor || '#0c7fa3'};">
                            ${block.logoUrl ? `<img src="${block.logoUrl}" alt="Logo" style="max-height: 50px; margin-bottom: 10px; display: block;" />` : ''}
                            <h1 style="font-family: Arial, sans-serif; font-size: 24px; color: #1e293b; margin: 0;">${block.title || 'Newsletter'}</h1>
                        </td>
                    </tr>
                `;
                break;
            case 'text':
                contentHtml += `
                    <tr>
                        <td style="padding: 20px; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #334155;">
                            ${block.content || ''}
                        </td>
                    </tr>
                `;
                break;
            case 'button':
                contentHtml += `
                    <tr>
                        <td align="center" style="padding: 20px;">
                            <table border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td align="center" style="border-radius: 8px;" bgcolor="${themeColor || '#0c7fa3'}">
                                        <a href="${block.url || '#'}" target="_blank" style="font-size: 16px; font-family: Arial, sans-serif; color: #ffffff; text-decoration: none; border-radius: 8px; padding: 12px 30px; border: 1px solid ${themeColor || '#0c7fa3'}; display: inline-block; font-weight: bold;">
                                            ${block.label || 'Click Here'}
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                `;
                break;
            case 'image':
                contentHtml += `
                    <tr>
                        <td align="center" style="padding: 10px 20px;">
                            <img src="${block.imageUrl}" alt="Newsletter Image" style="max-width: 100%; height: auto; display: block; border-radius: 12px; border: 1px solid #e2e8f0;" />
                        </td>
                    </tr>
                `;
                break;
            case 'spacer':
                contentHtml += `
                    <tr>
                        <td style="height: ${block.height || '20'}px; line-height: ${block.height || '20'}px; font-size: 1px;">&nbsp;</td>
                    </tr>
                `;
                break;
            default:
                break;
        }
    });

    // Wrap in standard responsive table template
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Newsletter</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f1f5f9;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#f1f5f9">
                <tr>
                    <td align="center" style="padding: 20px 0;">
                        <table width="600" border="0" cellspacing="0" cellpadding="0" bgcolor="#ffffff" style="max-width: 600px; width: 100%; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                            ${contentHtml}
                            <!-- Unsubscribe Footer -->
                            <tr>
                                <td align="center" style="padding: 30px 20px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; font-family: Arial, sans-serif; font-size: 12px; color: #64748b; line-height: 1.5;">
                                    <p style="margin: 0 0 10px 0;">You are receiving this email because you subscribed to our newsletter.</p>
                                    <p style="margin: 0;">
                                        <a href="${unsubscribeLink}" target="_blank" style="color: ${themeColor || '#0c7fa3'}; text-decoration: underline; font-weight: bold;">
                                            Unsubscribe from this list
                                        </a>
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
    `;
};

// @desc    Subscribe to newsletter (public)
// @route   POST /api/subscribers/subscribe
exports.subscribe = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: 'Please provide an email address' });
        }

        let subscriber = await Subscriber.findOne({ email });

        if (subscriber) {
            if (subscriber.status === 'SUBSCRIBED') {
                return res.status(400).json({ success: false, message: 'You are already subscribed!' });
            }
            // Resubscribe if previously unsubscribed
            subscriber.status = 'SUBSCRIBED';
            subscriber.token = crypto.randomBytes(32).toString('hex');
            await subscriber.save();
        } else {
            const token = crypto.randomBytes(32).toString('hex');
            subscriber = await Subscriber.create({ email, token });
        }

        // Send welcome email
        const host = req.get('host');
        const protocol = req.protocol;
        const unsubscribeLink = `${protocol}://${host}/api/subscribers/unsubscribe?email=${subscriber.email}&token=${subscriber.token}`;

        await sendEmail({
            to: subscriber.email,
            subject: 'Welcome to our Newsletter!',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2>Thank you for subscribing!</h2>
                    <p>We are thrilled to have you join our reader community. You'll receive our latest updates, articles, and insights directly in your inbox.</p>
                    <p style="margin-top: 30px; font-size: 12px; color: #777;">
                        If you did not sign up for this, you can safely 
                        <a href="${unsubscribeLink}" target="_blank">unsubscribe here</a>.
                    </p>
                </div>
            `
        });

        res.status(201).json({ success: true, message: 'Subscribed successfully! Check your inbox for confirmation.' });
    } catch (error) {
        next(error);
    }
};

// @desc    Unsubscribe from newsletter (public)
// @route   GET /api/subscribers/unsubscribe
exports.unsubscribe = async (req, res, next) => {
    try {
        const { email, token, reason } = req.query;

        if (!email || !token) {
            return res.status(400).send('<h1>Invalid Link</h1><p>Missing email or token.</p>');
        }

        const subscriber = await Subscriber.findOne({ email, token });
        if (!subscriber) {
            return res.status(404).send('<h1>Unsubscribe Failed</h1><p>Invalid unsubscribe token or email.</p>');
        }

        if (subscriber.status === 'UNSUBSCRIBED') {
            return res.send('<h1>Already Unsubscribed</h1><p>You have already unsubscribed from our newsletter.</p>');
        }

        subscriber.status = 'UNSUBSCRIBED';
        subscriber.unsubscribeReason = reason || 'No reason provided';
        await subscriber.save();

        res.send('<h1>Successfully Unsubscribed</h1><p>We are sorry to see you go! You have been successfully unsubscribed.</p>');
    } catch (error) {
        next(error);
    }
};

// @desc    Get all subscribers (admin)
// @route   GET /api/subscribers/admin
exports.getSubscribers = async (req, res, next) => {
    try {
        const subscribers = await Subscriber.find().sort({ createdAt: -1 });
        res.json({ success: true, count: subscribers.length, data: subscribers });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a subscriber (admin)
// @route   DELETE /api/subscribers/admin/:id
exports.deleteSubscriber = async (req, res, next) => {
    try {
        const subscriber = await Subscriber.findByIdAndDelete(req.params.id);
        if (!subscriber) {
            return res.status(404).json({ success: false, message: 'Subscriber not found' });
        }
        res.json({ success: true, message: 'Subscriber deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// @desc    Send a broadcast newsletter to all subscribers (admin)
// @route   POST /api/subscribers/admin/broadcast
exports.sendNewsletter = async (req, res, next) => {
    try {
        const { subject, blocks, themeColor } = req.body;

        if (!subject || !blocks || !Array.isArray(blocks) || blocks.length === 0) {
            return res.status(400).json({ success: false, message: 'Please provide email subject and blocks' });
        }

        const activeSubscribers = await Subscriber.find({ status: 'SUBSCRIBED' });
        if (activeSubscribers.length === 0) {
            return res.status(400).json({ success: false, message: 'No active subscribers found to broadcast to.' });
        }

        const host = req.get('host');
        const protocol = req.protocol;

        let successCount = 0;
        let failCount = 0;

        // Loop through subscribers and send compiled HTML
        for (const sub of activeSubscribers) {
            try {
                const unsubscribeLink = `${protocol}://${host}/api/subscribers/unsubscribe?email=${sub.email}&token=${sub.token}`;
                const compiledHtml = compileBlocksToHTML(blocks, themeColor, unsubscribeLink);

                await sendEmail({
                    to: sub.email,
                    subject,
                    html: compiledHtml
                });
                successCount++;
            } catch (err) {
                console.error(`Failed to send newsletter to ${sub.email}:`, err);
                failCount++;
            }
        }

        res.json({
            success: true,
            message: `Broadcast finished. Successfully sent to ${successCount} subscribers. Failed for ${failCount}.`
        });
    } catch (error) {
        next(error);
    }
};
