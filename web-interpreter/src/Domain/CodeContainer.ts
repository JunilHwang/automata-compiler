class CodeContainer {
  public static instance: CodeContainer;
  public static init(): void {
    CodeContainer.instance = new CodeContainer('');
  }
  public static getInstance(): CodeContainer {
    return CodeContainer.instance;
  }

  private code: string = '';
  constructor(code: string) {
    this.setCode(code);
  }
  public setCode(code: string) {
    this.code = code;
  }
  public getCode() {
    return this.code;
  }
  public getFirst() {
    return this.code[0];
  }
}
CodeContainer.init();

export const codeContainer: CodeContainer = CodeContainer.getInstance();
export default CodeContainer;
