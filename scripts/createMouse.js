import {generateMousePos} from '../funcs.js'

export default function createMouse(canvasSize, mouseBody)
{
  do {
    let initialMousePos = generateMousePos(canvasSize)
    mouseBody = document.querySelector(`[data-pos-x="${initialMousePos[0]}"][data-pos-y="${initialMousePos[1]}"]`)
  }
  while(mouseBody && mouseBody.classList.contains('snakeBody'))

  mouseBody && mouseBody.classList.add('mouseBody')

  return mouseBody
}
