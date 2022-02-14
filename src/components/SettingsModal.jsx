import { useState } from 'react';
import { Modal, Header, Grid, Checkbox, Icon, Popup } from 'semantic-ui-react';
import { saveSettings, loadSettings, defaultSettings } from '../utils/settings';

const SettingsModal = (props, state) => {
  const { open, handleClose } = props;
  const [settings, setSettings] = useState(loadSettings());

  const showAnswerStatusBadgesToggleChanged = (event, value) => {
    const settings = { ...defaultSettings };

    settings.display.showAnswerStatusBadges = value.checked;

    saveSettings(settings);
    setSettings(settings);
  }

  return (
    <Modal closeIcon open={open} onClose={handleClose} size='tiny'>
      <Modal.Header>Settings</Modal.Header>
      <Modal.Content scrolling>
        <Header>Display</Header>
        <Grid centered columns={3}>
          <Grid.Row>
            <Grid.Column className='fourteen wide'>
              Show answer status badges&nbsp;
              <Popup content='Having trouble seeing the difference in the colors? Turn on status badges!'
                trigger={
                  <Icon name='question circle outline' size='large' link
                    onHover={showAnswerStatusBadgesHoverDetail} />
                }
              />
            </Grid.Column>
            <Grid.Column className='two wide'>
              <Checkbox toggle className='float-right'
                name='showAnswerStatusBadgesToggle'
                onChange={showAnswerStatusBadgesToggleChanged}
                checked={settings.display.showAnswerStatusBadges} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Modal.Content>
    </Modal>
  );
}

const showAnswerStatusBadgesHoverDetail = () => {

}

export default SettingsModal;
