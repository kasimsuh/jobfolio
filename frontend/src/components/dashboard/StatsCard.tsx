import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: 'primary' | 'amber' | 'blue' | 'emerald' | 'red';
  trend?: string;
}

const colorStyles = {
  primary: {
    bg: 'bg-primary-100',
    text: 'text-primary-600',
    icon: 'text-primary-500',
  },
  amber: {
    bg: 'bg-amber-100',
    text: 'text-amber-600',
    icon: 'text-amber-500',
  },
  blue: {
    bg: 'bg-blue-100',
    text: 'text-blue-600',
    icon: 'text-blue-500',
  },
  emerald: {
    bg: 'bg-emerald-100',
    text: 'text-emerald-600',
    icon: 'text-emerald-500',
  },
  red: {
    bg: 'bg-red-100',
    text: 'text-red-600',
    icon: 'text-red-500',
  },
};

export function StatsCard({ label, value, icon: Icon, color, trend }: StatsCardProps) {
  const styles = colorStyles[color];
  
  return (
    <Card hover>
      <div className="flex items-start justify-between mb-3">
        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', styles.bg)}>
          <Icon className={cn('w-5 h-5', styles.icon)} />
        </div>
      </div>
      <p className="text-3xl font-display font-bold text-slate-800 mb-1">{value}</p>
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{label}</p>
        {trend && (
          <span className={cn('text-xs font-medium', styles.text)}>{trend}</span>
        )}
      </div>
    </Card>
  );
}
