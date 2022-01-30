import { Modal, Header, Grid, Segment } from "semantic-ui-react";
import TrainBullet from "./TrainBullet";

const AboutModal = (props) => {
  const { trigger } = props;
  return (
    <Modal trigger={trigger} closeIcon size='mini'>
      <Modal.Header>How to Play</Modal.Header>
      <Modal.Content scrolling>
        <p>Guess the <strong>SUBWAYDLE</strong> in 6 tries.</p>
        <p>Each guess must a be a valid subway trip involving 3 trains using available transfers between them.</p>
        <p><strong>No back tracking:</strong> No stations can be traveled through more than once in each trip.</p>
        <p>Transfers are only allowed if and when the lines are diverging.</p>
        <p>Routing for each train line is based on midday schedule (i.e. no peak-direction express, no peak-only branches, no 
          Z, B terminates at 145 St). Weekend puzzles are be based on regularly-scheduled weekend routings.</p>

        <Header as='h5'>Examples</Header>
        <Segment basic>
          <Grid centered columns={4} className='game-grid'>
            <Grid.Row>
              <Grid.Column>
                <Segment placeholder className='correct'>
                  <TrainBullet id='A' size='small' />
                </Segment>
              </Grid.Column>
              <Grid.Column>
                <Segment placeholder>
                  <TrainBullet id='6' size='small' />
                </Segment>
              </Grid.Column>
              <Grid.Column>
                <Segment placeholder>
                  <TrainBullet id='7' size='small' />
                </Segment>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
        <p>The <TrainBullet id='A' size='small' /> train is in the correct spot of the trip.</p>

        <Segment basic>
          <Grid centered columns={4} className='game-grid'>
            <Grid.Row>
              <Grid.Column>
                <Segment placeholder>
                  <TrainBullet id='J' size='small' />
                </Segment>
              </Grid.Column>
              <Grid.Column>
                <Segment placeholder className='present'>
                  <TrainBullet id='5' size='small' />
                </Segment>
              </Grid.Column>
              <Grid.Column>
                <Segment placeholder>
                  <TrainBullet id='2' size='small' />
                </Segment>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
        <p>The <TrainBullet id='5' size='small' /> train part of the trip, but in the wrong spot.</p>

        <Segment basic>
          <Grid centered columns={4} className='game-grid'>
            <Grid.Row>
              <Grid.Column>
                <Segment placeholder>
                  <TrainBullet id='F' size='small' />
                </Segment>
              </Grid.Column>
              <Grid.Column>
                <Segment placeholder>
                  <TrainBullet id='3' size='small' />
                </Segment>
              </Grid.Column>
              <Grid.Column>
                <Segment placeholder className='absent'>
                  <TrainBullet id='4' size='small' />
                </Segment>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
        <p>The <TrainBullet id='4' size='small' /> train is not part of the trip in any spot.</p>

        <Header as='h5'>About</Header>

        <p>Inspired by <a href="https://www.powerlanguage.co.uk/wordle/" target="_blank">Wordle</a>,
          its <a href="https://github.com/hannahcode/wordle" target="_blank">open-source clone</a>, <a href="https://nerdlegame.com/" target="_blank">Nerdle</a>,
          and <a href="https://www.nytransitmuseum.org/">New York Transit Museum</a> Trivia Nights.</p>

        <p>Created by <a href="https://www.sunny.ng" target="_blank">Sunny Ng</a>.</p>
        <p><a href="https://github.com/blahblahblah-/subwaydle" target="_blank">Source code</a>.</p>
        <p>Check out my other NYC Subway related projects: <a href="https://www.theweekendest.com" target="_blank">The Weekendest</a> and <a href="https://www.goodservice.io" target="_blank">goodservice.io</a>.</p>
      </Modal.Content>
    </Modal>
  );
}

export default AboutModal;
