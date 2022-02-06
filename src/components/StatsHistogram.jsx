import { Header, Grid, Progress } from 'semantic-ui-react';
import './StatsHistogram.scss';

const StatsHistogram = (props) => {
  const { stats } = props;
  const max = Math.max(...stats.winDistribution);
  return (
    <>
      <Header as='h3'>Guess Distribution</Header>
      <div className='stats-histogram'>
        <Grid>
          {
            stats.winDistribution.map((value, i) => {
              return (
                <Grid.Row key={i}>
                  <Grid.Column width={2}>
                    { i + 1}
                  </Grid.Column>
                  <Grid.Column width={14}>
                    <Progress progress='value' success value={value} total={max} />
                  </Grid.Column>
                </Grid.Row>
              )
            })
          }
        </Grid>
      </div>
    </>
  )
}

export default StatsHistogram;