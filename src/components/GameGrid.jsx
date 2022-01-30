import { Grid } from "semantic-ui-react";
import CompletedRow from './CompletedRow';
import CurrentRow from './CurrentRow';
import EmptyRow from './EmptyRow';

import './GameGrid.scss';

const GameGrid = (props) => {
  const { currentGuess, guesses, attempts, inPlay } = props;
  const emptyRows = [...Array(inPlay ? (attempts - 1) : attempts).keys()];
  return (
    <Grid centered columns={4} className='game-grid'>
      {
        guesses.slice().map((g, i) => {
          emptyRows.pop();
          return (
            <CompletedRow id={i} guess={g} />
          )
        })
      }
      {
        inPlay &&
        <CurrentRow currentGuess={currentGuess} />
      }
      {
        emptyRows.map((r) => {
          return (
            <EmptyRow />
          );
        })
      }
    </Grid>
  );
}

export default GameGrid;
