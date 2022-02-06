import StatsBox from './StatsBox';
import StatsHistogram from './StatsHistogram';

const Stats = (props) => {
  const { stats } = props;
  return (
    <>
      <StatsBox stats={stats} />
      <StatsHistogram stats={stats} />
    </>
  );
}

export default Stats;