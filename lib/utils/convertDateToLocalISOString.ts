export function convertDateToLocalISOString(date: Date): string {
  const localDate = new Date(date);
  localDate.setHours(0, 0, 0, 0); // Set jam ke 00:00 lokal
  return localDate.toISOString(); // Konversi ke ISO string
}
