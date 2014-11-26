var latLng = [50.4408, 30.4588];
var map = L.map('map').setView(latLng, 14);
velocity.onmousemove = function() {
	rangevalue1.value = velocity.value + ' км/час';
	}
velocityStep.onmousemove = function() {
	rangevalue2.value = velocityStep.value + ' км/час';
	}
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
	minZoom: 3,
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
var xhr = new XMLHttpRequest();
xhr.open("GET","/api/query",true);
var time = new Date();
xhr.onreadystatechange = function() {
  if (xhr.readyState == 4) {
     if(xhr.status == 200) {
       var data = JSON.parse((xhr.responseText));
       var len = data.length,
       polylines,
       getGraph = function() {
			var polylineArray = [],
			inputValues = document.getElementById('slider'),
			roof = inputValues.getElementsByTagName('input')[0].value;
			step = inputValues.getElementsByTagName('input')[1].value;
			if (polylines) map.removeLayer(polylines);
			var visibleSpeed = step*((18-map.getZoom()));
		    for (var i = len - 1; i >= 0; i--) {
			if (data[i].speed >= roof | data[i].speed >= visibleSpeed) polylineArray.push(L.polyline(data[i].latLng, {color: '#333399', opacity: 1}));
			};
			polylines = L.layerGroup(polylineArray);
			polylines.addTo(map);
			if (visibleSpeed) currentValue.value = roof > visibleSpeed ? 'больше ' + visibleSpeed + ' км/час' :' больше ' + roof + ' км/час';
			else currentValue.value = 'все';
		};
	  for (var i = len - 2; i >= 0; i-=2) {
			data[i].latLng = [[],[]];
			data[i].latLng[0] = [data[i].lat,data[i].lon];
			data[i].latLng[1] = [data[i+1].lat,data[i+1].lon];
			data.splice(i+1,1);
			delete data[i].lat;
			delete data[i].lon;
		};
len = data.length;
getGraph();
velocity.onmousemove();
velocityStep.onmousemove();
map.on('zoomend', getGraph);
document.getElementById('velocity').addEventListener("change", getGraph);
document.getElementById('velocityStep').addEventListener("change", getGraph);
document.getElementById('loader').className = "loaderHide"
         }
  }
}
xhr.send();