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
    for (let i = 0; i < file.length; i++) {
        const element = file[i];
        const result = await exec(element);
        resp += result.stdout+"\n\r";          
    }

    var html = `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
    body{
      font-family: arial;	
      background: #000000
    }
    
    .wrapper{
      width: 100%;
      height: 100vh;
      margin: 0 auto;
      
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .cmd{
      position: relative;
      display: block;
      
      height: 500px;
      width: 100%;
      border: 1px solid #000000;
      border-radius: 4px;
      overflow: hidden;
      
      box-shadow: 0px 8px 18px #4b1d3f;
    }
    
    /*
     * 1. Set position
     * 2. Set dimension
     * 3. Style
     */
    .title-bar{
      /* 1 */
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      /* 2 */
      width: 100%;
      height: 40px;
      /* 3 */
      display: block;
      color: #FFFFFF;
      line-height: 40px;
      font-weight: 600;
      background-color: #242424;
      text-align: center;
    }
    
    .tool-bar{
      position: absolute;
      top: 40px;
      left: 0;
      right: 0;
      display: block;
      width: 100%;
      height: 30px;
      line-height: 30px;
      background-color: #242424;
    }
    
    .tool-bar ul{
      list-style-type: none;
      margin: 0px;
      padding: 0px;
    }
    
    .tool-bar ul li{
      display: inline-block;
      margin: 0;
      padding: 0;
    }
    
    .tool-bar ul li a{
      padding: 0px 6px;
      text-decoration: none;
      color: #FFFFFF;
    }
    
    .tool-bar ul li a:hover{
      text-decoration: underline;
    }
    
    .textarea{
      position: relative;
      top: 70px;
      padding: 12px;
      
      resize: none;
      width: 100%;
      height: calc(100% - 70px);
      background-color: #4b1d3f;
      border: none;
      color: #FFFFFF;
      margin: 0px;
      font-size: 1.1rem;
    }
    
    </style>
</head>
<body>
<div class="wrapper">
	<div class="cmd">
		<div class="title-bar">ubuntu@ubuntu: ~</div>
		<div class="tool-bar">
			<ul>
				<li><a href="#">File</a></li>
				<li><a href="#">Edit</a></li><li><a href="#">View</a></li>
			</ul>
		</div>
		<textarea class="textarea">`+resp+`</textarea>
	</div>
</div>
</body>
</html>
    
    
    `

    res.send(html);
})

app.use(express.static('public'))
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

