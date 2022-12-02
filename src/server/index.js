const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const ecstatic = require('ecstatic');
const history = require('connect-history-api-fallback');
const axios = require('axios');

// const port = 8889;
const port = 8301;

errorSysInit(process);

const app = express();

app.all('*', function (req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST,GET');
    next();
});

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(history());
app.use(ecstatic({ root: __dirname + '/dist',cache:'no-cache',weakEtags:true}));

app.post(/proxy/,async function(req,res){
    const {url,params,config,headers,method} = req.body;
    // console.log(url)
    // console.log(params)
    // console.log(config)
    // console.log(headers)
    config.headers = headers;

    let result = await new Promise((resolve,reject)=>{
        proxy(url,params,config,method).then(v=>{
            resolve(v);
        }).catch(err=>{
            resolve(err);
        })
    });
    {
        const {status,statusText,headers,
            config,data
        } = result;
        const rlt = {
            status,statusText,headers,config,data
        };
        res.status(200).json(rlt);
    }
});

http.createServer(app).listen(port,function () {
    console.log(`应用实例，访问地址为 http://localhost:${port}`);
});

function errorSysInit(process){
    process.on('uncaughtException', function (err) {
        console.log(err);
    });
    process.on("unhandledRejection", (err, promise) => {
        console.log(err);
    });
}

function proxy(url,params={},config={},method="post"){
    return axios.create(config).post(url,params);
    // const handle =  axios.create(config);
    // if(method==="post"){
    //     return handle.post(url,params);
    // }
    // return handle.get(url,params);
}
