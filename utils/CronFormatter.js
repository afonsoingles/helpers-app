// Simple CRON to human-readable format converter
export function formatCronToHuman(cronExpression) {
  if (!cronExpression) return 'No schedule';
  
  const parts = cronExpression.split(' ');
  if (parts.length !== 5) return cronExpression; // Return original if not standard format
  
  const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;
  
  // Every day at specific time
  if (dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
    if (minute === '0' && hour !== '*') {
      return `Every day at ${formatHour(hour)}`;
    } else if (minute !== '*' && hour !== '*') {
      const h = parseInt(hour);
      const m = parseInt(minute);
      if (h === 0) return `Every day at 12:${formatMinute(minute)} AM`;
      if (h < 12) return `Every day at ${h}:${formatMinute(minute)} AM`;
      if (h === 12) return `Every day at 12:${formatMinute(minute)} PM`;
      return `Every day at ${h - 12}:${formatMinute(minute)} PM`;
    } else if (minute === '0') {
      return `Every hour`;
    } else {
      return `Every ${minute} minutes`;
    }
  }
  
  // Specific days of week
  if (dayOfMonth === '*' && month === '*') {
    const days = formatDaysOfWeek(dayOfWeek);
    if (minute === '0' && hour !== '*') {
      return `${days} at ${formatHour(hour)}`;
    } else if (minute !== '*' && hour !== '*') {
      const h = parseInt(hour);
      const m = parseInt(minute);
      if (h === 0) return `${days} at 12:${formatMinute(minute)} AM`;
      if (h < 12) return `${days} at ${h}:${formatMinute(minute)} AM`;
      if (h === 12) return `${days} at 12:${formatMinute(minute)} PM`;
      return `${days} at ${h - 12}:${formatMinute(minute)} PM`;
    } else {
      return `${days}`;
    }
  }
  
  // Specific days of month
  if (dayOfWeek === '*') {
    if (minute === '0' && hour !== '*') {
      return `Day ${dayOfMonth} of every month at ${formatHour(hour)}`;
    } else if (minute !== '*' && hour !== '*') {
      const h = parseInt(hour);
      const m = parseInt(minute);
      if (h === 0) return `Day ${dayOfMonth} of every month at 12:${formatMinute(minute)} AM`;
      if (h < 12) return `Day ${dayOfMonth} of every month at ${h}:${formatMinute(minute)} AM`;
      if (h === 12) return `Day ${dayOfMonth} of every month at 12:${formatMinute(minute)} PM`;
      return `Day ${dayOfMonth} of every month at ${h - 12}:${formatMinute(minute)} PM`;
    } else {
      return `Day ${dayOfMonth} of every month`;
    }
  }
  
  // Complex schedules - return original
  return cronExpression;
}

function formatHour(hour) {
  if (hour === '*') return 'every hour';
  const h = parseInt(hour);
  if (h === 0) return '12 AM';
  if (h < 12) return `${h} AM`;
  if (h === 12) return '12 PM';
  return `${h - 12} PM`;
}

function formatMinute(minute) {
  if (minute === '*') return '00';
  const m = parseInt(minute);
  return m.toString().padStart(2, '0');
}

function formatDaysOfWeek(dayOfWeek) {
  if (dayOfWeek === '*') return 'Every day';
  
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  if (dayOfWeek.includes(',')) {
    const days = dayOfWeek.split(',').map(d => dayNames[parseInt(d.trim())]).join(', ');
    return days;
  }
  
  if (dayOfWeek.includes('-')) {
    const [start, end] = dayOfWeek.split('-').map(d => parseInt(d.trim()));
    const dayRange = [];
    for (let i = start; i <= end; i++) {
      dayRange.push(dayNames[i]);
    }
    return dayRange.join(', ');
  }
  
  const dayIndex = parseInt(dayOfWeek);
  return dayNames[dayIndex] || dayOfWeek;
}

// Format multiple schedules
export function formatMultipleSchedules(schedules) {
  if (!schedules || schedules.length === 0) return 'No schedule';
  
  if (schedules.length === 1) {
    return formatCronToHuman(schedules[0]);
  }
  
  const formatted = schedules.map(schedule => formatCronToHuman(schedule));
  return `Multiple schedules: ${formatted.join(', ')}`;
}
