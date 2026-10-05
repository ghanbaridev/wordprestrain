/**
 * Two Step Checkout custom navigation
 *
 * @since 1.1.0
 */

(function ($) {
	jQuery(window).load(function() {
		var $slides = jQuery('.ast-two-step-checkout > li');
		var $tabs = jQuery('.ast-checkout-control-nav li a');
		var currentSlide = 0;
		var totalSlides = $slides.length;

		setTimeout(function() {
			$slides.css('display', 'none').eq(0).css('display', 'block');
		}, 100);

		// Created navigation buttons
		var navHtml = '<ul class="flex-direction-nav">' +
			'<li class="flex-nav-prev"><a href="#" class="flex-prev button" role="button" aria-label="' + astra.checkout_prev_text + '">' + astra.checkout_prev_text + '</a></li>' +
			'<li class="flex-nav-next"><a href="#" class="flex-next button" role="button" aria-label="' + astra.checkout_next_text + '">' + astra.checkout_next_text + '</a></li>' +
			'</ul>';
		jQuery('.ast-checkout-slides').append(navHtml);

		function updateSlide(index) {
			$slides.css('display', 'none').eq(index).css('display', 'block');
			$tabs.removeClass('flex-active').eq(index).addClass('flex-active');
			currentSlide = index;
			
			jQuery('.flex-prev').toggleClass('flex-disabled', index === 0);
			jQuery('.flex-next').toggleClass('flex-disabled', index === totalSlides - 1);
			
			jQuery(document.body).trigger('updated_checkout');
			jQuery(document.body).trigger('update_checkout');
			
			jQuery('html, body').animate({
				scrollTop: jQuery('form.checkout').offset().top
			}, 400);
		}

		// Tab navigation
		$tabs.click(function(e) {
			e.preventDefault();
			updateSlide(jQuery(this).parent().index());
		});

		// Next button
		jQuery(document).on('click', '.flex-next', function(e) {
			e.preventDefault();
			if (currentSlide < totalSlides - 1) {
				updateSlide(currentSlide + 1);
			}
		});

		// Previous button
		jQuery(document).on('click', '.flex-prev', function(e) {
			e.preventDefault();
			if (currentSlide > 0) {
				updateSlide(currentSlide - 1);
			}
		});

		// Initialize
		updateSlide(0);
	});
})(jQuery);
