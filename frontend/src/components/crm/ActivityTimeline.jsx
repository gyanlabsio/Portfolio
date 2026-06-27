import React from 'react';

const ActivityTimeline = ({ activities = [] }) => {
  return (
    <div className="p-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Activity Timeline</h3>
      {activities.length === 0 ? (
        <div className="text-gray-500 text-sm">No activity recorded yet.</div>
      ) : (
        <div className="space-y-6 border-l-2 border-gray-100 dark:border-gray-800 ml-3">
          {activities.map((activity, index) => (
            <div key={index} className="relative pl-6">
              <div className="absolute -left-2 top-1.5 w-4 h-4 rounded-full bg-blue-500 border-4 border-white dark:border-gray-900"></div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">{activity.type}</div>
              <div className="text-xs text-gray-500 mb-1">{new Date(activity.createdAt).toLocaleString()}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg mt-2">
                {activity.description}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityTimeline;
