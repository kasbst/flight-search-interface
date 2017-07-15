$(document).ready(function($) {	
    /* 
    * Call modal when clicking on a row in departures table 
    */
    $("#DeparturesTablePlaceholder").on("click", ".clickable-row", function() {
       var id = $(this).attr('id');
       $("#DeparturesModal-" + id).modal()
    });
	
    /* 
     * Call modal when clicking on a row in returns table 
    */
    $("#ReturnsTablePlaceholder").on("click", ".clickable-row", function() {
       var id = $(this).attr('id');
       $("#ReturnsModal-" + id).modal()
    });
	
    /* 
    * Set active class when selecting bootstrap navbar menu item 
    */
    $('a[href="' + location.pathname + '"]').closest('li').addClass('active');
	
    /* 
    * Display loader animation when clicking on departures form submit button 
    */
    $("#departures_submit_button").on("click", function (e) {
      $('#DeparturesLoading').html("<img src='/images/loader.gif'/>");
    });

    /* 
    * Display loader animation when clicking on returns form submit button 
    */ 
    $("#returns_submit_button").on("click", function (e) {
       $('#ReturnsLoading').html("<img src='/images/loader.gif'/>");
    });

    /* DESTINATIONS FORM SUBMIT:
    *  1) Performs input fields verification - (this can be done also on backend in /seach route, 
    *     but I think it is easier and better to do this on frontend before /search request,
    *     as we are doing several requests for each airline).
    *  FUNCTION: FlightSearch
    *  2) Gets airline codes - from hidden input field, which is filled during autocomple
    *     operation (after destination "from" field value is selected). As list of airlines
    *     can change, this way the list is up to date during each flight search.
    *  3) Performs a /search/:ariline_code backend request for each airline code using AJAX.
    *  4) Creates table with flights data after each AJAX request and creates modal with flight
    *     details for each table row.
    */	
    $("#DepartureForm").on("submit", function (e) {
        // function FormInputVerification (e, FromId, ToId, dateId, LoaderId, TablePlaceHolderId, 
        // errorId,FromAirportCodeId, ToAirportCodeId);
        if(FormInputVerification (e, "#DepartureFrom", "#DepartureTo", "#DepartureDate", 
           "#DeparturesLoading", "#DeparturesTablePlaceholder", "#DeparturesError", 
           "#departure_from_airport_code", "#departure_to_airport_code")) {
           return;
        }
        // Prevent page to be reloaded
        e.preventDefault();					
        var form = this;
        console.log();
		
        // function FlightSearch(form, AirlinesFieldId, ModalPlaceholderId, ModalType, LoadingId, TablePlaceholderId);
        FlightSearch(form, "#departure_airlines", "#DeparturesModalPlaceholder", 
        "DeparturesModal", "#DeparturesLoading", "#DeparturesTablePlaceholder");

        // Reset form input fields.
        form.reset();
    });

    /* RETURNS FORM SUBMIT:
    *  1) Performs input fields verification - (this can be done also on backend in /seach route, 
    *     but I think it is easier and better to do this on frontend before /search request,
    *     as we are doing several requests for each airline).
    *  FUNCTION: FlightSearch
    *  2) Gets airline codes - from hidden input field, which is filled during autocomple
    *     operation (after returns "from" field value is selected). As list of airlines
    *     can change, this way the list is up to date during each flight search.
    *  3) Performs a /search/:ariline_code backend request for each airline code using AJAX.
    *  4) Creates table with flights data after each AJAX request and creates modal with flight
    *     details for each table row.
    */	
    $("#ReturnForm").on("submit",function  (e) {
        // Imput fields verification
        // function FormInputVerification (e, FromId, ToId, dateId, LoaderId, TablePlaceHolderId, 
        // errorId,FromAirportCodeId, ToAirportCodeId);
        if(FormInputVerification (e, "#ReturnFrom", "#ReturnTo", "#ReturnDate", 
           "#ReturnsLoading", "#ReturnsTablePlaceholder", "#ReturnsError",
           "#return_from_airport_code", "#return_to_airport_code")) {
           return;
        }
        // Prevent page to be reloaded
        e.preventDefault();			
        var form = this;
        console.log();
		
        // function FlightSearch(form, AirlinesFieldId, ModalPlaceholderId, ModalType, LoadingId, TablePlaceholderId);
        FlightSearch(form, "#return_airlines", "#ReturnsModalPlaceholder", 
        "ReturnsModal", "#ReturnsLoading", "#ReturnsTablePlaceholder");

        // Reset form input fields.
        form.reset();
    });

    /*
    * Perform Form's Input Fields verification.
    */
    function FormInputVerification (e, FromId, ToId, dateId, LoaderId, TablePlaceHolderId, errorId,
                                    FromAirportCodeId, ToAirportCodeId) {
        var from_input_field  = $(FromId).val();
        var to_input_field    = $(ToId).val();
        var date_input_field  = $(dateId).val();
        var from_airport_code = $(FromAirportCodeId).val();
        var to_airport_code   = $(ToAirportCodeId).val();

        // Check if any of form's input fields are empty and display error code.
        if (!from_input_field || !to_input_field || !date_input_field) {
            e.preventDefault();	
            $(LoaderId).empty();
            $(TablePlaceHolderId).empty();
            $(errorId).html("You have to fill in all the fields to perform search!").addClass("DeparturesError").show();
            setTimeout(function() {
                $(errorId).fadeOut().empty();
            }, 2000);
            return 1;
        //Check if filled date is later than the current date and set error if false.
        } else {
            e.preventDefault();
            var dateArr = date_input_field.split('/');
            var departureDate = new Date(dateArr[2], dateArr[0] - 1, dateArr[1]);
            var todayDate = new Date();
            if(todayDate > departureDate) {
                $(LoaderId).empty();
                $(TablePlaceHolderId).empty();
                $(errorId).html("Select flight date later than the current date - " + todayDate).addClass("ReturnsError").show();
                setTimeout(function() {
                   $(errorId).fadeOut().empty();
                }, 2000);
                return 1;
            }
            if (!from_airport_code || !to_airport_code) {
                $(LoaderId).empty();
                $(TablePlaceHolderId).empty();
                $(errorId).html("Please select departure and arrival city with airport from " + 
                                "values provided by autocomplete").addClass("ReturnsError").show();
                setTimeout(function() {
                   $(errorId).fadeOut().empty();
                }, 2000);
                return 1;
            }
        }
    };
	
    /*
    * Performs flight_search request based on provided arguments
    * and generate flights table and modal for each row based on 
    * data returned
    */
    function FlightSearch(form, AirlinesFieldId, ModalPlaceholderId, 
                          ModalType, LoadingId, TablePlaceholderId) {
        // Get airline codes
        var airline_codes = $(AirlinesFieldId).val().split(',');

        var promises = [];
        InitializeModalPlaceholder(ModalPlaceholderId);
		
        var table;
        if (TablePlaceholderId === "#ReturnsTablePlaceholder") {
            table = InitializeReturnsTable();
        }
        if (TablePlaceholderId === "#DeparturesTablePlaceholder") {
            table = InitializeDeparturesTable();
        }

        // Perform /search/:airline_code requests
        for (var i = 0; i < airline_codes.length; i++) {
             var request = $.post("/search/" + airline_codes[i], $(form).serialize(), function( data ) {
                 var flights = data;
                 CreateTable(table, flights);
                 CreateModal(flights, ModalType, ModalPlaceholderId);
            });
            promises.push(request);
        }

        // When all requests are completed display the table and remove loader animation.
        $.when.apply(null, promises).done(function(){
            $(LoadingId).empty();
            $(TablePlaceholderId).html(table);
            if (ModalType === "ReturnsModal") {
                ResetReturnAirlinesAndAirportsFields();
            }
            if (ModalType === "DeparturesModal") {
                ResetDepartureAirlinesAndAirportsFields();
            }
        })
    };

    /*
    * Reset below fields on /search request success. 
    * As we are using AJAX, DOM is not refreshed after request,
    * so values need to be removed and added again.
    */
    function ResetDepartureAirlinesAndAirportsFields () {
        $("#departure_from_airport_code").val('');
        $("#departure_to_airport_code").val('');
        $("#departure_airlines").val('');
    }
	
    /*
    * Reset below fields on /search request success. 
    * As we are using AJAX, DOM is not refreshed after request,
    * so values need to be removed and added again.
    */
    function ResetReturnAirlinesAndAirportsFields () {
        $("#return_from_airport_code").val('');
        $("#return_to_airport_code").val('');
        $("#return_airlines").val('');
    }

    /*
    * Initialize modal placeholders.
    */
    function InitializeModalPlaceholder (ModalPlaceholderId) {
        $(ModalPlaceholderId).empty();
    }
		
});
