import { useState } from 'react';
import { Modal, Header, Button, Icon } from 'semantic-ui-react';
import Stats from './Stats';

import TrainBullet from './TrainBullet';
import { todaysTrip, todaysSolution } from '../utils/answerValidations';
import { shareStatus } from '../utils/share';

import stations from "../data/stations.json";
import './SolutionsModal.scss';

const BUTTON_PROMPT_MS = 2000;

const SolutionModal = (props) => {
  const { open, handleClose, isGameWon, stats, guesses } = props;
  const [isShareButtonShowCopied, setIsShareButtonShowCopied] = useState(false);
  const trip = todaysTrip();
  const solution = todaysSolution();
  const title = isGameWon ? "Yay! You completed today's trip!" : "Aww, looks like you got lost on the subway...";

  const handleShareClick = () => {
    shareStatus(guesses, !isGameWon);
    if (!navigator.share) {
      setIsShareButtonShowCopied(true);
      setTimeout(() => {
        setIsShareButtonShowCopied(false)
      }, BUTTON_PROMPT_MS);
    }
  }

  return (
    <Modal closeIcon open={open} onClose={handleClose} className='solutions-modal'>
      <Modal.Header>{ title }</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Header as='h3'>Today's Journey</Header>
          <TrainBullet id={trip[0]} size='small' /> from { stations[solution.origin].name } to { stations[solution.first_transfer_arrival].name }<br />
          <TrainBullet id={trip[1]} size='small' /> from { stations[solution.first_transfer_departure].name } to { stations[solution.second_transfer_arrival].name }<br />
          <TrainBullet id={trip[2]} size='small' /> from { stations[solution.second_transfer_departure].name } to { stations[solution.destination].name }
          <Stats stats={stats} />
          <Button positive icon labelPosition='right' onClick={handleShareClick} className='share-btn'>
            { isShareButtonShowCopied ? 'Copied' : 'Share' }
            <Icon name={isShareButtonShowCopied ? 'check' : 'share alternate'} />
          </Button>
        </Modal.Description>
      </Modal.Content>
    </Modal>
  );
}

export default SolutionModal;
