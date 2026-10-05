const accordionContainer	= document.querySelector(".ast-woocommerce-accordion");

if( accordionContainer ) {
	const accordionHeadings		= accordionContainer.querySelectorAll(".ast-accordion-header");
	const accordionContents		= accordionContainer.querySelectorAll(".ast-accordion-content");
	const activeClass			= 'active';
	let singleAccordionContent;

	accordionHeadings.forEach( function ( heading, headingIndex ) {
		//get content related to heading
		singleAccordionContent = heading.nextElementSibling;

		// Close all content except first by default.
		// Use 'auto' for the active tab so dynamic content (e.g. DataTables) renders at full height.
		if ( headingIndex == 0 ) {
			singleAccordionContent.style.height = 'auto';
		} else {
			singleAccordionContent.style.height = 0;
		}

		// Close and open accordion when clicked.
		heading.addEventListener( "click", function ( event ) {

			// Removes class active for all accordion content.
			accordionContents.forEach(function ( dropdown, dropdownIndex ) {
				if ( headingIndex !== dropdownIndex ) {
					dropdown.style.height = 0;
					dropdown.classList.remove( activeClass );
				}
			} );

			// Removes class active for all accordion headings.
			accordionHeadings.forEach(function ( single, singleIndex ) {
				if ( headingIndex !== singleIndex ) {
					single.classList.remove( activeClass );
				}
			} );

			// current accordion content.
			const currentAccordionContent = event.target.nextElementSibling;

			// Sets new height when accordion opened.
			let accordionContentHeight = currentAccordionContent.querySelector( '.ast-accordion-wrap' ).clientHeight;

			if (currentAccordionContent.classList.contains( activeClass ) ) {
				currentAccordionContent.classList.remove( activeClass );
				event.target.classList.remove( activeClass );
				currentAccordionContent.style.height = 0;
			} else {
				currentAccordionContent.classList.add( activeClass );
				event.target.classList.add( activeClass );
				currentAccordionContent.style.height = accordionContentHeight + "px";
			}
		} );
	} );
}

/**
 * Handle "Leave a Comment" link to open reviews tab and scroll to comment form
 */
function handleCommentLinkClick() {
	if ( window.location.hash === '#respond' || window.location.hash.includes( '#comment' ) ) {
		const reviewsTabLink = document.querySelector( '.woocommerce-tabs ul.tabs li.reviews_tab a' ) || document.querySelector( 'a[href="#tab-reviews"]' );

		if ( reviewsTabLink ) {
			reviewsTabLink.click();
		}

		setTimeout( function() {
			const commentForm = document.querySelector( '#respond' ) || document.querySelector( '#review_form' );
			if ( commentForm ) {
				commentForm.scrollIntoView( { behavior: 'smooth', block: 'center' } );
			}
		}, 300 );
	}
}

/**
 * Handle review link click to open accordion accordion when accordion layout is enabled
 */
function handleReviewLinkClick() {
	const reviewLinks = document.querySelectorAll( 'a.woocommerce-review-link' );

	reviewLinks.forEach( function( link ) {
		link.addEventListener( 'click', function( event ) {
			if ( accordionContainer && accordionContainer.classList.contains( 'ast-woocommerce-accordion' ) ) {
				event.preventDefault();

				const reviewsTabHeaders = accordionContainer.querySelectorAll( '.ast-single-tab .ast-accordion-header' );
				let reviewsHeader = null;

				reviewsTabHeaders.forEach( function( header ) {
					const content = header.nextElementSibling;
					if ( content && content.id === 'tab-reviews' ) {
						reviewsHeader = header;
					}
				} );

				if ( reviewsHeader ) {
					reviewsHeader.click();

					setTimeout( function() {
						const reviewsSection = accordionContainer.querySelector( '#tab-reviews' );
						if ( reviewsSection ) {
							reviewsSection.scrollIntoView( { behavior: 'smooth', block: 'center' } );
						}
					}, 300 );
				}
			}
		} );
	} );
}

document.addEventListener( 'DOMContentLoaded', handleCommentLinkClick );
window.addEventListener( 'hashchange', handleCommentLinkClick );

document.addEventListener( 'DOMContentLoaded', handleReviewLinkClick );
