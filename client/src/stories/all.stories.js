import React from 'react';

import { storiesOf } from '@storybook/react';

import { LetterButton, ButtonPanel, StartForm, PlayAgainPanel } from '../buttons';

storiesOf('Button-related Components', module)
    .add('LetterButton', () => <LetterButton />)
    .add('ButtonPanel', () => <ButtonPanel />)
    .add('StartForm', () => <StartForm />)
    .add('PlayAgainPanel', () => <PlayAgainPanel />)
;

