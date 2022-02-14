import './App.css';
import React from 'react';

const LETTER_GRID_WIDTH = 5;
const LETTER_GRID_HEIGHT = 6;
const KEYBOARD_LETTERS = [['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'DEL']];

const NO_MATCH_COLOUR_CODE = "noMatch";
const NEAR_MATCH_COLOUR_CODE = "nearMatch";
const PERFACT_MATCH_COLOUR_CODE = "perfectMatch";
class App extends React.Component {
  constructor(props) {
    super(props);
    var targetWord = this.getRandomWordFromFile();
    this.state = this.initalState(targetWord);

    this.handleKeyboardEntry = this.handleKeyboardEntry.bind(this);
    this.handleClueButtonClick = this.handleClueButtonClick.bind(this);
    this.handleNewWordButtonClick = this.handleNewWordButtonClick.bind(this);
  }

  initalState(targetWord) {
    return {
      letterGrid: this.buildEmptyLetterGrid(LETTER_GRID_HEIGHT, LETTER_GRID_WIDTH),
      keyboardGrid: this.buildNewKeyboard(KEYBOARD_LETTERS),
      activeRow: 0,
      activeColumn: 0,
      targetWord: targetWord.word,
      clue: targetWord.clue,
      clueVisible: false,
    };
  }

  render() {
    return (<div className="App">
      <p>Frank and Claire's Wordle!</p>
      <NewWordButton onButtonClick={this.handleNewWordButtonClick} />
      <Clue clue={this.state.clue} clueVisible={this.state.clueVisible} onButtonClick={this.handleClueButtonClick} />
      <LetterGrid letterGrid={this.state.letterGrid} />
      <KeyboardGrid keyboard={this.state.keyboardGrid} onKeyPress={this.handleKeyboardEntry} />
    </div>
    );
  }

  handleKeyboardEntry(key) {
    var rowIncrement = 0;
    var columnIncrement = 0;
    var newLetterGrid = this.state.letterGrid;
    var newKeyboardGrid = this.state.keyboardGrid;

    if (key === 'ENTER') {
      if (this.state.activeColumn === 5) {
        rowIncrement = 1;
        columnIncrement = -5;
        newLetterGrid = this.checkWord(this.state.letterGrid, this.state.activeRow, this.state.targetWord);
        newKeyboardGrid = this.setKeyboardKeyColours(this.state.letterGrid, this.state.keyboardGrid);
      }
    } else if (key === 'DEL') {
      if (this.state.activeColumn > 0) {
        columnIncrement = -1;
        newLetterGrid[this.state.activeRow][this.state.activeColumn - 1].letter = '';
      }
    } else if (this.state.activeColumn < 5) {
      newLetterGrid[this.state.activeRow][this.state.activeColumn] = { letter: key, key: "" + this.state.activeRow + this.state.activeColumn };
      columnIncrement = 1;
    }

    this.setState((state, props) => (
      {
        letterGrid: newLetterGrid,
        keyboardGrid: newKeyboardGrid,
        activeRow: state.activeRow + rowIncrement,
        activeColumn: state.activeColumn + columnIncrement,
      }));
  }
  
  handleClueButtonClick() {
    this.setState(() => (
      {
        clueVisible: true,
      }));
  }

  handleNewWordButtonClick() {
    var targetWord = this.getRandomWordFromFile();
    this.setState(() => (
      this.initalState(targetWord)
    ));
  }

  getRandomWordFromFile() {
    let data = require('./words.json');
    let wordIndex = Math.floor(Math.random() * (data.words.length - 1));
    console.log("word:", data.words[wordIndex])
    return data.words[wordIndex];
  }

  buildEmptyLetterGrid() {
    var gridRows = [];
    for (var i = 0; i < LETTER_GRID_HEIGHT; i++) {
      var letters = [];
      for (var j = 0; j < LETTER_GRID_WIDTH; j++) {
        letters.push({ letter: '', key: "" + i + j, colour: 'noGuess' })
      }
      gridRows.push(letters);
    }
    return gridRows;
  }

  buildNewKeyboard(keyboardLetters) {
    var keyboardRows = [];
    for (var i = 0; i < keyboardLetters.length; i++) {
      var letters = [];
      for (var j = 0; j < keyboardLetters[i].length; j++) {
        letters.push({ letter: keyboardLetters[i][j], key: "" + i + j, colour: 'notPressed' })
      }
      keyboardRows.push(letters);
    }
    return keyboardRows;
  }

  checkWord(letterGrid, activeRow, targetWord) {
    letterGrid[activeRow].forEach((letterRow, index) => {
      if (letterRow.letter === targetWord.charAt(index)) {
        letterRow.colour = PERFACT_MATCH_COLOUR_CODE;
      } else if (targetWord.includes(letterRow.letter)) {
        letterRow.colour = NEAR_MATCH_COLOUR_CODE;
      } else {
        letterRow.colour = NO_MATCH_COLOUR_CODE;
      }
    });

    return letterGrid;
  }

  setKeyboardKeyColours(letterGrid, keyboardGrid) {
    var noMatches = this.getColouredLetters(letterGrid, NO_MATCH_COLOUR_CODE);
    var nearMatches = this.getColouredLetters(letterGrid, NEAR_MATCH_COLOUR_CODE);
    var perfectMatches = this.getColouredLetters(letterGrid, PERFACT_MATCH_COLOUR_CODE);

    keyboardGrid.forEach((keyboardGridRow) => {
      keyboardGridRow.forEach((letter) => {
        if (noMatches.includes(letter.letter)) {
          letter.colour = NO_MATCH_COLOUR_CODE;
        } else if (nearMatches.includes(letter.letter)) {
          letter.colour = NEAR_MATCH_COLOUR_CODE;
        } else if (perfectMatches.includes(letter.letter)) {
          letter.colour = PERFACT_MATCH_COLOUR_CODE;
        };
      });
    });
    return keyboardGrid;
  };

  getColouredLetters(letterGrid, colour) {
    var arrayOfLetters = letterGrid.map((letterGridRow) => {
      return letterGridRow.filter((letter) => {
        return letter.colour === colour;
      });
    }).flat().map((letter) => {
      return letter.letter;
    })

    return Array.from(new Set(arrayOfLetters));;
  }

  
}

class Clue extends React.Component {
  render() {
    if (this.props.clueVisible) {
      return (
        <div key='clue'>
          {this.props.clue}
        </div>
      );
    } else {
      return (
        <div key='clue'>
          <ClueButton onButtonClick={this.props.onButtonClick} />
        </div>
      )
    }
  }
}

function NewWordButton(props) {
  function handleButtonClick(e) {
    props.onButtonClick(e.target.value);
  }

  return (
    <div className='newWordButton'>
      <button onClick={handleButtonClick}>
        New word please!
      </button>
    </div>
  )
}

function ClueButton(props) {
  function handleButtonClick(e) {
    props.onButtonClick(e.target.value);
  }

  return (
    <button onClick={handleButtonClick}>
      Click me for clue!
    </button>
  )
}
class LetterGrid extends React.Component {
  render() {
    return (
      <div key='letterGrid' className='grid'>
        <LetterRows letterGrid={this.props.letterGrid} />
      </div>
    );
  }
}

function LetterRows(props) {
  return props.letterGrid.map((letterRow, index) => {
      return (
        <div key={index} className='row'>
          <Letters letters={letterRow} />
        </div>
      )
  });
}

function Letters(props) {
  return props.letters.map((letter) =>
    <div key={letter.key} id={letter.colour} className='letter'>
      {letter.letter}
    </div>
  )
}

function KeyboardGrid(props) {
  return (
    <div key='keyboardGrid' className='grid'>
      <KeyboardRows keyboard={props.keyboard} onKeyPress={props.onKeyPress} />
    </div>
  )
}

function KeyboardRows(props) {
  return props.keyboard.map((keyboardRow, index) => {
    return (
      <div key={index} className='row'>
        <KeyboardButtons keys={keyboardRow} onKeyPress={props.onKeyPress} />
      </div>
    )
});
}

function KeyboardButtons(props) {
  function handleButtonClick(e) {
    props.onKeyPress(e.target.value);
  }

  return props.keys.map((key) =>
    <button key={key.letter} id={key.colour} value={key.letter} className='keyboardButton' onClick={handleButtonClick}>
      {key.letter}
    </button>
  )
}

export default App;
