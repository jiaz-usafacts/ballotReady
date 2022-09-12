//TODO
//"csa",
var layers = [
	"cd","elementary-school","places","secondary-school","senate-upper","senate-lower","county","unified-school"
]

var map//	= drawMap()
var userCenter;
var dataRoot = "P4_race_hispanic_over17/data/"
var dataDict = {}
var positionsData;
var popup;
var dp03



		var layerColors = {
G4000: "#9cbc34",
G5220: "#5f5848",
G5210: "#60e54e",
G5200: "#697253",
G5410: "#a0e642",
G5400: "#acb098",
G4110: "#e0dd37",
G5420: "#d9ea81",
G4210:"#9b8e33",
G4040: "#4caa30",
G4020: "#3c9341",
X0072:"#9ba672", 
X0001:"#789436", X0014:"#9dd48d", X0005:"#568450", X0029:"#6b6628"
		}
		
		var tenesee = [-86.7501,36.1708]

		var censusData = {}
// for(l in layers){
// 	var url = dataRoot+layers[l]+".csv"
// 	//console.log(url)
// 	var promise = d3.csv(url)
// 	promises.push(promise)
// }
//promises.push(d3.csv("races2b.csv"))
// console.log(promises)
//,d3.csv("races2b.csv")

var population = d3.json('data/population/B01003_001E_shapes.json')
var households = d3.json('data/households/B11012_001E_shapes.json')
var tenure = d3.json('data/tenure/B25003_003E_B25003_002E_B25003_001E_shapes.json')
var units = d3.json('data/units/B25024_010E_B25024_009E_B25024_002E_shapes.json')

Promise.all([d3.json("dp03.json"),population, households,tenure,units])
 .then(function(data){
	 // dp03 = data[0]
 // 	console.log(dp03)
 // //
 // 	  for(var d in data){
 // // 		// console.log(d)
 //  		 if(d<data.length-1){
 //  		 dataDict[layers[d]]=formatData(data[d])
 //
 //  		 }else{
 //  			positionsData = formatPositions(data[d])
 //  		 }
 // //
 //  	 }
 // // 	  console.log(positionsData)
//  // 	//
 	 var api_key = "a247bcaf741b4b90bb90e90badd1682c"; // Api key obtained from your account page
 	 var url = `https://ipgeolocation.abstractapi.com/v1/?api_key=${api_key}`;
//
//       //getLocation()
	 //console.log(population)
	 
	 censusData["population"]=data[1]
	 censusData["households"]=data[2]
	 httpGetAsync(url, showLocation)
	
	 
})

function httpGetAsync(url, callback) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      callback(xmlHttp.responseText);
  }
  xmlHttp.open("GET", url, true); // true for asynchronous
  xmlHttp.send(null);
}

function showLocation(data) {
 // console.log(data);
  var parsedData = JSON.parse(data)
  var center = [parsedData.longitude,parsedData.latitude]
// console.log(center)  
 userCenter = center
	 map	= drawMap()
 	map.on("load",function(){
//	 console.log("set center initial")
 	//setCenter(userCenter)
 })
 
}
// function getLocation() {
//
//
// 	$.getJSON('https://api.ipify.org?format=jsonp&callback=?', function(data) {
// 		  console.log(data.ip);
//
// 	  	    jQuery.get("http://ipinfo.io/"+data.ip, function (response)
// 	  	               {
// 	  	                   var lats = response.loc.split(',')[0];
// 	  	                   var lngs = response.loc.split(',')[1];
// 	  	                 // console.log(lats,lngs)
// 	  	               }, "jsonp");
// 	});
// }
         

function formatPositions(data){
	//console.log(data)
	var formatted ={}
	for(i in data){
		var geoid = data[i].geoId
		var mtfcc = data[i].mtfcc
		if(Object.keys(formatted).indexOf(mtfcc)==-1){
			formatted[mtfcc]={}
			if(Object.keys(formatted[mtfcc]).indexOf(geoid)==-1){
				formatted[mtfcc][geoid]=[]
				formatted[mtfcc][geoid].push(data[i])
			}else{
				formatted[mtfcc][geoid].push(data[i])
			}
		}else{
			if(Object.keys(formatted[mtfcc]).indexOf(geoid)==-1){
				formatted[mtfcc][geoid]=[]
				formatted[mtfcc][geoid].push(data[i])
			}else{
				formatted[mtfcc][geoid].push(data[i])
			}
		}
	}
	return formatted
}
function formatData(data){
	var formatted = {}
	for(var i in data){
		if(data[i]["GEO_ID"]!=undefined){
			var geoName = data[i].NAME
			var pop = data[i]["P4_001N"]
			var geoid = data[i]["GEO_ID"].split("US")[1]
			formatted[geoid]={geoName:geoName,pop:pop}
		}
	}
	return formatted
	
}

var marker = null;

var clicked = false
var resulted = false
var marker = new mapboxgl.Marker({
			color:"#E62790"
		})
		
function setCenter(latLng){
//	console.log(latLng)
//	 console.log(congressData)
	// console.log("call set center")
//	console.log(map.getStyle().layers)
	 marker.setLngLat([latLng[0],latLng[1]])
 	.addTo(map);
	
	  var pointOnScreen = map.project(latLng)
	

	//console.log(map.getStyle().layers)
	//console.log(latLng,pointOnScreen)
	var features = map.queryRenderedFeatures(pointOnScreen, {
	  	layers: ['group2-5000s-xs_fill','group1-4000s_fill','cbsa_fill']
	  })
	  var geoids = []
	  var noDups = []
	  for(var f in features){
	  	var feature = features[f]
		  var geoid = feature.properties["layer"]
		  if(geoids.indexOf(geoid)==-1){
		  	geoids.push(geoid)
			  noDups.push(feature)
		  }
	  }
	 // console.log(geoids)
	  
  		console.log(noDups)
	  var filter = ['in', 'layer'].concat(geoids);
	 		  map.setFilter('group2-5000s-xs',filter)
	 		  map.setFilter('group1-4000s',filter)
	 		  map.setFilter('cbsa',filter)
	  
	  var displayString = noDups.length+" geographies overlap at this location.<br><br>These are the positions:<br>"
	  var populationsDict ={}
	  var householdsDict = {}
	  var positionsCount = 0
	  
	  for(var n in noDups){
		  
		  var geoid = noDups[n]['properties']["geo_id"]
		  var mtfcc = noDups[n]['properties']["mtfcc"]
		  var population = censusData["population"][mtfcc+"_"+geoid]
		  var households = censusData["households"][mtfcc+"_"+geoid]
		
		populationsDict[mtfcc]=population
		householdsDict[mtfcc]=households
		  
		  displayString+="<br><strong>"+ mtfcc+" "+geoid+"<br>"+"population: "+population+"<br>"
		  +"households: "+households+"<br></strong>"
		  
		  positionsCount+=(noDups[n].properties.positions.split("]").length)
		 var featureString=  noDups[n].properties.positions.split("],")
		  for(f in featureString){
			  var featureArray = featureString[f].split("\",\"")
			  var position = featureArray[1]
			  var candidate =  featureArray[featureArray.length-1]
			  
			  displayString+= position+"<br>"			  
		  }
	  }
	  d3.selectAll(".info").remove()
	  drawCircles(populationsDict)
	  drawHills(populationsDict)
//	  drawSquiggle(populationsDict)
	  d3.select("#info").append("div").attr("class","info").html(displayString)
}

function drawSquiggle(data){
	console.log(data)
	var max = d3.max(Object.keys(data),function(d){return parseInt(data[d])})
	var min = d3.min(Object.keys(data),function(d){return parseInt(data[d])})
	console.log(max)
	var w = 400
	var h = 600
	var p = 80
	var yScale = d3.scaleSqrt().domain([min,max]).range([5,(h-p*2)])
	var svg = d3.select("#info").append("svg").attr('width',w).attr("height",h).attr("class","info")
    
    const curve = d3.line().curve(d3.curveLinear);
	var cW = 10000
	var cH = 60
	var offset = 0
	for(var d in data){
		
		var lineData = []
		var sCount = Math.round(data[d]/cW/2)
		//console.log(data[d],d,sCount)
		
		var leftOver = data[d]%cW
		for(var s =1; s<=sCount; s++){
			lineData.push([p,cH*(s-.5)])
			
			lineData.push([w-p,cH*(s-.5)])
			lineData.push([w-p,cH*(s)])
		//	lineData.push([w-p*.4,cH*(s+.25)])
			
			//lineData.push([w-p,cH*(s-.2)])
			
			
			//lineData.push([w-p,cH*(s+.25)])
			
			lineData.push([p,cH*(s)])
			lineData.push([p,cH*(s+.25)])
	//		lineData.push([p,cH*(s+.5)])
			//lineData.push([p*s,cH*(s)])
		}
		console.log(lineData)
		svg.append("path")
		.attr("d",curve(lineData))
		.attr("fill","none")
		.attr("stroke",function(){return layerColors[d]})
		.attr("stroke-width",4)
		.attr("opacity",1)
		.attr("transform","translate("+offset+","+offset+")")
		
		offset+=4
		console.log(offset)
		//break
	}
}

function drawHills(data){
	//console.log(data)
	var max = d3.max(Object.keys(data),function(d){return parseInt(data[d])})
	var min = d3.min(Object.keys(data),function(d){return parseInt(data[d])})
	//console.log(max)
	var w = 400
	var h = 200
	var p = 10
	var yScale = d3.scaleSqrt().domain([min,max]).range([5,12000])
	var svg = d3.select("#info").append("svg").attr('width',w).attr("height",h).attr("class","info")
    const curve = d3.line().curve(d3.curveCardinal);
	var order = 0
	var xOffset = 30
	for(var d in data){
		//console.log(data[d],d)
		var lineData = [[0+order*xOffset,h-p],
		[30+order*xOffset,h-p-Math.sqrt(yScale(data[d])/Math.PI)/2]
		,[60+order*xOffset,h-p]]
		order+=1
		svg.append("path")
		.attr("d",curve(lineData))
		.attr("fill",function(){return layerColors[d]})
		.attr("stroke",function(){return layerColors[d]})
		.attr("opacity",.4)
		//.attr("fill","none")
		.attr("stroke-width",2)
	}
	
}
function drawCircles(data){
	//console.log(data)
	var max = d3.max(Object.keys(data),function(d){return parseInt(data[d])})
	var min = d3.min(Object.keys(data),function(d){return parseInt(data[d])})
	//console.log(max)
	var w = 200
	var h = 200
	var p = 10
	//circle area is πr2
	//var r = Math.sqrt(area/Math.PI)
	//var area = r*r*Math.PI
	
	var rScale = d3.scaleSqrt().domain([min,max]).range([0,10000])

	var svg = d3.select("#info").append("svg").attr('width',w).attr("height",h).attr("class","info")
	svg.selectAll("circle")
	.data(Object.keys(data))
	.enter()
	.append("circle")
	.attr("r",function(d){
		return Math.sqrt(rScale(data[d])/Math.PI)
	})
	.attr("cx",100)
	.attr("cy",function(d){
		return h-Math.sqrt(rScale(data[d])/Math.PI)
	})
	.attr("fill","none")
	.attr("stroke-width",2)
	.attr("stroke",function(d){return layerColors[d]})
	.attr("opacity",1)
	.on("mouseover",function(d,i){
		console.log(data[d])
	})
}


function drawMap(){
	
	  popup = new mapboxgl.Popup({ closeOnClick: false })
	
//	console.log(dict)
//var maxBounds = [[-74.3, 40.5],[-73.5, 41]]
    mapboxgl.accessToken = "pk.eyJ1Ijoiamlhei11c2FmYWN0cyIsImEiOiJjbDNrOXUxNmoxamNmM2ltcmdhemQwNWJiIn0.QVFg3eeO5XBtNc5WRDHEYg"
    map = new mapboxgl.Map({
		container: 'map',
		style:"mapbox://styles/jiaz-usafacts/cl7ae93ig000515q7lq6tsopd?fresh=true",// ,//newest
zoom: 3,
center: [0, 1],
				//preserveDrawingBuffer: true,
		minZoom:3,
		maxZoom:12,// ,
		 // maxBounds: maxBounds,
		center:[-96,37.5],
		//https://docs.mapbox.com/mapbox-gl-js/example/projections/
	//	projection:"albers"
		
		// {
			name:"albers"
// 			center:[-120,45],
// 			parallels: [29.5, 70]
//
// 		}
     });	
	

	 map.addControl(new mapboxgl.NavigationControl(),'bottom-right');

	  var geocoder = new MapboxGeocoder({
	  				 accessToken:mapboxgl.accessToken,
	  				 mapboxgl: mapboxgl,
	 				 flyTo:false,
	 				 marker:false
	  			 })
	
	 map.addControl(geocoder)
				 
      map.on("load",function(){
	  // console.log(map.getStyle().layers)
// 		  console.log(userCenter)
// 	  	setCenter(userCenter)
	 	 //
	 	 // map.on("move",function(){
	 	 // 	console.log(map.getZoom())
	 	 // })
			//
			//
			
			// map.setPaintProperty("group1-4000s",'line-color',
// 			["match", ["get","mtfcc"],
// 			"G4000",layerColors["G4000"],
// 			"G4020",layerColors["G4020"],
// 			"G4040",layerColors["G4040"],
// 			"G4110",layerColors["G4110"],
// 			"G4210",layerColors["G4210"],"black"
// 			]
// 		)
		
				
	map.setLayoutProperty("group1-4000s",'line-sort-key',
		["match", ["get","mtfcc"], 
		"G4000",5,
		"G4020",4,
		"G4040",3,
		"G4110",2,
		"G4210",1,5
		]
		)
		map.setPaintProperty("group1-4000s",'line-offset',
			["match", ["get","mtfcc"], 
			"G4000",5,
			"G4020",4,
			"G4040",3,
			"G4110",2,
			"G4210",1,5
			]
			)
	// map.setPaintProperty("group1-4000s",'line-width',
	// 	["match", ["get","mtfcc"],
	// 	"G4000",1,
	// 	"G4020",2,
	// 	"G4040",3,
	// 	"G4110",4,
	// 	"G4210",5,1
	// 	]
	// 	)
		//
// map.setPaintProperty("group2-5000s-xs",'line-color',
// 	["match", ["get","mtfcc"],
// 	"G5220",layerColors["G5220"],
// 	"G5210",layerColors["G5210"],
// 	"G5420",layerColors["G5420"],
// 	"G5200",layerColors["G5200"],
// 	"G5410",layerColors["G5410"],
// 	"G5400",layerColors["G5400"],"black"
// 	]
// 	)
	
// map.setPaintProperty("group2-5000s-xs",'line-width',
// 	["match", ["get","mtfcc"],
// 	"G5220",6,
// 	"G5210",7,
// 	"G5420",8,
// 	"G5200",9,
// 	"G5410",10,
// 	"G5400",11,11
// 	]
// 	)
	
map.setLayoutProperty("group2-5000s-xs",'line-sort-key',
	["match", ["get","mtfcc"], 
	"G5220",6,
	"G5210",5,
	"G5420",4,
	"G5200",3,
	"G5410",2,
	"G5400",1,1
	]
	)
	
map.setPaintProperty("group2-5000s-xs",'line-offset',
	["match", ["get","mtfcc"], 
	"G5220",.5,
	"G5210",1,
	"G5420",1.5,
	"G5200",2,
	"G5410",2.5,
	"G5400",3,1
	]
	)
	
	map.setLayoutProperty("group2-5000s-xs",'visibility',"visible");//
	 map.setLayoutProperty("group1-4000s",'visibility',"visible");//
	
			//map.setLayoutProperty()
	   
		  clicked=true
		  map.on('click', (e) => {
			 center = [e.lngLat.lng,e.lngLat.lat]
			  map.flyTo({
				  center: center,
				  zoom:8
			  });
			  
			  if(clicked==true){
				  clicked = false
				  map.on("moveend",function(){
					  setCenter(center)
				  })
			  }
		});
	
	  		geocoder.on('result', function(result) {
					resulted = true
	  			if(result!=null){
	 				center = result.result.center
					//console.log(center)
					map.flyTo({center:center, zoom:8})
					if(resulted==true){
					  	 resulted=false
					  	 map.on("moveend",function(){
						  setCenter(center)
					  })	
				  }
	  			}
	  		});

		 })
		 return map
}
