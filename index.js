require('dotenv').config();
const cheerio=require('cheerio');
const request=require('request'); 
const fetch = require("node-fetch");

let access_token = "EAAAAZAw4FxQIBACFx9jDmksV1US5xKcJa2LO0ZASsOsjZC6k8mBFY3lG9dWJar97rkfTqZApfoeFn8PbloyovlOgEpP00ExHxFXnQ7hZBNBOHC1GkhtzUnZChwEv0Stn4pwFtaroEcKUueip6cBRetSunM7IZC4nzrhuNOZBHYgVgLb30k3hZBAYo";
let cookie=process.env.COOKIE;
let agent='Chrome';
let idPage = '881821441833819' 
let idPost='3058776280804980' //'3060445683971373'//

//get like
let likesPr=(idPage,idPost)=>{
    return new Promise((resolve)=>{
      url = "https://graph.facebook.com/v4.0/"+idPage+"_"+idPost+"?fields=likes.summary(total_count)&access_token="+access_token;
      fetch(url).then((resp)=>resp.json()).then(function(result){
        resolve(result.likes.summary.total_count);
      })
    })
  }
  
  //get image
  let getImagePr=({ cookie, agent, url  })=>{
    return new Promise( ( resolve ) => {
      const option = {
        "method": "GET",
        "url": url,
        "headers": {
          "User-Agent": agent,
          "Cookie": cookie
        }
      };
      request(option, function (err, res, body) {
        let  images=[];
        if(err){
          console.log(err);
        }
        else{
          let $ = cheerio.load( body);
          let div=$("div[class='_2a2q _65sr']");
          div[0].children.forEach(function(item){
            item.children.forEach(function(item){
              item.children.forEach(function(img){
                images.push(img.attribs.src);
              })
            })
          })
        }
        resolve(images.filter( ( image ) => image != undefined ));
      });
    })
  }

  //get post
  let getPostPr=(idPage,idPost)=>{
    return new Promise(async function(resolve){
      let url="https://www.facebook.com/"+idPost;
      let urlapi="https://graph.facebook.com/"+idPage+"_"+idPost+"?&access_token="+access_token;
      let images=await getImagePr({cookie,agent,url});
      fetch(urlapi).then((resp)=>resp.json()).then(async function(result){
        likes=await likesPr(idPage,idPost);
        let post={
          message:result.message,
          likes:likes,
          shares:result.shares.count,
          images:images
        }
        resolve( post);
      })
    })
    
  }
  let test=async(idPage,idPost)=>{
    let post=await getPostPr(idPage,idPost);
    console.log(post);
  }
  test(idPage,idPost);
