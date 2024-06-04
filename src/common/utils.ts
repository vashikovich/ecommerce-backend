export const cursorUtils = {
  encode(input: any) {
    return Buffer.from(JSON.stringify(input)).toString('base64');
  },
  decode<T>(input: string) {
    const str = Buffer.from(input, 'base64').toString('ascii');
    return JSON.parse(str) as T;
  },
};
