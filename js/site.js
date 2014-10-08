
    // ============ COOKIE =========================

    function setCookie(code) {

        document.cookie = code +"=" + "code" + "; path=/AQUI.io" ;

        console.log(document.cookie);

        if($("#places-sought-shortener-url").length > 0 || $("#label-places-sought").length > 0){
            $("#places-sought-shortener-url").remove();
            $("#label-places-sought").remove();
            returnListPlaces();
        } else{
            returnListPlaces();
        }
    }

  

    function returnListPlaces() {
        var items = "";
        var places = document.cookie.split(";");
        var labelurl = "<div id = 'label-places-sought'>Places... :</div>";
        var type;
        if (places.length > 0){

            items = "<div id = 'listPlaces'>";
            for (var i = 0 ; i < places.length ; i++){
                code = places[i].split("=")[0].replace(" ", "");
                type = places[i].split("=")[1];
                console.log("code::" + code);
                if (type == "code") {
                    items += "<div id = 'places-sought-shortener-url'><div id= 'shortener-text' class = 'url'><a href='http://localhost/AQUI.io/" + code +"'\"><h3> http://aqui.io/" + code +"</h3></a></div></div>";;    
                }
            } 
            items += "</div>";
            $("#column-search").append(labelurl);
            $("#column-search").append(items);
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

    function searchPlace(place) {

        var service;
        var items = ""; 
        geocoder = new google.maps.Geocoder();

        var map = new google.maps.Map(document.getElementById('map-canvas'), {           
            zoom: 2
        });

        var request = {
            address: place,
        };

        if ($('#listPlaces').length > 0){ 
            $("#listPlaces").remove();    
        }
        if ($('#label-shortener-url').length > 0){ 
            $('#label-shortener-url').remove();  
            $('#shortener-url').remove();    
        }

        if($("#places-sought-shortener-url").length > 0 || $("#label-places-sought").length > 0){
            $("#places-sought-shortener-url").remove();
            $("#label-places-sought").remove();
        }
       
        $("#addressSide").val(place);
        geocoder.geocode(request, callback);
        
        function callback(results, status) {  
            if (status == google.maps.GeocoderStatus.OK) {
                items = "<div id = 'listPlaces'>";
                for (var i = 0; i < results.length; i++) {
                    var place = results[i];
                    createMarker(results[i], map, i+1);
                    items += "<div class='alert alert-info' role ='alert'><a href='#' onclick=\"listPlacesHandle"+results[i].geometry.location +"\" class='alert-link'>"+ results[i].formatted_address +"</a></div>";
                    
                }
                items += "<div>";
                map.setCenter(results[0].geometry.location);
            } 
            labelurl = "<div id = 'label-shortener-url'>Choose your place below:</div>";            
            
            
            $("#column-search").append(labelurl);
            $("#column-search").append(items);
        }
    }
    function createMarker(place, map, number) {
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location,
            icon: "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=" + number + "|0099FF|000000",
            animation: google.maps.Animation.DROP
        });
    }

    function listPlacesHandle(latitude, longitude) {
        $("#listPlaces").hide();
        locationHandle(latitude, longitude);
    }


    function locationHandle(latitude, longitude) {

        var lat = latitude;
        var lon = longitude;
        var result = new Array();
        encode(lat, lon, ANYSRID, 3, 4326, result);
        console.log("locationHandle");

        var labelurl = "<div id = 'label-shortener-url'>Click and press CTRL-C to copy</div>";
        var shortenerurl = "<div id = 'shortener-url'><div id= 'shortener-text' class = 'url'><h3 onclick=\"selectText('shortener-url');\"> http://aqui.io/" + result.join("") +"</h3></div></div>";

        if ($('#listPlaces').length > 0){ 
            $("#listPlaces").remove();    
        }

        if($("#label-shortener-url").length > 0) $("#label-shortener-url").replaceWith(labelurl);
        else $("#column-search").append(labelurl);

        if($("#shortener-url").length > 0) $("#shortener-url").replaceWith(shortenerurl);
        else $("#column-search").append(shortenerurl);

        $("#addressSide").val(lat + " " + lon);       
        initialize(lat, lon);
        selectText("shortener-text");
        setCookie(result.join(""));

    }

    function divYourLocation(){
        //var buttonLocation = "<a id = 'id-my-location' data-toggle='tooltip' data-placement='right' title='Get your location!' href='javascript:void(0);'><spam class='glyphicon glyphicon-map-marker'></spam></a>";
        var buttonLocation = "";
        $("#address-header").append(buttonLocation);
    }

    function topAddressHandle() {
        $("#page-header").hide();
        $("#row-search").show();
        var address = $("#addressTop").val();

        addressHandle(address);
               
    }

    function sideAddressHandle () {
        var address = $("#addressSide").val();
        addressHandle(address); 
    }

    function addressHandle(address){

        var lat = parseFloat(address.split(" ")[0]);
        var lon = parseFloat(address.split(" ")[1]);
        
        if (!isNaN(lat) && !isNaN(lon)){
            locationHandle(lat, lon);
        } else {
            var itens = searchPlace(address);
        }       
    }

    function decodeHandle(code){
        var address = decode(code);
        var lat = parseFloat(address.split(" ")[0]);
        var lon = parseFloat(address.split(" ")[1]);
        locationHandle(lat, lon);
    }


    function getPosition(position){
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        locationHandle(latitude, longitude);
    }
    function yourLocation(){
        $("#page-header").hide();
        $("#row-search").show();
        navigator.geolocation.getCurrentPosition(getPosition);
    }

    $(document).ready(function(){

        $("#btnSearchTop").click(function(){
            topAddressHandle(); 
        });


        $("#addressTop").keypress(function(e){
            if(e.keyCode == 13)
            {
                topAddressHandle();
            }
        });
        if(navigator.geolocation) {
            divYourLocation();
        } 
       
        $("#id-my-location").click(function(){
            yourLocation();
            
        });

        $("#btnSearchSide").click(function(){
            sideAddressHandle();
           
        }); 

        $("#addressSide").keypress(function(e){
            if(e.keyCode == 13)
            {
                 sideAddressHandle();
            }
        }); 

        if($("#page-header").length <= 0){
            var sPageURL = document.URL;
            var code = sPageURL.split('AQUI.io/')[1];
            decodeHandle(code);
        }       
    });
