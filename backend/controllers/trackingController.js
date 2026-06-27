const VisitorProfile = require('../models/VisitorProfile');
const AnalyticsSession = require('../models/AnalyticsSession');
const AnalyticsEvent = require('../models/AnalyticsEvent');
const crypto = require('crypto');
const useragent = require('useragent');

// @desc    Initialize a tracking session
// @route   POST /api/tracking/init
// @access  Public
exports.initTracking = async (req, res, next) => {
    try {
        let { visitorId, sessionId } = req.body;
        const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const agent = useragent.parse(req.headers['user-agent']);
        
        let profile;
        if (visitorId) {
            profile = await VisitorProfile.findOne({ visitorId });
        }
        
        if (!profile) {
            visitorId = crypto.randomUUID();
            profile = await VisitorProfile.create({
                visitorId,
                consentStatus: 'granted', // Default to granted since consent is removed
                lastKnownIp: ipAddress,
                lastKnownDevice: {
                    os: agent.os.toString(),
                    browser: agent.toAgent(),
                    deviceType: agent.device.family === 'Other' ? 'desktop' : 'mobile'
                }
            });
        } else {
            profile.lastKnownIp = ipAddress;
            profile.lastKnownDevice = {
                os: agent.os.toString(),
                browser: agent.toAgent(),
                deviceType: agent.device.family === 'Other' ? 'desktop' : 'mobile'
            };
            await profile.save();
        }

        let session;
        if (sessionId) {
            session = await AnalyticsSession.findOne({ sessionId });
        }

        if (!session) {
            sessionId = crypto.randomUUID();
            session = await AnalyticsSession.create({
                sessionId,
                visitorId: profile.visitorId,
                ipAddress,
                deviceInfo: {
                    os: agent.os.toString(),
                    browser: agent.toAgent(),
                    deviceType: agent.device.family === 'Other' ? 'desktop' : 'mobile'
                }
            });
            
            profile.totalSessions += 1;
            await profile.save();
        } else {
            session.endTime = Date.now();
            session.duration = Math.floor((session.endTime - session.startTime) / 1000);
            await session.save();
            
            profile.lastSeen = Date.now();
            await profile.save();
        }

        res.json({ success: true, visitorId, sessionId, consentStatus: profile.consentStatus });
    } catch (error) {
        next(error);
    }
};

// @desc    Log an event
// @route   POST /api/tracking/event
// @access  Public
exports.logEvent = async (req, res, next) => {
    try {
        const { visitorId, sessionId, eventType, pageUrl, metadata } = req.body;
        
        if (!visitorId || !sessionId) {
            return res.status(400).json({ success: false, message: 'visitorId and sessionId required' });
        }

        const event = await AnalyticsEvent.create({
            visitorId,
            sessionId,
            type: eventType,
            page: pageUrl,
            module: metadata?.module || 'OTHER',
            metadata
        });

        // Update session duration
        const session = await AnalyticsSession.findOne({ sessionId });
        if (session) {
            session.endTime = Date.now();
            session.duration = Math.floor((session.endTime - session.startTime) / 1000);
            if (eventType === 'PAGE_VIEW') {
                session.pageViews += 1;
            }
            await session.save();
        }

        res.status(201).json({ success: true, event });
    } catch (error) {
        next(error);
    }
};

// @desc    Identify visitor (e.g. login or form submit)
// @route   POST /api/tracking/identify
// @access  Public
exports.identifyVisitor = async (req, res, next) => {
    try {
        const { visitorId, userId } = req.body;
        
        if (!visitorId || !userId) {
            return res.status(400).json({ success: false, message: 'visitorId and userId required' });
        }

        const profile = await VisitorProfile.findOne({ visitorId });
        if (profile) {
            profile.userId = userId;
            profile.isIdentified = true;
            await profile.save();
        }

        res.json({ success: true, profile });
    } catch (error) {
        next(error);
    }
};
