import { Progress } from 'semantic-ui-react';

const Histogram = (props) => {
  const { stats } = props;
  return (
    <>
      <Header as='h3'>Statistics</Header>
      <Statistic.Group size='mini'>
        <Statistic>
          <Statistic.Value>{ stats.totalGames }</Statistic.Value>
          <Statistic.Label>Played</Statistic.Label>
        </Statistic>
        <Statistic>
          <Statistic.Value>{ stats.successRate }</Statistic.Value>
          <Statistic.Label>Win %</Statistic.Label>
        </Statistic>
        <Statistic>
          <Statistic.Value>{ stats.currentStreak }</Statistic.Value>
          <Statistic.Label>Current<br />Streak</Statistic.Label>
        </Statistic>
        <Statistic>
          <Statistic.Value>{ stats.bestStreak }</Statistic.Value>
          <Statistic.Label>Max<br />Streak</Statistic.Label>
        </Statistic>
      </Statistic.Group>
    </>
  );
}

export default Histogram;