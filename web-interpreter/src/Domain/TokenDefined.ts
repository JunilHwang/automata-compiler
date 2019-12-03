export interface Token {
  type: number;
  value: number|string;
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
export const opTable: any = {
  '(': Lparen,
  ')': Rparen,
  '+': Plus,
  '-': Minus,
  '*': Multi,
  '/': Divi,
  '^': Power,
  '=': Assign,
  '?': Print,
};
export const symbolTable: any = { };
