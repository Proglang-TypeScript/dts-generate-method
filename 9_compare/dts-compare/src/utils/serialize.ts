import objectHash from 'object-hash';

export const serialize = (target: any) => objectHash(target);
