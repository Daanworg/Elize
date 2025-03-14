const calculator = require('../src/calculator');

describe('Calculator', () => {
    test('adds two numbers correctly', () => {
        expect(calculator.add(2, 3)).toBe(5);
    });

    test('subtracts two numbers correctly', () => {
        expect(calculator.subtract(5, 2)).toBe(3);
    });
});
