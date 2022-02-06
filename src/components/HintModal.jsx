import { Modal } from 'semantic-ui-react';
import { todaysSolution } from '../utils/answerValidations';

import stations from '../data/stations.json';

const HintModal = (props) => {
  const { trigger, onHintOpen } = props;
  const solution = todaysSolution();
  return (
    <Modal trigger={trigger} closeIcon size='tiny' onOpen={onHintOpen}>
      <Modal.Header>Hint</Modal.Header>
      <Modal.Content>
        <p>Travel from { stations[solution.origin].name } to { stations[solution.destination].name } using 2 transfers.</p>
        <p><strong>Note:</strong> There may be multiple ways to make this journey, you have to guess a specific one. And this specific way may
          not be the most efficent or fastest route.</p>
      </Modal.Content>
    </Modal>
  );
}

export default HintModal;
