export const formatDateID = (dateString: string | null | undefined): string => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const formatEventDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export const formatFullDate = (dateString: string | null | undefined) => {
  if (!dateString) return "TBD";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateString));
};

export const formatTimeOnly = (dateString: string | null | undefined) => {
  if (!dateString) return "--:--";
  return new Date(dateString).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getScheduleInfo = (scheduledAt: string | null) => {
  if (!scheduledAt) return { text: "-", isUrgent: false, daysLeft: 0 };

  const interviewDate = new Date(scheduledAt);
  const today = new Date();
  const diffTime = interviewDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const formatted = interviewDate.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return {
    text: formatted,
    isUrgent: diffDays >= 0 && diffDays <= 4,
    daysLeft: diffDays,
  };
};
