import { Modal } from 'semantic-ui-react';
import { todaysSolution } from '../utils/answerValidations';

import stations from '../data/stations.json';

const HintModal = (props) => {
  const { trigger } = props;
  const solution = todaysSolution();
  return (
    <Modal trigger={trigger} closeIcon size='tiny'>
      <Modal.Header>Hint</Modal.Header>
      <Modal.Content>
        Travel from { stations[solution.origin].name } to { stations[solution.destination].name }.
      </Modal.Content>
    </Modal>
  );
}

export default HintModal;
