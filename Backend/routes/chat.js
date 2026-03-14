import express from "express";
import Thread from "../models/Thread.js";
import getOllamaResponse from "../utils/ollama.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/test", authMiddleware, async(req,res) => {
    try{
        const thread = new Thread({
             userId: req.user.userId,
            threadId: "xyz",
            tittle: "Testing your thread"
        });

        const response = await thread.save();
        res.send(response);
    }  catch(err){
        console.log(err);
        res.status(500).json({error: "faliled to save the db"})
    }   
});

router.get("/thread", authMiddleware, async(req,res) => {
    try{
        const threads = await Thread
        .find({ userId: req.user.userId })
        .sort({updatedAt: -1});
        res.json(threads);
    } catch(err) {
        console.log(err);
        res.status(500).json({error:"failed to fetch the thread"});
    }
})

router.get("/thread/:threadId", authMiddleware, async (req, res) => {

  const { threadId } = req.params;

  try {

    const thread = await Thread.findOne({
      threadId,
      userId: req.user.userId
    });

    if (!thread) {
      return res.status(404).json({ error: "Thread not found" });
    }

    res.json(thread.messages);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "failed to fetch chat" });
  }

});

router.delete("/thread/:threadId", authMiddleware, async(req,res) => {
    const {threadId} = req.params;
    try{
        const deletedThread = await Thread.findOneAndDelete({threadId,userId: req.user.userId});

        if(!deletedThread){
            return res.status(404).json({error:"Thread not found"});
        }

        res.status(200).json({success: "Thread deleted successfully"});
    } catch(err){
        console.log(err);
        res.status(500).json({error:"failed to delete thr thread"});
    }
});

router.post("/chat", authMiddleware, async(req,res) => {
    const {threadId,message} = req.body;
    
    if(!threadId || !message){
        return res.status(400).json({error: "missing required fields"});
    }

    try{
        let thread = await Thread.findOne({threadId,userId:req.user.userId});

        if(!thread){
            thread = new Thread({
                userId : req.user.userId,
                threadId,
                title : message,
                messages: [{role:"user", content:message}]
            });
        } else {
            thread.messages.push({role:"user", content:message});    
        }

        const assistantReply = await getOllamaResponse(message);

        thread.messages.push({role:"assistant", content: assistantReply});
        thread.updatedAt = new Date();
        
        await thread.save();
        res.json({reply: assistantReply});

    } catch(err) {
        console.log(err);
        res.status(500).json({error: "something went wrong"});
    }
});
 
export default router;