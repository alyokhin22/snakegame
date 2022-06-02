export const randomNumber = (min, max) =>
  Math.round(Math.random() * (max-min) + min)

export const generateSnakePos = (initialSnakeSize, canvasSize) =>
  [randomNumber(initialSnakeSize, canvasSize-1), randomNumber(0 , canvasSize-1)]

export const generateMousePos = (canvasSize) =>
  [randomNumber(0, canvasSize-1), randomNumber(0, canvasSize-1)]
