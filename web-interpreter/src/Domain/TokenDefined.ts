// Token의 interface 저으이 */
export interface Token {
  type: number;
  value?: number|string;
}

// Token Type 정의. counter 변수를 사용하여 반복 할당 작업 자동화 */
let counter: number = 0;
export const Print: number = counter++;
export const Lparen: number = counter++;
export const Rparen: number = counter++;
export const Plus: number = counter++;
export const Minus: number = counter++;
export const Multi: number = counter++;
export const Divi: number = counter++;
export const Power: number = counter++;
export const Assign: number = counter++;
export const IntNum: number = counter++;
export const VarName: number = counter++;
export const Program: number = counter++;
export const Var: number = counter++;
export const Begin: number = counter++;
export const End: number = counter++;
export const TypeInt: number = counter++;
export const TypeFloat: number = counter++;
export const Empty: number = counter++;
export const Comma: number = counter++;
export const Semicolon: number = counter++;
export const Comment: number = counter++;

// 다른 코드에서 사용 될 token의 key 정의
export const printKey = 'print';
export const programKey = 'Program';
export const varKey = 'Var';
export const beginKey = 'Begin';
export const endKey = 'End';
export const commentKey = '/*';
export const opTable: any = {
  '(': Lparen,
  ')': Rparen,
  '+': Plus,
  '-': Minus,
  '*': Multi,
  '/': Divi,
  '^': Power,
  '=': Assign,
  [printKey]: Print,
  [programKey]: Program,
  [varKey]: Var,
  [beginKey]: Begin,
  [endKey]: End,
  'int': TypeInt,
  'float': TypeFloat,
  ',': Comma,
  ';': Semicolon,
  [commentKey]: Comment,
};

// symbol table에 대한 instance 정의
export const symbolTable = new class {
  private symbols: any = {};
  // symbol을 새로 만듬. 즉, define 할 때 사용
  public set(key: string, value: number|null = null, type = IntNum) {
    const check = this.symbols[key] === undefined;
    if (check) {
      this.symbols[key] = {type, value};
    }
    return check;
  }
  // symbol에서 value를 가져옴
  public get(key: string) {
    const k = this.symbols[key];
    return k === undefined ? undefined : k.value;
  }
  // symbol의 내용을 수정함. 즉, assign 할 때 사용
  public put(key: string, value: number) {
    const check = this.symbols[key] !== undefined;
    if (check) {
      this.symbols[key].value = value;
    }
    return check;
  }
}();
