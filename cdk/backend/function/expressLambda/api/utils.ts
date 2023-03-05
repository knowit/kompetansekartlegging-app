// Denne tar ikke hensyn til norsk tid.
// Kan evt. gjøre new Date(Date.now() + 60 * 60 * 1000).toISO....
export const createTimestampNow = () =>
  new Date()
    .toISOString()
    .replace('T', ' ')
    .replace(/\..+/, '')
