import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { addDecorator } from '@storybook/react';

import { LetterButton, ButtonPanel, StartForm, PlayAgainPanel } from '../buttons';
import { GlobalStyle } from '../fonts';
addDecorator(s => <><GlobalStyle />{s()}</>);


storiesOf('Button-related Components', module)
    .add('LetterButton', () => (
        <div>
          <h2>LetterButton(letter, wasUsed, makeGuess)</h2>
          <ul>
            <li>letter - the button text, assumed to be one character</li>
            <li>wasUsed - (Boolean) whether the button was used; affects styling</li>
            <li>makeGuess - callBack to use on button click</li>
          </ul>
          <h3>Already used</h3>
          <LetterButton letter="A" wasUsed={true}
                        makeGuess={action('click-A')}/>
          <h3>Not yet used</h3>
          <LetterButton letter="B" wasUsed={false}
                        makeGuess={action('click-B')}/>
        </div>
    ))
    .add('ButtonPanel', () => (
        <div>
          <h2>ButtonPanel(language, onGuess)</h2>
          <ul>
            <li>onGuess - a callback that takes the guessed letter</li>
            <li>usedLetters - string of already-guessed letters</li>
          </ul>
          <h3>Used Letters rlstine</h3>
          <ButtonPanel onGuess={action('guessed')} usedLetters="rlstine"/>
          <h3>Used Letters senorita</h3>
          <ButtonPanel onGuess={action('guessed')} usedLetters="senorita"/>
          <h3>Used letters mondieu</h3>
          <ButtonPanel onGuess={action('guessed')} usedLetters="mondieu"/>
        </div>
    ))
    .add('StartForm', () => <StartForm />)
    .add('PlayAgainPanel', () => <PlayAgainPanel />)
;
