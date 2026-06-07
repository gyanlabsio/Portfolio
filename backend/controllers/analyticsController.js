const AnalyticsEvent = require('../models/AnalyticsEvent');

// @desc    Record an analytics event
// @route   POST /api/analytics
// @access  Public
const recordEvent = async (req, res, next) => {
    try {
        const { type, page, module, element, metadata, visitorId, visitorLabel, realName } = req.body;
        
        await AnalyticsEvent.create({
            type: type.toUpperCase(),
            page,
            module: module.toUpperCase(),
            element,
            metadata: metadata || {},
            visitorId,
            visitorLabel,
            realName
        });

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

// @desc    Get grouped unique visitors
// @route   GET /api/analytics/visitors
// @access  Private/Admin
const getVisitors = async (req, res, next) => {
    try {
        const visitors = await AnalyticsEvent.aggregate([
            {
                $match: { visitorId: { $exists: true, $ne: null } }
            },
            {
                $group: {
                    _id: "$visitorId",
                    visitorLabel: { $last: "$visitorLabel" },
                    realName: { $last: "$realName" },
                    firstVisit: { $min: "$createdAt" },
                    lastVisit: { $max: "$createdAt" },
                    totalEvents: { $sum: 1 },
                    pageViews: {
                        $sum: { $cond: [{ $eq: ["$type", "PAGE_VIEW"] }, 1, 0] }
                    },
                    pagesVisited: { $addToSet: "$page" }
                }
            },
            {
                $sort: { lastVisit: -1 }
            },
            {
                $limit: 200 // Limit to latest 200 visitors for performance
            }
        ]);

        res.json({ success: true, data: visitors });
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
    getVisitors
};
