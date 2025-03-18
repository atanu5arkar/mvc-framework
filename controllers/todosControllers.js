import UserModel from "../models/User.js";

async function insertTodosController(req, res) {
    try {
        const body = JSON.parse(req.data.body);
        let { task, deadline } = body;
        const { email } = req.user;

        deadline = new Date(deadline);
        await UserModel.updateOne({ email }, { $push: { todos: { task, deadline } } });

        res.statusCode = 201;
        return res.end(JSON.stringify({ msg: 'Task Inserted Successfully!' }));
    } catch (error) {
        throw error;
    }
}

async function getTodosController(req, res) {
    try {
        const { email } = req.user;
        const todos = await UserModel.findOne({ email }, '-_id todos');

        res.statusCode = 200;
        return res.end(JSON.stringify(todos));
    } catch (error) {
        throw error;
    }
}

async function deleteTodosController(req, res) {
    try {
        const { email } = req.user;
        const { taskid } = req.data.query;
        await UserModel.updateOne({ email }, { $pull: { todos: { _id: taskid } } });

        res.statusCode = 200;
        return res.end(JSON.stringify({ msg: 'Task Deleted Successfully!' }));
    } catch (error) {
        throw error;
    }
}

export { insertTodosController, getTodosController, deleteTodosController };