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

const FormInput = styled.input`
    padding:  3px;
    margin:   6px;
    text-align: center;
    font-family: inherit;
`;

const FormSelect = styled.select`
    padding:  3px;
    margin:   6px;
    text-align: center;
    font-family: inherit;
`;

const ActionButton = styled.button`
    padding: 5px;
    margin: 3px;
    background-color: #ccc;
    font-size: 110%;
    font-family: inherit;
`;

class StartForm extends Component {
    constructor(props) {
        super(props);
        this.state = { nameValue: "", langValue: "en" };
        this.onNameChange = this.onNameChange.bind(this);
        this.onLangChange = this.onLangChange.bind(this);
        this.clickWrapper = this.clickWrapper.bind(this);
    };

    onNameChange(event) {
        this.setState({ nameValue: event.target.value });
    };

    onLangChange(event) {
        this.setState({ langValue: event.target.value });
    };

    clickWrapper(event) {
        const { nameValue, langValue } = this.state;
        this.props.clickStart(nameValue, langValue);
    };
    
    render() {
        const { clickWrapper, onNameChange, onLangChange } = this;
        const { nameValue, langValue } = this.state;
                
        return <div>
                 <form>
                   <label htmlFor="nameInput">Enter your name</label>
                   <FormInput
                     value={nameValue}
                     type="text"
                     name="name"
                     onChange={onNameChange}
                   />
                   <br/>
                   <label htmlFor="languageInput">Choose a Language</label>
                   <FormSelect
                     onChange={onLangChange}
                     value={langValue}
                     id="languageInput"
                     name="language">
                     <option value="en">English</option>
                     <option value="fr">French</option>
                     <option value="es">Spanish</option>
                   </FormSelect>
                   <br/>
                   <ActionButton
                     type="button"
                     onClick={clickWrapper}
                   >
                     Start a Game
                   </ActionButton>
                 </form>
               </div>;
    }
}
class PlayAgainPanel extends Component {
    constructor(props) {
        super(props);
        this.state = { langValue: props.lang };
        this.onLangChange = this.onLangChange.bind(this);
        this.clickWrapper = this.clickWrapper.bind(this);
    };

    onLangChange(event) {
        this.setState({ langValue: event.target.value });
    }

    clickWrapper(event) {
        const { langValue } = this.state;
        this.props.clickPlayAgain(langValue);
    };
    
    render() {
        const { clickWrapper, onLangChange } = this;
        const { langValue } = this.state;
        const { clickQuit } = this.props;
                
        return <div>
                 <form>
                   <label htmlFor="languageInput">
                     Choose a Language
                   </label>
                   <FormSelect
                     onChange={onLangChange}
                     value={langValue}
                     id="languageInput"
                     name="language">
                     <option value="en">English</option>
                     <option value="fr">French</option>
                     <option value="es">Spanish</option>
                   </FormSelect>
                   <ActionButton
                     type="button"
                     onClick={clickWrapper}>
                     Play Again
                   </ActionButton>
                   <ActionButton
                     type="button"
                     onClick={clickQuit}>
                     Quit
                   </ActionButton>
                 </form>
               </div>;
    }
} 
export { LetterButton, ButtonPanel, StartForm, PlayAgainPanel };
