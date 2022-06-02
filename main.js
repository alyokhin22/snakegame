import createCanvas from './scripts/createCanvas.js'
import createSnake from './scripts/createSnake.js'
import createMouse from './scripts/createMouse.js'

let canvas = document.getElementById('snakeGameCanvas')
let gameSettingsEl = document.getElementById('gameSettings')
const formEl = document.querySelector('form')

let direction = 'right'
let interval
let snakeBody = []
let mouseBody
let steps
let mode = 'settings'

// Function set mode
function setMode(_mode)
{
  if(_mode === 'game')
  {
    gameSettingsEl.style.display = 'none'
  }
  else if(_mode === 'settings')
  {
    gameSettingsEl.style.display = 'block'
    clearGame()
  }

  mode = _mode
}

// Implement nextTick function
function nextTick(canvasSize, difficulty)
{

  // Get snake head position
  let snakeHeadPos = [
    +snakeBody[0].getAttribute('data-pos-x'),
    +snakeBody[0].getAttribute('data-pos-y')
  ]

  // Make snake head snake tail
  snakeBody[0].classList.remove('snakeHead')

  // Remove snake tail from prev position
  snakeBody[snakeBody.length-1].classList.remove ('snakeBody')
  snakeBody.pop()

  /* Place snake head to the next cell */

  if(direction === 'right')
    snakeBody.unshift(document.querySelector(`[data-pos-x="${(snakeHeadPos[0] < canvasSize-1 ? snakeHeadPos[0] : (
      difficulty === 'hard' ? stopGame() : -1
    )) + 1}"][data-pos-y="${snakeHeadPos[1]}"]`))

  if(direction === 'left')
    snakeBody.unshift(document.querySelector(`[data-pos-x="${(snakeHeadPos[0] ? snakeHeadPos[0] : (
      difficulty === 'hard' ? stopGame() : canvasSize
    )) - 1}"][data-pos-y="${snakeHeadPos[1]}"]`))

  if(direction === 'up')
    snakeBody.unshift(document.querySelector(`[data-pos-x="${snakeHeadPos[0]}"][data-pos-y="${(snakeHeadPos[1] ? snakeHeadPos[1] : (
      difficulty === 'hard' ? stopGame() : canvasSize
    )) - 1}"]`))

  if(direction === 'down')
    snakeBody.unshift(document.querySelector(`[data-pos-x="${snakeHeadPos[0]}"][data-pos-y="${(snakeHeadPos[1] < canvasSize-1 ? snakeHeadPos[1] : (
      difficulty === 'hard' ? stopGame() :  -1
    )) + 1}"]`))

  // Handle mouse
  if(
    snakeBody[0].getAttribute('data-pos-x') === mouseBody.getAttribute('data-pos-x')
    &&
    snakeBody[0].getAttribute('data-pos-y') === mouseBody.getAttribute('data-pos-y')
  ) {
    mouseBody.classList.remove('mouseBody')

    let snakeBodyEndPosX = snakeBody[snakeBody.length - 1].getAttribute('data-pos-x')
    let snakeBodyEndPosY = snakeBody[snakeBody.length - 1].getAttribute('data-pos-y')
    snakeBody.push(document.querySelector(`[data-pos-x="${snakeBodyEndPosX}"][data-pos-y="${snakeBodyEndPosY}"]`))
    mouseBody = createMouse(canvasSize, mouseBody)
  }

  // Handle self eating
  if(difficulty !== 'easy' && snakeBody[0].classList.contains('snakeBody'))
  {
    stopGame()
  }

  snakeBody.forEach((cell, i) =>
  {
    if(!i) cell.classList.add('snakeHead')
    cell.classList.add('snakeBody')
  })

  // Update steps
  steps = true
}

// Start game function
function startGame(canvasSize, snakeSize, cellsPerSecond, difficulty)
{
  // Clear game
  clearGame()

  // Create canvas
  createCanvas(canvas, canvasSize)

  //// Create a snake
  createSnake(snakeSize, canvasSize, snakeBody)

  // Create a mouse
  mouseBody = createMouse(canvasSize, mouseBody)

  // Run the game
  interval = setInterval(() => nextTick(canvasSize, difficulty), 1000 / cellsPerSecond)
}

function clearGame()
{
  clearInterval(interval)

  snakeBody.forEach((el) => {
    el.classList = ''
  })

  mouseBody && (mouseBody.classList = '')

  snakeBody = []
  mouseBody = null

  direction = 'right'
}

function stopGame()
{
  alert('Игра окончена')
  setMode('settings')
  clearInterval(interval)
}

function getParams(entries)
{
  let valid

  // Fetch params
  const params = {}

  for(const p of entries)
  {
    params[p[0]] = p[1]
  }

  // Prepare parameters
  const snakeSize = params.snakeSize ? +params.snakeSize : null
  const canvasSize = params.canvasSize ? +params.canvasSize : null
  const snakeSpeed = params.snakeSpeed ? +params.snakeSpeed : null
  const difficulty = params.difficulty ?? null

  // Validate parameters
  valid = !isNaN(canvasSize) && canvasSize >= 5 && canvasSize <= 100
  valid = valid && !isNaN(snakeSize) && snakeSize >= 3 && snakeSize <= canvasSize - 2
  valid = valid && !isNaN(snakeSpeed) && snakeSpeed >= 1 && snakeSpeed <= 5
  valid = valid && ['easy', 'medium', 'hard'].includes(difficulty)

  if(!valid) return null
  else return {
    snakeSpeed,
    snakeSize,
    canvasSize,
    difficulty
  }
}

window.onload = () =>
{

  createCanvas(canvas, 10)

  /* Read params */
  const params = getParams(new URLSearchParams(location.search))

  // Start game if params
  if(params)
  {
    setMode('game')
    startGame(params.canvasSize, params.snakeSize, params.snakeSpeed, params.difficulty)
  }

  formEl.onsubmit = onFormSubmit
}

// Change direction on key down
window.addEventListener('keydown', (e) =>
{
  if(!steps || mode !== 'game') return

  const _direction = e.key.replace('Arrow', '').toLowerCase()

  if(
    direction === 'right' && _direction === 'left'
    ||
    direction === 'left' && _direction === 'right'
    ||
    direction === 'up' && _direction === 'down'
    ||
    direction === 'up' && _direction === 'down'
  ) return

  direction = _direction
  steps = false
})

/* Handle form submit */

function onFormSubmit(e)
{
  const formData = new FormData(formEl)

  const params = getParams(formData)

  // Start game if letGameStarted
  if(params)
  {
    setMode('game')
    startGame(params.canvasSize, params.snakeSize, params.snakeSpeed, params.difficulty)
  }

  else alert('Форма заполнена не правильно')

  e.preventDefault()
}
