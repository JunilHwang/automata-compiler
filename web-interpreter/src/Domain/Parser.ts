import {
  Token,
  Lparen, Rparen,
  IntNum, VarName,
  Assign,
  Plus, Minus, Multi, Divi, Power,
  Print,
  symbolTable,
  programKey, varKey, endKey, beginKey,
} from './TokenDefined';
import { nextToken } from './Scanner';
import { eventBus } from '../Helper';
import { codeContainer } from './CodeContainer';

let stateCounter = 0;
const NEXT_PROGRAM = stateCounter++;
const NEXT_VAR = stateCounter++;
const NEXT_BEGIN = stateCounter++;
const NEXT_END = stateCounter++;
const nextStateChecker: any = {
  [programKey]: NEXT_PROGRAM,
  [varKey]: NEXT_VAR,
  [endKey]: NEXT_END,
  [beginKey]: NEXT_BEGIN,
};

let token: Token;
let parserState: number = NEXT_PROGRAM;
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
  const { type, value } = token;
  switch (type) {
    case VarName:
      stack.push(symbolTable.get(String(value)));
      break;
    case IntNum:
      stack.push(value);
      break;
    case Lparen:
      token = nextToken();
      expression();
      checkToken(Rparen, 'Rparen Error');
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

const errorMessageAppend = (message: string) => {
  eventBus.$emit('tokenError', message);
  throw message;
};

const tokenAppend = (message: string) => {
  eventBus.$emit('tokenAppend', message);
};

const checkToken = (tokenType: number, message: string): void => {
  const checked = token.type === tokenType;
  if (!checked) {
    errorMessageAppend(message);
  }
};

export const statement = (): string => {
  token = nextToken();
  const { type, value } = token;
  switch (type) {
    case Print:
      token = nextToken();
      expression();
      return `\n${stack.pop()}`;
    case VarName:
      token = nextToken();
      checkToken(Assign, 'Assign Error');
      token = nextToken();
      expression();
      symbolTable.set(String(value), stack.pop());
      break;
  }
  return '';
};

export const checkState = () => {
  const code = codeContainer.getCode();
  const next = nextStateChecker[code];
  if (next !== undefined) {
    if (next === parserState) {
      parserState = (parserState + 1) % stateCounter;
    } else {
      errorMessageAppend(`Error : Next state is not ${code}`);
    }
  }
};

export default { };
