import { GATEWAY_HOST } from '../metaplex/metadata';

export function uriToPath(uri: string): string {
  const cid = uri.split('/').pop();
  return `${GATEWAY_HOST}${cid}`;
}
