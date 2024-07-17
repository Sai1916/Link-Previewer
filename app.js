import express from "express";
import cors from "cors";

const app = express();

app.use(cors());

app.get("/", async (req, res) => {
  const { url } = req.query;
  console.log("request: " + JSON.stringify(req.query));

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });

  const data = await response.text();
//   console.log("response: " + data); 
  res.send(data);
});

app.listen(5000, () => console.log("server running on port 5000"));
