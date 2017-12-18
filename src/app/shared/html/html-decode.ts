/**
 * Converts an html characterSet into its original character
 *
 * @param str
 **/
export function htmlDecode(str: string): string {

  return str.replace(/&#(\d+);/g, (match: string, dec: number) => String.fromCharCode(dec));
}
