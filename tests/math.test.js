const { add, subtract } = require('../src/math');

describe('Math utilities', () => {
  test('adds two numbers correctly', () => {
    expect(add(2, 2)).toBe(4);
    expect(add(-1, 1)).toBe(0);
  });

  test('subtracts two numbers correctly', () => {
    expect(subtract(5, 3)).toBe(2);
    expect(subtract(1, 1)).toBe(0);
  });
});
