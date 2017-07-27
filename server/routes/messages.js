import winston from 'winston';
import express from 'express';
import TasksService from '../services/tasks/index';
import MqService from '../services/mq/index';

const router = express.Router(); // eslint-disable-line new-cap

router
  .route('/')
  .get((req, res) => {
    const mqService = new MqService('db.messages.insert');

    mqService.subscribe((msg) => {
      // receive messages for channel db.messages.insert
      winston.info('%s was received', msg);
    });

    const service = new TasksService();
    service.runTask('db.messages.insert');

    res.send('Hello');
  });

export default router;
