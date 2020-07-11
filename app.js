const express = require('express');
const body_parser = require('body-parser');
const ejs = require('ejs');
const request = require('request');
const district = require(__dirname+'/district_class');

const app = express();
app.use(body_parser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine','ejs');

let port_number = 3000;
app.get('/',function (req,response) {
    //some code
    let all_data = [];
    district.get_district_data((data)=>{
	all_data.push(data);	
    },()=>{
	all_data.sort((first,second)=>(first.title>second.title)?1:(second.title>first.title?-1:0));
	response.render("template",{
	    data:all_data,
	    region:"District"
	});	
    });
    
});

app.get("/region/:region/:id",(req,resp)=>{
    let id = req.params.id;
    let region = req.params.region;
    district.get_munci_data(id,region,(mcts)=>{
	resp.render("template",{
	    data:mcts,
	    region:"Municipality"
	});
    })
});

app.get("/region/municipals",(req,resp)=>{
    district.get_munci_data("","municipals",(mcts)=>{
	resp.render("munci",{
	    data:mcts,
	    region:"Municipality"
	});
    })
});
app.post("/search",(req,resp)=>{
    let query = req.body.search;
    query = (query.length==0)?null:query[0].toUpperCase() + query.slice(1,query.length);
    query?resp.redirect("/#"+query):resp.redirect("/");

})

app.listen(process.env.PORT ||  port_number,function() {
    console.log("Starting server at port:"+port_number);
});

