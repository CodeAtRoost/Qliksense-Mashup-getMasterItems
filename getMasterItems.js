/*
 * Basic responsive mashup template
 * @owner Enter you name here (Codeatroost@gmail.com)
 */
/*
 *    Fill in host and port for Qlik engine
 */
var prefix = window.location.pathname.substr( 0, window.location.pathname.toLowerCase().lastIndexOf( "/extensions" ) + 1 );
var config = {
	host: window.location.hostname,
	prefix: prefix,
	port: window.location.port,
	isSecure: window.location.protocol === "https:"
};
require.config( {
	baseUrl: ( config.isSecure ? "https://" : "http://" ) + config.host + (config.port ? ":" + config.port : "") + config.prefix + "resources"
} );

require( ["js/qlik"], function ( qlik ) {
	qlik.setOnError( function ( error ) {
		$( '#popupText' ).append( error.message + "<br>" );
		$( '#popup' ).fadeIn( 1000 );
	} );
	$( "#closePopup" ).click( function () {
		$( '#popup' ).hide();
	} );


	$('.list').click(function(){
		var listType=$(this).attr("id");
		if (listType=="VariableList"){
			getVariables();		
		}
		else
		{
			getList(listType);
		}
	});
	$('#sheet').click(function(){	
		getSheets();	
	});
	$('#app').click(function(){	
		getAppDetails();	
	});
	//open apps -- inserted here --
	var app = qlik.openApp('Consumer Sales.qvf', config);
	function getSheets(){
	app.getAppObjectList( 'sheet', function(reply){
	var str = "";
	console.log(reply);
	$.each(reply.qAppObjectList.qItems, function(key, value) {
		console.log(value.qName);
		str=str+ "<br>" + value.qData.title + "    -    " + value.qInfo.qId;
		app.getFullPropertyTree(value.qInfo.qId).then(function(reply){
		//console.log(reply.);
		});	
	});
	$('#QV01').html(str)
	});
	}
	
	function getAppDetails(){
	app.getAppLayout(function(layout){
	console.log("Layout")
	console.log(layout);
	$('#QV01').html(JSON.stringify(layout))
	});
	}
	function getList(listType){
	app.getList(listType, function(reply){	
		var str="";
		$.each(reply["q"+listType].qItems, function(key, value) {
			
			str=str+ "<br>" + value.qData.title + "    -    " + value.qInfo.qId;
			});
		$('#QV01').html(str);
		});
	}
	function getVariables(){
	var str="";
	app.getList("VariableList", function(reply){
	$.each(reply.qVariableList.qItems, function(key, value) {
		str=str+ "<br>" + value.qName + "    -    " + value.qInfo.qId;;
		app.variable.getContent(value.qName).then(function(model){
   		console.log(model);
		});
	});
	$('#QV01').html(str);
	});
	}
	/*app.createGenericObject({
	qMeasureListDef : {
	qType: "measure", qData: { title: "/title", tags: "/tags" }						}

	}, function(reply){

	console.log(reply);
	$.each(reply.qMeasureList.qItems, function(key, value) {
		//console.log(value);
		app.getFullPropertyTree(value.qInfo.qId).then(function(reply){
		console.log(reply);
		});	
	});

	});
	app.createGenericObject({
	qDimensionListDef  : {
	qType: "dimension", qData: { title: "/title", tags: "/tags" }						}

	}, function(reply){

	console.log(reply);
	$.each(reply.qDimensionList.qItems, function(key, value) {
		//console.log(value);
		app.getFullPropertyTree(value.qInfo.qId).then(function(reply){
		console.log(reply);
		},function(errror){});	
	});
	

	});*/
	
	
	
});
	

