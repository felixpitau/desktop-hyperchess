import React, { Component } from 'react'
import PieceRender from './pieceRender'

export default class GameView extends Component {
  constructor (props) {
    super(props)
    // ...
    this.state = {
      pieces: [],
      posScheme: [0, 1, 2, 3]
    }
    this.classNames = this.classNames.bind(this)
    this.setPieces = this.setPieces.bind(this)
  }

  componentWillMount (nextProps, nextState) {
    this.setPieces()
  }

  setPieces () {
    if (this.props.game !== null) {
      let pieces = this.props.game.pieces
      let pieceRenders = []
      for (let piece in pieces) {
        pieceRenders.push(<PieceRender key={piece} piece={pieces[piece]} posScheme={this.state.posScheme} />)
      }
      this.setState({
        pieces: pieceRenders
      })
    }
  }

  classNames () {
    return 'layer view ' + (this.props.active ? 'active' : '')
  }

  render () {
    return (
      <div id="game-view" className={this.classNames()}>
        <img id="game-board" src="images/chessboard.png" />
        <div id="game-pieces">
          {this.state.pieces}
        </div>
      </div>
    )
  }
}
