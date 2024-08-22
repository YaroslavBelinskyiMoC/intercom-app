import { Router, Request, Response } from 'express';
import { initialCanvas, createFinalCanvas, textCanvas, requestCanvas, additionalAnswerGenerator } from '../components';
import { logger } from '../logger';

const log = logger(__filename);

const router: Router = Router();

router.post('/initialize', (request: Request, response: Response) => {
    try {
        log.info('App initialization');
        response.send(requestCanvas);
    } catch (error) {
        log.info(error);
        response.status(500).send({ error: "Internal Server Error" });
    }
});

router.post('/submit', (request: Request, response: Response) => {
    try {
        log.info('Submit clicked');
        if (request.body.component_id == 'submit_button') {
            // let department = request.body.input_values.departmentChoice;
            console.log(request.body.input_values);
            response.send(textCanvas);
        } else if (request.body.component_id == 'submit-issue-form') {
            // let department = request.body.input_values.departmentChoice;
            console.log(request.body.current_canvas.content.components);
            const canvasAnswer = {
                canvas: {
                    content: request.body.current_canvas.content
                }
            }
            const array = canvasAnswer.canvas.content.components;
            const input = request.body.input_values.description;
            const newComponents = additionalAnswerGenerator(input);
            array.splice(array.length - 12, 0, ...newComponents);
            response.send(canvasAnswer);
        } else {
            response.send(requestCanvas);
        }
    } catch (error) {
        log.info(error);
        response.status(500).send({ error: "Internal Server Error" });
    }
});

export default router;