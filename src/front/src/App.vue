<template>
  <div class="left">
    <div class="action">
      <button v-show="status" @click="run">发送请求</button>
    </div>
    <h3>config</h3>
    <textarea v-model="data.config"/>
    <h3>url</h3>
    <input type="text" v-model="data.url">
    <h3>headers</h3>
    <textarea v-model="data.headers"/>
    <h3>params</h3>
    <textarea v-model="data.params"/>
  </div>
  <div class="right">
    <h3>请求配置</h3>
    <JsonViewer :value="jsonData" copyable boxed sort :expand-depth="2" v-if="status"/>
    <p v-else>输入参数有误</p>
    <h3>响应结果</h3>
    <JsonViewer :value="res" copyable boxed sort />
</div>
</template>

<script setup>
import {JsonViewer} from "vue3-json-viewer";
import "vue3-json-viewer/dist/index.css";
import {onMounted, ref,watch} from 'vue';
import axios from "axios";

const jsonData = ref({});
const status = ref(true);

const res = ref({});

const data = ref({
url:"/login/do_login",
config:`{
  "baseURL":"http://101.34.27.96:8201",
  "timeout":5000
}`,
params:`{
  "uuid":"0424585384",
  "password":"228322"
}`,
headers:`{
  "Authorization": "token"
}`
});

const handle = axios.create({
  baseURL:"/serve",
  timeout:20000
});

function proxy(url,params={},config={},headers={},method="post"){
    return handle.post("/proxy",{
      url,params,config,headers,method
    });
}

const run = debounce(()=>{
  const d = jsonData.value;
  proxy(d.url,d.params,d.config,d.headers).then(v=>{
    // console.log(v);
    res.value = v.data||{};
  }).catch(err=>{console.log(err)})
},500);

function debounce(fn,wait){
    var timer = null;
    return function(){
        if(timer !== null){
            clearTimeout(timer);
        }
        timer = setTimeout(fn,wait);
    }
}

watch(data,
  c=>{
    parse(c);
  },{
    deep:true
  }
)

function parse(value){
  try{
    const d = jsonData.value;
    d.url = value.url;
    d.config = JSON.parse(value.config);
    d.params = JSON.parse(value.params);
    d.headers = JSON.parse(value.headers);
    status.value = true;
    save(value);
  }catch(err){
    // console.log(err);
    status.value = false;
  }
}

function save(value){
  if(status.value)localStorage.setItem("jsonData",JSON.stringify(value));
}

function load(){
  const cfg = localStorage.getItem("jsonData");
  if(cfg)return JSON.parse(cfg);
  return {
url:"/login/do_login",
config:`{
  "baseURL":"http://101.34.27.96:8201",
  "timeout":5000
}`,
params:`{
  "uuid":"0424585384",
  "password":"228322"
}`,
headers:`{
  "Authorization": "token"
}`
  };
}

onMounted(()=>{
  data.value = load();
  status.value=true;
});

</script>

<style>

html,body{
  margin: 0;
  padding: 0;
  overflow: hidden;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

#app {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-start;
  box-sizing: border-box;
}

#app>.left,#app>.right{
  height: 100%;
  overflow-y: auto;
  padding: 15px;
  box-shadow: 3px 3px 10px gray;
  margin: 0 10px 0 10px;
  border-radius: 1rem;
}

#app>.left{
  flex: 1.3;
  display: flex;
  flex-direction: column;
}

#app>.right{
  flex: 1;
}

h3{
  margin-left: 10px;
  user-select: none;
}

.action{
  display: flex;
  flex-direction: row-reverse;
}

button{
  margin-top: 20px;
  padding: 10px;
  border: 0;
  box-shadow: 2px 2px 10px gray;
  border-radius: 1rem;
  background-color: #79bbff;
  color: white;
}
button:hover{
  background-color: #409eff;
}

button:active{
  background-color: #337ecc;
}

textarea{
  resize: vertical;
  min-height: 80px;
}

p{
  color: red;
}

::-webkit-scrollbar {
  width:5px;
}
/* 滚动槽 */
::-webkit-scrollbar-track {
  -webkit-box-shadow:inset006pxrgba(0,0,0,0.3);
  border-radius:10px;
}
/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  border-radius:10px;
  background:rgba(0,0,0,0.1);
  -webkit-box-shadow:inset006pxrgba(0,0,0,0.5);
}
::-webkit-scrollbar-thumb:window-inactive {
  background:rgba(255,0,0,0.4);
}

</style>
