import { todayGameIndex, checkGuessStatuses, isWeekend } from './answerValidations';

export const shareStatus = (guesses, lost) => {
  const title = isWeekend ? `Subwaydle ${todayGameIndex()} (Weekend Edition)` : `Subwaydle ${todayGameIndex()}`;
  const text = `${title} ${lost ? 'X' : guesses.length}/6\n\n` +
    generateEmojiGrid(guesses);
  const isIos = /iP(ad|od|hone)/i.test(window.navigator.userAgent);
  if (navigator.share && isIos) {
    navigator.share({text: text});
  } else {
    navigator.clipboard.writeText(text);
  }
}

const generateEmojiGrid = (guesses) => {
  return guesses
    .map((guess) => {
      const status = checkGuessStatuses(guess);
      return status.map((s) => {
          switch (s) {
            case 'correct':
              return '🟢';
            case 'present':
              return '🟡';
            default:
              return '⚪';
          }
        })
        .join('');
    })
    .join('\n');
}
