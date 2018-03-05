/*jshint esversion: 6 */
const cheerio = require('cheerio'); //fetch
const superagent = require('superagent');
const fs = require('fs');
const http = require('http');

const desUrl = "https://github.com/ShiTuoCheng/Notes/blob/master/README.md";

let titleArr = [], titleUrl = [];

const saveFile = (path, data) => {
  fs.appendFile(path, data, 'utf-8', err => {

    if(err) console.err('写入文件出错');
    console.log('写入文件成功');
  });
};

// 标题爬虫
function titleFetch () {
  superagent.get(desUrl).end((err, res) => {
    if (err) return console.error("出错咯");

    const $ = cheerio.load(res.text);

    Promise.resolve($(".markdown-body > h5 > a").each((index, ele) => {
        let item = ele.children[0].data,
          itemUrl = ele.attribs.href;

        if (item != void 0) {
          console.log(" 正在抓取第：", index);
          titleArr.push(item);
          titleUrl.push(itemUrl);
        }
      }))
      .then(() => saveFile("./content/title.txt", titleArr))
      .then(() => contentFetch())
      .catch(err => console.error("解析出了点错误"));

    console.log(titleArr);
  });
}

// 内容爬虫
function contentFetch () {
  titleUrl.forEach((v, index) => {
    superagent.get(v).end((err, res) => {
      const v$ = cheerio.load(res.text);
      saveFile(`./content/article${index}.html`, v$(".markdown-body"));
    });
  });
}
  

// main 函数
(() =>{
  titleFetch();
})();


