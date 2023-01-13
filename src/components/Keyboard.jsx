import { useEffect } from 'react';
import { Grid, Button } from 'semantic-ui-react';
import Key from './Key';
import routes from '../data/routes.json';

import './Keyboard.scss';

const Keyboard = (props) => {
  const {
    noService, isDarkMode,
    onChar, onDelete, onEnter,
    correctRoutes, similarRoutes, presentRoutes, absentRoutes
  } = props;

  useEffect(() => {
    const listener = (e) => {
      if (e.code === 'Enter') {
        onEnter();
      } else if (e.code === 'Backspace') {
        onDelete();
      } else {
        const key = e.key.toUpperCase()
        if (key.length === 1 && routes[key]) {
          onChar(key);
        } else if (key === 'S') {
          onChar('GS');
        } else if (key === 'K') {
          onChar('FS');
        } else if (key === 'I') {
          onChar('SI');
        }
      }
    }
    window.addEventListener('keyup', listener)
    return () => {
      window.removeEventListener('keyup', listener)
    }
  }, [onEnter, onDelete, onChar])

  const handleDelete = () => {
    onDelete();
  }

  const handleEnter = () => {
    onEnter();
  }


  return (
    <Grid centered columns={7} className='keyboard'>
      <Grid.Row>
        {
          ["1", "2", "3", "4", "5", "6", "7"].map((routeId) => {
            return (
              <Key
                id={routeId}
                key={routeId}
                isDarkMode={isDarkMode}
                onClick={onChar}
                disabled={noService.includes(routeId)}
                isCorrect={correctRoutes.includes(routeId)}
                isSimilar={similarRoutes.includes(routeId)}
                isPresent={presentRoutes.includes(routeId)}
                isAbsent={absentRoutes.includes(routeId)}
              />
            )
          })
        }
      </Grid.Row>
      <Grid.Row>
        {
          ["A", "B", "C", "D", "E", "F", "G"].map((routeId) => {
            return (
              <Key
                id={routeId}
                key={routeId}
                isDarkMode={isDarkMode}
                onClick={onChar}
                disabled={noService.includes(routeId)}
                isCorrect={correctRoutes.includes(routeId)}
                isSimilar={similarRoutes.includes(routeId)}
                isPresent={presentRoutes.includes(routeId)}
                isAbsent={absentRoutes.includes(routeId)}
              />
            )
          })
        }
        </Grid.Row>
        <Grid.Row>
        {
          ["J", "L", "M", "N", "Q", "R", "W"].map((routeId) => {
            return (
              <Key
                id={routeId}
                key={routeId}
                isDarkMode={isDarkMode}
                onClick={onChar}
                disabled={noService.includes(routeId)}
                isCorrect={correctRoutes.includes(routeId)}
                isSimilar={similarRoutes.includes(routeId)}
                isPresent={presentRoutes.includes(routeId)}
                isAbsent={absentRoutes.includes(routeId)}
              />
            )
          })
        }
        </Grid.Row>
        <Grid.Row columns={6}>
          <Grid.Column className='key' stretched>
            <Button onClick={handleEnter} inverted={isDarkMode}>
              Enter
            </Button>
          </Grid.Column>
        {
          ["SI", "GS", "FS", "H"].map((routeId) => {
            return (
              <Key
                id={routeId}
                key={routeId}
                isDarkMode={isDarkMode}
                onClick={onChar}
                disabled={noService.includes(routeId)}
                isCorrect={correctRoutes.includes(routeId)}
                isSimilar={similarRoutes.includes(routeId)}
                isPresent={presentRoutes.includes(routeId)}
                isAbsent={absentRoutes.includes(routeId)}
              />
            )
          })
        }
          <Grid.Column className='key' stretched>
            <Button onClick={handleDelete} inverted={isDarkMode}>
              Delete
            </Button>
          </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}

export default Keyboard;
