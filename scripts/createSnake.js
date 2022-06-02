import {generateSnakePos} from '../funcs.js'

export default function createSnake(snakeSize, canvasSize, snakeBody)
{
  const initialSnakePos = generateSnakePos(snakeSize, canvasSize)

  for(let i = 0; i < snakeSize; i++)
  {
    snakeBody.push(
      document.querySelector(`[data-pos-x="${initialSnakePos[0]-i}"][data-pos-y="${initialSnakePos[1]}"]`)
    )
  }

  snakeBody.forEach((cell, i) =>
  {
    if(!i) cell.classList.add('snakeHead')
    cell.classList.add('snakeBody')
  })
}
