import { WebSnake } from '../snake';
const { JSDOM } = require('jsdom');
const dom = new JSDOM();
global.document = dom.window.document;


// Mock the DOM elements
global.document.getElementById = () => ({
  getContext: () => ({}),
  addEventListener: jest.fn(),
  classList: {
    remove: jest.fn(),
    add: jest.fn(),
  },
  width: 0,
  height: 0,
  innerText: '',
});

// Mock the Math object
global.Math.random = () => 0.5;

describe('Snake Game', () => {
  let game;
  let box;

  beforeEach(() => {
    box = 32;
    game = new WebSnake();
    game.snake = [{ x: 9 * box, y: 10 * box }];
    game.food = game.createFood();
  });

  it('should create food correctly', () => {
    expect(game.food).toEqual({ x: 9 * box, y: 12 * box });
  });

  it('should handle keyboard events', () => {

    game.handleKeydown({ keyCode: 37 });
    expect(game.direction).toBe('LEFT');

    game.handleKeydown({ keyCode: 38 });
    expect(game.direction).toBe('UP');

    // Test the remaining key codes
  });

  it('should detect collision correctly', () => {
    const head = { x: 9 * box, y: 10 * box };
    expect(game.collision(head, game.snake)).toBe(false);

    const selfCollideSnake = [...game.snake, { x: 9 * box, y: 10 * box }];
    expect(game.collision(head, selfCollideSnake)).toBe(true);
  });
});
