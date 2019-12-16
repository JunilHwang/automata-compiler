class CodeContainer {
  public static instance: CodeContainer;  // 싱글톤으로 사용될 instance
  public static init(): void {
    CodeContainer.instance = new CodeContainer(''); // 싱글톤 인스턴스 생성
  }
  public static getInstance(): CodeContainer {
    return CodeContainer.instance; // 싱글톤 인스턴스 반환
  }
  private code: string = '';
  constructor(code: string) {
    this.setCode(code); // code를 받아와서 저장함
  }
  public setCode(code: string) {
    this.code = code.trim(); // 양 끝 여백을 없앰
  }
  public getCode() {
    return this.code.trim(); // 현재 코드 반환
  }
  public getFirst() {
    return this.getCode()[0]; // 첫 번째 글자 반환
  }
}
CodeContainer.init(); // 클래스로부터 static 상태의 싱글톤 인스턴스 생성

// codeContainer변수를 만든 후 export
export const codeContainer: CodeContainer = CodeContainer.getInstance();
