import React, { Component } from 'react'

export default class pieceRender extends Component {
  constructor (props) {
    super(props)
    // console.log(props.piece)
    this.state = {
      pieceImg: ('images/piece/' + (props.piece.side === 0 ? 'white' : 'black') + '-' + props.piece.type + '.svg'),
      captured: props.piece.captured,
      style: {
        top: 'calc(' + (((props.piece.spot[props.posScheme[1]] * 5) + 1) + (props.piece.spot[props.posScheme[3]])) + ' * ' + ((1 / 21) * 100) + '%)',
        left: 'calc(' + (((props.piece.spot[props.posScheme[0]] * 5) + 1) + (props.piece.spot[props.posScheme[2]])) + ' * ' + ((1 / 21) * 100) + '%)'
      }
    }
    props.piece.pieceRender = this
    this.updatePosition = this.updatePosition.bind(this)
    this.classNames = this.classNames.bind(this)
  }

  componentDidMount () {
    this.updatePosition()
  }

  updatePosition () {
    let piece = this.props.piece
    let posScheme = this.props.posScheme
    this.setState({
      style: {
        top: 'calc(' + (((piece.spot[posScheme[1]] * 5) + 1) + (piece.spot[posScheme[3]])) + ' * ' + ((1 / 21) * 100) + '%)',
        left: 'calc(' + (((piece.spot[posScheme[0]] * 5) + 1) + (piece.spot[posScheme[2]])) + ' * ' + ((1 / 21) * 100) + '%)'
      },
      captured: piece.captured
    })
  }

  classNames () {
    return 'piece' + (this.state.captured ? ' captured' : '')
  }

  render () {
    let tips = (
      <div className="tips">
        <div className="tip black"> {this.props.piece.type} </div>
      </div>
    )
    return (
      <div className={this.classNames()} style={this.state.style}>
        <img src={this.state.pieceImg} />
        {tips}
      </div>
    )
  }
}
