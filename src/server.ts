import mongoose from 'mongoose';
import app from './app';
import config from './config';
import { errorlogger, logger } from './shared/logger';

async function bootstrap() {
  try {
    await mongoose.connect(config.database_url as string);
    logger.info('Database connect succussfully');
    app.listen(config.port, () => {
      logger.info(`Server is listening on ${config.port}`);
    });
  } catch (error) {
    errorlogger.error(error);
  }
}

bootstrap();
