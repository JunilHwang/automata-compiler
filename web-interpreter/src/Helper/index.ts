export const isNum = (temp: string): boolean => !isNaN(+temp);
export const isVar = (temp: string): boolean => /^[\w\$]+$/.test(temp);
