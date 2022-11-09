import express from "express";

const app = express()

app.get("/", async (req, res) => {
    try {
        const response = "hei, det funket"
        res.status(200).json()
    } catch (err) {
        console.error(err)
    }
})