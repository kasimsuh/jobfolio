import { useMemo } from 'react';
import { useAppStore } from './useAppStore';
import { Analytics } from '@/types';

export function useAnalytics(): Analytics {
  const applications = useAppStore((state) => state.applications);
  
  return useMemo(() => {
    const total = applications.length;
    const applied = applications.filter((a) => a.status !== 'saved').length;
    const interviews = applications.filter((a) => a.status === 'interview').length;
    const offers = applications.filter((a) => a.status === 'offer').length;
    const rejected = applications.filter((a) => a.status === 'rejected').length;
    const pending = applications.filter((a) => a.status === 'applied').length;
    
    const responseRate = applied > 0
      ? ((interviews + offers + rejected) / applied * 100).toFixed(1)
      : '0';
    const interviewRate = applied > 0
      ? ((interviews + offers) / applied * 100).toFixed(1)
      : '0';
    const offerRate = (interviews + offers) > 0
      ? (offers / (interviews + offers) * 100).toFixed(1)
      : '0';
    
    return {
      total,
      applied,
      interviews,
      offers,
      rejected,
      pending,
      responseRate,
      interviewRate,
      offerRate,
    };
  }, [applications]);
}
