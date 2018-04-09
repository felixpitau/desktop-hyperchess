import React, { Component } from 'react'
import electron, { remote } from 'electron'
import Hyperchess, { Game } from 'hyperchess'
import { game } from '../index'

const win = remote.getCurrentWindow()

export default class Menu extends Component {
  constructor (props) {
    super(props)

    this.state = { level: 'start' }
    this.handleSingleplayer = this.handleSingleplayer.bind(this)
    this.handleBack = this.handleBack.bind(this)
    this.handleNewGame = this.handleNewGame.bind(this)
    this.handleQuit = this.handleQuit.bind(this)
    this.classNames = this.classNames.bind(this)
  }

  handleSingleplayer () {
    // ...
    this.setState({
      level: 'singleplayer'
    })
  }

  handleNewGame () {
    this.setState({
      level: 'none'
    })
    this.props.onChange({
      state: {
        gameviewActive: true,
        menuActive: false
      }
    })
  }

  handleBack () {
    if (this.state.level === 'singleplayer') {
      this.setState({ level: 'start' })
    }
  }

  handleQuit () {
    win.close()
  }

  classNames () {
    return 'menu layer ' + (this.props.active ? 'active' : '')
  }

  render () {
    let singleplayerMenu = (
      <div className="items">
        <button className="back" onClick={this.handleBack} />
        <button onClick={this.handleNewGame}>New Game</button>
      </div>
    )
    let startMenu = (
      <div className="items">
        <button onClick={this.handleSingleplayer}>Singleplayer</button>
        <button onClick={this.handleQuit}>Quit</button>
      </div>
    )
    return (
      <div className={this.classNames()}>
        {this.state.level !== 'none' ? startMenu : ''}
        {this.state.level === 'singleplayer' ? singleplayerMenu : ''}
      </div>
    )
  }
}
