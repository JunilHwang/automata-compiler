export interface Token {
  type: number;
  value?: number|string;
}

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
export const printKey = 'print';
export const programKey = 'Program';
export const varKey = 'Var';
export const beginKey = 'Begin';
export const endKey = 'End';
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
};
export const symbolTable = new class {
  private symbols: any = {};
  public set(key: string, value: number|undefined = undefined, type = IntNum) {
    const check = this.symbols[key] === undefined;
    if (check) {
      this.symbols[key] = {type, value};
    }
    return check;
  }
  public get(key: string) {
    return this.symbols[key].value;
  }
  public put(key: string, value: number) {
    const check = this.symbols[key] !== undefined;
    if (check) {
      this.symbols[key].value = value;
    }
    return check;
  }
}();
