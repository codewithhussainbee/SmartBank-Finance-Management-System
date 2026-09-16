export function formatCurrency(amount: number, currency: string = 'INR'): string {
  if (isNaN(amount)) return '₹0.00';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency === '₹' ? 'INR' : currency,
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(d);
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString: string): string {
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return dateString;
  }
}

export function maskAccountNumber(accNum: string): string {
  if (!accNum) return '';
  const parts = accNum.split('-');
  if (parts.length >= 3) {
    return `${parts[0]}-••••-${parts[2]}`;
  }
  return accNum;
}

export function getRiskLevelBadge(level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL') {
  switch (level) {
    case 'LOW':
      return { label: 'Low Risk', bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/20' };
    case 'MEDIUM':
      return { label: 'Medium Risk', bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/20' };
    case 'HIGH':
      return { label: 'High Risk', bg: 'bg-rose-500/10', text: 'text-rose-500', border: 'border-rose-500/20' };
    case 'CRITICAL':
      return { label: 'Critical Anomaly', bg: 'bg-red-500/20', text: 'text-red-600', border: 'border-red-500/30' };
  }
}
