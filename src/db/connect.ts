import mongoose from 'mongoose';
import log from '../logger';

const connect = async () => {
  const dbUri = process.env.DB_URI as string;

  try {
    await mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true });
    log.info('Database connected');
  } catch (error) {
    log.error('db error', error);
    process.exit(1);
  }
};

export default connect;
