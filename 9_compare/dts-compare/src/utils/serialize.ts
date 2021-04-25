import objectHash from 'object-hash';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const serialize = (target: any) => objectHash(target);
