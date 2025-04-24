// util/helpers.js

export const eq = (a, b) => a === b;

export const gt = (a, b) => a > b;

export const lt = (a, b) => a < b;

export const add = (a, b) => a + b;

export const sub = (a, b) => a - b;

export const range = (start, end) => {
  const arr = [];
  for (let i = start; i <= end; i++) arr.push(i);
  return arr;
};
