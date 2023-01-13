import { useState, useEffect } from 'react';
import { Header, Segment, Icon, Message } from 'semantic-ui-react';

import GameGrid from './components/GameGrid';
import Keyboard from './components/Keyboard';
import AboutModal from './components/AboutModal';
import SolutionModal from './components/SolutionModal';
import StatsModal from './components/StatsModal';
import SettingsModal from './components/SettingsModal';

import {
  isWeekend,
  routesWithNoService,
  isValidGuess,
  isWinningGuess,
  updateGuessStatuses,
  flattenedTodaysTrip,
  todaysSolution,
} from './utils/answerValidations';

import {
  loadGameStateFromLocalStorage,
  saveGameStateToLocalStorage,
  isNewToGame
} from './utils/localStorage';

import { addStatsForCompletedGame, loadStats } from './utils/stats';

import { loadSettings } from './utils/settings';

import stations from './data/stations.json';

import './App.scss';

const ATTEMPTS = 6;
const ALERT_TIME_MS = 2000;

const App = () => {
  const [currentGuess, setCurrentGuess] = useState([]);
  const [isGameWon, setIsGameWon] = useState(false);
  const [isGameLost, setIsGameLost] = useState(false);
  const [isSolutionsOpen, setIsSolutionsOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotEnoughRoutes, setIsNotEnoughRoutes] = useState(false);
  const [isGuessInvalid, setIsGuessInvalid] = useState(false);
  const [absentRoutes, setAbsentRoutes] = useState([]);
  const [presentRoutes, setPresentRoutes] = useState([]);
  const [similarRoutes, setSimilarRoutes] = useState([]);
  const [similarRoutesIndexes, setSimilarRoutesIndexes] = useState({});
  const [correctRoutes, setCorrectRoutes] = useState([]);
  const [guesses, setGuesses] = useState(() => {
    const loaded = loadGameStateFromLocalStorage();
    if (loaded?.answer !== flattenedTodaysTrip()) {
      if (isNewToGame() && window.location === window.parent.location) {
        setIsAboutOpen(true);
      }
      return [];
    }
    const gameWasWon = loaded.guesses.map((g) => g.join('-')).includes(flattenedTodaysTrip())
    if (gameWasWon) {
      setIsGameWon(true);
      setIsSolutionsOpen(true);
    }
    if (loaded.guesses.length === 6 && !gameWasWon) {
      setIsGameLost(true)
      setIsSolutionsOpen(true);
    }
    updateGuessStatuses(loaded.guesses, setCorrectRoutes, setSimilarRoutes, setPresentRoutes, setAbsentRoutes, setSimilarRoutesIndexes);
    return loaded.guesses;
  });
  const [stats, setStats] = useState(() => loadStats());
  const [settings, setSettings] = useState(() => loadSettings());

  const solution = todaysSolution();

  useEffect(() => {
    saveGameStateToLocalStorage({ guesses, answer: flattenedTodaysTrip() })
  }, [guesses])

  const onChar = (routeId) => {
    if (!isStatsOpen && !isGameWon && currentGuess.length < 3 && guesses.length < ATTEMPTS) {
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
    const guessCount = guesses.length;
    if (isGameWon || isGameLost || guessCount === 6) {
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
      [currentGuess],
      setCorrectRoutes,
      setSimilarRoutes,
      setPresentRoutes,
      setAbsentRoutes,
      setSimilarRoutesIndexes,
      correctRoutes,
      similarRoutes,
      presentRoutes,
      absentRoutes,
      similarRoutesIndexes,
    );

    setGuesses(newGuesses);
    setCurrentGuess([]);

    if (winningGuess) {
      const updatedStats = addStatsForCompletedGame(stats, guessCount);
      setStats(updatedStats);
      setIsGameWon(true);
      setIsSolutionsOpen(true);
      return;
    }

    if (newGuesses.length === 6) {
      const updatedStats = addStatsForCompletedGame(stats, guessCount + 1);
      setStats(updatedStats);
      setIsGameLost(true);
      setIsSolutionsOpen(true);
    }
  }

  const onSolutionsClose = () => {
    setIsSolutionsOpen(false);
  }

  const onStatsClose = () => {
    setIsStatsOpen(false);
  }

  const onAboutClose = () => {
    setIsAboutOpen(false);
  }

  const onSettingsClose = () => {
    setIsSettingsOpen(false);
  }

  const handleStatsOpen = () => {
    if (isGameWon || isGameLost) {
      setIsSolutionsOpen(true);
    } else {
      setIsStatsOpen(true);
    }
  }

  const handleSettingsOpen = () => {
    setIsSettingsOpen(true);
  }

  const handleAboutOpen = () => {
    setIsAboutOpen(true);
  }

  const isDarkMode = settings.display.darkMode;

  return (
    <div className={"outer-app-wrapper " + (isDarkMode ? 'dark' : '')}>
      <Segment basic className='app-wrapper' inverted={isDarkMode}>
        <Segment clearing basic className='header-wrapper' inverted={isDarkMode}>
          <Header floated='left'>{isWeekend && "Weekend "}Subwaydle</Header>
          <Icon className='float-right' inverted={isDarkMode} name='cog' size='large' link onClick={handleSettingsOpen} />
          <Icon className='float-right' inverted={isDarkMode} name='chart bar' size='large' link onClick={handleStatsOpen} />
          <Icon className='float-right' inverted={isDarkMode} name='question circle outline' size='large' link onClick={handleAboutOpen} />
        </Segment>
        <Header as='h5' textAlign='center' className='hint'>Travel from {stations[solution.origin].name} to {stations[solution.destination].name} using 2 transfers.</Header>
        <Segment basic className='game-grid-wrapper'>
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
            isDarkMode={isDarkMode}
            currentGuess={currentGuess}
            guesses={guesses}
            attempts={ATTEMPTS}
            inPlay={!isGameWon && !isGameLost && guesses.length < 6}
          />
        </Segment>
        <Segment basic>
          <Keyboard
            noService={routesWithNoService()}
            isDarkMode={isDarkMode}
            onChar={onChar}
            onDelete={onDelete}
            onEnter={onEnter}
            correctRoutes={correctRoutes}
            similarRoutes={similarRoutes}
            presentRoutes={presentRoutes}
            absentRoutes={absentRoutes}
          />
        </Segment>
        <AboutModal open={isAboutOpen} isDarkMode={isDarkMode} handleClose={onAboutClose} />
        <SolutionModal open={isSolutionsOpen} isDarkMode={isDarkMode} isGameWon={isGameWon}  handleModalClose={onSolutionsClose} stats={stats} guesses={guesses} />
        <StatsModal open={isStatsOpen} isDarkMode={isDarkMode} stats={stats} handleClose={onStatsClose} />
        <SettingsModal open={isSettingsOpen} isDarkMode={isDarkMode} handleClose={onSettingsClose} onSettingsChange={setSettings} />
      </Segment>
    </div>
  );
}

export default App;
