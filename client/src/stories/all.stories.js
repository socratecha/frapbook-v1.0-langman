import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { addDecorator } from '@storybook/react';

import { LetterButton, ButtonPanel, StartForm, PlayAgainPanel } from '../buttons';
import { Banner, ResultBanner, UsageAndBlanks } from '../components';
import { Gallows } from '../gallows';
import { SignInScreen, WinScreen, LoseScreen, PlayScreen } from '../screens';
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
    .add('StartForm', () => (
        <div>
          <h2>StartForm(clickStart)</h2>
          <ul>
            <li>ClickStart - game starting callback, takes name and language</li>
          </ul>
          <StartForm clickStart={action('start-game')} />
        </div>
    ))
    .add('PlayAgainPanel', () => (
        <div>
          <h2>PlayAgainPanel(lang, clickPlayAgain)</h2>
          <ul>
            <li>lang - the language in which the last game was played</li>
            <li>clickPlayAgain - callback taking the new language choice</li>
            <li>clickQuit - callback to quit playing</li>
          </ul>
          <h3>Default English</h3>
          <PlayAgainPanel
            lang="en"
            clickPlayAgain={action('play-again')}
            clickQuit={action('quit-game')}
          />
          <h3>Default French</h3>
          <PlayAgainPanel
            lang="fr"
            clickPlayAgain={action('play-again')}
            clickQuit={action('quit-game')}
          />
        </div>
    ))
;

storiesOf('Banners and Displays', module)
    .add('Banner', () => (
        <div>
          <h2>Banner(full)</h2>
            <p>This component includes both Banner and ShortTitle
            from the design docs.</p>
          <ul>
            <li>full - truthy means wide title is shown with subtitle,
                       otherwise shows just short title</li>
          </ul>
          <h3>Full Title</h3>
          <Banner full={true}/>
          <h3>Short Title</h3>
          <Banner full={false}/>
        </div>
    ))
    .add('ResultBanner', () => (
        <div>
          <h2>Result Banner</h2>
          <ul>
            <li>winResult - truthy means the player won, otherwise the player lost</li>
          </ul>
          <h3>Player Won the Game</h3>
          <ResultBanner winResult={true}/>
          <h3>Player Lost the Game</h3>
          <ResultBanner winResult={false}/>
        </div>
    ))
    .add('UsageAndBlanks', () => (
        <div>
          <h2>UsageAndBlanks(usage, blanks, showBlanks)</h2>
          <p>This component uses the non-React function prepareUsage.</p>
          <ul>
            <li>usage - usage example with guess word as underscores</li>
            <li>blanks - guessed/non-guessed letters, like "h_ml_t"</li>
            <li>showBlanks - whether to show blanks separately or in usage</li>
          </ul>          
          <h3>With blanks</h3>
          <UsageAndBlanks
            usage="The sky loomed dark and ______."
            blanks="__oo_y"
            showBlanks={true}
          />
          <h3>Without blanks</h3>
          <UsageAndBlanks
            usage="The sky loomed dark and ______."
            blanks="gloomy"
            showBlanks={false}
          />
        </div>
    ))
;
storiesOf('Gallows', module)
    .add('Gallows description', () => (
        <div>
          <h2>Gallows(badGuesses)</h2>
          <ul>
            <li>badGuesses - number (0 to 6) of parts to draw</li>
          </ul>
          <Gallows />
        </div>
    ))
    .add('Gallows gallery', () => (
        <div>
          <Gallows badGuesses={6}/>
          <Gallows badGuesses={5}/>
          <Gallows badGuesses={4}/>
          <Gallows badGuesses={3}/>
          <Gallows badGuesses={2}/>
          <Gallows badGuesses={1}/>
          <Gallows badGuesses={0}/>
        </div>
    ))
;

storiesOf('Screens', module)
    .add('SignInScreen', () => (
        <div>
          <h2>SignInScreen(clickStart)</h2>
          <ul>
            <li>clickStart - game-starting callback; gets name, language</li>
          </ul>
          <SignInScreen clickStart={action('start-game')}/>
        </div>
    ))
    .add('WinScreen', () => (
        <div>
          <h2>WinScreen(lang, playAgain, clickQuit)</h2>
          <ul>
            <li>lang - the language in which the last game was played</li>
            <li>clickPlayAgain - callback taking the new language choice</li>
            <li>clickQuit - callback to quit playing</li>
          </ul>
          <h3>Expecting English</h3>
          <WinScreen lang="en" clickPlayAgain={action('play-again')}
                     clickQuit={action('quit-game')}/>
          <h3>Expecting Spanish</h3>
          <WinScreen lang="es" clickPlayAgain={action('play-again')}
                     clickQuit={action('quit-game')}/>
        </div>
    ))
    .add('LoseScreen', () => (
        <div>
          <h2>LoseScreen()</h2>
          <ul>
            <li>usage - the usage example from the game just ending</li>
            <li>blanks - the word to be guessed for the game just ending</li>
            <li>lang - the language in which the last game was played</li>
            <li>clickPlayAgain - callback taking the new language choice</li>
            <li>clickQuit - callback to quit playing</li>
          </ul>
          <h3>English Example</h3>
          <LoseScreen
            usage="Therefore, send not to know for whom the bell _____, it tolls for thee."
            blanks="tolls"
            lang="en"
            clickPlayAgain={action('play-again')}
            clickQuit={action('quit-game')}
          />
          <h3>Spanish Example</h3>
          <LoseScreen
            usage="Los _________ nunca abandonan y los que abandonan nunca ganan."
            blanks="ganadores"
            lang="es"
            clickPlayAgain={action('play-again')}
            clickQuit={action('quit-game')}
          />
        </div>
    ))
    .add('PlayScreen', () => (
        <div>
          <h2>PlayScreen(usage, blanks, usedLetters, numBadGuesses, onGuess)</h2>
          <ul>
            <li>usage - the usage example provided as a clue</li>
            <li>blanks - blanks and right guesses for the secret word</li>
            <li>usedLetters - a string of letters that have been guessed</li>
            <li>numBadGuesses - number of wrong guesses</li>
            <li>onGuess - callback to use when guessing a letter</li>
          </ul>
          <h3>Typical Game</h3>
          <PlayScreen
            usage="All happy families are alike; each unhappy ______ is unhappy in its own way."
            blanks="_a____"
            usedLetters="acr"
            numBadGuesses={2}
            onGuess={action('guess')}
          />
        </div>
    ))
;
