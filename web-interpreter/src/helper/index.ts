interface Token {
  type: number;
  value: number|string;
}

const Print: number = 0;
const Lparen: number = 1;
const Rparen: number = 2;
const Plus: number = 3;
const Minus: number = 4;
const Multi: number = 5;
const Divi: number = 6;
const Assign: number = 7;
const IntNum: number = 8;
const varName: number = 9;
const opTable: any = {
  '(': Lparen,
  ')': Rparen,
  '+': Plus,
  '-': Minus,
  '*': Multi,
  '/': Divi,
  '=': Assign,
  '?': Print,
};

let lastToken = 10;
const symbolTable: any = {};
const stack = [];

const nextTkn = (code: string): Token => {
  const temp = code.trim();
  const first = temp[0];
  let i = 0;
  let token: Token;
  switch (true) {
    case opTable[first] !== undefined:
      i++;
      token = { type: opTable[first], value: 0 };
      break;
    case isNum(first):
      while (isNum(temp[i])) { i++; }
      token = { type: IntNum, value: +temp.substr(0, i) };
      break;
    default:
      while (isVar(temp.substr(0, i))) { i++; }
      token = { type: varName, value: temp.substr(0, i) };
      break;
  }
  return token;
}

const sattement = () => {

};

const expression = () => {
  
}

const term = () => {

}

const factor = () => {

}

const operate = () => {

}

const checkToken = () => {
  
}

const isNum = (temp: string): boolean => !isNaN(+temp);
const isVar = (temp: string): boolean => /^[\w\$]+$/.test(temp);
