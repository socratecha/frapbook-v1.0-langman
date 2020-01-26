import React, { Component } from 'react';
import styled from 'styled-components';

const TitleFontDiv = styled.div`
    font-family: 'Allura', cursive;
    font-size: 6em;
    :first-letter {
        font-size: 150%;
        margin-right: -0.1em;
    };
    padding-left: 0.2em;
    text-align: left;
`;


const SubTitleDiv = styled.div`
    font-size: 2em;
    text-align: right;
    font-family: 'Allura', cursive;
    margin-top: -2em;
    padding-right: 3em;
`;

class Banner extends Component {
    render() {
        const { full } = this.props;
        return (
            <div>
              <TitleFontDiv>
                Lang-man
              </TitleFontDiv>
              {
                  full &&
                      <SubTitleDiv>
                        play multilingual hangman
                      </SubTitleDiv>                  
              }
            </div>
        );
    }
}

class ResultBanner extends Component {
    render() {
        return <div>Result Banner</div>;
    }
}
class UsageAndBlanks extends Component {
    render() {
        return <div>Usage And Blanks</div>;
    }
}
export { Banner, ResultBanner, UsageAndBlanks };
