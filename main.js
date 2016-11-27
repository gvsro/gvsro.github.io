$(function () {

	checkboxes.click(function () {
		// The checkboxes in our app serve the purpose of filters.
		// Here on every click we add or remove filtering criteria from a filters object.

		// Then we call this function which writes the filtering criteria in the url hash.
		createQueryHash(filters);
	});



	$.getJSON( "http://583a3c22237de71200e1d193.mockapi.io/apartments", function( data ) {
		// Get data about our products from products.json.
    console.log(data);
		// Call a function that will turn that data into HTML.
		generateAllProductsHTML(data);

		// Manually trigger a hashchange to start the app.
		$(window).trigger('hashchange');
	});


	$(window).on('hashchange', function(){
		// On every hash change the render function is called with the new hash.
		// This is how the navigation of our app happens.
		render(decodeURI(window.location.hash));
	});


  function render(url) {

		// Get the keyword from the url.
		var temp = url.split('/')[0];

		// Hide whatever page is currently shown.
		$('.main-content .page').removeClass('visible');


		var map = {

			// The Homepage.
			'': function() {

				// Clear the filters object, uncheck all checkboxes, show all the products
				filters = {};
				checkboxes.prop('checked',false);

				renderProductsPage(products);
			},

			// Single Products page.
			'#product': function() {

				// Get the index of which product we want to show and call the appropriate function.
				var index = url.split('#product/')[1].trim();

				renderSingleProductPage(index, products);
			},

			// Page with filtered products
			'#filter': function() {

				// Grab the string after the '#filter/' keyword. Call the filtering function.
				url = url.split('#filter/')[1].trim();

				// Try and parse the filters object from the query string.
				try {
					filters = JSON.parse(url);
				}
				// If it isn't a valid json, go back to homepage ( the rest of the code won't be executed ).
				catch(err) {
					window.location.hash = '#';
				}

				renderFilterResults(filters, products);
			}

		};

		// Execute the needed function depending on the url keyword (stored in temp).
		if(map[temp]){
			map[temp]();
		}
		// If the keyword isn't listed in the above - render the error page.
		else {
			renderErrorPage();
		}

	}


  function generateAllProductsHTML(data){

      var list = $('.all-products .products-list');

      var theTemplateScript = $("#products-template").html();
      //Compile the template​
      var theTemplate = Handlebars.compile (theTemplateScript);
      list.append (theTemplate(data));


      // Each products has a data-index attribute.
      // On click change the url hash to open up a preview for this product only.
      // Remember: every hashchange triggers the render function.
      list.find('li').on('click', function (e) {
        e.preventDefault();

        var productIndex = $(this).data('index');

        window.location.hash = 'product/' + productIndex;
      })
    }


    function renderProductsPage(data){

      var page = $('.all-products'),
        allProducts = $('.all-products .products-list > li');

      // Hide all the products in the products list.
      allProducts.addClass('hidden');

      // Iterate over all of the products.
      // If their ID is somewhere in the data object remove the hidden class to reveal them.
      allProducts.each(function () {

        var that = $(this);

        data.forEach(function (item) {
          if(that.data('index') == item.id){
            that.removeClass('hidden');
          }
        });
      });

      // Show the page itself.
      // (the render function hides all pages so we need to show the one we want).
      page.addClass('visible');

    }


    function renderSingleProductPage(index, data){

      var page = $('.single-product'),
        container = $('.preview-large');

      // Find the wanted product by iterating the data object and searching for the chosen index.
      if(data.length){
        data.forEach(function (item) {
          if(item.id == index){
            // Populate '.preview-large' with the chosen product's data.
            container.find('h3').text(item.name);
            container.find('img').attr('src', item.image.large);
            container.find('p').text(item.description);
          }
        });
      }

      // Show the page.
      page.addClass('visible');

    }

	function renderFilterResults(filters, products){
		// Crates an object with filtered products and passes it to renderProductsPage.
		renderProductsPage(results);
	}

  function renderErrorPage(){
    var page = $('.error');
    page.addClass('visible');
  }


  function createQueryHash(filters){

    // Here we check if filters isn't empty.
    if(!$.isEmptyObject(filters)){
      // Stringify the object via JSON.stringify and write it after the '#filter' keyword.
      window.location.hash = '#filter/' + JSON.stringify(filters);
    }
    else{
      // If it's empty change the hash to '#' (the homepage).
      window.location.hash = '#';
    }

  }

});
