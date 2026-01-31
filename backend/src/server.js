import express from "express"
import { ENV } from "./config/env.js";
import {db} from "./config/db.js"
import { favoritesTable } from "./db/schema.js";

const app = express();
const port = ENV.PORT

app.use(express.json());

app.get("/api/health", (req , res)=>{
    res.status(200).json({sucess: true})
})

app.post("/api/favorites", async (req, res) => {
  try {
    const { userId, recipeId, title, image, cookTime, servings } = req.body;

    if (userId == null || !recipeId || !title) {
      return res.status(400).json({ error: "Incomplete credentials..." });
    }

    const newFavorite = await db
      .insert(favoritesTable)
      .values({
        userId,
        recipeId,
        title,
        image,
        cookTime,
        servings,
      })
      .returning();

    res.status(201).json(newFavorite[0]);
  } catch (error) {
    console.log("Error adding favorites", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});


app.listen(port , ()=>{
    console.log("Server is running")
})