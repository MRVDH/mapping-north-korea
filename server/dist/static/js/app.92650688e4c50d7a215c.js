webpackJsonp([1],{"1gNz":function(t,e){},"7zck":function(t,e){},ErG4:function(t,e){},LL2N:function(t,e){},NHnr:function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=o("7+uW"),a=o("3EgV"),r=o.n(a),s=o("mtWM"),i=o.n(s),l="localhost"===window.location.hostname?"http://localhost:8081":"https://mappingnorthkorea.com",c=function(){return i.a.get(l+"/api/sector")},d=function(){return i.a.get(l+"/api/state")},u=function(t){return i.a.put(l+"/api/sector/"+t.sector._id,t)},p=function(t){return i.a.get(l+"/api/event/all/"+t)},v=function(t){return i.a.get(l+"/api/event/sectorid/"+t)},m=function(){return i.a.get(l+"/api/iteration/latest")},g=function(t){return i.a.get(l+"/api/sector/completed/count/"+t)},h=function(t){return i.a.delete(l+"/api/sector/"+t)},f=function(t){return i.a.get(l+"/api/sector/split/"+t)},_=new n.default,k={name:"CustomMenuLeft",data:function(){return{drawerLeft:!1,loggedInUser:null,loginLink:"",currentIteration:null,sectorTotalCount:0,sectorDoneCount:0}},mounted:function(){var t=this;_.$on("mnk:toggle-drawer-left",function(){t.drawerLeft=!t.drawerLeft}),_.$on("mnk:oauth-request-token-received",function(e){t.loginLink=e}),_.$on("mnk:oauth-user-details-received",function(e){t.loggedInUser=e}),_.$on("mnk:update-sector",function(e){"Completed"===e.properties.state.title&&t.sectorDoneCount++}),_.$emit("mnk:start-loading","getCompletedSectorCountByIterationId"),m().then(function(e){t.currentIteration=e.data,g(t.currentIteration._id).then(function(e){t.sectorTotalCount=e.data.totalCount,t.sectorDoneCount=e.data.doneCount,_.$emit("mnk:stop-loading","getCompletedSectorCountByIterationId")}).catch(function(){_.$emit("mnk:message-error","Something went wrong"),_.$emit("mnk:stop-loading","getCompletedSectorCountByIterationId")})}).catch(function(){_.$emit("mnk:message-error","Something went wrong")})},computed:{valueDeterminate:function(){var t=100*this.sectorDoneCount/this.sectorTotalCount;return t<1?1:t}}},b={render:function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("v-navigation-drawer",{attrs:{app:"",temporary:"",clipped:""},model:{value:t.drawerLeft,callback:function(e){t.drawerLeft=e},expression:"drawerLeft"}},[o("v-toolbar",{staticClass:"transparent",attrs:{flat:""}},[o("v-list",{staticClass:"pa-0"},[t.loggedInUser?o("v-list-tile",{attrs:{avatar:"",href:"https://www.openstreetmap.org/user/"+t.loggedInUser.name,target:"_blank"}},[o("v-list-tile-content",[o("v-list-tile-title",{attrs:{id:"logged-in-user-name"}},[t._v(t._s(t.loggedInUser.name))])],1)],1):o("v-list-tile",{attrs:{avatar:""}},[o("v-list-tile-action",[o("v-btn",{attrs:{color:"info",href:t.loginLink,disabled:0===t.loginLink.length}},[t._v("Login")])],1)],1)],1)],1),t._v(" "),o("v-list",[o("v-divider"),t._v(" "),o("v-list-tile",{attrs:{to:{path:"/"}}},[o("v-list-tile-action",[o("v-icon",[t._v("dashboard")])],1),t._v(" "),o("v-list-tile-content",[o("v-list-tile-title",[t._v("Map")])],1)],1),t._v(" "),o("v-list-tile",{attrs:{to:{path:"/about"}}},[o("v-list-tile-action",[o("v-icon",[t._v("info_outline")])],1),t._v(" "),o("v-list-tile-content",[o("v-list-tile-title",[t._v("About")])],1)],1)],1),t._v(" "),t.currentIteration?o("v-list",[o("v-divider"),t._v(" "),o("v-list-tile",[o("v-list-tile-content",[o("v-list-tile-title",[t._v("Iteration: "+t._s(t.currentIteration.title))])],1)],1),t._v(" "),o("v-list-tile",[o("v-list-tile-content",[t.sectorTotalCount>0?o("v-progress-linear",{model:{value:t.valueDeterminate,callback:function(e){t.valueDeterminate=e},expression:"valueDeterminate"}}):t._e()],1),t._v(" "),o("v-list-tile-action",{staticStyle:{"padding-left":"10px"}},[o("span",[t._v(t._s(t.sectorDoneCount)+" / "+t._s(t.sectorTotalCount))])])],1)],1):t._e()],1)},staticRenderFns:[]},y=o("VU/8")(k,b,!1,null,null,null).exports,w={name:"CustomHeader",data:function(){return{processesWorking:[],displayRightIcon:"MapPage"===this.$router.currentRoute.name,infoDialog:!1}},mounted:function(){_.$on("mnk:start-loading",this.addLoading),_.$on("mnk:stop-loading",this.removeLoading)},methods:{toggleDrawerLeft:function(){_.$emit("mnk:toggle-drawer-left")},toggleDrawerRight:function(){_.$emit("mnk:toggle-drawer-right")},toggleDarkTheme:function(){_.$emit("mnk:toggle-dark-theme","true"!==localStorage.darkTheme)},addLoading:function(t){this.processesWorking.push(t)},removeLoading:function(t){this.processesWorking=this.processesWorking.filter(function(e){return e!==t})}},watch:{$route:function(){this.displayRightIcon="MapPage"===this.$router.currentRoute.name}}},S={render:function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("v-toolbar",{attrs:{app:"","clipped-right":"",extended:"","extension-height":"7"}},[o("v-toolbar-side-icon",{on:{click:function(e){return e.stopPropagation(),t.toggleDrawerLeft()}}}),t._v(" "),o("v-toolbar-title",[t._v("Mapping North Korea")]),t._v(" "),o("v-btn",{attrs:{icon:""},on:{click:function(e){e.stopPropagation(),t.infoDialog=!0}}},[o("v-icon",[t._v("help_outline")])],1),t._v(" "),o("v-spacer"),t._v(" "),o("v-btn",{attrs:{icon:""},on:{click:function(e){return e.stopPropagation(),t.toggleDarkTheme()}}},[o("v-icon",[t._v("invert_colors")])],1),t._v(" "),t.displayRightIcon?o("v-toolbar-side-icon",{on:{click:function(e){return e.stopPropagation(),t.toggleDrawerRight()}}}):t._e(),t._v(" "),t.processesWorking.length>0?o("v-progress-linear",{staticClass:"ma-0",attrs:{slot:"extension",indeterminate:!0},slot:"extension"}):t._e(),t._v(" "),o("v-dialog",{attrs:{"max-width":"700px"},model:{value:t.infoDialog,callback:function(e){t.infoDialog=e},expression:"infoDialog"}},[o("v-card",{attrs:{id:"info-dialog"}},[o("v-card-title",[o("h1",[t._v("New to mappingnorthkorea.com?")]),t._v("\n                Read some frequently asked questions here.\n            ")]),t._v(" "),o("v-card-text",[o("h3",[t._v("What is this?")]),t._v(" "),o("p",[t._v("\n                    This is MappingNorthKorea.com, a collaborative effort to map one of the most isolated countries on earth. Read more on the about page "),o("a",{attrs:{href:"/#/about"},on:{click:function(e){e.stopPropagation(),t.infoDialog=!1}}},[t._v("here")]),t._v(".\n                ")]),t._v(" "),o("h3",[t._v("Why are all the buttons disabled?")]),t._v(" "),o("p",[t._v("\n                    You probably haven't logged in yet. You can browse sectors without an account, but to map you will need an OpenStreetMap account. If you don't have one, sign up "),o("a",{attrs:{href:"https://www.openstreetmap.org/user/new",target:"_blank"}},[t._v("here")]),t._v(". If you have an account, open the left menu by pressing the three-lined-button in the top left corner and click the login button. If only the Map button is disabled but the edit button is clickable, then the sector is probably not in an editable state. Check the question below.\n                ")]),t._v(" "),o("h3",[t._v("Why is the Map button disabled?")]),t._v(" "),o("p",[t._v("\n                    The sector that you selected is probably not in an editable state. Use the Edit button to switch the sector to either Being edited or Being reviewed. If the edit button is disabled then you are probably not logged in yet. Check the question above.\n                ")]),t._v(" "),o("h3",[t._v("The sector I am editing is too much work or too big. How do I split a sector into smaller sectors?")]),t._v(" "),o("p",[t._v("\n                    To avoid abuse of the system currently only people whom have administrator rights are allowed to do this. Please send an email to "),o("a",{attrs:{href:"mailto:info@maartenvandenhoven.com"}},[t._v("info@maartenvandenhoven.com")]),t._v(" for a split request and include the sector id. The sector id can be found after selecting a sector.\n                ")])]),t._v(" "),o("v-divider"),t._v(" "),o("v-card-actions",[o("v-spacer"),t._v(" "),o("v-btn",{attrs:{outline:""},on:{click:function(e){e.stopPropagation(),t.infoDialog=!1}}},[t._v("Got it")])],1)],1)],1)],1)},staticRenderFns:[]};var x=o("VU/8")(w,S,!1,function(t){o("heS6")},null,null).exports,C={render:function(){var t=this.$createElement,e=this._self._c||t;return e("v-footer",{staticClass:"pa-3",attrs:{app:""}},[e("v-spacer"),this._v(" "),e("div",[this._v("© mappingnorthkorea.com "+this._s((new Date).getFullYear()))])],1)},staticRenderFns:[]};var $=o("VU/8")({name:"CustomFooter",data:function(){return{}}},C,!1,function(t){o("h7V3")},null,null).exports,T="localhost"===window.location.hostname?"http://localhost:8081":"https://mappingnorthkorea.com",M=function(){return i.a.post(T+"/api/osm/oauth/request")},I=function(){return i.a.get(T+"/api/osm/oauth/isauthenticated")},D=function(){return i.a.get(T+"/api/osm/getuserdetails")},O={name:"App",data:function(){return{darkTheme:!1,snackbar:!1,snackbarOptions:{color:"",timeout:5e3,text:""}}},mounted:function(){var t=this;localStorage.darkTheme?this.darkTheme="true"===localStorage.darkTheme:(localStorage.darkTheme=!1,this.darkTheme=!1),document.getElementById("loading-text").remove(),"done"===new URL(window.location.href).searchParams.get("callback")?(_.$emit("mnk:start-loading","getUserDetails"),D().then(function(t){_.$emit("mnk:message-success","Logged in. You can now start mapping"),_.$emit("mnk:oauth-user-details-received",t.data),_.$emit("mnk:toggle-drawer-left"),_.$emit("mnk:stop-loading","getUserDetails")}).catch(function(){_.$emit("mnk:message-error","Something went wrong"),_.$emit("mnk:stop-loading","getUserDetails")}),window.history.pushState({},document.title,"/")):(_.$emit("mnk:start-loading","isuserloggedin"),I().then(function(t){t.data.isAuthenticated?(_.$emit("mnk:start-loading","getUserDetails"),D().then(function(t){_.$emit("mnk:oauth-user-details-received",t.data),_.$emit("mnk:stop-loading","getUserDetails")})):(_.$emit("mnk:start-loading","getrequesttoken"),M().then(function(t){_.$emit("mnk:oauth-request-token-received",t.data),_.$emit("mnk:stop-loading","getrequesttoken")})),_.$emit("mnk:stop-loading","isuserloggedin")}).catch(function(){_.$emit("mnk:message-error","Something went wrong"),_.$emit("mnk:stop-loading","isuserloggedin")})),_.$on("mnk:toggle-dark-theme",function(){t.darkTheme=!t.darkTheme}),_.$on("mnk:message-success",function(e){t.snackbar=!0,t.snackbarOptions.color="success",t.snackbarOptions.text=e}),_.$on("mnk:message-info",function(e){t.snackbar=!0,t.snackbarOptions.color="info",t.snackbarOptions.text=e}),_.$on("mnk:message-error",function(e){t.snackbar=!0,t.snackbarOptions.color="error",t.snackbarOptions.text=e})},watch:{darkTheme:function(t){localStorage.darkTheme=t}},components:{CustomMenuLeft:y,CustomHeader:x,CustomFooter:$}},A={render:function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("v-app",{attrs:{id:"app",dark:t.darkTheme}},[o("CustomMenuLeft"),t._v(" "),o("CustomHeader"),t._v(" "),o("router-view"),t._v(" "),o("CustomFooter"),t._v(" "),o("v-snackbar",{attrs:{left:"",color:t.snackbarOptions.color,timeout:t.snackbarOptions.timeout},model:{value:t.snackbar,callback:function(e){t.snackbar=e},expression:"snackbar"}},[t._v("\n        "+t._s(t.snackbarOptions.text)+"\n        "),o("v-btn",{attrs:{flat:""},on:{click:function(e){t.snackbar=!1}}},[t._v("\n            Close\n        ")])],1)],1)},staticRenderFns:[]};var E=o("VU/8")(O,A,!1,function(t){o("LL2N")},"data-v-2634bdfb",null).exports,R=o("/ocq"),J=o("BO1k"),P=o.n(J),F=1,U=.6,B={name:"CustomMap",data:function(){return{map:null,geoJsonLayer:null,sectors:null,selectedSector:null,lightTileLayer:null,darkTileLayer:null}},mounted:function(){var t=this;this.initMap(),_.$on("mnk:update-sector",function(e){for(var o in t.sectors.features[t.sectors.features.findIndex(function(t){return t.properties._id===e.properties._id})]=e,t.geoJsonLayer._layers)if(t.geoJsonLayer._layers[o].feature.properties._id===e.properties._id){t.geoJsonLayer._layers[o].feature=e,t.geoJsonLayer._layers[o].setStyle({fillColor:e.properties.state.color});break}}),_.$on("mnk:go-to-sector",function(e){for(var o in t.geoJsonLayer._layers)if(t.geoJsonLayer._layers[o].feature.properties._id===e){t.selectSector(t.geoJsonLayer._layers[o]);break}}),_.$on("mnk:select-random-sector-by-state-id",function(e){var o=[];for(var n in t.geoJsonLayer._layers)t.geoJsonLayer._layers[n].feature.properties.state._id===e&&o.push(t.geoJsonLayer._layers[n]);o.length>0?t.selectSector(o[Math.floor(Math.random()*o.length)]):_.$emit("mnk:message-info","No sectors with that state.")}),_.$on("mnk:toggle-dark-theme",function(e){e?(t.map.removeLayer(t.lightTileLayer),t.map.addLayer(t.darkTileLayer)):(t.map.removeLayer(t.darkTileLayer),t.map.addLayer(t.lightTileLayer))})},methods:{initMap:function(){var t=this;this.map=L.map("map").on("click",this.clickMap).setView([39.686,127.5],7),this.lightTileLayer=L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}),this.darkTileLayer=L.tileLayer("https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",{maxZoom:19,attribution:'&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}),localStorage.darkTheme&&"true"===localStorage.darkTheme?this.darkTileLayer.addTo(this.map):this.lightTileLayer.addTo(this.map),_.$emit("mnk:start-loading","loadingsectors"),c().then(function(e){t.sectors=t.sectorsToGeoJson(e.data),t.geoJsonLayer=L.geoJSON(t.sectors,{style:function(t){return{color:t.properties.state.color,fillColor:t.properties.state.color,weight:F,opacity:U}}}).on("click",t.clickSector).on("dblclick",function(t){return L.DomEvent.stopPropagation(t),!1}).addTo(t.map),_.$emit("mnk:stop-loading","loadingsectors")}).catch(function(){_.$emit("mnk:message-error","Something went wrong"),_.$emit("mnk:stop-loading","loadingsectors")})},clickSector:function(t){this.selectedSector&&this.selectedSector.feature.properties._id===t.layer.feature.properties._id?(_.$emit("mnk:deselect-sector"),t.layer.setStyle({color:this.selectedSector.feature.properties.state.color,weight:F,opacity:U}),this.selectedSector=null):(_.$emit("mnk:select-sector",t.layer.toGeoJSON()),t.layer.bringToFront(),t.layer.setStyle({color:"#FFFF00",opacity:1,weight:2,fillColor:t.layer.options.fillColor}),this.selectedSector&&this.selectedSector.setStyle({color:this.selectedSector.feature.properties.state.color,weight:F,opacity:U}),this.selectedSector=t.layer),L.DomEvent.stopPropagation(t)},clickMap:function(){if(this.selectedSector){for(var t in _.$emit("mnk:deselect-sector"),this.geoJsonLayer._layers)if(this.geoJsonLayer._layers[t].feature.properties._id===this.selectedSector.feature.properties._id){this.geoJsonLayer._layers[t].setStyle({color:this.selectedSector.feature.properties.state.color,weight:F,opacity:U});break}this.selectedSector=null}},sectorsToGeoJson:function(t){var e={features:[],type:"FeatureCollection"},o=!0,n=!1,a=void 0;try{for(var r,s=P()(t);!(o=(r=s.next()).done);o=!0){var i=r.value;e.features.push({type:"Feature",properties:{_id:i._id,state:i.state,sectorSet:i.sectorSet},geometry:{type:"Polygon",coordinates:i.coordinates}})}}catch(t){n=!0,a=t}finally{try{!o&&s.return&&s.return()}finally{if(n)throw a}}return e},flyToSectorByPolygonCoordinates:function(t){this.map.flyTo([(t[2][1]+t[0][1])/2,(t[1][0]+t[0][0])/2],13)},selectSector:function(t){_.$emit("mnk:select-sector",t.toGeoJSON()),t.bringToFront(),t.setStyle({color:"#FFFF00",opacity:1,weight:2,fillColor:t.options.fillColor}),this.selectedSector&&this.selectedSector.setStyle({color:this.selectedSector.feature.properties.state.color,weight:F,opacity:U}),this.selectedSector=t,this.flyToSectorByPolygonCoordinates(this.selectedSector.feature.geometry.coordinates[0])}}},j={render:function(){var t=this.$createElement;return(this._self._c||t)("div",{attrs:{id:"map"}})},staticRenderFns:[]};var V=o("VU/8")(B,j,!1,function(t){o("suSj")},null,null).exports,N=o("fZjL"),q=o.n(N),W=function(t,e){return t+="?"+q()(e).map(function(t){return t+"="+e[t]}).join("&"),i.a.get(t)},G={name:"CustomMenuRight",data:function(){return{drawerRight:!this.$vuetify.breakpoint.xs,selectedSector:null,idUrl:"",valid:!0,newComment:"",newState:null,states:null,events:[],userLoggedIn:!1,allEvents:[],mappingMenuOpen:!1,stateEditOpen:!1}},mounted:function(){var t=this;_.$on("mnk:toggle-drawer-right",function(){t.drawerRight=!t.drawerRight}),_.$on("mnk:select-sector",this.selectSector),_.$on("mnk:oauth-user-details-received",function(){t.userLoggedIn=!0}),_.$on("mnk:deselect-sector",function(){t.selectedSector=null}),_.$emit("mnk:start-loading","getAllStates"),d().then(function(e){t.states=e.data,_.$emit("mnk:stop-loading","getAllStates")}),_.$emit("mnk:start-loading","getAllEvents"),p(25).then(function(e){t.allEvents=e.data,_.$emit("mnk:stop-loading","getAllEvents")})},methods:{selectSectorById:function(t){_.$emit("mnk:go-to-sector",t)},selectSector:function(t){var e=this;this.selectedSector=t,this.newState=this.selectedSector.properties.state._id;var o=this.selectedSector.geometry.coordinates[0];this.idUrl="https://www.openstreetmap.org/edit?editor=id&#map=13/"+(o[1][1]+o[2][1])/2+"/"+(o[0][0]+o[1][0])/2+"&comment=MappingNorthKorea.com%20sector%20"+this.selectedSector.properties._id+"&gpx=https://mappingnorthkorea.com/api/sector/generate/"+this.selectedSector.properties._id+".gpx",_.$emit("mnk:start-loading","getEventsBySectorId"),v(this.selectedSector.properties._id).then(function(t){t.data.length>0&&(e.events=t.data.sort(function(t,e){return new Date(e.time.date)-new Date(t.time.date)}).reverse()),_.$emit("mnk:stop-loading","getEventsBySectorId")})},selectRandomSector:function(t){_.$emit("mnk:select-random-sector-by-state-id",t)},postComment:function(){""!==this.newComment&&null!==this.newComment&&void 0!==this.newComment&&this.updateSector(this.selectedSector.properties.state,this.newComment)},updateSector:function(t,e){var o=this,n=this.geoJsonSectorToApiSector(this.selectedSector);this.stateEditOpen=!1,_.$emit("mnk:start-loading","updateSector"),u({sector:n,comment:e||"",state:t}).then(function(t){var e=!0,n=!1,a=void 0;try{for(var r,s=P()(t.data.events);!(e=(r=s.next()).done);e=!0){var i=r.value;o.events.unshift(i),o.allEvents.unshift(i)}}catch(t){n=!0,a=t}finally{try{!e&&s.return&&s.return()}finally{if(n)throw a}}o.selectedSector=o.sectorToGeoJson(t.data.sector),o.newComment="",o.newState=o.selectedSector.properties.state._id,_.$emit("mnk:message-success","Sector updated"),_.$emit("mnk:update-sector",o.selectedSector),_.$emit("mnk:stop-loading","updateSector")}).catch(function(){_.$emit("mnk:message-error","Something went wrong"),_.$emit("mnk:stop-loading","updateSector")})},mapSectorInJOSM:function(){var t={left:this.selectedSector.geometry.coordinates[0][0][0],bottom:this.selectedSector.geometry.coordinates[0][2][1],right:this.selectedSector.geometry.coordinates[0][1][0],top:this.selectedSector.geometry.coordinates[0][0][1],changeset_comment:encodeURIComponent("MappingNorthKorea.com sector "+this.selectedSector.properties._id)};_.$emit("mnk:start-loading","sendJOSMCommand"),W("https://127.0.0.1:8112/load_and_zoom",t).catch(function(){_.$emit("mnk:message-error","Failed to load data into JOSM. Is JOSM running and is Remote Contol (by HTTPS) enabled?"),_.$emit("mnk:stop-loading","sendJOSMCommand")}),W("https://127.0.0.1:8112/imagery",{type:"bing",url:"https://www.bing.com/maps/"})},cancelDialog:function(){this.updateSectorDialog=!1,this.newComment="",this.newState=this.selectedSector.properties.state._id},geoJsonSectorToApiSector:function(t){return{_id:t.properties._id,sectorSet:t.properties.sectorSet,state:t.properties.state,coordinates:t.geometry.coordinates}},calculateDateOutput:function(t){var e=new Date,o=new Date;return o.setDate(o.getDate()-1),t.getDate()===e.getDate()&&t.getMonth()===e.getMonth()&&t.getFullYear()===e.getFullYear()?"today":t.getDate()===o.getDate()&&t.getMonth()===o.getMonth()&&t.getFullYear()===o.getFullYear()?"yesterday":t.toLocaleString("nl-NL",{year:"numeric",month:"long",day:"numeric"})},sectorToGeoJson:function(t){return{type:"Feature",properties:{_id:t._id,state:t.state,sectorSet:t.sectorSet},geometry:{type:"Polygon",coordinates:t.coordinates}}},deleteSector:function(){confirm("Are you sure you want to delete this sector?")&&(_.$emit("mnk:start-loading","deleteSectorById"),h(this.selectedSector.properties._id).then(function(t){_.$emit("mnk:stop-loading","deleteSectorById"),location.reload()}))},splitSector:function(){confirm("Are you sure you want to split this sector?")&&(_.$emit("mnk:start-loading","splitSectorById"),f(this.selectedSector.properties._id).then(function(t){_.$emit("mnk:stop-loading","splitSectorById"),location.reload()}))}},computed:{adminLoggedIn:function(){return!!this.userLoggedIn&&("DevModeUser"===document.getElementById("logged-in-user-name").innerText||"Artemis64"===document.getElementById("logged-in-user-name").innerText)}}},z={render:function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("v-navigation-drawer",{attrs:{fixed:"",right:"",clipped:"","mobile-break-point":"0",app:""},model:{value:t.drawerRight,callback:function(e){t.drawerRight=e},expression:"drawerRight"}},[t.selectedSector?o("v-list",[o("v-list-tile",[o("v-list-tile-content",[o("v-list-tile-title",[t._v("Sector id")])],1),t._v(" "),o("v-list-tile-action",[o("v-list-tile-title",{staticClass:"text-xs-right"},[t._v(t._s(t.selectedSector.properties._id))])],1)],1),t._v(" "),o("v-list-tile",[o("v-list-tile-content",[o("v-list-tile-title",[t._v("State")])],1),t._v(" "),o("v-list-tile-action",[o("v-list-tile-title",{staticClass:"text-xs-right"},[t._v(t._s(t.selectedSector.properties.state.title))]),t._v(" "),o("v-menu",{attrs:{"offset-y":""},scopedSlots:t._u([{key:"activator",fn:function(e){var n=e.on;return[o("v-btn",t._g({staticClass:"no-margin-button",attrs:{outline:"",disabled:!t.userLoggedIn}},n),[t._v(t._s(t.selectedSector.properties.state.title))])]}}]),model:{value:t.stateEditOpen,callback:function(e){t.stateEditOpen=e},expression:"stateEditOpen"}},[t._v(" "),o("v-list",t._l(t.states,function(e,n){return o("v-list-tile",{key:n,on:{click:function(o){return o.stopPropagation(),t.updateSector(e,null)}}},[o("v-list-tile-title",[o("span",{style:{color:e.color,"vertical-align":"text-bottom"}},[t._v("■")]),t._v(" "+t._s(e.title)+"\n                            ")])],1)}),1)],1)],1)],1),t._v(" "),o("div",[t.userLoggedIn?t._e():o("v-container",{staticStyle:{padding:"0 16px"},attrs:{"text-xs-center":"","grid-list-xs":""}},[o("v-layout",[o("v-flex",[o("span",{staticClass:"orange--text"},[t._v("Please log in to map or edit this sector.")])])],1)],1),t._v(" "),"Open"===t.selectedSector.properties.state.title&&t.userLoggedIn?o("v-container",{staticStyle:{padding:"0 16px"},attrs:{"text-xs-center":"","grid-list-xs":""}},[o("v-layout",[o("v-flex",[o("span",{staticClass:"orange--text"},[t._v('Please change the state to "Being edited" to map this sector.')])])],1)],1):t._e(),t._v(" "),"Review needed"===t.selectedSector.properties.state.title&&t.userLoggedIn?o("v-container",{staticStyle:{padding:"0 16px"},attrs:{"text-xs-center":"","grid-list-xs":""}},[o("v-layout",[o("v-flex",[o("span",{staticClass:"orange--text"},[t._v('Please change the state to "Being reviewed" to review or back to "Being edited" to edit this sector.')])])],1)],1):t._e(),t._v(" "),"Completed"===t.selectedSector.properties.state.title&&t.userLoggedIn?o("v-container",{staticStyle:{padding:"0 16px"},attrs:{"text-xs-center":"","grid-list-xs":""}},[o("v-layout",[o("v-flex",[o("span",{staticClass:"orange--text"},[t._v('Please change the state back to "Being edited" or "Being reviewed" to edit or review this sector.')])])],1)],1):t._e()],1),t._v(" "),o("v-container",{staticStyle:{padding:"16px"},attrs:{"grid-list-xs":""}},[o("v-layout",[o("v-flex",[o("v-menu",{attrs:{"offset-y":""},scopedSlots:t._u([{key:"activator",fn:function(e){var n=e.on;return[o("v-btn",t._g({staticClass:"no-margin-button",attrs:{color:"success",disabled:!t.userLoggedIn||"Open"===t.selectedSector.properties.state.title||"Review needed"===t.selectedSector.properties.state.title||"Completed"===t.selectedSector.properties.state.title}},n),[t._v("Map")])]}}]),model:{value:t.mappingMenuOpen,callback:function(e){t.mappingMenuOpen=e},expression:"mappingMenuOpen"}},[t._v(" "),o("v-list",[o("v-list-tile",{attrs:{href:t.idUrl,target:"_blank"}},[o("v-list-tile-title",[t._v("iD")])],1),t._v(" "),o("v-list-tile",{on:{click:function(e){e.stopPropagation(),t.mapSectorInJOSM(),t.mappingMenuOpen=!1}}},[o("v-list-tile-title",[t._v("JOSM")])],1)],1)],1),t._v(" "),o("v-btn",{staticClass:"no-margin-button",attrs:{color:"success",target:"_blank",href:"https://www.openstreetmap.org/#map=13/"+(this.selectedSector.geometry.coordinates[0][1][1]+this.selectedSector.geometry.coordinates[0][2][1])/2+"/"+(this.selectedSector.geometry.coordinates[0][0][0]+this.selectedSector.geometry.coordinates[0][1][0])/2}},[t._v("View")]),t._v(" "),t.adminLoggedIn?o("v-btn",{staticClass:"no-margin-button",attrs:{color:"warning",disabled:!t.userLoggedIn},on:{click:function(e){return e.stopPropagation(),t.splitSector()}}},[t._v("Split")]):t._e(),t._v(" "),t.adminLoggedIn?o("v-btn",{staticClass:"no-margin-button",attrs:{color:"error",disabled:!t.userLoggedIn},on:{click:function(e){return e.stopPropagation(),t.deleteSector()}}},[t._v("Delete")]):t._e()],1)],1)],1),t._v(" "),o("v-divider"),t._v(" "),t.userLoggedIn?o("v-container",{staticStyle:{padding:"0 16px"},attrs:{"text-xs-center":"","grid-list-xs":""}},[o("v-layout",{attrs:{row:"",wrap:""}},[o("v-flex",{attrs:{xs12:""}},[o("v-textarea",{attrs:{"append-outer-icon":"send",counter:500,rules:[function(t){return t.length<=500||"Comment must be less than 500 characters"}],label:"Comment"},on:{"click:append-outer":function(e){return t.postComment()}},model:{value:t.newComment,callback:function(e){t.newComment=e},expression:"newComment"}})],1)],1)],1):t._e(),t._v(" "),o("v-container",{staticStyle:{padding:"16px"},attrs:{"grid-list-md":"","text-xs-center":""}},t._l(t.events,function(e,n){return o("v-layout",{key:n,attrs:{row:""}},[o("v-flex",{attrs:{xs12:""}},[o("div",{staticClass:"text-xs-left"},[t._v(t._s(e.description))]),t._v(" "),o("div",{staticClass:"text-xs-right grey--text text--lighten-1 caption"},[t._v(t._s(e.osmUserName)+"\n                        "),o("a",{staticStyle:{"text-decoration":"none"},attrs:{href:"https://www.openstreetmap.org/user/"+e.osmUserName,target:"_blank"}},[o("v-icon",{staticStyle:{"font-size":"10px","vertical-align":"initial"},attrs:{small:""}},[t._v("launch")])],1),t._v(" - "),o("span",{attrs:{title:new Date(e.time)}},[t._v(t._s(t.calculateDateOutput(new Date(e.time))))])])])],1)}),1)],1):o("v-list",[o("v-container",{staticStyle:{padding:"16px"},attrs:{"text-xs-center":"","grid-list-xs":""}},[o("v-layout",[o("v-flex",[t._v("\n                    Select a sector on the map to start mapping or select a random sector by state.\n                ")])],1)],1),t._v(" "),t._l(t.states,function(e,n){return o("v-list-tile",{key:n},[o("v-list-tile-content",[o("v-list-tile-title",[o("span",{style:{color:e.color}},[t._v("■")]),t._v(" "+t._s(e.title))])],1),t._v(" "),o("v-list-tile-action",[o("v-btn",{attrs:{icon:""},on:{click:function(o){return o.stopPropagation(),t.selectRandomSector(e._id)}}},[o("v-icon",[t._v("forward")])],1)],1)],1)}),t._v(" "),t.allEvents.length>0?o("v-divider"):t._e(),t._v(" "),o("v-container",{staticStyle:{padding:"16px 16px 0 16px"},attrs:{"grid-list-xs":""}},[o("v-layout",[o("v-flex",[o("span",{staticClass:"font-weight-bold"},[t._v("Recent events")])])],1)],1),t._v(" "),o("v-container",{staticStyle:{padding:"16px"},attrs:{"grid-list-md":"","text-xs-center":""}},t._l(t.allEvents,function(e,n){return o("v-layout",{key:n,attrs:{row:""}},[o("v-flex",{attrs:{xs12:""}},[o("div",{staticClass:"text-xs-left",staticStyle:{cursor:"pointer"},on:{click:function(o){return o.stopPropagation(),t.selectSectorById(e.sector)}}},[t._v(t._s(e.description))]),t._v(" "),o("div",{staticClass:"text-xs-right grey--text text--lighten-1 caption"},[t._v(t._s(e.osmUserName)+"\n                        "),o("a",{staticStyle:{"text-decoration":"none"},attrs:{href:"https://www.openstreetmap.org/user/"+e.osmUserName,target:"_blank"}},[o("v-icon",{staticStyle:{"font-size":"10px","vertical-align":"initial"},attrs:{small:""}},[t._v("launch")])],1),t._v(" - "),o("span",{attrs:{title:new Date(e.time)}},[t._v(t._s(t.calculateDateOutput(new Date(e.time))))])])])],1)}),1)],2)],1)},staticRenderFns:[]};var H={name:"MapPage",data:function(){return{}},components:{CustomMap:V,CustomMenuRight:o("VU/8")(G,z,!1,function(t){o("1gNz")},null,null).exports}},Y={render:function(){var t=this.$createElement,e=this._self._c||t;return e("v-content",[e("v-container",{attrs:{id:"content-container",fluid:"","fill-height":""}},[e("v-layout",[e("v-flex",[e("CustomMap")],1)],1)],1),this._v(" "),e("CustomMenuRight")],1)},staticRenderFns:[]};var K=o("VU/8")(H,Y,!1,function(t){o("VAoS")},"data-v-858e7c5c",null).exports,Z={render:function(){var t=this.$createElement;return(this._self._c||t)("div")},staticRenderFns:[]};var X=o("VU/8")({name:"StatisticsPage",data:function(){return{}}},Z,!1,function(t){o("ErG4")},null,null).exports,Q={render:function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("v-content",[o("v-container",{attrs:{id:"about-page","grid-list-xs":"","fill-height":""}},[o("v-layout",{attrs:{row:""}},[o("v-flex",{attrs:{xs12:""}},[o("v-card",[o("v-card-title",{attrs:{id:"about-page-headline"}},[o("h3",{staticClass:"headline"},[t._v("Mapping one of the most isolated and unmapped countries on earth.")])]),t._v(" "),o("v-card-text",[t._v("\n                        The purpose of this tool is to discover North Korea by analysing sattelite imagery and mapping everything to "),o("a",{attrs:{target:"_blank",href:"https://www.openstreetmap.org/about"}},[t._v("OpenStreetMap")]),t._v(". Because of a lack of interest, and probably due to it being unmonetizable, other map providers (such as Google, Bing and Apple) have only mapped North Korea to a very basic level.\n                    ")]),t._v(" "),o("v-card-title",{attrs:{id:"about-page-how-it-works"}},[o("h5",{staticClass:"headline"},[t._v("How it works")])]),t._v(" "),o("v-card-text",[t._v("\n                        The map is divided into 4723 sectors at the time of writing. These sectors can be selected for editing, reviews and more. Reviews can be done by anyone who would like to, but it's encouraged to let experienced OpenStreetMap mappers do it. An OpenStreetMap account is required to edit sectors. Users can log in with the OpenStreetMap account via OAuth using the menu on the left."),o("br"),t._v("\n                        The sectors are part of an iteration. The iteration system was added for the reason that once mapping starts, it will take a long time for the whole country to be completed. By the time the last sectors are done, the first sectors might be outdated. After completing the country a second iteration can be started for updates."),o("br"),t._v("\n                        The application is fully dynamic, which means it can be used for any other place on earth as well. A GitHub repository will soon be created for people to fork the code and apply it to their own countries, cities and so forth.\n                    ")]),t._v(" "),o("v-card-title",{attrs:{id:"about-page-attribution"}},[o("h5",{staticClass:"headline"},[t._v("Attribution")])]),t._v(" "),o("v-card-text",[t._v("\n                        There several articles, languages and frameworks that I have used to create this web app. I think it's fair to give attribution and to list those items as they have significantly helped me with the development.\n                        "),o("br"),o("br"),t._v("\n                        Back-end attribution.\n                        "),o("ul",[o("li",[t._v("The back-end is built on "),o("a",{attrs:{target:"_blank",href:"https://nodejs.org/en/"}},[t._v("Node.js")]),t._v(" using the "),o("a",{attrs:{target:"_blank",href:"https://expressjs.com/"}},[t._v("Express.js")]),t._v(" framework.")]),t._v(" "),o("li",[t._v("The "),o("a",{attrs:{target:"_blank",href:"https://www.mongodb.com/cloud/atlas"}},[t._v("MongoDB Atlas")]),t._v(" platform (free tier) is used for running the "),o("a",{attrs:{target:"_blank",href:"https://www.mongodb.com/"}},[t._v("MongoDB")]),t._v(" instance.")]),t._v(" "),o("li",[t._v("npm packages include "),o("a",{attrs:{target:"_blank",href:"https://github.com/expressjs/session"}},[t._v("express-session")]),t._v(", "),o("a",{attrs:{target:"_blank",href:"https://github.com/expressjs/body-parser"}},[t._v("body-parser")]),t._v(", "),o("a",{attrs:{target:"_blank",href:"https://github.com/kelektiv/node-uuid"}},[t._v("uuid")]),t._v(", "),o("a",{attrs:{target:"_blank",href:"https://github.com/jdesboeufs/connect-mongo"}},[t._v("connect-mongo")]),t._v(", "),o("a",{attrs:{target:"_blank",href:"https://github.com/Automattic/mongoose"}},[t._v("mongoose")]),t._v(" and "),o("a",{attrs:{target:"_blank",href:"https://github.com/nfriedly/express-rate-limit"}},[t._v("express-rate-limit")]),t._v(".")])]),t._v(" "),o("br"),t._v("\n                        Front-end attribution.\n                        "),o("ul",[o("li",[t._v("As a front-end framework "),o("a",{attrs:{target:"_blank",href:"https://vuejs.org/"}},[t._v("Vue.js")]),t._v(" is used and "),o("a",{attrs:{target:"_blank",href:"https://vuetifyjs.com/en/"}},[t._v("Vuetify")]),t._v(" is used for styling.")]),t._v(" "),o("li",[t._v("Icons and fonts are from "),o("a",{attrs:{target:"_blank",href:"https://fonts.google.com/"}},[t._v("Google Fonts")]),t._v(".")]),t._v(" "),o("li",[t._v("Testing has been done in the "),o("a",{attrs:{target:"_blank",href:"https://www.google.com/chrome/"}},[t._v("Google Chrome")]),t._v(", "),o("a",{attrs:{target:"_blank",href:"https://www.mozilla.org/en-US/firefox/new/"}},[t._v("Mozilla Firefox")]),t._v(", "),o("a",{attrs:{target:"_blank",href:"https://www.microsoft.com/en-us/windows/microsoft-edge"}},[t._v("Microsoft Edge")]),t._v(" and "),o("a",{attrs:{target:"_blank",href:"https://www.opera.com/"}},[t._v("Opera")]),t._v(" browsers.")]),t._v(" "),o("li",[t._v("For the light map "),o("a",{attrs:{target:"_blank",href:"https://leafletjs.com/"}},[t._v("Leaflet")]),t._v(" and a plugin "),o("a",{attrs:{target:"_blank",href:"https://github.com/leaflet-extras/leaflet-providers"}},[t._v("Leaflet-providers")]),t._v(" is used and for the dark map the awesome "),o("a",{attrs:{target:"_blank",href:"https://docs.stadiamaps.com/themes/#alidade-smooth-dark"}},[t._v('"Alidade Smooth Dark" layer')]),t._v(" of "),o("a",{attrs:{target:"_blank",href:"https://stadiamaps.com/"}},[t._v("Stadia Maps")]),t._v(" is used.")]),t._v(" "),o("li",[o("a",{attrs:{target:"_blank",href:"https://github.com/axios/axios"}},[t._v("axios")]),t._v(" is used for sending requests to the server.")]),t._v(" "),o("li",[t._v("To transpile and build all the front-end code "),o("a",{attrs:{target:"_blank",href:"https://webpack.js.org/"}},[t._v("webpack")]),t._v(", "),o("a",{attrs:{target:"_blank",href:"https://eslint.org/"}},[t._v("ESLint")]),t._v(" and a ton of other packages were used.")]),t._v(" "),o("li",[t._v("I took inspiration for the color codes of the sectors and how to get the connection strings for iD and JOSM from the "),o("a",{attrs:{target:"_blank",href:"https://github.com/hotosm/tasking-manager"}},[t._v("HOT Tasking Manager")]),t._v(".")])]),t._v(" "),o("br"),t._v("\n                        I already had some experience building web applications with Node.js, but to get started with Webpack, Vue.js and Vuetify I used some articles and guides.\n                        "),o("ul",[o("li",[t._v('"'),o("i",[t._v("Develop awesome webapps using VueJS + Webpack (demonstrating by building a XRP ledger integration)")]),t._v('" by Wietse Wind - '),o("a",{attrs:{target:"_blank",href:"https://itnext.io/develop-awesome-webapps-using-vuejs-webpack-bda08ebb691c"}},[t._v("link")])]),t._v(" "),o("li",[t._v('"'),o("i",[t._v("Anyway, here’s how to make AJAX & API calls with Vue JS")]),t._v('" by darkylmnx - '),o("a",{attrs:{target:"_blank",href:"https://itnext.io/anyway-heres-how-to-do-ajax-api-calls-with-vue-js-e71e57d5cf12"}},[t._v("link")])]),t._v(" "),o("li",[t._v('"'),o("i",[t._v("A simple EventBus to communicate between Vue.js components")]),t._v('" by Andrejs Abrickis - '),o("a",{attrs:{target:"_blank",href:"https://medium.com/@andrejsabrickis/https-medium-com-andrejsabrickis-create-simple-eventbus-to-communicate-between-vue-js-components-cdc11cd59860"}},[t._v("link")])]),t._v(" "),o("li",[t._v("And of course many many many "),o("a",{attrs:{target:"_blank",href:"https://stackoverflow.com/"}},[t._v("Stack Overflow")]),t._v(" Q&As.")])])]),t._v(" "),o("v-card-title",{attrs:{id:"about-page-data-usage"}},[o("h5",{staticClass:"headline"},[t._v("Data usage and Privacy")])]),t._v(" "),o("v-card-text",[t._v("\n                        After logging in, cookies are stored for session management. The cookie contains only your session id, but your OSM user name and OSM user id are stored server-side while the session lasts. Sessions will automatically be removed after a certain amount of time. Each time a sector is edited an 'event' is created to keep track of what happens to sectors, when and by whom. This event contains the OSM user name, OSM user id, timestamp, message and reference to said sector. Mappingnorthkorea.com does not keep ip, useragent or any other privacy sensitive logs. If users would like to have their OSM user name and id redacted or anonymised then they can send a request to the email address below.\n                    ")]),t._v(" "),o("v-card-title",{attrs:{id:"about-page-contact"}},[o("h5",{staticClass:"headline"},[t._v("Contact")])]),t._v(" "),o("v-card-text",[t._v("\n                        You can contact me at "),o("a",{attrs:{href:"mailto:info@maartenvandenhoven.com"}},[t._v("info@maartenvandenhoven.com")]),t._v(" for questions about this project and anything else or visit my website at "),o("a",{attrs:{href:"https://maartenvandenhoven.com"}},[t._v("https://maartenvandenhoven.com")]),t._v(".\n                    ")])],1)],1)],1)],1),t._v(" "),o("v-navigation-drawer",{attrs:{right:"",clipped:"",permanent:"","mobile-break-point":"0",app:""}},[o("v-list",[o("v-list-tile",[o("v-list-tile-action",{attrs:{target:"_blank",href:"#about-page-headline"}},[t._v("Header")])],1),t._v(" "),o("v-list-tile",[o("v-list-tile-action",{attrs:{target:"_blank",href:"#about-page-how-it-works"}},[t._v("How it works")])],1),t._v(" "),o("v-list-tile",[o("v-list-tile-action",{attrs:{target:"_blank",href:"#about-page-attribution"}},[t._v("Attribution")])],1),t._v(" "),o("v-list-tile",[o("v-list-tile-action",{attrs:{target:"_blank",href:"#about-page-data-usage"}},[t._v("Data usage and Privacy")])],1),t._v(" "),o("v-list-tile",[o("v-list-tile-action",{attrs:{target:"_blank",href:"#about-page-contact"}},[t._v("Contact")])],1)],1)],1)],1)},staticRenderFns:[]};var tt=o("VU/8")({name:"AboutPage",data:function(){return{}}},Q,!1,function(t){o("d15V")},null,null).exports;n.default.use(R.a);var et=new R.a({routes:[{path:"/",name:"MapPage",component:K},{path:"/stats",name:"Statistics",component:X},{path:"/about",name:"About",component:tt}]});o("7zck");n.default.config.productionTip=!1,n.default.use(r.a),new n.default({el:"#app",router:et,components:{App:E},template:"<App/>"})},VAoS:function(t,e){},d15V:function(t,e){},h7V3:function(t,e){},heS6:function(t,e){},suSj:function(t,e){}},["NHnr"]);
//# sourceMappingURL=app.92650688e4c50d7a215c.js.map