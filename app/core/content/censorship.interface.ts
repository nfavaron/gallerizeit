export interface ContentCensorshipInterface {

  /**
   * Returns true if the text is safe, else returns false
   */
  isSafe(text: string): boolean;

}
