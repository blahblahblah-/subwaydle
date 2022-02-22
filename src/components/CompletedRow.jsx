import { Grid, Icon, Label, Segment } from 'semantic-ui-react';
import TrainBullet from './TrainBullet';
import { checkGuessStatuses } from '../utils/answerValidations';
import { loadSettings } from '../utils/settings';

const CompletedRow = (props) => {
  const { guess } = props;
  const classNameArrays = checkGuessStatuses(guess)
  const settings = loadSettings();

  return (
    <Grid.Row>
      {
        guess.map((routeId, index) => {
          return (
            <Grid.Column key={`guess-${index}`}>
              <Segment placeholder className={classNameArrays[index]}>
                {settings.display.showAnswerStatusBadges &&
                  <Label as='a' floating circular size='tiny'>
                    {
                      classNameArrays[index] === 'present' ?
                        <Icon name="arrows alternate horizontal" fitted /> :
                        classNameArrays[index] === 'correct' ?
                          <Icon name="check" fitted /> :
                          classNameArrays[index] === 'similar' ?
                            <Icon name="sync alternate" fitted /> :
                            <Icon name="x" fitted />
                    }
                  </Label>
                }
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
