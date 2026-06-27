export const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num;
};

export const formatPercentage = (num) => {
  if (num === null || num === undefined) return '0%';
  return `${num > 0 ? '+' : ''}${num.toFixed(1)}%`;
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};
