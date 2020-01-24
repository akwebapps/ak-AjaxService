/*! akAjaxService v1.0.1 2020-01-23 | https://github.com/akwebapps/ak-AjaxService | (c) 2020 AK Web Apps | @license Licensed MIT */
(function ( $ ) {
	var akAjaxDefaults={
		type: "POST",
		async: true,
		cache: false,
		consoleLogs: true,
		primaryKey: "w",
		logPrefix: "akAjax:"
	};
	$.akAjaxService = function(url,data,callback,options){
		if(data && typeof data=="string" && data.indexOf("{")<0) data=JSON.parse('{"' + decodeURI(data).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
		var params=$.extend(true,{},akAjaxDefaults,options),
		logObj={"action":">"+params.logPrefix+" Send","endpoint":url,"key":(params.primaryKey && data[params.primaryKey])?data[params.primaryKey]:"","data":data},
		akParams={
			url:url,
			data:data,
			success:function(data){
				data=convertToJson(data);
				serviceSuccess(params,logObj,data);
				if(typeof callback=="function") callback(data);
			},
			error:function(xhr,statusText,msg,vars){
		   		if(xhr.status==200){
			   		data=convertToJson(xhr.responseText);
					serviceSuccess(params,logObj,data);
					if(typeof callback=="function") callback(data);
				}else{
					serviceFailed(params,logObj,xhr)
					return;
				}
			}
		};
		if(params.consoleLogs) console.log(logObj);
		$.ajax($.extend(akParams,params));
		function convertToJson(str){
			var r=str;
			if(typeof r=="string"){
				try {
			        var o = JSON.parse(r);
			        if (o && typeof o == "object") r=o;
			    }
			    catch (e) {}
			}
			return r;
		}
		function serviceFailed(params,fromObj,result) {
			var errMsg=result;
			if(result.status) errMsg=result.status + '  ' + result.statusText; 
			if(result.responseText) {
				pageMsg=result.responseText;
				findComment=pageMsg.indexOf("<!-- ERROR MSG -->");
				if(findComment>=0) {
					pageMsg=pageMsg.substring(findComment);
					findComment=pageMsg.indexOf("<!-- END MSG -->");
					if(findComment>=0) pageMsg=pageMsg.substring(0,findComment-1);
				}
				pageMsg=pageMsg.replace(/<(?:.|\n)*?>/gm, '');
				errMsg+=  '\n' + pageMsg;
			}
			var logObj={"status":"<"+params.logPrefix+" Failed","endpoint":fromObj.endpoint};
			if(params.consoleLogs) $.extend(logObj,{"data":fromObj.data,"returned":errMsg});
			throw logObj;
		}
		function serviceSuccess(params,fromObj,result) {//"data":fromObj.data,
			if(params.consoleLogs) console.log({"status":"<"+params.logPrefix+" Success","endpoint":fromObj.endpoint,"key":fromObj.key,"returned":result});
		}
	}
})(jQuery);
	
	

