const computer = v => {
  const str = v.trim().replace(/\s+/g, '')
  const len = str.length;
  const nums: number[] = []
  const opers: any[] = []
  let number = ''
  for (let i = 0; i < len; i++) {
    const now = str[i]
    if (['+', '-', '*', '/'].indexOf(now) !== -1) {
      nums.push(~~number)
      opers.push(now)
      number = ''
    } else {
      number += now
      if (i === len - 1) {
        nums.push(~~number)
      }
    }
  }
  let now = nums.shift()
  while (opers[0] !== undefined) {
    const oper = {
      '+': (n1, n2) => n1 + n2,
      '-': (n1, n2) => n1 - n2,
      '*': (n1, n2) => n1 * n2,
      '/': (n1, n2) => n1 / n2,
    }[opers.shift()];
    now = oper(now, nums.shift())
  }
  return now
}

console.log(computer('1 + 2 - 3'))
console.log(computer('1 * 2 - 3'))
console.log(computer('1 * 2 + 3'))
console.log(computer('1 * 2 / 3'))