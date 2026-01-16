import { headers } from 'next/headers';

export function getBaseUrl(): string {
  const headerList = headers();
  const host = headerList.get('host') ?? 'localhost:3000';
  const protocol = headerList.get('x-forwarded-proto') ?? 'http';
  return `${protocol}://${host}`;
}
