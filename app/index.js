/* globals PIXI */
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Hyperchess, { Game } from 'hyperchess'
import Menu from './components/menu'
import GameView from './components/gameview'
import electron, { remote } from 'electron'

const win = remote.getCurrentWindow()
let game = new Game()
let games = []

let debug = {
  mousePos: [0, 0],
  mouseGrid: [0, 0],
  gridPos: [-1, -1, -1, -1]
}

let pos = [-1, -1, -1, -1]
let inGrid = false
let selectedPiece = null

class Root extends Component {
  constructor (props) {
    super(props)
    this.state = {
      gameviewActive: false,
      menuActive: true,
      game: game
    }
    this.handleMin = this.handleMin.bind(this)
    this.handleMax = this.handleMax.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  handleMin () {
    win.minimize()
  }

  handleMax () {
    if (!win.isMaximized()) {
      win.maximize()
    } else {
      win.unmaximize()
    }
  }

  handleClose () {
    win.close()
  }

  onChange (e) {
    this.setState(e.state)
  }

  render () {
    return (
      <div>
        <div id="title-bar">
          <div id="title">
            <img src="./images/hyperchess-logo.svg" />
          </div>
          <div id="title-bar-buttons">
            <button id="min-button" onClick={this.handleMin}>
              <img src="./images/titlebar/min-button.svg" />
            </button>
            <button id="max-button" onClick={this.handleMax}>
              <img src="./images/titlebar/max-button.svg" />
            </button>
            <button id="close-button" onClick={this.handleClose}>
              <img src="./images/titlebar/close-button.svg" />
            </button>
          </div>
        </div>
        <div id="debug">
          <div>
            <span id="mouseposx" />
            <span id="mouseposy" />
          </div>
          <div>
            <span id="gridposx" />
            <span id="gridposy" />
          </div>
          <div>
            <span id="4dposx" />
            <span id="4dposy" />
            <span id="4dposxx" />
            <span id="4dposyy" />
          </div>
          <div>
            <span id="ingrid" />
          </div>
        </div>
        <GameView onChange={this.onChange} game={this.state.game} active={this.state.gameviewActive} />
        <div id="game-moves" />
        <Menu onChange={this.onChange} active={this.state.menuActive} />
      </div>
    )
  }
}

let rootDOM = <Root />

ReactDOM.render(
  rootDOM,
  document.getElementById('app')
)

console.log(rootDOM)

function setGridPos (e) {
  let gvRect = document.getElementById('game-view').getBoundingClientRect()
  let mousepos = [e.clientX - gvRect.left, e.clientY - gvRect.top]
  let gridpos = [
    Math.floor(mousepos[0] / (gvRect.width / 21)),
    Math.floor(mousepos[1] / (gvRect.width / 21))
  ]
  pos = [
    Math.floor(gridpos[0] / 5),
    Math.floor(gridpos[1] / 5),
    gridpos[0] % 5 - 1,
    gridpos[1] % 5 - 1
  ]
  inGrid = !pos.some(x => (x < 0 || x > 3))
}

window.onload = () => {
  document.addEventListener('mousemove', (e) => {
    setGridPos(e)
    document.getElementById('4dposx').innerHTML = pos[0]
    document.getElementById('4dposy').innerHTML = pos[1]
    document.getElementById('4dposxx').innerHTML = pos[2]
    document.getElementById('4dposyy').innerHTML = pos[3]
    document.getElementById('ingrid').innerHTML = inGrid
  })

  document.addEventListener('mousedown', (e) => {
    setGridPos(e)
    for (let p in game.pieces) {
      let piece = game.pieces[p]
      if (inGrid &&
          game.turn === piece.side &&
          !piece.captured &&
          piece.spot[0] === pos[0] &&
          piece.spot[1] === pos[1] &&
          piece.spot[2] === pos[2] &&
          piece.spot[3] === pos[3]) {
        console.log(' from ' + pos)
        selectedPiece = piece
        console.log(piece)
        break
      }
    }
  })

  document.addEventListener('mouseup', (e) => {
    setGridPos(e)
    if (selectedPiece !== null) {
      for (let m in selectedPiece.possibleMoves) {
        let move = selectedPiece.possibleMoves[m]
        if (inGrid &&
            move.spot[0] === pos[0] &&
            move.spot[1] === pos[1] &&
            move.spot[2] === pos[2] &&
            move.spot[3] === pos[3]) {
          console.log(' to ' + pos)
          let success = game.makeMove(move)
          selectedPiece.pieceRender.updatePosition()
          if (move.capture) {
            move.capturedPiece.pieceRender.updatePosition()
          }
          if (success) {
            let elGameMoves = document.getElementById('game-moves')
            elGameMoves.insertAdjacentHTML('beforeend', '<div class="' + (move.piece.side === 0 ? 'white' : 'black') + '">' + move.description + '</div>')
          }
          console.log(success ? ' Piece moved! ' : ' Piece not moved. ')
          console.log(move)
          console.log(selectedPiece)
          selectedPiece = null
          break
        }
      }
    }
  })
}
