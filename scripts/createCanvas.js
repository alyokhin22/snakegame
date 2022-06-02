export default function createCanvas(canvas, canvasSize)
{

  /* Create canvas */

  canvas.style.gridTemplateColumns = `repeat(${canvasSize}, 1fr)`
  canvas.style.gridTemplateRows = `repeat(${canvasSize}, 1fr)`

  canvas.innerHTML = ''

  /* Fill the canvas */

  for(let i = 0; i < canvasSize; i++)
  {
    for(let _i = 0; _i < canvasSize; _i++)
    {
      let cell = document.createElement('div')
      cell.classList.add('cell')

      cell.setAttribute('data-pos-x', _i)
      cell.setAttribute('data-pos-y', i)

      canvas.appendChild(cell)
    }
  }
}
