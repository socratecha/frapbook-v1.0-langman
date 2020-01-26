import React, { Component } from 'react';
import styled from 'styled-components';

import { ButtonPanel, StartForm, PlayAgainPanel } from './buttons';
import { Banner, ResultBanner, UsageAndBlanks } from './components';
import { Gallows } from './gallows';

import { keyframes } from 'styled-components';

const FortySixtyGrid = styled.div`
    display: grid;
    grid-template-columns: 40% 60%;
    width: 600px;
    background-color: #ddd;
    font-family: 'Josefin Slab', serif;
`;

const FullWidthDiv = styled.div`
    grid-column: 1 / 3;
    ${props => props.spacer && 'padding-bottom: 20px;'}
`;

const PositionDiv = styled.div`
    grid-column: ${props => props.column};
    grid-row: ${props => props.row};
`;

const PositionDivCentered = styled(PositionDiv)`
    text-align: center;
`;

class SignInScreen extends Component {
    render() {
        const { clickStart } = this.props;
        return (
            <FortySixtyGrid>
              <FullWidthDiv spacer>
                <Banner full={true}/>
              </FullWidthDiv>
              <PositionDivCentered row={2} column={1}>
                <Gallows badGuesses={3}/>
              </PositionDivCentered>
              <PositionDiv row={2} column={2}>
                <StartForm clickStart={clickStart}/>
              </PositionDiv>
            </FortySixtyGrid>
        );
    }
}
const zoomBounceKeyframes = keyframes`
    0%   { transform: scale(0.1);  }
    50%  { transform: scale(0.95); }
    60%  { transform: scale(0.9);  }
    70%  { transform: scale(0.95); }
    80%  { transform: scale(0.9);  }
    90%  { transform: scale(0.95); }
    100% { transform: scale(0.9);  }
`;

const WinResultsDiv = styled(FullWidthDiv)`
    font-size: 180%;
    animation-name: ${zoomBounceKeyframes};
    animation-duration: 1.0s;
    animation-timing-function: ease-in;
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
    animation-direction: normal;
`;

class WinScreen extends Component {
    render() {
        const { lang, clickPlayAgain, clickQuit } = this.props;
        return (
            <FortySixtyGrid>
              <FullWidthDiv>
                <Banner full={false}/>
              </FullWidthDiv>
              <WinResultsDiv style={{textAlign:'center'}}>
                <ResultBanner winResult={true}/>
              </WinResultsDiv>
              <PositionDivCentered row={3} column={"1 / 3"}>
                <PlayAgainPanel
                  lang={lang}
                  clickPlayAgain={clickPlayAgain}
                  clickQuit={clickQuit}
                />
              </PositionDivCentered>
            </FortySixtyGrid>
        );
    }           
}

const dropSwingKeyframes = keyframes`
    0%  { transform: translateY(-300px); }
    5%  { transform: translateY(-290px); }
    10% { transform: translateY(-250px); }
    15% { transform: translateY(-160px); }
    20% { transform: translateY(   0px); }
    30% { transform: rotate(-16deg); transform-origin: 50% -100%; }
    50% { transform: rotate( 12deg); transform-origin: 50% -100%; }
    70% { transform: rotate( -8deg); transform-origin: 50% -100%; }
    90% { transform: rotate(  4deg); transform-origin: 50% -100%; }
   100% { transform: rotate(  0deg); transform-origin: 50% -100%; }
`;

const LoseResultDiv = styled.div`
    text-align: center;
    animation-name: ${dropSwingKeyframes};
    animation-delay: 0.2s;
    animation-duration: 2.0s;
    animation-timing-function: linear;
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
    animation-direction: normal;
    grid-column: 2;
    grid-row: 2;
`;
class LoseScreen extends Component {
    render() {
        const { usage, blanks } = this.props;
        const { lang, clickPlayAgain, clickQuit } = this.props;
        return (
            <FortySixtyGrid style={{backgroundColor: '#ccc'}}>
              <FullWidthDiv>
                <Banner full={false}/>
              </FullWidthDiv>
              <PositionDiv
                row={"2 / 4"}
                column={1}
                style={{textAlign: 'right', margin: 'auto'}}
              >
                <Gallows badGuesses={6}/>
              </PositionDiv>
              <LoseResultDiv>
                <ResultBanner winResult={false}/>
              </LoseResultDiv>
              <PositionDiv row={3} column={2}>
                <UsageAndBlanks
                  usage={usage}
                  blanks={blanks}
                  showBlanks={false}
                />
              </PositionDiv>
              <PositionDivCentered row={4} column={"1 / 3"}>
                <PlayAgainPanel
                  lang={lang}
                  clickPlayAgain={clickPlayAgain}
                  clickQuit={clickQuit}
                />
              </PositionDivCentered>
            </FortySixtyGrid>
        );
    }           
}
class PlayScreen extends Component {
    render() { return <h2>Play Screen</h2>; }
}

export { SignInScreen, WinScreen, LoseScreen, PlayScreen };
