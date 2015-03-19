
var validatiors = {
	'def':function (name, val)
	{
		var v = {'ok':false, 'message':'Заполните это поле'};
		if (val.length != 0)
		{
			v.ok = true;
			return v;
		}	
		else
		{
			return v;
		}
	},
	'email':function (name,val)
	{
		var v = validatiors.def(name,val);
		if (!v.ok) return v;
		var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    	if (re.test(val))
    	{
    		return v;
    	}
    	else
    	{
    		v.ok = false;
    		v.message = 'Email введен неверно';
    		return v;
    	}
	}
}

function isValid(val)
{
	if (typeof( validatiors[ val.attr('name') ] ) != "undefined")
	{
		return validatiors[ val.attr('name') ]( val.attr('name'), val.val() );
	}
	else
	{
		return validatiors.def( val.attr('name'), val.val() );
	}
}


$('#deliveryFrom').submit( function (e) {
	var inputs = $('#deliveryFrom :input');
	var errFlag = false;
	inputs.each(function() {
        var valid = isValid($(this));
        if (!valid.ok){
            $('html, body').animate({
	            scrollTop: $(this).parent().offset().top
	        }, 200);
	        $(this).focus();
	        $(this).parent().addClass('has-error');
	        $(this).parent().find('.error-message').text(valid.message);
			$(this).on('keydown', function () { $(this).parent().removeClass('has-error') } );
			e.preventDefault();
			errFlag = true;
            return false; 
        }
    });

    if (!errFlag)
    {
    	alert("Форма прошла валидацию и сейчас будет отправлена");
    }
});


var map;
var service;
var infowindow;

function textSearch(text)
{
	$('#map').css('opacity',1);
	var request = {
	    query: text
	};
	service.textSearch(request, callback);
}

var dTimer;

$('#address').keydown( function () {
	clearTimeout(dTimer);
	dTimer = setTimeout(function(){ textSearch($('#address').val()) }, 900);
} );

function initialize() {
  var pyrmont = new google.maps.LatLng(-33.8665433,151.1956316);

  map = new google.maps.Map(document.getElementById('map'), {
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      center: pyrmont,
      zoom: 13
    });
  service = new google.maps.places.PlacesService(map);
}

function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      //console.log(place);
      map.setCenter(place.geometry.location);
      createMarker(place);
      var request = {
		  reference: place.reference
		};
		service.getDetails(request, callback2);
		return;
    }
  }
}

function setGreenValue(obj, value)
{
	$(obj).val(value);
	$(obj).parent().addClass('has-success');
	$(obj).on('keydown', function () { $(this).parent().removeClass('has-success') } );	
}

function callback2(place, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    //console.log(place);
    for (var x in place.address_components)
    {
    	var addr = place.address_components[x];
    	if (addr.types.indexOf("locality") != -1)
    	{
    		setGreenValue("#city", addr.long_name);
    	}

    	if (addr.types.indexOf("postal_code") != -1)
    	{
    		setGreenValue("#postIndex", addr.long_name);
    	}
    }
  }
}
google.maps.event.addDomListener(window, 'load', initialize);

function createMarker(place) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  // google.maps.event.addListener(marker, 'click', function() {
  //   infowindow.setContent(place.name);
  //   infowindow.open(map, this);
  // });
}