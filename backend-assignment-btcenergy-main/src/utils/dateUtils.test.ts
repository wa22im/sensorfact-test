import { getMidnightUTCTimestamp, formatDateString } from './dateUtils';

describe('getMidnightUTCTimestamp', () => {
  it('returns the correct UTC midnight timestamp for 1 day ago', () => {
    const yesterday = new Date();
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);
    yesterday.setUTCHours(0, 0, 0, 0);
    const expected = yesterday.getTime();
    expect(Math.abs(getMidnightUTCTimestamp(1) - expected)).toBeLessThan(1000);
  });
});

describe('formatDateString', () => {
  it('returns the correct ISO date string for 0 days ago', () => {
    const today = new Date();
    const expected = today.toISOString().split('T')[0];
    expect(formatDateString(0)).toBe(expected);
  });

});
