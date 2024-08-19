import { Router, Request, Response } from 'express';
import { initialCanvas, createFinalCanvas } from '../components';
import { logger } from '../logger';

const log = logger(__filename);

const router: Router = Router();

router.post('/initialize', (request: Request, response: Response) => {
    try {
        log.info('App initialization');
        response.send(initialCanvas);
    } catch (error) {
        log.info(error);
        response.status(500).send({ error: "Internal Server Error" });
    }
});

router.post('/submit', (request: Request, response: Response) => {
    try {
        log.info('Submit clicked');
        if (request.body.component_id == 'submit_button') {
            let department = request.body.input_values.departmentChoice;
            response.send(createFinalCanvas(department));
        } else {
            response.send(initialCanvas);
        }
    } catch (error) {
        log.info(error);
        response.status(500).send({ error: "Internal Server Error" });
    }
});

export default router;