import { Grid, Segment } from "semantic-ui-react";
import TrainBullet from './TrainBullet';

const CurrentRow = (props) => {
  const { currentGuess } = props;
  const emptyGuesses = [...Array(3).keys()];
  return (
    <Grid.Row>
      {
        currentGuess.map((routeId, index) => {
          emptyGuesses.pop();
          return (
            <Grid.Column key={`guess-${index}`}>
              <Segment placeholder>
                <TrainBullet id={routeId} size='medium' />
              </Segment>
            </Grid.Column>
          );
        })
      }
      {
        emptyGuesses.map((i) => {
          return (
            <Grid.Column key={i}>
              <Segment placeholder></Segment>
            </Grid.Column>
          );
        })
      }
    </Grid.Row>
  );
}

export default CurrentRow;
