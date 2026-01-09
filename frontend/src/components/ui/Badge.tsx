import React from 'react';
import { cn } from '@/lib/utils';
import { ApplicationStatus } from '@/types';
import { STATUS_CONFIG } from '@/lib/constants';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variantStyles = {
    default: 'bg-slate-100 text-slate-600 border-slate-200',
    success: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    warning: 'bg-amber-50 text-amber-600 border-amber-200',
    danger: 'bg-red-50 text-red-600 border-red-200',
    info: 'bg-primary-50 text-primary-600 border-primary-200',
  };
  
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

interface StatusBadgeProps {
  status: ApplicationStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full border',
        config.bgColor,
        config.textColor,
        config.borderColor,
        className
      )}
    >
      {config.label}
    </span>
  );
}
