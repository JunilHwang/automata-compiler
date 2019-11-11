import fs from 'fs';

class Scanner {
  private opTable = {
    '+': 0,
    '-': 1,
    '*': 2,
    '/': 3,
    '=': 4,
    '%': 5,
    ')': 6,
    '(': 7,
    ';': 8,
    ',': 9,
    '[': 10,
    ']': 11,
    '{': 12,
    '}': 13,
    '<': 14,
    '>': 15,
    '==': 16,
    '<=': 17,
    '>=': 18,
    '!=': 19,
    ':': 20,
    'int': 21,
    'char': 22,
    'float': 23,
    'void': 24,
    'return': 25,
    '#include': 26,
    'if': 27,
    'else': 28,
    'for': 29,
    'while': 30,
    'switch': 31,
    'case': 32,
    'break': 33,
    'default': 34,
    'number': 35,
    'string': 36,
    'line_comment': 37,
    'block_comment': 38,
    ' ': 39,
    '\t': 40,
    "\r\n": 41,
    "\n": 42,
    "\r": 43,
  }
  private symbolTable = {}
  private lastSymbolNumber: number = 44;
  constructor (code: string) {
    let i: number = 0,
        last: number = code.length
    let token = ''
    const tokenList: number[] = []
    const { opTable, symbolTable } = this
    while (i < last) {
      const now = code[i]
      if (['"', "'"].indexOf(now) !== -1) {
        const next: number = code.indexOf(now, i + 1) + 1
        tokenList.push(opTable['string'])
        i = next;
        continue
      }
      if (i < last - 1 && ['/*', '//'].indexOf(`${now}${code[i + 1]}`) !== -1) {
        const commentStart: string = `${now}${code[i + 1]}`
        const chk: boolean = commentStart === '/*'
        const commentType: string = chk ? 'block_comment' : 'line_comment'
        const next: number = chk ? code.indexOf('*/', i) + 2 : code.indexOf("\r\n", i)
        tokenList.push(opTable[commentType])
        i = next + 1;
        continue;
      }
      switch (true) {
        case opTable[token] !== undefined :
          tokenList.push(opTable[token])
          token = ''
        break;
        case opTable[now] !== undefined :
          if (token.length > 0) {
            switch (true) {
              case /^([0-9]+)$/.test(token) :
              case /^([0-9]+\.[0-9]+)$/.test(token) :
                tokenList.push(opTable['number'])
                token = ''
              break;
              default :
                if (symbolTable[token] === undefined) {
                  symbolTable[token] = this.lastSymbolNumber++
                }
                tokenList.push(symbolTable[token]);
              break;
            }
          }
          tokenList.push(opTable[now]);
          token = '';
        break;
        default :
          token += now
        break;
      }
      i++;
    }
    console.log(opTable)
    console.log(symbolTable)
  }
}
fs.readFile('./test.c', 'utf-8', (err, buffer) => {
  new Scanner(buffer);
});