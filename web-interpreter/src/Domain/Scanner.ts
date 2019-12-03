import {
  Token, opTable, IntNum, VarName,
  printKey, programKey, varKey, beginKey, endKey,
} from './TokenDefined';
import { codeContainer } from './CodeContainer';
import { isNumChar, isNumStr, isVar } from '@/Helper';

export const nextToken = (): Token => {
  const code = codeContainer.getCode();
  const first = codeContainer.getFirst();
  const last = code.length;
  let token: Token;
  let i = 0;
  switch (true) {
    case opTable[first] !== undefined:
      i = 1;
      token = { type: opTable[first], value: 0 };
      break;
    case code.indexOf(printKey) === 0:
      i = printKey.length;
      token = { type: opTable[printKey], value: 0 };
      break;
    case isNumChar(first):
      while (isNumStr(code.substr(0, i + 1)) && i < last) { i++; }
      token = { type: IntNum, value: +code.substr(0, i) };
      break;
    default:
      while (isVar(code.substr(0, i + 1)) && i < last) { i++; }
      token = { type: VarName, value: code.substr(0, i) };
      break;
  }
  codeContainer.setCode(code.substr(i));
  return token;
};

export default { };
