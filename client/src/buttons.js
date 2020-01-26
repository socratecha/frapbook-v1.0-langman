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
class ButtonPanel extends Component {
    render() {
        return <div>Button Panel</div>;
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
