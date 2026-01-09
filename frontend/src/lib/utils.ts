import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { DiffLine } from '@/types';

// Merge Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Generate unique ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Format date
export function formatDate(date: string | null): string {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// Get relative time
export function getRelativeTime(date: string): string {
  const now = new Date();
  const then = new Date(date);
  const diffInDays = Math.floor((now.getTime() - then.getTime()) / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  return `${Math.floor(diffInDays / 30)} months ago`;
}

// Compute text diff between two strings
export function computeDiff(oldText: string, newText: string): DiffLine[] {
  const oldLines = oldText.split('\n');
  const newLines = newText.split('\n');
  const result: DiffLine[] = [];

  // Simple LCS-based diff algorithm
  const lcs = computeLCS(oldLines, newLines);
  
  let oldIdx = 0;
  let newIdx = 0;
  let lcsIdx = 0;

  while (oldIdx < oldLines.length || newIdx < newLines.length) {
    if (lcsIdx < lcs.length && oldIdx < oldLines.length && oldLines[oldIdx] === lcs[lcsIdx]) {
      if (newIdx < newLines.length && newLines[newIdx] === lcs[lcsIdx]) {
        result.push({ type: 'unchanged', content: oldLines[oldIdx] });
        oldIdx++;
        newIdx++;
        lcsIdx++;
      } else {
        result.push({ type: 'added', content: newLines[newIdx] });
        newIdx++;
      }
    } else if (oldIdx < oldLines.length && (lcsIdx >= lcs.length || oldLines[oldIdx] !== lcs[lcsIdx])) {
      result.push({ type: 'removed', content: oldLines[oldIdx] });
      oldIdx++;
    } else if (newIdx < newLines.length) {
      result.push({ type: 'added', content: newLines[newIdx] });
      newIdx++;
    }
  }

  return result;
}

// Compute Longest Common Subsequence
function computeLCS(arr1: string[], arr2: string[]): string[] {
  const m = arr1.length;
  const n = arr2.length;
  const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (arr1[i - 1] === arr2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack to find LCS
  const lcs: string[] = [];
  let i = m, j = n;
  while (i > 0 && j > 0) {
    if (arr1[i - 1] === arr2[j - 1]) {
      lcs.unshift(arr1[i - 1]);
      i--;
      j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }

  return lcs;
}

// Parse markdown to HTML (simple version)
export function parseMarkdown(text: string): string {
  return text
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-6 mb-3 text-indigo-400">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code class="px-1.5 py-0.5 bg-white/10 rounded text-sm font-mono">$1</code>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
    .replace(/\n\n/g, '</p><p class="mb-3">')
    .replace(/\n/g, '<br/>');
}

// Extract keywords from job description
export function extractKeywords(text: string): string[] {
  const commonTechKeywords = [
    'javascript', 'typescript', 'python', 'java', 'react', 'node', 'aws',
    'docker', 'kubernetes', 'sql', 'mongodb', 'git', 'agile', 'scrum',
    'api', 'rest', 'graphql', 'css', 'html', 'vue', 'angular', 'next.js',
    'express', 'postgresql', 'redis', 'linux', 'ci/cd', 'testing'
  ];

  const lowerText = text.toLowerCase();
  return commonTechKeywords.filter(keyword => lowerText.includes(keyword));
}

// Calculate days until deadline
export function getDaysUntilDeadline(deadline: string | null): number | null {
  if (!deadline) return null;
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Get deadline status
export function getDeadlineStatus(deadline: string | null): 'overdue' | 'urgent' | 'upcoming' | 'safe' | null {
  const days = getDaysUntilDeadline(deadline);
  if (days === null) return null;
  if (days < 0) return 'overdue';
  if (days <= 3) return 'urgent';
  if (days <= 7) return 'upcoming';
  return 'safe';
}
