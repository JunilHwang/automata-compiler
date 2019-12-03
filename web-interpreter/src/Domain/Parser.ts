import {
  Token,
  Lparen, Rparen,
  IntNum, VarName,
  Assign,
  Plus, Minus, Multi, Divi, Power,
  Print,
  symbolTable,
  varKey, endKey, beginKey, Program,
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
      checkTokenType(Rparen, 'Rparen Error');
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

const checkTokenType = (tokenType: number, message: string): void => {
  const checked = token.type === tokenType;
  if (!checked) {
    errorMessageAppend(message);
  }
};

export const statement = (): void => {
  console.log('statement start');
  token = nextToken();
  const { type, value } = token;
  const tabIndent = '\t';
  switch (type) {
    case Program:
      if (parserState !== NEXT_PROGRAM) {
        errorMessageAppend('Error: Next state must be \'Var\'');
      }
      token = nextToken();
      console.log(token);
      checkTokenType(VarName, 'Error: Token Type must be \'VarName(word)\'');
      parserState = NEXT_VAR;
      symbolTable.set(String(token.value));
      lineAppend();
      break;
    case Print:
      token = nextToken();
      expression();
      lineAppend(tabIndent);
      tokenAppend(`\n\t${stack.pop()}`);
      break;
    case VarName:
      token = nextToken();
      checkTokenType(Assign, 'Error: Token Type must be \'Assign(=)\'');
      token = nextToken();
      expression();
      symbolTable.set(String(value), stack.pop());
      lineAppend(tabIndent);
      break;
  }
  console.log(symbolTable);
};

export const checkState = (): boolean => {
  const code = codeContainer.getCode();
  const next = nextStateChecker[code];
  const checked: boolean = next !== undefined;
  if (checked) {
    if (next === parserState) {
      parserState = (parserState + 1) % stateCounter;
      lineAppend();
    } else {
      errorMessageAppend(`Error : Next state is not ${code}`);
    }
  }
  return checked;
};

const errorMessageAppend = (message: string) => {
  eventBus.$emit('tokenError', message);
  throw new Error(message);
};
const tokenAppend = (message: string) => eventBus.$emit('tokenAppend', message);
const lineAppend = (indent: string = '') => eventBus.$emit('lineAppend', indent);

export default { };
