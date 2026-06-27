import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setDateRange, setCategory } from '../../store/slices/analyticsFilterSlice';
import ExportMenu from './ExportMenu'; // We'll create this next

const GlobalFilters = () => {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.analyticsFilter);
  const handleDateChange = (type, value) => {
    dispatch(setDateRange({ ...filters.dateRange, [type]: value }));
  };

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Date Filters */}
        <div className="flex items-center space-x-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Start Date</label>
            <input 
              type="date" 
              className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
              value={filters.dateRange.start}
              onChange={(e) => handleDateChange('start', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">End Date</label>
            <input 
              type="date" 
              className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
              value={filters.dateRange.end}
              onChange={(e) => handleDateChange('end', e.target.value)}
            />
          </div>
        </div>

        {/* Module/Category Filter */}
        <div className="flex-1 max-w-xs">
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Module</label>
          <select 
            className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
            value={filters.category}
            onChange={(e) => dispatch(setCategory(e.target.value))}
          >
            <option value="ALL">All Modules</option>
            <option value="PROJECTS">Projects</option>
            <option value="BLOG">Blog</option>
            <option value="CONTACT">Contact</option>
          </select>
        </div>

        {/* Actions (Export) */}
        <div className="flex items-end pb-0.5">
          <ExportMenu />
        </div>

      </div>
    </div>
  );
};

export default GlobalFilters;
