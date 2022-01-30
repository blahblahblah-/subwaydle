import { Modal } from 'semantic-ui-react';
import Stats from './Stats';

const StatsModal = (props) => {
  const { open, handleClose, stats } = props;
  return (
    <Modal closeIcon open={open} onClose={handleClose} size='tiny'>
      <Modal.Content>
        <Stats stats={stats} />
      </Modal.Content>
    </Modal>
  );
}

export default StatsModal;
