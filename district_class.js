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

module.exports.get_data = get_data;
function get_data(store_fun,main_fun) {
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

