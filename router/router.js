import url from "url";

import { homepageController, registrationController, loginController, getUserDataController } from "../controllers/userControllers.js";
import authMiddleware from "../middlewares/auth.js";
import { insertTodosController, getTodosController, deleteTodosController } from "../controllers/todosControllers.js";

const routes = {
    '/': {
        'GET': {
            '/': homepageController
        }
    },
    '/user': {
        'POST': {
            '/user/register': registrationController,
            '/user/login': loginController
        },
        'GET': {
            '/user/data': getUserDataController // Requires valid 'auth-key' header
        }
    },
    '/todos': { // Protected route
        'POST': {
            '/todos/insert': insertTodosController
        },
        'GET': {
            '/todos/data': getTodosController
        },
        'DELETE': {
            '/todos/delete': deleteTodosController
        }
    }
}

function router(req, res) {
    try {
        const { query, pathname } = url.parse(req.url, true);
        const { method } = req;
        let body = '';

        req.on('data', (chunk) => body += chunk);

        req.on('end', async () => {
            try {
                const baseUrl = `/${pathname.split('/')[1]}`;
                res.setHeader('Content-Type', 'application/json');

                if (routes[baseUrl]?.[method]?.[pathname]) {
                    req.data = { query, pathname, method, body };

                    // Protects the /todos route
                    if (!authMiddleware(req, res, baseUrl)) {
                        res.statusCode = 401;
                        return res.end(JSON.stringify({ msg: 'Access Denied!' }));
                    }
                    return await routes[baseUrl][method][pathname](req, res);
                }
                res.statusCode = 404;
                return res.end(JSON.stringify({ msg: 'API Not Found!' }));

            } catch (error) {
                console.log(error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ msg: 'Server Error!' }));
            }
        });
    } catch (error) {
        console.log(error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ msg: 'Server Error!' }));
    }
}

export default router;