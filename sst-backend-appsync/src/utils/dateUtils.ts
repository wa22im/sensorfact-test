export const getMidnightUTCTimestamp = (daysAgo: number): number => {
  const now = new Date();
  now.setUTCDate(now.getUTCDate() - daysAgo);
  now.setUTCHours(0, 0, 0, 0);
  return now.getTime();
};

export const formatDateString = (daysAgo: number): string => {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - daysAgo);
  const isoString = date.toISOString().split("T")[0];
  if (!isoString) {
    throw new Error("Failed to format date string");
  }
  return isoString;
};
