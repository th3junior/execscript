const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const fs = require('fs');
const util = require('util');
const child = require('child_process');

const exec = util.promisify(child.exec);

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    const auth = {login: 'a', password: 'a'}
    const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
    const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':')
    if (login && password && login === auth.login && password === auth.password) {
      return next()
    }
    res.set('WWW-Authenticate', 'Basic realm="401"');
    res.status(401).send('Authentication required.');
});

app.use(express.static('public'));

app.post('/exec', async (req, res) => {
    const { command } = req.body;
    try {
        let resp = await exec(command);
        res.send(resp);
    } catch (error) {
        res.send(error);
    }
});

app.get('/scripts', (req, res) => {
    fs.readdir('./public/scripts', (err, files) => {
        res.send(files);
    });
});

app.listen(port,"192.168.172.198", () => {
  console.log(`Example app listening on port ${port}`);
});