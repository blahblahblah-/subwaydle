import { Icon } from 'semantic-ui-react';
import StatsBox from './StatsBox';
import StatsHistogram from './StatsHistogram';

const Stats = (props) => {
  const { stats, isDarkMode } = props;
  return (
    <>
      <StatsBox isDarkMode={isDarkMode} stats={stats} />
      <StatsHistogram isDarkMode={isDarkMode} stats={stats} />
      <p>Follow <a href='https://twitter.com/subwaydle' target='_blank'>@subwaydle<Icon name='twitter' link /></a> for the previous day's solution and stats, updated daily.</p>
    </>
  );
}

export default Stats;