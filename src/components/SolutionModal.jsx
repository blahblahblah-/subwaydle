import { useState, useRef, useEffect } from 'react';
import { Modal, Header, Button, Icon } from 'semantic-ui-react';

import Stats from './Stats';
import TrainBullet from './TrainBullet';
import MapFrame from './MapFrame';

import { todaysTrip, todaysSolution } from '../utils/answerValidations';
import { shareStatus } from '../utils/share';

import stations from "../data/stations.json";
import './SolutionsModal.scss';

const BUTTON_PROMPT_MS = 2000;

const SolutionModal = (props) => {
  const { open, handleModalClose, isGameWon, stats, guesses } = props;
  const [isShareButtonShowCopied, setIsShareButtonShowCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalHidden, setIsModalHidden] = useState(false);
  const modal = useRef(null);
  const trip = todaysTrip();
  const solution = todaysSolution();
  const title = isGameWon ? "Yay! You completed today's trip!" : "Aww, looks like you got lost on the subway...";
  const isIos = /iP(ad|od|hone)/i.test(window.navigator.userAgent);

  const handleShareClick = () => {
    shareStatus(guesses, !isGameWon);
    if (!navigator.share || !isIos) {
      setIsShareButtonShowCopied(true);
      setTimeout(() => {
        setIsShareButtonShowCopied(false)
      }, BUTTON_PROMPT_MS);
    }
  }

  const handleClose = () => {
    setIsModalHidden(true);
    handleModalClose();
  }

  useEffect(() => {
    if (isModalHidden) {
      modal.current.ref.current.parentElement.setAttribute("style", "display: none !important");
      modal.current.ref.current.parentElement.parentElement.classList.remove("dimmable");
      modal.current.ref.current.parentElement.parentElement.classList.remove("dimmed");
    } else {
      if (modal.current.ref.current) {
        modal.current.ref.current.parentElement.setAttribute("style", "display: flex !important");
        modal.current.ref.current.parentElement.parentElement.classList.add("dimmable");
        modal.current.ref.current.parentElement.parentElement.classList.add("dimmed");
      }
    }
  }, [isModalHidden]);

  useEffect(() => {
    if (open) {
      setIsModalHidden(false);
      setIsModalOpen(true);
    }
  }, [open]);

  return (
    <Modal closeIcon open={isModalOpen} onClose={handleClose} ref={modal} className='solutions-modal' size='small'>
      <Modal.Header>{ title }</Modal.Header>
      <Modal.Content>
        <Modal.Description>
        <MapFrame />
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
