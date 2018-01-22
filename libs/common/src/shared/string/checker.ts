export abstract class StringChecker {

  /**
   * Returns true is the provided @text is safe, else returns false
   *
   * @param text
   */
  abstract isSafe(text: string): boolean;
}
