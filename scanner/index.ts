import Scanner from './Scanner'
import fs from 'fs'

// test.c를 읽어들인 후 Scanner에게 넘김
fs.readFile('./test.c', 'utf-8', (err, buffer) => {
  const scanner = new Scanner(buffer)
  scanner.result()
})