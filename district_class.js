const request = require('request');

module.exports.district = district;
function district(id,title,cases,active,recovered,death){
    this.id = id;
    this.title = title;
    this.cases = cases;
    this.active = active;
    this.recovered = recovered;
    this.death = death;
}

module.exports.get_district_data = get_district_data;
function get_district_data(store_fun,main_fun) {
    request("https://data.nepalcorona.info/api/v1/districts",(error,req,resp)=>{
	let districts = JSON.parse(resp);
	districts.forEach(item => {
	    let id = item.id;
	    let title = item.title;
	    request("https://data.nepalcorona.info/api/v1/districts/"+id,(e,request,response)=>{
		let details = JSON.parse(response).covid_summary;
		let temp_district = new district(id,title,details.cases,details.active,details.recovered,details.death);
		store_fun(temp_district);
	    });
	});
    })
    setTimeout(()=>{main_fun();},5000);
}

module.exports.get_munci_data = get_munci_data;
function get_munci_data(id,region,fun) {
    let mcts = [];
    let timeout=3000;
    request("https://data.nepalcorona.info/api/v1/"+region+"/"+id,function(error,re,response){
	let munici = JSON.parse(response);
	let municipalities;
	 if (region === "districts") {
	     municipalities = munici.municipalities;

	 }else if (region === "municipals") {
	     municipalities = munici;

	 }
	municipalities.forEach(item => {
	     request("https://data.nepalcorona.info/api/v1/municipals/"+item.id,function(error,requ,respon){
		 let body = JSON.parse(respon)
		 let title = body.title
		 let cases = body.covid_cases
		 let total_cases = cases.length
		 let recovered = 0
		 let active = 0
		 cases.forEach(cur_item => {
		     if (cur_item.currentState === "recovered") {
			 recovered+=1
		     }else if (cur_item.currentState === "active") {
			 active+=1
		     }
		 });
		 let temp = {
		     title:title,
		     cases:total_cases,
		     recovered:recovered,
		     active:active,
		     death:total_cases-active-recovered
		 };
		 mcts.push(temp);
	     });
	 });
    });

    setTimeout(()=>{
	mcts.sort((first,second)=>(first.title>second.title)?1:(second.title>first.title?-1:0));
	fun(mcts);
    },3000);
}



