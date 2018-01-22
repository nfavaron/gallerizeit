/**
 * Converts an html characterSet into its original character
 *
 * @param str
 **/
export function htmlDecodeHelper(str: string): string {

  return str.replace(/&#(\d+);/g, (match: string, dec: number) => String.fromCharCode(dec));
}
