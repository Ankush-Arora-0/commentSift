import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { checkRelevance } from './relevance_api.js';
const app = express();
const relevantTo = "Binary search";
app.use(express.json())
app.use(cors({
    origin:["http://localhost:5173","*"],
    credentials:true
}));
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)
const FILE_PATH = path.join(__dirname,'comment.txt');
const buildPath = path.join(__dirname, 'dist');
app.use(express.static(buildPath));
//file is created when a server is started
fs.writeFileSync(FILE_PATH,'');
//Delete the file when server shuts down
const cleanup = () => {
    if (fs.existsSync(FILE_PATH)) {
      fs.unlinkSync(FILE_PATH);
      console.log('Temporary file deleted.');
    }
    process.exit();
  };
  process.on('SIGINT', cleanup);     // Ctrl+C
  process.on('SIGTERM', cleanup);    // `kill` command
  process.on('exit', cleanup); 


app.post('/addcomment',async(req,res)=>{
    try{
      const comment = req.body.comment;
      const similarity = await checkRelevance(comment,relevantTo)
      // console.log(comment);
        if(similarity>0.6){
          fs.appendFile('comment.txt',comment+'\n',(err)=>{
            if(err) throw err;
            res.send("Data appended");
            console.log("Data appended");
          })
        }
        else{
          console.log("not matching");
        }
    }
    catch(err){
        console.log(err);
    }
})

app.get('/getcomments', async (req, res) => {
  try {
    if (!fs.existsSync(FILE_PATH)) {
      return res.json([]); // No file yet = no comments
    }

    const data = fs.readFileSync(FILE_PATH, 'utf8');
    // console.log(data);
    // Split by new line and filter empty lines
    const comments = data
      .split('\n')
      .map(line => line.trim())
      .filter(line => line !== '');

    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to read comments' });
  }
});

app.listen(5000,()=>{
  console.log('Our server is listening at port 5000');
})