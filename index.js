const { exec } = require('child_process');
const fs = require('fs');
const express = require('express')
const app = express()
const port = 3001


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
    for (let i = 0; i < file.length; i++) {
        const element = file[i];

         exec(element, (err, stdout, stderr) => {
            if (err) {
              return;
            }

            console.log(stdout);
            console.log(res.write(stdout));

          });
    }
    console.log(res.write('aaa'));

    res.end();
})

app.use(express.static('public'))
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

