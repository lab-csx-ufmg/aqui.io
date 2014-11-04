
    // ============ COOKIE =========================

    function setCookie(code) {

        document.cookie = code +"=" + "code" + "; path=/" ;

        //console.log(document.cookie);

        /*if($("#places-sought-shortener-url").length > 0 || $("#label-places-sought").length > 0){
            $("#places-sought-shortener-url").remove();
            $("#label-places-sought").remove();
            //returnListPlaces();
        } else{
            //returnListPlaces();
        }*/
        returnListPlaces();

    }    

    

    function returnListPlaces() {
        var items = "";
        var places = document.cookie.split(";");
        var labelurl = "<div id = 'label-places-sought'>Your last places ... :</div>";
        var type;
        var total = 10;
        var identifier = 1;
        var totalItemsPags = 7;
        var address, lat, lon;
        var codes = new Array();
        if (places.length > 0){

            items = "<div id = 'listPlaces'>";
            for (var i = 0, j=0 ; i < places.length ; i++){
                code = places[i].split("=")[0].replace(" ", "");
                type = places[i].split("=")[1];
                //console.log("code:" + code);
                if(type == "code"){
                  codes[j] = code;
                  j++;
                } 
            } 

            for(var i = codes.length -1 ; i >= 0 && identifier <= 10; i--){
                    address = decode(codes[i]);
                    //console.log(codes[i]);
                    lat = parseFloat(address.split(" ")[0]);
                    lon = parseFloat(address.split(" ")[1]);
        
                    if(identifier >= totalItemsPags)items += "<div id= 'item-place"+ identifier + "' class='panel panel-default' hidden = 'true'>";
                    else items += "<div id= 'item-place"+ identifier + "' class='panel panel-default'>";
                    items += "<div class='panel-body alert alert-info'>";
                    items += "<div class='row'>";
                    items += "<div id = 'balloon-place' class='col-xs-1 col-sm-1 '><img src='http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=|0099FF|000000'/></div>";
                    items += "<div id = 'item-place' class='col-xs-11 col-sm-11'><strong>Lat: "+lat+" Lon: "+lon+"<br><a href='http://aqui.io/"+codes[i]+"'>http://aqui.io/"+ codes[i] +"</a></strong></div>";
                    items += "</div></div></div>";
                    identifier++;       
            }
            items += "</div>";


            if($("#label-places-sought").length > 0) {
                $("#label-places-sought").replaceWith(labelurl);
                $("#column-search").append(items);
            }
            else{
                $("#column-search").append(labelurl);
                $("#column-search").append(items);    
            }
             if(identifier > totalItemsPags){
                paginationHandle(identifier, totalItemsPags);
            }
        }
    }


    function selectText(element) 
    {
        var doc = document, text = doc.getElementById(element), range, selection;    
        if (doc.body.createTextRange) {
            range = document.body.createTextRange();
            range.moveToElementText(text);
            range.select();
        } 
        else if (window.getSelection) 
        {
            selection = window.getSelection();        
            range = document.createRange();
            range.selectNodeContents(text);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }

   /* function selectText(divID) //divID contains actual id of ‘div’ element
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
    }*/

    function initialize(lat, lon)
    {
        var myCenter = new google.maps.LatLng(parseFloat(lat), parseFloat(lon));
        var mapProp = {
          center:myCenter,
          zoom:15,
          mapTypeId:google.maps.MapTypeId.ROADMAP
          };

        var map = new google.maps.Map(document.getElementById("map-canvas"),mapProp);

        var marker = new google.maps.Marker({
          position:myCenter,
          });

        marker.setMap(map);
    }

    function cleanForSearchPlace(){

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

        if($('#pagination-demo').length > 0){
            $('#pagination-demo').remove();
        }

    }

    function searchPlace(place, btn) {

        var totalItemsPags = 6;
        var service;
        var items = ""; 
        var pagination = "";
        geocoder = new google.maps.Geocoder();

        var request = {
            address: place,
        };

       
        $("#addressSide").val(place);
        geocoder.geocode(request, callback);
        
        function callback(results, status) {  
            if (status == google.maps.GeocoderStatus.OK) {
                cleanForSearchPlace();
                $("#page-header").hide();
                $("#row-search").show();
                var map = new google.maps.Map(document.getElementById('map-canvas'), {           
                     zoom: 2
                });
                items +="<div id = 'listPlaces'>";

                for (var i = 0; i < results.length; i++) {
                        var place = results[i];
                        if(i < totalItemsPags){ 
                            items += createListPlace(i, results[i], true);                    
                            
                        }    
                        else items += createListPlace(i, results[i], false);                    
                    createMarker(results[i], map, i+1);    
                }     
                map.setCenter(results[0].geometry.location);
                items+="</div>";
                labelurl = "<div id = 'label-shortener-url'>Choose your place below:</div>";            
            
            
                $("#column-search").append(labelurl);
                $("#column-search").append(items);

            }
            
            if(results.length > totalItemsPags){
                paginationHandle(results.length, totalItemsPags);
            }
            if(results.length > 0){
                if(btn == "address-header"){                    
                    $("#address-header").removeClass("has-error has-feedback");
                    $("label[for='Error']").remove();
                    $("span[for='Error']").remove();
                }else{
                    console.log("removeError");
                    $("#address-bar").removeClass("has-error has-feedback");
                    $("label[for='Error']").remove();
                    $("span[for='Error']").remove();
                }
            }else{
                if(btn == "address-header"){
                    $("#address-header").addClass("has-error has-feedback");
                    $("#addressTop").before("<label For ='Error' class='control-label sr-only' for='inputSuccess5'>Hidden label</label>");
                    $("#addressTop").after("<span For ='Error' class='glyphicon glyphicon-remove form-control-feedback'></span>");    
                }else{
                     $("#address-bar").addClass("has-error has-feedback");
                    $("#addressSide").before("<label for= 'Error' class='control-label sr-only' for='inputSuccess5'>Hidden label</label>");
                    $("#addressSide").after("<span for= 'Error' class='glyphicon glyphicon-remove form-control-feedback'></span>");
                    
                }
                
            }
        }
        
    }

    function paginationHandle(totalItems, totalItemsPags){
        var pagination = "";
        pagination = "<ul id='pagination-demo' class='pagination pagination-sm'>";
        pags = Math.ceil(totalItems / totalItemsPags);
        for(var i = 0 ; i < pags ; i++) pagination += "<li><a href='#'>"+(i+1)+"</a></li>";
        pagination += "</lu>";

        if($('#pagination-demo').length > 0){
            $('#pagination-demo').remove();
        }

        $("#column-search").append(pagination);

        $('#pagination-demo').twbsPagination({
            totalPages: pags,
            visiblePages: 3,
            onPageClick: function (event, page) {

                for(var i = 0 ; i < pags*totalItemsPags ; i++){
                    var item = '#item-place' + i;
                    if($(item).length > 0){
                        if((i >= totalItemsPags * (page - 1)) && i < (totalItemsPags * page)){
                            $(item).show();
                        } else {
                            $(item).hide();
                        }
                    }
                }
            }
        });
    }

    function createListPlace(identifier, result, visibility){
        var item = "";
        if(!visibility) item += "<div id= 'item-place"+ identifier + "' class='panel panel-default' hidden = 'true'>";
        else item += "<div id= 'item-place"+ identifier + "' class='panel panel-default'>";
        item += "<div class='panel-body alert alert-info'>";
        item += "<div class='row'>";
        item += "<div id = 'balloon-place' class='col-xs-1 col-sm-1 '><img src='http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=" + (identifier+1) + "|0099FF|000000'/></div>";
        item += "<div id = 'item-place' class='col-xs-11 col-sm-11'><a href='#' onclick=\"listPlacesHandle"+result.geometry.location +"\">"+ result.formatted_address +"</a></div>";
        item += "</div></div></div>";

        return item;
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

        var labelurl = "<div id = 'label-shortener-url'>Click and press CTRL-C to copy</div>";
        var shortenerurl = "<div id = 'shortener-url'><div id= 'shortener-text' class = 'url'><h3 onclick=\"selectText('shortener-url');\"> http://aqui.io/" + result.join("") +"</h3></div></div>";

        if ($('#listPlaces').length > 0){ 
            $("#listPlaces").remove();    
        }

        if($("#label-shortener-url").length > 0) $("#label-shortener-url").replaceWith(labelurl);
        else $("#column-search").append(labelurl);

        if($("#shortener-url").length > 0) $("#shortener-url").replaceWith(shortenerurl);
        else $("#column-search").append(shortenerurl);

        if($('#pagination-demo').length > 0){
            $('#pagination-demo').remove();
        }

        $("#addressSide").val(lat + " " + lon);       
        initialize(lat, lon);
        selectText("shortener-text");
        setCookie(result.join(""));

    }

    function divYourLocation(){
        var buttonLocation = "";
    }

    function topAddressHandle() {
        
        var address = $("#addressTop").val();  
        address = address.trim();
        while(address.indexOf("  ") != -1) address = address.replace("  ", " ");
        
        var lat = parseFloat(address.split(" ")[0]);
        var lon = parseFloat(address.split(" ")[1]);  
    
        if (!isNaN(lat) && !isNaN(lon)){
            if(latitudeCheck(lat) && longitudeCheck(lon)){
                locationHandle(lat, lon);
                $("#page-header").hide();
                $("#row-search").show();
                selectText("shortener-text");

                $("#address-header").removeClass("has-error has-feedback");
                $("label[for='Error']").remove();
                $("span[for='Error']").remove();
            }else{
                $("#address-header").addClass("has-error has-feedback");
                $("#addressTop").before("<label For ='Error' class='control-label sr-only' for='inputSuccess5'>Hidden label</label>");
                $("#addressTop").after("<span For ='Error' class='glyphicon glyphicon-remove form-control-feedback'></span>");
            }
        } else{
            searchPlace(address, "address-header");
        }   
    }

    function sideAddressHandle () {
        var address = $("#addressSide").val();

        address = address.trim();
        while(address.indexOf("  ") != -1) address = address.replace("  ", " ");
        
        var lat = parseFloat(address.split(" ")[0]);
        var lon = parseFloat(address.split(" ")[1]);

         if (!isNaN(lat) && !isNaN(lon)){
            if(latitudeCheck(lat) && longitudeCheck(lon)){
                locationHandle(lat, lon);
                selectText("shortener-text");

                $("#address-bar").removeClass("has-error has-feedback");
                $("label[for='Error']").remove();
                $("span[for='Error']").remove();

            }else{
                $("#address-bar").addClass("has-error has-feedback");
                $("#addressSide").before("<label for= 'Error' class='control-label sr-only' for='inputSuccess5'>Hidden label</label>");
                $("#addressSide").after("<span for= 'Error' class='glyphicon glyphicon-remove form-control-feedback'></span>");
            }
        } else{
            searchPlace(address, "address-bar");
        }   

    }

    function latitudeCheck(lat){
        if(lat < -90.0 || lat > 90.0) return false;
        else return true;
    }

    function longitudeCheck(lon) {
         if (lon < -180.0 || lon > 180.0) return false;
         else return true;
    }

    function decodeHandle(code){
        var address = decode(code);
        var lat = parseFloat(address.split(" ")[0]);
        var lon = parseFloat(address.split(" ")[1]);
        
        //locationHandle(lat, lon);

        var labelurl = "<div id = 'label-shortener-url'>Click and press CTRL-C to copy</div>";
        var shortenerurl = "<div id = 'shortener-url'><div id= 'shortener-text' class = 'url'><h3 onclick=\"selectText('shortener-url');\"> http://aqui.io/" + code +"</h3></div></div>";

        if ($('#listPlaces').length > 0){ 
            $("#listPlaces").remove();    
        }

        if($("#label-shortener-url").length > 0) $("#label-shortener-url").replaceWith(labelurl);
        else $("#column-search").append(labelurl);

        if($("#shortener-url").length > 0) $("#shortener-url").replaceWith(shortenerurl);
        else $("#column-search").append(shortenerurl);

        if($('#pagination-demo').length > 0){
            $('#pagination-demo').remove();
        }

        $("#addressSide").val(lat + " " + lon);       
        initialize(lat, lon);
        selectText("shortener-text");
        setCookie(code);
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


        $("#btnSearchSide").click(function(){
            sideAddressHandle();
           
        }); 
        $("#yourLocation").click(function(){
            yourLocation();
           
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
