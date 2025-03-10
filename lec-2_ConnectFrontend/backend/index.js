import express from 'express'; // This line will give srroe so we write "type": "module",  in package.json file so that node assembles all the files as modules.
const app = express();
app.get('/', (req,res)=>{
    res.send('Server is ready');
})

app.get('/api/jokes', (req,res)=>{
    const jokes = [
     {
        id:1,
        title: 'Joke 1',
        content: "this is joke 1"
     } ,
     {
        id:2,
        title: 'Joke 2',
        content: "this is joke 2"
     } ,
     {
        id:3,
        title: 'Joke 3',
        content: "this is joke 3"
     } ,
     {
        id:4,
        title: 'Joke 4',
        content: "this is joke 4"
     } ,          
    ];
    res.json(jokes);
})

const port = process.env.PORT || 3000;
app.listen(port , () => {
    console.log(`serve at http://localhost:${port}`);
})











