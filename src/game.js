import React, { Component } from 'react';
import Colonize from './colonization/colonize.js';


class Game extends Component {

	constructor(props){
		super(props);

    this.game = new Colonize();

		window.addEventListener('load', () => {		
			this.game.onload();
		});
	}

  render() {
    return (
      <div>
        <div id="screen"></div>
      </div>
    );
  }
}



export default Game;