import React, { Component } from 'react';
import { GlobalStyle } from './fonts';
import axios from 'axios';
import { SignInScreen, PlayScreen, WinScreen, LoseScreen } from './screens';

const APIURL = 'http://localhost:5000/';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gameStatus: 'logged out'
        };
        this.startGame = this.startGame.bind(this);
        this.guessLetter = this.guessLetter.bind(this);
        this.playAgain = this.playAgain.bind(this);
        this.quitGame  = this.quitGame.bind(this);
    };

    startGame(nameValue, langValue) {
        axios.post(APIURL + 'api/games',
                   { username: nameValue, language: langValue })
            .then( response => {
                console.log(response.data);
                if (response.data.message === 'success') {
                    const gameId = response.data.game_id;
                    this.setState({
                        username:nameValue,
                        language:langValue,
                        gameId:gameId,
                    });
                    axios.get(APIURL + `api/games/${gameId}`)
                        .then(response2 => {
                            this.setState({
                                badGuesses: response2.data.bad_guesses,
                                guessed: response2.data.guessed,
                                playerId: response2.data.player,
                                revealWord: response2.data.reveal_word,
                                usage: response2.data.usage,
                                gameStatus: 'active'
                            });
                        })
                        .catch( error => {
                            alert('Oops. Server is not cooperating.');
                        });
                };
            })
            .catch( error => {
                alert('Oops. Server is not cooperating.');
            });
    }
    
    guessLetter(letter) {
        const gameId = this.state.gameId;
        axios.put(APIURL + `api/games/${gameId}`, {letter})
            .then(response => {
                this.setState({
                    badGuesses: response.data.bad_guesses,
                    guessed: response.data.guessed,
                    revealWord: response.data.reveal_word,
                    gameStatus: response.data.result,
                    secretWord: response.data.secret_word
                });
                console.log(response.data);
            });   
    }

    playAgain(langValue) {
        this.startGame(this.state.username, langValue);            
    }
    quitGame() {
        this.setState({gameStatus: 'logged out'});
    }
    render() {
        const { gameStatus } = this.state;
        let screen = <></>;
        if (gameStatus === 'logged out') {
            const startGame = this.startGame;
            screen = <SignInScreen clickStart={ startGame }/>;        
        } else if (gameStatus === 'active') {
            const { usage, revealWord, guessed, badGuesses } = this.state;
            const guessLetter = this.guessLetter;
            screen = <PlayScreen
                     usage = {usage}
                     blanks = {revealWord}
                     usedLetters = {guessed}
                     numBadGuesses = {badGuesses}
                     onGuess = {guessLetter}
                   />;        
        } else if (gameStatus === 'won') {
            const { language } = this.state;
            const playAgain = this.playAgain;
            const quitGame = this.quitGame;
            screen = <WinScreen
                     lang={language}
                     clickPlayAgain={playAgain}
                     clickQuit={quitGame}
                   />;
        } else if (gameStatus === 'lost') {
            const { usage, secretWord, language } = this.state;
            const playAgain = this.playAgain;
            const quitGame = this.quitGame;
            screen = <LoseScreen
                     usage = {usage}
                     blanks = {secretWord}
                     lang = {language}
                     clickPlayAgain = {playAgain}
                     clickQuit = {quitGame}
                   />;
        } else {
            screen = <div>Unexpected {gameStatus} </div>;
        }
        return <><GlobalStyle/>{screen}</>;
    }
}

export default App;
