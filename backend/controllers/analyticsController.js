const AnalyticsEvent = require('../models/AnalyticsEvent');
const SavedView = require('../models/SavedView');
const VisitorProfile = require('../models/VisitorProfile');
const AnalyticsSession = require('../models/AnalyticsSession');

// @desc    Record an analytics event
// @route   POST /api/analytics
// @access  Public
const recordEvent = async (req, res, next) => {
    try {
        const { type, page, module, element, metadata, visitorId, visitorLabel, realName } = req.body;
        
        const event = await AnalyticsEvent.create({
            type: type.toUpperCase(),
            page,
            module: module.toUpperCase(),
            element,
            metadata: metadata || {},
            visitorId,
            visitorLabel,
            realName
        });

        // Emit to admin clients
        const io = req.app.get('io');
        if (io) {
            io.to('admin').emit('analytics_event_recorded', event);
        }

        res.status(201).json({ success: true, message: 'Event recorded' });
    } catch (error) {
        next(error);
    }
};

// @desc    Retrieve analytics events
// @route   GET /api/analytics
// @access  Private/Admin
const getEvents = async (req, res, next) => {
    try {
        const { type, module, startDate, endDate } = req.query;
        const filter = {};

        if (type) filter.type = type.toUpperCase();
        if (module) filter.module = module.toUpperCase();
        
        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = new Date(startDate);
            if (endDate) filter.createdAt.$lte = new Date(endDate);
        }

        const events = await AnalyticsEvent.find(filter)
            .sort({ createdAt: -1 })
            .limit(1000); // Prevent massive queries on large datasets

        res.json({
            success: true,
            count: events.length,
            data: events,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Return aggregated statistics
// @route   GET /api/analytics/summary
// @access  Private/Admin
const getSummary = async (req, res, next) => {
    try {
        const summary = await AnalyticsEvent.aggregate([
            {
                $group: {
                    _id: '$type',
                    count: { $sum: 1 }
                }
            }
        ]);

        const result = {
            pageViews: 0,
            clicks: 0,
            formSubmissions: 0,
        };

        summary.forEach(item => {
            if (item._id === 'PAGE_VIEW') result.pageViews = item.count;
            if (item._id === 'CLICK') result.clicks = item.count;
            if (item._id === 'FORM_SUBMISSION') result.formSubmissions = item.count;
        });

        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

// @desc    Return aggregated metrics grouped by module
// @route   GET /api/analytics/modules
// @access  Private/Admin
const getModulesSummary = async (req, res, next) => {
    try {
        const modulesData = await AnalyticsEvent.aggregate([
            {
                $group: {
                    _id: { module: '$module', type: '$type' },
                    count: { $sum: 1 }
                }
            }
        ]);

        const result = {};

        modulesData.forEach(item => {
            const mod = item._id.module.toLowerCase();
            const type = item._id.type.toLowerCase();

            if (!result[mod]) {
                result[mod] = {};
            }
            
            // e.g. views, clicks, form_submissions
            const metricName = type === 'page_view' ? 'views' : type === 'form_submission' ? 'formSubmissions' : `${type}s`;
            result[mod][metricName] = item.count;
        });

        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

// @desc    Get timeseries data for charts
// @route   GET /api/analytics/timeseries
// @access  Private/Admin
const getTimeSeries = async (req, res, next) => {
    try {
        const { days = 30 } = req.query;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(days));

        const timeseries = await AnalyticsEvent.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: {
                        date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        type: "$type"
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.date": 1 }
            }
        ]);

        // Transform into a frontend-friendly format for recharts
        const dataMap = {};
        timeseries.forEach(item => {
            const date = item._id.date;
            const type = item._id.type;
            
            if (!dataMap[date]) {
                dataMap[date] = { date, pageViews: 0, clicks: 0, formSubmissions: 0 };
            }
            
            if (type === 'PAGE_VIEW') dataMap[date].pageViews = item.count;
            if (type === 'CLICK') dataMap[date].clicks = item.count;
            if (type === 'FORM_SUBMISSION') dataMap[date].formSubmissions = item.count;
        });

        res.json({ success: true, data: Object.values(dataMap) });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all visitors
// @route   GET /api/analytics/visitors
// @access  Private/Admin
const getVisitors = async (req, res, next) => {
    try {
        const { type } = req.query; // 'anonymous', 'identified', 'all'
        
        let query = {};
        if (type === 'identified') query.isIdentified = true;
        if (type === 'anonymous') query.isIdentified = false;

        const visitors = await VisitorProfile.find(query)
            .populate('userId', 'name email role')
            .sort({ lastSeen: -1 })
            .lean();

        res.json({ success: true, count: visitors.length, data: visitors });
    } catch (error) {
        next(error);
    }
};

// @desc    Get visitor details (drill-down)
// @route   GET /api/analytics/visitors/:visitorId
// @access  Private/Admin
const getVisitorDetails = async (req, res, next) => {
    try {
        const visitorId = req.params.visitorId;

        const profile = await VisitorProfile.findOne({ visitorId })
            .populate('userId', 'name email role')
            .lean();

        if (!profile) {
            return res.status(404).json({ success: false, message: 'Visitor not found' });
        }

        const sessions = await AnalyticsSession.find({ visitorId }).sort({ startTime: -1 }).lean();
        const events = await AnalyticsEvent.find({ visitorId }).sort({ timestamp: -1 }).lean();

        res.json({ 
            success: true, 
            data: {
                profile,
                sessions,
                timeline: events
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get saved views
// @route   GET /api/analytics/views
// @access  Private/Admin
const getSavedViews = async (req, res, next) => {
    try {
        const views = await SavedView.find({ createdBy: req.admin._id }).sort({ createdAt: -1 });
        res.json({ success: true, data: views });
    } catch (error) {
        next(error);
    }
};

// @desc    Create a saved view
// @route   POST /api/analytics/views
// @access  Private/Admin
const createSavedView = async (req, res, next) => {
    try {
        const { name, filters } = req.body;
        const view = await SavedView.create({
            name,
            filters,
            createdBy: req.admin._id
        });
        res.status(201).json({ success: true, data: view });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    recordEvent,
    getEvents,
    getSummary,
    getModulesSummary,
    getTimeSeries,
    getVisitors,
    getVisitorDetails,
    getSavedViews,
    createSavedView
};
