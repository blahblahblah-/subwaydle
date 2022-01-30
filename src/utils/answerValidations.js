import weekdayAnswers from './../data/weekday/answers.json';
import weekdaySolutions from './../data/weekday/solutions.json';
import weekendAnswers from './../data/weekend/answers.json';
import weekendSolutions from './../data/weekend/solutions.json';

const ROUTES_WITH_NO_WEEKEND_SERVICE = ['B', 'W'];
const GAME_EPOCH = new Date('January 29, 2022 00:00:00').valueOf();
const DAY_IN_MS = 86400000;

const today = new Date();
const now = Date.now();

export const isWeekend = [0, 6].includes(today.getDay());

export const routesWithNoService = () => {
  if (isWeekend) {
    return ROUTES_WITH_NO_WEEKEND_SERVICE;
  }
  return [];
}

export const isValidGuess = (guess) => {
  const flattenedGuess = guess.join('-');
  if (isWeekend) {
    return !!weekendSolutions[flattenedGuess];
  }
  return !!weekdaySolutions[flattenedGuess];
}

export const todayGameIndex = () => {
  return Math.floor((now - GAME_EPOCH) / DAY_IN_MS);
}

export const todaysTrip = () => {
  const index = todayGameIndex();
  if (isWeekend) {
    return weekendAnswers[index % weekendAnswers.length];
  }
  return weekdayAnswers[index % weekdayAnswers.length];
}

export const flattenedTodaysTrip = () => {
  return todaysTrip().join('-');
}

export const todaysSolution = () => {
  if (isWeekend) {
    return weekendSolutions[todaysTrip().join("-")];
  }
  return weekdaySolutions[todaysTrip().join("-")];
}

export const isWinningGuess = (guess) => {
  return guess.join('-') === todaysTrip().join('-');
}

export const updateGuessStatuses = (guess, correctRoutes, setCorrectRoutes, presentRoutes, setPresentRoutes, absentRoutes, setAbsentRoutes) => {
  const correct = correctRoutes.slice();
  const present = presentRoutes.slice();
  const absent = absentRoutes.slice();
  const remainingRoutes = [];
  const remainingGuessPositions = [];

  todaysTrip().forEach((routeId, index) => {
    if (guess[index] === routeId) {
      correct.push(routeId);
    } else {
      remainingRoutes.push(routeId);
      remainingGuessPositions.push(index);
    }
  });

  remainingGuessPositions.forEach((index) => {
    if (remainingRoutes.includes(guess[index])) {
      present.push(guess[index]);
    } else {
      absent.push(guess[index]);
    }
  });

  setCorrectRoutes(correct);
  setPresentRoutes(present);
  setAbsentRoutes(absent);
}

export const checkGuessStatuses = (guess) => {
  const results = ['absent', 'absent', 'absent'];
  const remainingRoutes = [];
  const remainingGuessPositions = [];

  todaysTrip().forEach((routeId, index) => {
    if (guess[index] === routeId) {
      results[index] = 'correct';
    } else {
      remainingRoutes.push(routeId);
      remainingGuessPositions.push(index);
    }
  });

  remainingGuessPositions.forEach((index) => {
    if (remainingRoutes.includes(guess[index])) {
      results[index] = 'present';
    }
  });

  return results;
}
