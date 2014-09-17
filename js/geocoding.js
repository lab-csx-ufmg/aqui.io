$(document).ready(function(){

  $("#btnSearch").click(function(){
	main();
  });

  
  });


var UTM = 2;
var ANYSRID = 1
var WGS84 = 1;

var ENCODE_TABLE = new Array('a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z','A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z','0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '-', '_');

var DECODE_TABLE = new Array(
   255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 
   255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 
   255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,  62, 255, 255, 
    52,  53,  54,  55,  56,  57,  58,  59,  60,  61, 255, 255, 255, 255, 255, 255, 
   255,  26,  27,  28,  29,  30,  31,  32,  33,  34,  35,  36,  37,  38,  39,  40,
    41,  42,  43,  44,  45,  46,  47,  48,  49,  50,  51, 255, 255, 255, 255,  63, 
   255,   0,   1,   2,   3,   4,   5,   6,   7,   8,   9,  10,  11,  12,  13,  14, 
    15,  16,  17,  18,  19,  20,  21,  22,  23,  24,  25, 255, 255, 255, 255, 255, 
   255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 
   255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 
   255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 
   255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 
   255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 
   255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 
   255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 
   255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255 
);

function encodeUTM(Northing, Easting, precision, SRID, returncode){
    var code = new Array();
    var i, b;
    var quad = 0;
    var bytes;
    var Northing_int, Easting_int;
    var num;
    var SRID_aux;
    
    // quadrant bits
    //no more sign
    if (Northing < 0) {
        quad += 2;
        Northing = -Northing;
    }
    if (Easting < 0) {
        quad++;
        Easting = -Easting;
    }
    


    num = 0;
    switch (precision) {
        case 0: // 1 cm 
            Northing_int = UINT64((Northing + 0.005) * 100); //range 0 to 10,000,000 -> 0 to 1,000,000,000
            Easting_int = UINT64((Easting + 0.005) * 100); //range 0 to 1,000,000 -> 0 to 100,000,000
            num = (Northing_int.shiftLeft(34,true)).or((Easting_int.shiftLeft(7, true))).clone();
            bytes = 12;
            break;
            
        case 1: // 10 cm 
            Northing_int = UINT64((Northing + 0.05) * 10); //range 0 to 10,000,000 ->  0 to 100,000,000
            Easting_int = UINT64((Easting + 0.05) * 10); //range 0 to 1,000,000 -> 0 to 10,000,000
	        num = (Northing_int.shiftLeft(37,true)).or((Easting_int.shiftLeft(13, true))).clone();            
            bytes = 11;
            break;
            
        case 2: // 1 m 
            Northing_int = UINT64(Northing + 0.5); //range 0 to 10,000,000 -> 0 to 10,000,000
            Easting_int = UINT64(Easting + 0.5); //range 0 to 1,000,000 -> 0 to 1,000,000
	        num = (Northing_int.shiftLeft(40,true)).or((Easting_int.shiftLeft(20, true))).clone();             
            bytes = 10;
            break;
            
        case 3: // 10 m
            Northing_int = UINT64((Northing + 5) / 10); //range 0 to 10,000,000 -> 0 to 1,000,000
            Easting_int = UINT64((Easting + 5) / 10); //range 0 to 1,000,000 -> 0 to 100,000
	        num = (Northing_int.shiftLeft(44,true)).or((Easting_int.shiftLeft(27, true))).clone();             
            //printf("N = %#jx, E = %#jx, num = %#jx\n", Northing_int, Easting_int, num);
            bytes = 9;
            break;
            
        default:
            // invalid precision
            return 1;
    }
    
    code[0] = 32 | (precision << 2) | quad;
    i = 1;
    b = bytes - 1;
    while (b > 0) {
	    mask = UINT64("18158513697557839872");
	    numAux = num.clone();
        code[i] = ((numAux.and(mask)).shiftRight(58)).toNumber();
        num = num.shiftLeft(6).clone();
        b--;
        i++;
    }

    // add SRID
    SRID_aux = SRID;
    switch (precision) {
        case 0: // 1 cm 
            // bit 63 and on, 21 bits remaining, 16 SRID + 5 filler
	    
            SRID_aux = UINT64(SRID << 5);
	        SRID_aux2 = UINT64(SRID_aux);

	        code[10] += SRID_aux.shiftRight(18).toNumber();

            mask = UINT64(258048);
	        SRID_aux = UINT64(SRID_aux2);
            code[11] =SRID_aux.and(mask).shiftRight(12).toNumber();    
 
	        SRID_aux = UINT64(SRID_aux2);
	        mask = UINT64(4032);
	        code[12] =SRID_aux.and(mask).shiftRight(6).toNumber(); 

 	        SRID_aux = UINT64(SRID_aux2);
	        mask = UINT64(63);
	        code[13] =SRID_aux.and(mask).toNumber(); 
           
            break;
        case 1: // 10 cm 
            // bit 57 and on, 21 bits remaining, 16 SRID + 5 filler
            SRID_aux = UINT64(SRID << 5);
	        SRID_aux2 = UINT64(SRID_aux);

            code[9] += SRID_aux.shiftRight(18).toNumber();

	        mask = UINT64(258048);
	        SRID_aux = UINT64(SRID_aux2);
            code[10] =SRID_aux.and(mask).shiftRight(12).toNumber();
			
	        mask = UINT64(4032);
	        SRID_aux = UINT64(SRID_aux2);
            code[11] =SRID_aux.and(mask).shiftRight(6).toNumber();

	        mask = UINT64(63);
	        SRID_aux = UINT64(SRID_aux2);
            code[12] = SRID_aux.and(mask).toNumber();
            break;
        case 2: // 1 m 
            // bit 50 and on, 16 bits remaining, 16 SRID + 0 filler
	
            SRID_aux = UINT64(SRID);
	        SRID_aux2 = UINT64(SRID_aux);

            code[8] += SRID_aux.shiftRight(12).toNumber();
	    
            SRID_aux = UINT64(SRID_aux2);
            mask = UINT64(4032);	
            code[9] =SRID_aux.and(mask).shiftRight(6).toNumber();

	        mask = UINT64(63);
            SRID_aux = UINT64(SRID_aux2);
            code[10] = SRID_aux.and(mask).toNumber();

            break;
        case 3: // 10 m 
            // bit 59 and on, 17 bits remaining, 16 SRID + 1 filler
    	    SRID_aux = UINT64(SRID << 1);
    	    SRID_aux2 = UINT64(SRID_aux);
            
	        code[7] += SRID_aux.shiftRight(12).toNumber();
	   
            SRID_aux = UINT64(SRID_aux2);
            mask = UINT64(64512);	
            code[8] = SRID_aux.and(mask).shiftRight(5).toNumber();
	
	        SRID_aux = UINT64(SRID_aux2);
            mask = UINT64(63);	
            code[9] = SRID_aux.and(mask).toNumber();
            break;
        default:
            return 1;
    }

    for (i = 0; i < bytes; i++)
        returncode[i] = ENCODE_TABLE[code[i]];
    
    return 0;
}

function encodeLATLON(lat, lon, precision, SRID, returncode){
    var code = new Array();
    var i, b;
    var quad = 0;
    var bytes;
    var latint, lonint;
    var num;
    var SRID_aux;

    // quadrant bits
    //no more sign
    if (lat < 0) {
        quad = quad + 2;
        lat = -lat;
    }
    if (lon < 0) {
        quad = quad + 1;
        lon = -lon;
    }
    
    num = 0;
    switch (precision) {
        case 0: // 1 cm (UTM) or 7 decimal places (unsupported)
            //latint = ((lat + 0.00000005)*10000000); //range 0 to 90 -> 0 to 900,000,000
            //lonint = ((lon + 0.00000005)*10000000); //range 0 to 180 -> 0 to 1,800,000,000
            return 1;
            break;
            
        case 1: // 10 cm (UTM) or 6 decimal places
            latint = UINT64(((lat + 0.0000005)*1000000)); //range 0 to 90 ->  0 to 90,000,000
            lonint = UINT64(((lon + 0.0000005)*1000000)); //range 0 to 180 -> 0 to 180,000,000
            num = (latint.shiftLeft(37, true)).or((lonint.shiftLeft(9, true))).clone();

            if (SRID == 4326) // WGS84
                bytes = 11;
            else 
                bytes = 13;
            break;
            
        case 2: // 1 m (UTM) or 5 decimal places
            latint = UINT64(((lat + 0.000005)*100000)); //range 0 to 90 -> 0 to 9,000,000
            lonint = UINT64(((lon + 0.000005)*100000)); //range 0 to 180 -> 0 to 18,000,000
	        num = (latint.shiftLeft(40, true)).or((lonint.shiftLeft(15, true))).clone();

            if (SRID == 4326) // WGS84
                bytes = 10;
            else 
                bytes = 12;
            break;
            
        case 3: // 10 m (UTM) or 4 decimal places
            latint = UINT64(((lat + 0.00005)*10000)); //range 0 to 90 -> 0 to 900,000
            lonint = UINT64(((lon + 0.00005)*10000)); //range 0 to 180 -> 0 to 1,800,000

	        num = (latint.shiftLeft(44, true)).or((lonint.shiftLeft(23, true))).clone();

            if (SRID == 4326) // WGS84
                bytes = 8;
            else 
                bytes = 11;
            break;
            
        default:
            // invalid precision
            return 1;
    }
    
    code[0] = (precision << 2) | quad;
    if (SRID != 4326) code[0] = code[0] + 16;
    
    i = 1;
    b = bytes - 1;
    while (b > 0) {
       	mask = UINT64("18158513697557839872");
       	numAux = num.clone();
        code[i] = ((numAux.and(mask)).shiftRight(58)).toNumber();
        num = num.shiftLeft(6).clone();
        b--;
        i++;
    }
    
    
    if (SRID != 4326) { // it's not WGS84, so we need to add the SRID code
        // add SRID
        SRID_aux = UINT64(SRID);
	    var mask;
        switch (precision) {
            case 0: // 1 cm (UTM) or 7 decimal places (unsupported)
                return 1;
                break;
            case 1: // 10 cm (UTM) or 6 decimal places
                // bit 61 and on, 18 bits remaining, 16 SRID + 2 filler
                SRID_aux = UINT64(SRID << 2);
		        SRID_aux2 = UINT64(SRID_aux);
                code[10] = SRID_aux.shiftRight(12).toNumber();

		        SRID_aux = UINT64(SRID_aux2);
		        mask = UINT64(4032);
                code[11] = SRID_aux.and(mask).shiftRight(6).toNumber();
		
		        mask = UINT64(63);
		        SRID_aux = UINT64(SRID_aux2);
                code[12] = SRID_aux.and(mask).toNumber();
                break;
            case 2: // 1 m (UTM) or 5 decimal places
                // bit 55 and on, 17 bits remaining, 16 SRID + 1 filler
                SRID_aux = UINT64(SRID << 1);

		        SRID_aux2 = UINT64(SRID_aux);
                code[9] += SRID_aux.shiftRight(12).toNumber();

		        SRID_aux = UINT64(SRID_aux2);
		        mask = UINT64(4032);
                code[10] = SRID_aux.and(mask).shiftRight(6).toNumber();

                mask = UINT64(63);
		        SRID_aux = UINT64(SRID_aux2);
                code[11] = SRID_aux.and(mask).toNumber();

                break;
            case 3: // 10 m (UTM) or 4 decimal places
                // bit 47 and on, 19 bits remaining, 16 SRID + 3 filler
                SRID_aux = UINT64(SRID << 3)
		
		        SRID_aux2 = UINT64(SRID_aux);
                code[7] += SRID_aux.shiftRight(16).toNumber();

		        SRID_aux = UINT64(SRID_aux2);
		        mask = UINT64(258048);
                code[8] = SRID_aux.and(mask).shiftRight(12).toNumber();              

		        SRID_aux = UINT64(SRID_aux2);
		        mask = UINT64(4032);
                code[9] = SRID_aux.and(mask).shiftRight(6).toNumber();
                
		        mask = UINT64(63);
		        SRID_aux = UINT64(SRID_aux2);
                code[10] = SRID_aux.and(mask).toNumber();
                break;
            default:
                return 1;
        }
    }
    for (i = 0; i < bytes; i++){ 
        returncode[i] = ENCODE_TABLE[code[i]];
    }
        
    return 0;

}

function encode(lat_or_N, lon_or_E, sys, precision, SRID, result){

    if(sys == 0) SRID = 4326;
    if((sys == 0 ||  sys == 1)) return encodeLATLON(lat_or_N, lon_or_E, precision, SRID, result);
    else if (sys == 2) return encodeUTM(lat_or_N, lon_or_E, precision, SRID, result);

    return 1;

}

function decode(code, latitude, longitude){
    var MODE, SYS, PREC, QUAD;
    var latbits, lonbits, fillerbits;
    var mult;
    var bytes, sridbytes, i, numchars;
    var latint, lonint;
    var sridint = 0;
    var SRID;
    
    // decode MODE
    //var charToInt = code[0];
    MODE = DECODE_TABLE[code[0].charCodeAt(0)];
    //print(parseInt("code[0]" + code[0] + "\n");
    //print(code[0].charCodeAt(0));    

    SYS = (MODE & 0x30) >> 4;
    PREC = (MODE & 0x0C) >> 2;
    QUAD = (MODE & 0x03);
    
    // decode coordinates
    switch (SYS) {
        case 0: // LAT/LON, WGS84
        case ANYSRID: // LAT/LON, any SRID
            if (PREC == 0) return 1; // 1cm / 7 places (unsupported)
            else if (PREC == 1) { // 10cm / 6 places
                latbits = 27; lonbits = 28; fillerbits = 2; mult = 0.000001;
            } else if (PREC == 2) { // 1m / 5 places
                latbits = 24; lonbits = 25; fillerbits = 1; mult = 0.00001;
            } else if (PREC == 3) { // 10m / 4 places
                latbits = 20; lonbits = 21; fillerbits = 3; mult = 0.0001;
            }
            break;
        case 2: // UTM
            if (PREC == 0) { // 1cm
                latbits = 30; lonbits = 27; fillerbits = 5; mult = 0.01;
            } else if (PREC == 1) { // 10cm
                latbits = 27; lonbits = 24; fillerbits = 5; mult = 0.1;
            } else if (PREC == 2) { // 1m
                latbits = 24; lonbits = 20; fillerbits = 0; mult = 1;
            } else if (PREC == 3) { // 10m
                latbits = 20; lonbits = 17; fillerbits = 1; mult = 10;
            }break;
        default:
            return 1;
    }
    
    latint = UINT64(0);
    lonint = UINT64(0);
    
    bytes = (latbits + lonbits - 1) / 6 + 1; // number of bytes for encoding lat and lon
    for (i = 1; i <= bytes; i++) {
        var teste = (DECODE_TABLE[code[i].charCodeAt()]);
        teste = UINT64((DECODE_TABLE[code[i].charCodeAt()]).toString());
        teste = teste.shiftLeft(64-6*i, true).clone();
        latint.add(teste);
    }


    latintAux = UINT64(latint.toString());

    lonint = latint.shiftLeft(latbits).shiftRight((64 - lonbits)).clone(); // divide INT64 into lat and lon integers

    latint = latintAux.clone();

    latint = latint.shiftRight(64 - latbits).clone();
    
    var lat = latint.toNumber() * mult;
    var lon = parseFloat(lonint.toNumber() * mult);

    // adjust quadrant
    if (QUAD & 0x01) // Western hemisphere
        lon = -(lon);
    if (QUAD & 0x02) // Southern hemisphere
        lat = -(lat);
    
    // decode SRID
    if (SYS != 0) {
        numchars = (latbits + lonbits + 16 + fillerbits - 1) / 6 + 1; //total number of chars in the code
        sridbytes = (fillerbits + 16 - 1) / 6 + 1; // number of bytes for encoding srid, at the end of the code
        for (i = numchars; i > numchars - sridbytes; i--) {
            sridint += DECODE_TABLE[code[i]] << ((i - numchars) * 6);
        }
        sridint = (sridint >> fillerbits) & 0xFFFF;
    } else
        SRID = 4326;
    
    if (SRID == 1)
        SRID = 900913; // Google's SRID
    
    //console.log("blah");
    //console.log("Decode: lat = " + lat + ", lon = " + lon + ", SRID = " + SRID + "\n");
    
   // print("DEC lat: " + lat.toFixed(6) + " lon: " + lon.toFixed(6) + "\n");   

    if((latitude.toFixed(6) != lat.toFixed(6)) || (longitude.toFixed(6) != lon.toFixed(6))){
       // print("diff ENC lat: " + latitude.toFixed(6) + " lon: " + longitude.toFixed(6) + " " + result.join(""));
       // print("diff DEC lat: " + lat.toFixed(6) + " lon: " + lon.toFixed(6) + "\n");   
       // print("\n"); 
    } 

    return 0;
	}

function main (){
   var lat, lon, N, E;
   var SRID;

   lat = -43.3924;
   lon = -20.1322;
   
   var result = new Array();
   //encode(lat, lon, 1, 3, 29193, result)
   //console.log("Coordenadas " + lat + ", " + lon + ": aqui.io/" + result.join("") + "\n");
   //decode(result,  29193);

   E = 680000.0;
   N = 7800000.0;
   
   result = new Array();    
  
   //encode(N, E, 2, 3, 29193, result);
   //console.log("Coordenadas " + N + ", " + E + ": aqui.io/" + result.join("") + "\n");
   //decode(result, 29193);

   result = new Array();
   //encode(lat, lon, 1, 1, 29193, result);
   //console.log("Coordenadas " + lat + ", " + lon + ": aqui.io/" + result.join("") + "\n");
  // decode(result, 29193);

  //encodeTeste();
   return 0;
}

function encodeTeste(){

    //encodeTesteLatLon(WGS84);
    encodeTesteLatLon(ANYSRID);
    encodeTesteLatLon(29193);
}

function encodeTesteLatLon(SRID){

   // encode(lat, lon, precision, SRID, result);

    var longitude = 0.0;
    var latitude = 0.0;
    var precision = 0;
    var j = 0;
   
    for (precision = 1 ; precision <= 3 ; precision++){
    while(latitude < 90){
        while(longitude < 180){
               
            longitude+=0.90;
            result = new Array();
            encodeLATLON(latitude, longitude, precision, SRID, result);  
            //print("ENC lat: " + latitude.toFixed(6) + " lon: " + longitude.toFixed(6) + " " + result.join(""));
            decode(result, latitude, longitude);
           // print("\n");
            //print("result: " + result.join("") + " latitude: " + latitude + " longitude: " + longitude);
            //saida.value += result.join("") + "\n";
            //printf("lat: %lf lon: %lf %s\n", latitude, longitude, result);
        }
        latitude +=0.009;
        longitude = 0.0;
    }
    latitude = 0.0;
   }    
    
}

function selectText(divID) //divID contains actual id of ‘div’ element
{
    var textC=document.getElementById(divID);
    if (document.selection)
    {
        //Portion for IE
        var div = document.body.createTextRange();
        div.moveToElementText(textC);
        div.select();
    }
    else
    {
        //Portion for FF
        var div = document.createRange();
        div.setStartBefore(textC);
        div.setEndAfter(textC);
        window.getSelection().addRange(div);
        //alert(div.value);
    }
}

 /*function initialize(lat, lon) {
        var mapOptions = {
          //center: new google.maps.LatLng(-34.397, 150.644),
          center: new google.maps.LatLng(parseFloat(lat), parseFloat(lon)),
          zoom: 5
          //mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        //console.log(lat);
        //console.log(lon);
        var myCenter=new google.maps.LatLng(parseFloat(lat), parseFloat(lon));
        var marker = google.maps.Marker({
            position:myCenter,
        });

        var map = new google.maps.Map(document.getElementById("map-canvas"),
            mapOptions);

        marker.setMap(map);
      }*/
      

    function initialize(lat, lon)
    {
        var myCenter = new google.maps.LatLng(parseFloat(lat), parseFloat(lon));
        var mapProp = {
          center:myCenter,
          zoom:5,
          mapTypeId:google.maps.MapTypeId.ROADMAP
          };

        var map = new google.maps.Map(document.getElementById("map-canvas"),mapProp);

        var marker = new google.maps.Marker({
          position:myCenter,
          });

        marker.setMap(map);
    }


function addDivUrl (geoHash){
    document.getElementById("page-header").setAttribute("hidden", true);
    document.getElementById("column-search").removeAttribute("hidden");
    document.getElementById("map-canvas").removeAttribute("hidden");

    if (document.getElementById("shortener-url") ) {
        var label_url = document.getElementById("label-shortener-url");
        var shortenerurl = document.getElementById("shortener-url");
        var column_search = document.getElementById("column-search");
        
        column_search.removeChild(shortenerurl);
        column_search.removeChild(label_url);

        label_url = document.createElement('div');
        label_url.setAttribute("id", "label-shortener-url");

        label_url.innerHTML = "Press CTRL-C to copy";

        shortenerurl = document.createElement('div');
        shortenerurl.setAttribute("id", "shortener-url");
        //el.innerHTML = "onclick='selectText(\"shortener-url\");'";

        //var geoHash = el.innerHTML = "<a target = \"_blank\" href=\"http://geohash.org/"+ geoHash +"\"  ><h3>http://geohash.org/"+geoHash+"</h3></a>";
        shortenerurl.innerHTML = "<h3 align = 'center' class='navbar-text' onclick='selectText(\"shortener-url\");'> http://aqui.io/" + geoHash +"</h3>";
        document.getElementById('column-search').appendChild(label_url);  
        document.getElementById('column-search').appendChild(shortenerurl);      
    } else {

        var label = document.createElement('div');
        label.setAttribute("id", "label-shortener-url");
        label.innerHTML = "Press CTRL-C to copy";

        var el = document.createElement('div');
        el.setAttribute("id", "shortener-url");
        //el.innerHTML = "onclick='selectText(\"shortener-url\");'";

        el.innerHTML = "<h3 align = 'center'  class='navbar-text' onclick='selectText(\"shortener-url\");'> http://aqui.io/" + geoHash +"</h3>";
        //var geoHash = el.innerHTML = "<a target = \"_blank\" href=\"http://geohash.org/"+ geoHash +"\"><h3>http://geohash.org/"+geoHash+"</h3></a>";
        document.getElementById('column-search').appendChild(label);  
        document.getElementById('column-search').appendChild(el);

    }

     selectText("shortener-url");
    }

function geocodingAddress(buttonId) {
        var result = new Array();

        //console.log(buttonId);
        if(buttonId == "btnSearchSide") var address = document.getElementById("addressSide").value;
        else var address = document.getElementById("addressTop").value;
        
        var lat = address.split(" ")[0];
        var lon = address.split(" ")[1];
        
        //console.log(lat);
        //console.log(lon);

        var geoHash = encode(lat, lon, ANYSRID, 3, 4326, result);
        addDivUrl(result.join(""));
        initialize(lat, lon);
    }

