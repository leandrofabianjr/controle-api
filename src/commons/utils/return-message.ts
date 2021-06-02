export default class ReturnMessage {
  private constructor(
    private type: 'info' | 'danger' | 'success',
    private message: string,
  ) {}

  toString(): string {
    return this.message;
  }

  static Danger(message: string): ReturnMessage {
    return new ReturnMessage('danger', message);
  }

  static Success(message: string): ReturnMessage {
    return new ReturnMessage('success', message);
  }
}
