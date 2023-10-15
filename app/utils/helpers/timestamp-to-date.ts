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
