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

const BlockFontDiv = styled.div`
    background-color: ${props => props.winResult ? "#ccc" : "transparent"};
    font-family: 'Passion One', sans-serif;
    font-size: 4em;
`;

class ResultBanner extends Component {
    render() {
        const { winResult } = this.props;
        return <BlockFontDiv>
                 { winResult ? "You Won!" : "You Lost" }
               </BlockFontDiv>;
    }
}

const InUsageSpan = styled.span`
    text-decoration: ${props => props.showBlanks ? "none" : "underline" };
    padding-left: 0.3em;
    padding-right: 0.3em;
    display: inline-block;
`;

/* Create the new usage example based on what goes in the blanks */
function prepareUsage(usage, blanks, showBlanks) {
    const [ beforeBlanks, afterBlanks ] = usage.split(/_+/);
    const newBlanks    = (showBlanks ? blanks.replace(/./g,'_') : blanks);

    return <p>
             { beforeBlanks }
             <InUsageSpan showBlanks={showBlanks}>
               { newBlanks }
             </InUsageSpan>
             { afterBlanks }
           </p>;     
}

const BlanksDiv = styled.div`
    letter-spacing: 0.3em;
    font-size: 1.5em;
    text-align: center;
`;

class UsageAndBlanks extends Component {    
    render() {
        const { usage, blanks, showBlanks } = this.props;
        const newUsage = prepareUsage(usage, blanks, showBlanks);
        const newBlanks = <BlanksDiv>{blanks}</BlanksDiv>;
        
        return (
            <div>
              { newUsage }
              { showBlanks && newBlanks }
            </div>
        );
    }
}

class FlashMessage extends Component {
    render() {
        const { flashMessage } = this.props;
        return (
            (flashMessage) ? (
                <p>{ flashMessage }</p>
            ) : ''
        );
    }
}
export { Banner, ResultBanner, UsageAndBlanks, FlashMessage };
