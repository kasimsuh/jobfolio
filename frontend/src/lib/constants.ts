import { ApplicationStatus, StatusConfig } from '@/types';
import { Clock, Send, Calendar, Award, X } from 'lucide-react';

// Status Configuration Map
export const STATUS_CONFIG: Record<ApplicationStatus, StatusConfig> = {
  saved: {
    label: 'Saved',
    color: 'bg-slate-500',
    bgColor: 'bg-slate-100',
    textColor: 'text-slate-600',
    borderColor: 'border-slate-200',
  },
  applied: {
    label: 'Applied',
    color: 'bg-blue-500',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    borderColor: 'border-blue-200',
  },
  interview: {
    label: 'Interview',
    color: 'bg-amber-500',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-600',
    borderColor: 'border-amber-200',
  },
  offer: {
    label: 'Offer',
    color: 'bg-emerald-500',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-600',
    borderColor: 'border-emerald-200',
  },
  rejected: {
    label: 'Rejected',
    color: 'bg-red-500',
    bgColor: 'bg-red-50',
    textColor: 'text-red-600',
    borderColor: 'border-red-200',
  },
};

// Status Icons Map
export const STATUS_ICONS = {
  saved: Clock,
  applied: Send,
  interview: Calendar,
  offer: Award,
  rejected: X,
};

// Application Sources
export const APPLICATION_SOURCES = [
  'LinkedIn',
  'Handshake',
  'Indeed',
  'Company Website',
  'WaterlooWorks',
  'Glassdoor',
  'Referral',
  'Career Fair',
  'Other',
];

// Status Order for Kanban
export const STATUS_ORDER: ApplicationStatus[] = [
  'saved',
  'applied',
  'interview',
  'offer',
  'rejected',
];
