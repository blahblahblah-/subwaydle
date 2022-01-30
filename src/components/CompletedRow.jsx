import { Grid, Segment } from "semantic-ui-react";
import TrainBullet from './TrainBullet';
import { checkGuessStatuses } from '../utils/answerValidations';

const CompletedRow = (props) => {
  const { guess } = props;
  const classNameArrays = checkGuessStatuses(guess)
  return (
    <Grid.Row>
      {
        guess.map((routeId, index) => {
          return (
            <Grid.Column key={`guess-${index}`}>
              <Segment placeholder className={classNameArrays[index]}>
                <TrainBullet id={routeId} size='medium' />
              </Segment>
            </Grid.Column>
          );
        })
      }
    </Grid.Row>
  );
}

export default CompletedRow;
