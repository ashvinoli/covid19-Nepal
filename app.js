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
    district.get_data((data)=>{
	all_data.push(data);	
    },()=>{
	all_data.sort((first,second)=>(first.title>second.title)?1:(second.title>first.title?-1:0));
	response.render("template",{
	    data:all_data
	});	
    });
    
});

app.get("/district/:id",(req,resp)=>{
    let id = req.params.id;
    let mcts = [];
    request("https://data.nepalcorona.info/api/v1/districts/"+id,function(error,re,response){
	let munici = JSON.parse(response);
	let municipalities = munici.municipalities;
	municipalities.forEach(item => {
	    request("https://data.nepalcorona.info/api/v1/municipals/"+item.id,function(error,requ,respon){
		let body = JSON.parse(respon)
		let title = body.title
		let cases = body.covid_cases
		let total_cases = cases.length
		let recovered = 0
		cases.forEach(cur_item => {
		    if (cur_item.currentState === "recovered") {
			recovered+=1
		    }
		});
		let temp = {
		    title:title,
		    total_cases:total_cases,
		    recovered:recovered
		};
		mcts.push(temp);
	    });
	});
    });
    setTimeout(()=>{
	mcts.sort((first,second)=>(first.title>second.title)?1:(second.title>first.title?-1:0));
	resp.render("munci",{
	    data:mcts
	});
    },3000);
});

app.listen(process.env.PORT ||  port_number,function() {
    console.log("Starting server at port:"+port_number);
});



