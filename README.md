# akAjaxService
A collection of functions used along with jQuery $.ajax to quickly run ajax calls, write status to console, and execute callbacks.
```javascript
$.akAjaxService(urlString,sendData,callback,options);
```
-	`urlString` (string): the url of the script file you want to "GET" or "POST" to
-	`sendData` (optional. object or string): the data you want to send to the script file.
	-	send data as a `string` like you would a querystring: `w=getData&id=12345`
	-	send data as an `object`: `{"w":"getData","id":"12345"}`
-	`callback` (optional. function(data){}): returns the data from your script file as the first (and only) parameter.
-	`options` (optional. object): overwrite default values and any ajax parameters. Object gets passed to the `$.ajax()` call.

## Options
```json
{
	"type": "POST",
	"async": true,
	"cache": false,
	"consoleLogs": true,
	"primaryKey": "w",
	"logPrefix": "akAjax:"
}
```
-	`consoleLogs` (boolean): controls if there is detailed logging for each call. Turn this off for PROD environments.
-	`primaryKey` (string): use this key as a way to track specific actions. For example: I pass the `w` parameter with every call I make. This way, I can quickly check the console for success and failures on particular segments in my script file.
-	`logPrefix` (string): what you want to appear at the beginning of each call and return status log.
-	All other parameters are for $.ajax

## Example
I need to do some server side scripting in order to pull back a list of landing page folders so that my users can modify details. I'll make an ajax call to a local script which will return the data in JSON format.
### Client Side
My primary variable on this server-side script is `whichView` so I'll need to include that as my `primaryKey` parameter.
```javascript
$.akAjaxService("landingPreview.php",{"whichView":"dirList"},function(landingJSON){
	//JSON formatted strings will be converted to JSON objects.
	if(landingJSON){
		//Loop through data
		$(landingJSON).each(function(i,obj){
			if($("#landingList").is("ul")){
				li="<li><a href='manageLanding.php?f="+ obj.folder +"'>"+ obj.folder +"</a>&nbsp;<span class='landingActions'>";
				if(obj.hasDev) li+="<a href='manageLanding.php?f="+ obj.folder +"&v=dev' title='Dev version'><i class='fa fa-flask'></i></a>&nbsp;";
				if(obj.hasProd){
					li+="<a href='/cities/"+ obj.folder +"/index.html' target='_blank' title='Open preview'><i class='fa fa-eye'></i></a>&nbsp;" +
					"<a href='#' data-folder='"+ obj.folder +"' class='copyLanding' title='Copy'><i class='fa fa-files-o'></i></a>&nbsp";
				}
				li+="<a href='#' data-folder='"+ obj.folder +"' class='deleteLanding' title='Delete'><i class='fa fa-trash'></i></a></span></li>";
				$("#landingList").append(li);
			}else{
				addSel="";
				if(f==obj.folder) addSel=" selected";
				$("#landingList").append("<option value='"+ obj.folder +"'"+ addSel +">"+ obj.folder +"</option>")
			}
		})
	}
},{primaryKey:"whichView"});
```
### Server Side
Excerpt from my php file which returns the data as a string in JSON format:
```php
if ($whichView=="dirList") { 
	$path = "../cities";
	$results = scandir($path);
	$return = "";
	foreach ($results as $result) {
	    if ($result === '.' or $result === '..') continue;
	    if (is_dir($path . '/' . $result)) {
			$hasProd=file_exists($path . '/' . $result . "/data.json");
			$hasDev=file_exists($path . '/' . $result . "/data-dev.json");
	       if ($result!="admin" && ($hasProd || $hasDev)){
		   		if($return!="") $return .= ", ";
				$return .= "{\"folder\":\"" . $result . "\",\"hasProd\":";
				if($hasProd) $return .="true";
				else  $return .="false";
				 $return .=",\"hasDev\":";
				if($hasDev) $return .="true";
				else  $return .="false"; 
				$return .="}";
		   }
	    }
	}
	echo "[". $return ."]";
}
```
### Resulting Console Logs
You can open/close each action in the console log diving as deep as needed into the resulting data.
![alt text](http://akwebapps.com/git/_assets/akAjaxService.png "Console log screenshot")

