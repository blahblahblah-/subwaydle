import {
  loadSettingsFromLocalStorage,
  saveSettingsToLocalStorage,
} from './localStorage'

export const defaultSettings = {
  display: {
    showAnswerStatusBadges: false
  }
}

export const saveSettings = (gameSettings) => {
  saveSettingsToLocalStorage(gameSettings);
}

export const loadSettings = () => {
  return loadSettingsFromLocalStorage() || defaultSettings;
}