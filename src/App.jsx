import { useState, useEffect } from 'react';
import { Header, Segment, Icon, Message } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

import GameGrid from './components/GameGrid';
import Keyboard from './components/Keyboard';
import AboutModal from './components/AboutModal';
import SolutionModal from './components/SolutionModal';
import {
  isWeekend,
  routesWithNoService,
  isValidGuess,
  isWinningGuess,
  updateGuessStatuses,
  flattenedTodaysTrip,
} from './utils/answerValidations';

import {
  loadGameStateFromLocalStorage,
  saveGameStateToLocalStorage,
} from './utils/localStorage';

import './App.scss';

const ATTEMPTS = 6;
const ALERT_TIME_MS = 2000;

const App = () => {
  const [currentGuess, setCurrentGuess] = useState([]);
  const [isGameWon, setIsGameWon] = useState(false);
  const [isGameLost, setIsGameLost] = useState(false);
  const [isSolutionsOpen, setIsSolutionsOpen] = useState(false);
  const [isNotEnoughRoutes, setIsNotEnoughRoutes] = useState(false);
  const [isGuessInvalid, setIsGuessInvalid] = useState(false);
  const [guesses, setGuesses] = useState(() => {
    const loaded = loadGameStateFromLocalStorage();
    if (loaded?.answer !== flattenedTodaysTrip()) {
      return []
    }
    const gameWasWon = loaded.guesses.map((g) => g.join('-')).includes(flattenedTodaysTrip())
    if (gameWasWon) {
      setIsGameWon(true)
    }
    if (loaded.guesses.length === 6 && !gameWasWon) {
      setIsGameLost(true)
    }
    return loaded.guesses;
  });
  const [absentRoutes, setAbsentRoutes] = useState([]);
  const [presentRoutes, setPresentRoutes] = useState([]);
  const [correctRoutes, setCorrectRoutes] = useState([]);

  useEffect(() => {
    saveGameStateToLocalStorage({ guesses, answer: flattenedTodaysTrip() })
  }, [guesses])

  const onChar = (routeId) => {
    if (!isGameWon && currentGuess.length < 3 && guesses.length < ATTEMPTS) {
      if (!routesWithNoService().includes(routeId)) {
        setCurrentGuess([...currentGuess, routeId]);
      }
    }
  }

  const onDelete = () => {
    if (currentGuess.length > 0) {
      setCurrentGuess(currentGuess.slice(0, currentGuess.length - 1));
    }
  }

  const onEnter = () => {
    if (isGameWon || isGameLost || guesses.length === 6) {
      return;
    }

    if (currentGuess.length !== 3) {
      setIsNotEnoughRoutes(true);
      setTimeout(() => {
        setIsNotEnoughRoutes(false)
      }, ALERT_TIME_MS);
      return;
    }

    if (!isValidGuess(currentGuess)) {
      setIsGuessInvalid(true);
      setTimeout(() => {
        setIsGuessInvalid(false)
      }, ALERT_TIME_MS);
      return;
    }

    const winningGuess = isWinningGuess(currentGuess);
    const newGuesses = [...guesses, currentGuess];

    updateGuessStatuses(
      currentGuess,
      correctRoutes,
      setCorrectRoutes,
      presentRoutes,
      setPresentRoutes,
      absentRoutes,
      setAbsentRoutes,
    );

    setGuesses(newGuesses);
    setCurrentGuess([]);
    // save

    if (winningGuess) {
      setIsGameWon(true);
      setIsSolutionsOpen(true);
      // set stats
      return;
    }

    if (newGuesses.length === 6) {
      setIsGameLost(true);
      // set stats
    }
  }

  const onSolutionsClose = () => {
    setIsSolutionsOpen(false);
  }

  return (
    <Segment basic className='app-wrapper'>
      <Segment clearing basic>
        <Header floated='left'>{ isWeekend && "Weekend "}Subwaydle</Header>
        <Icon className='float-right' name='chart bar' size='large' />
        <AboutModal trigger={<Icon className='float-right' name='question circle outline' size='large' link />} />
      </Segment>
      <Segment basic>
        {
          isNotEnoughRoutes &&
          <Message negative floating attached='top'>
            <Message.Header>Not enough trains for the trip</Message.Header>
          </Message>
        }
        {
          isGuessInvalid &&
          <Message negative>
            <Message.Header>Not a valid trip</Message.Header>
          </Message>
        }
        <GameGrid
          currentGuess={currentGuess}
          guesses={guesses}
          attempts={ATTEMPTS}
          inPlay={!isGameWon && !isGameLost && guesses.length < 6}
        />
      </Segment>
      <Segment basic>
        <Keyboard
          noService={routesWithNoService()}
          onChar={onChar}
          onDelete={onDelete}
          onEnter={onEnter}
          correctRoutes={correctRoutes}
          presentRoutes={presentRoutes}
          absentRoutes={absentRoutes}
        />
      </Segment>
      <SolutionModal open={isSolutionsOpen} handleClose={onSolutionsClose} />
    </Segment>
  );
}

export default App;
