import { Grid, Segment } from "semantic-ui-react";

function EmptyRow() {
  return (
    <Grid.Row>
      <Grid.Column>
        <Segment placeholder></Segment>
      </Grid.Column>
      <Grid.Column>
        <Segment placeholder></Segment>
      </Grid.Column>
      <Grid.Column>
        <Segment placeholder></Segment>
      </Grid.Column>
    </Grid.Row>
  );
}

export default EmptyRow;
