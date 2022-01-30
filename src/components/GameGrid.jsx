import { Grid } from "semantic-ui-react";
import CompletedRow from './CompletedRow';
import CurrentRow from './CurrentRow';
import EmptyRow from './EmptyRow';

import './GameGrid.scss';

const GameGrid = (props) => {
  const { currentGuess, guesses, attempts, inPlay } = props;
  const emptyRows = [...Array(attempts - 1).keys()];
  return (
    <Grid centered columns={4} className='game-grid'>
      {
        inPlay &&
        <CurrentRow currentGuess={currentGuess} />
      }
      {
        guesses.slice().reverse().map((g, i) => {
          emptyRows.pop();
          return (
            <CompletedRow id={i} guess={g} />
          )
        })
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
