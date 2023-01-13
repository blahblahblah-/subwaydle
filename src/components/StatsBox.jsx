import { Header, Statistic } from 'semantic-ui-react';
import './StatsBox.scss'

const StatsBox = (props) => {
  const { isDarkMode, stats } = props;
  return (
    <>
      <Header as='h3'>Statistics</Header>
      <div className='stats-box'>
        <Statistic.Group size='mini' inverted={isDarkMode}>
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
      </div>
    </>
  )
}

export default StatsBox;