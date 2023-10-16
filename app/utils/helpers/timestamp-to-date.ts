export function timestampToDate(timestamp: number): string {
  const formattedDate = new Date(timestamp)
    .toLocaleDateString('en-GB', {
      day: 'numeric',
      month: '2-digit',
      year: '2-digit',
    })
    .replace(/\//g, '.');

  return formattedDate;
}

export function dateToTimestamp(dateString) {
  const [day, month, year] = dateString.split('/').map(Number);
  const date = new Date(year, month - 1, day);
  const timestamp = date.getTime();

  return Math.floor(timestamp / 1000);
}
