import React from 'react';
import { formatNumber } from '../../utils/formatters';

const KpiCard = ({ title, value, growth, icon }) => {
  const isPositive = growth > 0;
  const isNegative = growth < 0;

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</h3>
        <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
          {icon}
        </div>
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {formatNumber(value)}
          </p>
        </div>
        {growth !== undefined && (
          <div className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium ${
            isPositive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
            isNegative ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
            'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
          }`}>
            <span>{isPositive ? '↑' : isNegative ? '↓' : '−'}</span>
            <span>{Math.abs(growth)}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default KpiCard;
