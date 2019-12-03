import {
  Token,
  Lparen, Rparen,
  IntNum, VarName,
  Assign,
  Plus, Minus, Multi, Divi, Power,
  Print,
  symbolTable,
} from './TokenDefined';
import { nextToken } from './Scanner';

let token: Token;
const stack: any = [];

const expression = () => {
  term();
  while ([Plus, Minus].indexOf(token.type) !== -1) {
    operateCallee(term);
  }
};

const term = () => {
  pow();
  while ([Multi, Divi].indexOf(token.type) !== -1) {
    operateCallee(pow);
  }
};

const pow = () => {
  factor();
  while (token.type === Power) {
    operateCallee(factor);
  }
};

const operateCallee = (callback: any) => {
  const operator = token.type;
  token = nextToken();
  callback();
  operate(operator);
};

const factor = () => {
  switch (token.type) {
    case VarName:
      stack.push(symbolTable[token.value]);
      break;
    case IntNum:
      stack.push(token.value);
      break;
    case Lparen:
      token = nextToken();
      expression();
      checkToken(Rparen);
      break;
  }
  token = nextToken();
};

const operate = (operator: number) => {
  const [d2, d1] = [stack.pop(), stack.pop()];
  if (d1 === undefined) { return; }
  switch (operator) {
    case Plus: stack.push(d1 + d2); break;
    case Minus: stack.push(d1 - d2); break;
    case Multi: stack.push(d1 * d2); break;
    case Divi: stack.push(d1 / d2); break;
    case Power: stack.push(Math.pow(d1, d2)); break;
  }
};

const checkToken = (tokenType: number): boolean => token.type === tokenType;

export const statement = (): string => {
  let key: number|string;
  token = nextToken();
  switch (token.type) {
    case Print:
      token = nextToken();
      expression();
      return `\n${stack.pop()}`;
    case VarName:
      key = token.value;
      token = nextToken();
      checkToken(Assign);
      token = nextToken();
      expression();
      symbolTable[key] = stack.pop();
      break;
  }
  console.log(symbolTable);
  return '';
};

export default { };
