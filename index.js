const child = require('child_process');
const fs = require('fs');
const express = require('express')
const app = express()
const port = 3001
const util = require('util');

const exec = util.promisify(child.exec);


app.get('/scripts', (req, res) => {
    
    fs.readdir("./public/scripts", (err, files) => {
        files.forEach(file => {
          console.log(file);
        });
  res.send(files)
      });

})

app.get('/execute/:i', async (req, res) => {
    var script = req.params.i;
    var file = fs.readFileSync('./public/scripts/'+script).toString().split('\r\n');
    var resp = ""
    res.write(`
    
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Scripts</title>
    <style>
    body {
      background-color:black;
    }
    
    .terminal {
      width:100%;
      height:100%;
      background-color:black;
      color:#66cc00;
      font-size:20px;
    }
    </style>
</head>
<body>
<textarea class="terminal" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" id="terminal" cols="100" rows="100">
    `);

    for (let i = 0; i < file.length; i++) {
        const element = file[i];
        const result = await exec(element);
        res.write(result.stdout);

    }

    res.write(`
    </textarea>
    </body>
    </html>
    `);
    res.end()
})

app.use(express.static('public'))
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

