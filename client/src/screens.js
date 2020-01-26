import React, { Component } from 'react';
import styled from 'styled-components';

import { ButtonPanel, StartForm, PlayAgainPanel } from './buttons';
import { Banner, ResultBanner, UsageAndBlanks } from './components';
import { Gallows } from './gallows';

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
class WinScreen extends Component {
    render() { return <h2>Win Screen</h2>; }
}
class LoseScreen extends Component {
    render() { return <h2>Lose Screen</h2>; }
}
class PlayScreen extends Component {
    render() { return <h2>Play Screen</h2>; }
}

export { SignInScreen, WinScreen, LoseScreen, PlayScreen };
