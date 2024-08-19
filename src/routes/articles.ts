import { Router, Request, Response } from 'express';
import {
    setProducts,
    searchProducts,
} from "../controllers/articles";

const router: Router = Router();

router.post('/set', (request: Request, response: Response) => {
    setProducts(request, response);
});

router.post('/search', (request: Request, response: Response) => {
    searchProducts(request, response);
});

export default router;