# react cli service

比`create-react-app`更好用的`react cli`

## 目录结构
参考[https://github.com/zlab/react-cli-demo](https://github.com/zlab/react-cli-demo)

## 已有项目
```
npm i react-cli-service -D
``` 

## package.json
```
"scripts": {
    "serve": "react-cli-service serve",
    "build": "react-cli-service build --report"
},
```

## 配置
新增`react.config.js`

## 入口
默认入口为`src/main.js`

# 新项目
## 下载模版
```
git clone https://github.com/zlab/react-cli-demo my-project
cd my-project
```

## install
`npm i` or `yarn`

## dev
`npm run serve` or `yarn serve`

## preview
[http://localhost:8080](http://localhost:8080)

## build
`npm run build` or `yarn build`

## 配置参考
[@vue/cli3](https://cli.vuejs.org/zh/config/)

[webpack-chain](https://github.com/neutrinojs/webpack-chain)