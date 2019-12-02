export interface Token {
  type: number;
  value: number|string;
}

export const Print: number = 0;
export const Lparen: number = 1;
export const Rparen: number = 2;
export const Plus: number = 3;
export const Minus: number = 4;
export const Multi: number = 5;
export const Divi: number = 6;
export const Assign: number = 7;
export const IntNum: number = 8;
export const VarName: number = 9;
export const opTable: any = {
  '(': Lparen,
  ')': Rparen,
  '+': Plus,
  '-': Minus,
  '*': Multi,
  '/': Divi,
  '=': Assign,
  '?': Print,
};
export const symbolTable: any = { };
