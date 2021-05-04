import { genSalt, hash, compare } from 'bcrypt';

export default class PasswordService {
  /**
   * Async generate a Hash based on salt and return it.
   * @param plainPassword Plain password string.
   * @returns Promise, if callback has been omitted.
   */
  public static async genHash(plainPassword: string): Promise<string> {
    const salt = await genSalt(10);
    const hashed = await hash(plainPassword, salt);

    return hashed;
  }

  /**
   * Async check if password hash is valid.
   * @param plainPassword Plain password string.
   * @param hashedPassword Hashed password string.
   * @returns Promise, if callback has been omitted.
   */
  public static async isValidHash(plainPassword: string, hashedPassword: string): Promise<boolean> {
    const isValid = await compare(plainPassword, hashedPassword);
    return isValid;
  }
}
