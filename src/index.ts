import { init } from '@db/index';
import logger from 'jet-logger';
import { getModel, initModels } from './models/index';
import './pre-start'; // Must be the first import
import server from './server';

// Constants
const serverStartMsg = 'Express server started on port: ';
const port = process.env.PORT || 3000;

init().then(() => {
  initModels().then(() => {
    console.log(getModel('Users'));
  });
});
// Start server
server.listen(port, () => {
  logger.info(serverStartMsg + port);
});
