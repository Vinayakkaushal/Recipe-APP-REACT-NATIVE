import express from "express"
import { ENV } from "./config/env.js";
import {db} from "./config/db.js"
import { favoritesTable } from "./db/schema.js";
import { and, eq } from "drizzle-orm";

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


app.get("/api/favorites/:userId" , async (req, res) =>{
  try {
    const {userId} = req.params;
    
    const data = await db.select().from(favoritesTable).where(eq(favoritesTable.userId,userId))
    console.log(data)
    res.status(200).json({message: "Data fetched successfully..." , data:data});
  } catch (error) {
        console.log("Error fetching favorites", error);
    res.status(500).json({ error: "Something went wrong" });
  }
})

app.delete("/api/favorites/:userId/:recipeId" , async (req , res)=>{
  try {
    const {userId , recipeId} = req.params;
await db.delete(favoritesTable).where(and(eq(favoritesTable.userId,userId) , eq(favoritesTable.recipeId,parseInt(recipeId))));
    console.log(data)
    res.status(200).json({message: "Favorite deleted sucessfully", });

  } catch (error) {
    
    console.log("Error deleting favorites", error);
    res.status(500).json({ error: "Something went wrong" });
  }
})

app.listen(port , ()=>{
    console.log("Server is running")
})