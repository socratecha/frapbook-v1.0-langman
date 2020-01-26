import React, { Component } from 'react';
import styled from 'styled-components';

const BaseLetterButton = styled.button`
    font-family: 'IBM Plex Mono', monospace;
    font-size: 30px;
    padding: 0em 0.9em 1.3em 0.3em;
    margin: 0.1em;
    border-radius: 0.5em;
    text-align: center;
    width: 1em;
    height: 1.2em;
    background-color: ${props => (props.used ? "#777" : "#ccc")};
    &:hover {
       ${props => props.used ? "" : "background-color: #eee;"}
    };
`;

class LetterButton extends Component {
    render() {
        const { letter, wasUsed, makeGuess } = this.props;
        return (
            <BaseLetterButton
              type="button"
              used={wasUsed}
              onClick={ wasUsed ? null : makeGuess }>
              {letter}
            </BaseLetterButton>
        );
    }
}
const BoxPanel = styled.div`
    display: inline-block;
    font-size: 30px;
    background-color: #444;
    color: #fff;
    border-radius: 26px;
    padding: 20px;
    margin: 10px;
`;

class ButtonPanel extends Component {
    alphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M',
	        'N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

    makeGuess(letter) {
        return () => {
            this.props.onGuess(letter);
        };
    }
    
    constructor(props) {
        super(props);
        this.makeGuess = this.makeGuess.bind(this);
    }
    
    render() {
        const usedLetters = this.props.usedLetters.toUpperCase();
        const letterButtons = this.alphabet.map(
            (letter) => {
                return <LetterButton
                         key={letter}
                         letter={letter}
                         wasUsed={usedLetters.includes(letter)}
                         makeGuess={this.makeGuess(letter)}
                       />;
            }
        );
        return (
            <BoxPanel>
              { letterButtons }
            </BoxPanel>
        );
    }
}

class StartForm extends Component {
    render() {
        return <div>Start Form</div>;
    }
}

class PlayAgainPanel extends Component {
    render() {
        return <div>Play Again Panel</div>;
    }
}

export { LetterButton, ButtonPanel, StartForm, PlayAgainPanel };