import { useState } from 'react';
import { Modal, Header, Grid, Checkbox, Icon, Popup } from 'semantic-ui-react';
import { saveSettings, loadSettings, defaultSettings } from '../utils/settings';
import { todayGameIndex, NIGHT_GAMES } from '../utils/answerValidations';

import './SettingsModal.scss'

const SettingsModal = (props, state) => {
  const { open, handleClose, onSettingsChange, isDarkMode} = props;
  const [settings, setSettings] = useState(loadSettings());

  const showAnswerStatusBadgesToggleChanged = (event, value) => {
    const settings = { ...defaultSettings };

    settings.display.showAnswerStatusBadges = value.checked;

    saveSettings(settings);
    setSettings(settings);
    onSettingsChange(settings);
  }

  const darkModeToggleChanged = (event, value) => {
    const settings = { ...defaultSettings };

    settings.display.darkMode = value.checked;

    saveSettings(settings);
    setSettings(settings);
    onSettingsChange(settings);
  }

  return (
    <Modal closeIcon open={open} onClose={handleClose} size='tiny' className={isDarkMode ? 'settings-modal dark' : 'settings-modal'}>
      <Modal.Header>Settings</Modal.Header>
      <Modal.Content scrolling>
        <Header>Display</Header>
        <Grid centered columns={3}>
          <Grid.Row>
            <Grid.Column className='fourteen wide'>
              Show answer status badges&nbsp;
              <Popup inverted={isDarkMode} content='Having trouble seeing the difference in the colors? Turn on status badges!'
                trigger={
                  <Icon inverted={isDarkMode} name='question circle outline' size='large' link
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
          {
            todayGameIndex() > Math.max(...NIGHT_GAMES) &&
            <Grid.Row>
              <Grid.Column className='fourteen wide'>
                Dark Mode
              </Grid.Column>
              <Grid.Column className='two wide'>
                <Checkbox toggle className='float-right'
                  name='darkModeToggle'
                  onChange={darkModeToggleChanged}
                  checked={settings.display.darkMode} />
              </Grid.Column>
            </Grid.Row>
          }
        </Grid>
      </Modal.Content>
    </Modal>
  );
}

const showAnswerStatusBadgesHoverDetail = () => {

}

export default SettingsModal;
