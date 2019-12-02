import {
  Token,
  Lparen, Rparen,
  IntNum, VarName,
  Assign,
  Plus, Minus, Multi, Divi,
  Print,
  opTable, symbolTable,
} from './TokenDefined';

let token: Token;
const stack: any = [];

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

const nextToken = () => {
  const code = codeContainer.getCode();
  const first = codeContainer.getFirst();
  let i = 0;
  switch (true) {
    case opTable[first] !== undefined:
      i = 1;
      token = { type: opTable[first], value: 0 };
      break;
    case isNum(first):
      while (isNum(code[i])) { i++; }
      token = { type: IntNum, value: +code.substr(0, i) };
      break;
    default:
      while (isVar(code.substr(0, i))) { i++; }
      token = { type: VarName, value: code.substr(0, i) };
      break;
  }
  codeContainer.setCode(code.substr(i));
};

const statement = () => {
  let key: number|string;
  switch (token.type) {
    case VarName:
      key = token.value;
      nextToken();
      checkToken(Assign);
      nextToken();
      expression();
      symbolTable[key] = stack.pop();
      break;
    case Print:
      nextToken();
      expression();
      resultPrint();
      break;
  }
};

const expression = () => {
  term();
  while ([Plus, Minus].indexOf(token.type) !== -1) {
    const operator = token.type;
    nextToken();
    term();
    operate(operator);
  }
};

const term = () => {
  factor();
  while ([Multi, Divi].indexOf(token.type) !== -1) {
    const operator = token.type;
    nextToken();
    factor();
    operate(operator);
  }
};

const factor = () => {
  switch (token.type) {
    case VarName:
      stack.push(symbolTable[token.value].value);
      break;
    case IntNum:
      stack.push(token.value);
      break;
    case Lparen:
      nextToken();
      expression();
      checkToken(Rparen);
      break;
  }
  nextToken();
};

const operate = (operator: number) => {
  const [d2, d1] = [stack.pop(), stack.pop()];
  if (d1 === undefined) { return; }
  switch (operator) {
    case Plus: stack.push(d1 + d2); break;
    case Minus: stack.push(d1 - d2); break;
    case Multi: stack.push(d1 * d2); break;
    case Divi: stack.push(d1 / d2); break;
  }
};

const resultPrint = () => {
  return stack.pop();
};

const checkToken = (tokenType: number): boolean => token.type === tokenType;
const isNum = (temp: string): boolean => !isNaN(+temp);
const isVar = (temp: string): boolean => /^[\w\$]+$/.test(temp);

export default { };
