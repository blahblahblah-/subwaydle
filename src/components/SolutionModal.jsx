import { Modal, Header } from 'semantic-ui-react';
import TrainBullet from './TrainBullet';
import { todaysTrip, todaysSolution } from '../utils/answerValidations';

import stations from "../data/stations.json";

const SolutionModal = (props) => {
  const { open, handleClose } = props;
  const trip = todaysTrip();
  const solution = todaysSolution();
  return (
    <Modal closeIcon open={open} onClose={handleClose}>
      <Modal.Header>Yay! You completed today's trip!</Modal.Header>
      <Modal.Content>
        <Header as='h3'>Today's Journey</Header>
        <TrainBullet id={trip[0]} size='small' /> from { stations[solution.origin].name } to { stations[solution.first_transfer_arrival].name }<br />
        <TrainBullet id={trip[1]} size='small' /> from { stations[solution.first_transfer_departure].name } to { stations[solution.second_transfer_arrival].name }<br />
        <TrainBullet id={trip[2]} size='small' /> from { stations[solution.second_transfer_departure].name } to { stations[solution.destination].name }
      </Modal.Content>
    </Modal>
  );
}

export default SolutionModal;
