import express, { Request, Response } from 'express'
import cors from 'cors'

const app = express()

const PORT = process.env.PORT

app.use(cors())
app.use(express.json())

app.use((err: Error, req: Request, res: Response) => {
  res.status(400).json({
    error: {
      message: err.message || "something went wrong",
    },
  });
});


app.get("/", (req: Request, res: Response) => {
  res.json("Connection Established");
});

app.listen(PORT,()=>{
    console.log("Server running on port" + PORT)
})