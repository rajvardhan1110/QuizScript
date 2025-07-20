const express = require("express");
const { UserAuthMiddleware } = require("../Middleware/UserAuthMiddleware");
const TestModel = require("../models/TestModel");
const TestLiveRouter = express.Router();

async function TestLiveHandler(req, res) {
    try {
        const userId = req.userId;
        const testId = req.query.testId;

        const test = await TestModel.findById(testId);

        if (!test) {
            return res.status(404).json({ msg: "Test is not available" });
        }

        res.json({
            test
        });

        
    } catch (e) {
        console.error("Error in TestLiveHandler:", e);
        res.status(500).json({ msg: "Server error" });
    }
}

TestLiveRouter.get("/", UserAuthMiddleware, TestLiveHandler);

module.exports = {
    TestLiveRouter
};
