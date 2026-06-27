import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setMetricsData, setMetricsLoading, setMetricsError } from '../store/slices/metricsSlice';
import { setTimeSeriesData, setModulesData, setChartsLoading, setChartsError } from '../store/slices/chartsSlice';
import api from '../api/index'; // Import global axios instance

export const useAnalytics = () => {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.analyticsFilter);
  const { dateRange, category, status } = filters;

  useEffect(() => {
    const fetchAnalytics = async () => {
      dispatch(setMetricsLoading(true));
      dispatch(setChartsLoading(true));
      try {
        const queryParams = new URLSearchParams();
        if (dateRange.start) queryParams.set('startDate', dateRange.start);
        if (dateRange.end) queryParams.set('endDate', dateRange.end);
        if (category && category !== 'ALL') queryParams.set('module', category);
        
        const qs = queryParams.toString();

        const [summaryRes, tsRes, modRes] = await Promise.all([
          api.get(`/analytics/summary${qs ? '?' + qs : ''}`),
          api.get(`/analytics/timeseries${qs ? '?' + qs : ''}`),
          api.get(`/analytics/modules${qs ? '?' + qs : ''}`)
        ]);

        dispatch(setMetricsData(summaryRes.data.data));
        dispatch(setTimeSeriesData(tsRes.data.data));
        dispatch(setModulesData(modRes.data.data));

      } catch (error) {
        dispatch(setMetricsError(error.message));
        dispatch(setChartsError(error.message));
      } finally {
        dispatch(setMetricsLoading(false));
        dispatch(setChartsLoading(false));
      }
    };

    fetchAnalytics();
  }, [dispatch, dateRange, category, status]);
};
