/**
 * File fronend-pro.js
 *
 * Handles toggling the navigation menu for Addon widget
 *
 * @package astra-addon
 */

/**
 * Canonical mobile menu state setter.
 *
 * Applies open/closed state to every mobile header on the page
 * (original #masthead + sticky clone #ast-fixed-header), keeping the
 * burger, nav container, and body class in lockstep.
 *
 * @since x.x.x
 * @param {boolean} isOpen Desired open state.
 */
astraSyncMobileMenuState = function( isOpen ) {
    var containers = document.querySelectorAll( '#masthead #ast-mobile-header, #ast-fixed-header #ast-mobile-header' );
    for ( var i = 0; i < containers.length; i++ ) {
        var nav = containers[i].querySelector( '.main-header-bar-navigation' );
        var btn = containers[i].querySelector( '.main-header-menu-toggle' );
        if ( nav ) {
            nav.classList.toggle( 'toggle-on', isOpen );
            nav.style.display = isOpen ? 'block' : '';
        }
        if ( btn ) {
            btn.classList.toggle( 'toggled', isOpen );
            btn.setAttribute( 'aria-expanded', isOpen ? 'true' : 'false' );
        }
    }
    document.body.classList.toggle( 'ast-main-header-nav-open', isOpen );
};

astraToggleSetupPro = function( mobileHeaderType, body, menu_click_listeners ) {

	var flag = false;
	var menuToggleAllLength;

	if ( 'off-canvas' === mobileHeaderType || 'full-width' === mobileHeaderType ) {
        // comma separated selector added, if menu is outside of Off-Canvas then submenu is not clickable, it work only for Off-Canvas area with dropdown style.
        var __main_header_all = document.querySelectorAll( '#ast-mobile-popup, #ast-mobile-header' );
        if ( body.classList.contains('ast-header-break-point') ) {

            var menu_toggle_all   = document.querySelectorAll( '#ast-mobile-header .main-header-menu-toggle' );
        } else {
            menu_toggle_all   = document.querySelectorAll( '#ast-desktop-header .main-header-menu-toggle' );
		}
		menuToggleAllLength = menu_toggle_all.length;
    } else {

		if ( body.classList.contains('ast-header-break-point') ) {

			var __main_header_all = document.querySelectorAll( '#ast-mobile-header' ),
				menu_toggle_all   = document.querySelectorAll( '#ast-mobile-header .main-header-menu-toggle' );
				menuToggleAllLength = menu_toggle_all.length;
				flag = menuToggleAllLength > 0 ? false : true;
				menuToggleAllLength = flag ? 1 : menuToggleAllLength;
		} else {

			var __main_header_all = document.querySelectorAll( '#ast-desktop-header' ),
				menu_toggle_all = document.querySelectorAll('#ast-desktop-header .main-header-menu-toggle');
				menuToggleAllLength = menu_toggle_all.length;
		}
	}

	if ( menuToggleAllLength > 0 || flag ) {

        for (var i = 0; i < menuToggleAllLength; i++) {

			if ( !flag ) {
				menu_toggle_all[i].setAttribute('data-index', i);

				if (!menu_click_listeners[i]) {
					menu_click_listeners[i] = menu_toggle_all[i];
					menu_toggle_all[i].removeEventListener('click', astraNavMenuToggle);
					menu_toggle_all[i].addEventListener('click', astraNavMenuToggle, false);
				}
			}

            if ('undefined' !== typeof __main_header_all[i]) {

                // To handle the comma seprated selector added above we need this loop.
                for( var mainHeaderCount =0; mainHeaderCount  < __main_header_all.length; mainHeaderCount++ ){

                    if (document.querySelector('header.site-header').classList.contains('ast-builder-menu-toggle-link')) {
                        var astra_menu_toggle = __main_header_all[mainHeaderCount].querySelectorAll('ul.main-header-menu .menu-item-has-children > .menu-link, ul.main-header-menu .ast-menu-toggle');
                    } else {
                        var astra_menu_toggle = __main_header_all[mainHeaderCount].querySelectorAll('ul.main-header-menu .ast-menu-toggle');
                    }
                    // Add Eventlisteners for Submenu.
                    if (astra_menu_toggle.length > 0) {

                        for (var j = 0; j < astra_menu_toggle.length; j++) {
                            astra_menu_toggle[j].removeEventListener('click', AstraToggleSubMenu);
                            astra_menu_toggle[j].addEventListener('click', AstraToggleSubMenu, false);
                        }
                    }
                }
            }
        }
    }
}

astraNavMenuTogglePro = function ( event, body, mobileHeaderType, thisObj ) {

    event.preventDefault();

    var desktop_header = event.target.closest('#ast-desktop-header');

    var desktop_header_content = document.querySelector('#masthead > #ast-desktop-header .ast-desktop-header-content');

    if ( null !== desktop_header && undefined !== desktop_header && '' !== desktop_header ) {

        var desktop_toggle = desktop_header.querySelector( '.main-header-menu-toggle' );
    } else {
        var desktop_toggle = document.querySelector('#masthead > #ast-desktop-header .main-header-menu-toggle');
    }

    var desktop_menu = document.querySelector('#masthead > #ast-desktop-header .ast-desktop-header-content .main-header-bar-navigation');

    if ( 'desktop' === event.currentTarget.trigger_type ) {

        if ( null !== desktop_menu && '' !== desktop_menu && undefined !== desktop_menu ) {
            astraToggleClass(desktop_menu, 'toggle-on');
            if (desktop_menu.classList.contains('toggle-on')) {
                desktop_menu.style.display = 'block';
            } else {
                desktop_menu.style.display = '';
            }
        }
        astraToggleClass(desktop_toggle, 'toggled');
        if ( desktop_toggle.classList.contains( 'toggled' ) ) {
            body.classList.add("ast-main-header-nav-open");
            if ( 'dropdown' === mobileHeaderType ) {
                desktop_header_content.style.display = 'block';
            }
        } else {
            body.classList.remove("ast-main-header-nav-open");
            desktop_header_content.style.display = 'none';
        }
        return;
    }

    // Collapse expanded submenus on the clicked header before toggling open/closed.
    var clickedHeader = thisObj.closest( '#ast-fixed-header' ) || document.getElementById( 'masthead' );
    if ( clickedHeader ) {
        var menuHasChildren = clickedHeader.querySelectorAll( '#ast-mobile-header .main-header-bar-navigation .menu-item-has-children' );
        for ( var i = 0; i < menuHasChildren.length; i++ ) {
            menuHasChildren[i].classList.remove( 'ast-submenu-expanded' );
            var subMenus = menuHasChildren[i].querySelectorAll( '.sub-menu' );
            for ( var j = 0; j < subMenus.length; j++ ) {
                subMenus[j].style.display = 'none';
            }
        }
    }

    var menu_class = thisObj.getAttribute( 'class' ) || '';
    if ( menu_class.indexOf( 'main-header-menu-toggle' ) !== -1 ) {
        // Flip state based on clicked button's current state, then sync across all mobile headers.
        var nextOpen = ! thisObj.classList.contains( 'toggled' );
        astraSyncMobileMenuState( nextOpen );
    }
}

const accountMenuToggle = function () {
    const checkAccountActionTypeCondition = astraAddon.hf_account_action_type && 'menu' === astraAddon.hf_account_action_type;
    const accountMenuClickCondition = checkAccountActionTypeCondition && astraAddon.hf_account_show_menu_on && 'click' === astraAddon.hf_account_show_menu_on;

    const headerAccountContainer = document.querySelectorAll('.ast-header-account-wrap');

    if(  headerAccountContainer ) {

        headerAccountContainer.forEach(element => {

            const accountMenu = element.querySelector('.ast-account-nav-menu');

            const handlePointerUp = function( e ) {
                const condition = ( accountMenuClickCondition ) || ( checkAccountActionTypeCondition && document.querySelector('body').classList.contains('ast-header-break-point'));
                if( condition ) {
                    // if the target of the click isn't the container nor a descendant of the container
                    if ( accountMenu && !element.contains( e.target ) ) {
                        accountMenu.style.right = '';
                        accountMenu.style.left = '';
                    }
                }
            };

            // Attach pointerup event listener only once.
            if ( ! element._accountPointerUpHandler ) {
                element._accountPointerUpHandler = handlePointerUp;
                document.addEventListener('pointerup', handlePointerUp);
            }

            const headerAccountTrigger =  element.querySelector( '.ast-header-account-link' );
            if( headerAccountTrigger ) {
                const handleAccountClick = function( e ) {
                    const condition = ( accountMenuClickCondition ) || ( checkAccountActionTypeCondition && document.querySelector('body').classList.contains('ast-header-break-point'));
                    if( condition ) {

                        headerSelectionPosition = e.target.closest('.site-header-section');

                        if( headerSelectionPosition ) {
                            if( headerSelectionPosition.classList.contains('site-header-section-left') ) {
                                accountMenu.style.left   = accountMenu.style.left  === '' ? '-100%' : '';
                                accountMenu.style.right   = accountMenu.style.right  === '' ? 'auto' : '';
                            } else {
                                accountMenu.style.right   = accountMenu.style.right  === '' ? '-100%' : '';
                                accountMenu.style.left   = accountMenu.style.left  === '' ? 'auto' : '';
                            }
                        }
                    }
                };

                // Attach click event listener only once.
                if ( ! headerAccountTrigger._accountClickHandler ) {
                    headerAccountTrigger._accountClickHandler = handleAccountClick;
                    headerAccountTrigger.addEventListener( 'click', handleAccountClick);
                }
            }
        });
    }
}

/**
 * Color Switcher.
 *
 * @since 4.10.0
 */
const astraColorSwitcher = {
	...astraAddon?.colorSwitcher, // Spreading Color Switcher options.

	/**
	 * Initializes the Color Switcher Widget.
	 */
	init: function () {
		if ( ! this?.isInit ) {
			return;
		}

		this.switcherButtons = document.querySelectorAll( '.ast-builder-color-switcher .ast-switcher-button' );

		if ( ! this.switcherButtons?.length ) {
			return;
		}

		this.switcherButtons?.forEach( ( switcherButton ) => {
			switcherButton?.addEventListener( 'click', this.toggle ); // ✅ `this` refers to astraColorSwitcher
		} );

		if ( this.isDarkPalette && this.defaultMode === 'system' ) {
			// Detect system preference and apply mode accordingly.
			this.detectSystemColorScheme();
		}

		// Set initial logo state if switched
		if ( this.isSwitched ) {
			this.switchLogo();
		}
	},

	/**
	 * Detects the system's color scheme preference and sets the theme accordingly.
	 */
	detectSystemColorScheme: function () {
		const storedPreference = this.getCookie( 'astraColorSwitcherState' );

		// Bail early, if user has previously chosen a theme.
		if ( storedPreference !== null ) {
			return;
		}

		// Detect system preference.
		const prefersDark = window.matchMedia( '(prefers-color-scheme: dark)' ).matches;

		if ( prefersDark && ! this.isSwitched ) {
			// Apply the detected or stored theme.
			this.toggle();
		}
	},

	/**
	 * Toggle the palette.
	 *
	 * @param {Event} e Button click event object.
	 */
	toggle: function ( e ) {
		e?.preventDefault();
		const switcher = astraColorSwitcher;

		// Toggle the state
		switcher.isSwitched = ! switcher.isSwitched;

		// Store state in cookie (expires in 90 days).
		switcher.setCookie( 'astraColorSwitcherState', switcher.isSwitched, 90 );

		if ( switcher?.forceReload ) {
			window.location.reload();
			return;
		}

		switcher.switchPaletteColors();
		switcher.switchIcon();
		switcher.switchLogo();

		if ( switcher.isDarkPalette ) {
			switcher.handleDarkModeCompatibility();
		}
	},

	/**
	 * Switch Palette Colors.
	 */
	switchPaletteColors: function () {
		// Choose the correct palette based on `isSwitched` state.
		const currentPalette = this.isSwitched ? this?.palettes?.switched : this?.palettes?.default;

		// Apply the colors to CSS variables.
		currentPalette?.forEach( ( color, index ) => {
			document.documentElement.style.setProperty( `--ast-global-color-${ index }`, color );
			if ( astraAddon?.is_elementor_active ) {
				document.documentElement.style.setProperty( `--e-global-color-astglobalcolor${ index }`, color );
			}
		} );
	},

	/**
	 * Switch Icon.
	 */
	switchIcon: function () {
		this.switcherButtons?.forEach( ( switcherButton ) => {
			const [ defaultIcon, switchedIcon ] = switcherButton?.querySelectorAll( '.ast-switcher-icon' );

			// Avoid icon switching if there is none or only one.
			if ( defaultIcon && switchedIcon ) {
				const [ first, second ] = this.isSwitched ? [ switchedIcon, defaultIcon ] : [ defaultIcon, switchedIcon ];

				// Animate icon.
				switcherButton?.classList.add( 'ast-animate' );

				setTimeout( () => {
					first?.classList.add( 'ast-current' );
					second?.classList.remove( 'ast-current' );
				}, 100 );

				setTimeout( () => switcherButton?.classList.remove( 'ast-animate' ), 200 );
			}

			/// Switch aria attribute.
			const ariaLabelTextKey = this.isSwitched ? 'defaultText' : 'switchedText';
			switcherButton?.setAttribute(
				'aria-label',
				switcherButton?.dataset?.[ ariaLabelTextKey ] || 'Switch color palette.'
			);
		} );
	},

	/**
	 * Switch Logo.
	 */
	switchLogo: function () {
		// Handle color switcher logo switching
		if ( this.isDarkPalette && this?.logos?.switched && this?.logos?.default ) {
			this.switchColorSwitcherLogo();
		}
	},

	/**
	 * Switch Color Switcher Logo.
	 * Handles logo switching for dark/light palette modes.
	 */
	switchColorSwitcherLogo: function () {
		// Target only main logo, exclude sticky header and transparent header logos
		const logoSelectors = [
			'.custom-logo-link:not(.sticky-custom-logo):not(.transparent-custom-logo) .custom-logo',  // Main logo only
			'.site-branding .site-logo-img img:not(.ast-sticky-header-logo)',  // Main site logo, not sticky
			'.ast-site-identity .site-logo-img img:not(.ast-sticky-header-logo)', // Alternative main logo structure
		];

		let logoImages = [];
		
		// Try each selector to find main logo images only
		for ( const selector of logoSelectors ) {
			const foundImages = document.querySelectorAll( selector );
			if ( foundImages.length > 0 ) {
				// Filter out sticky and transparent header logos if they somehow get selected
				logoImages = Array.from( foundImages).filter( ( img ) => {
					// Exclude if parent contains sticky header or transparent header classes
					return ! img.closest( '.ast-sticky-header-logo' ) && 
						   ! img.closest( '.sticky-custom-logo' ) &&
						   ! img.closest( '.transparent-custom-logo' ) &&
						   ! img.classList.contains( 'ast-sticky-header-logo' );
				} );

				if ( logoImages.length > 0 ) {
					break;
				}
			}
		}

		if ( ! logoImages.length ) {
			return;
		}

		// Determine which logo to show based on current state
		const targetSrc = this.isSwitched ? this.logos.switched : this.logos.default;
		
		if ( ! targetSrc ) {
			return;
		}

		// Update each logo image
		this.updateLogoImages( logoImages, targetSrc );
	},

	/**
	 * Update Logo Images.
	 */
	updateLogoImages: function ( logoImages, targetSrc ) {
		logoImages.forEach( ( logoImg ) => {
			if ( logoImg && logoImg.src !== targetSrc ) {
				// Preload image for smoother switching
				const newImg = new Image();
				newImg.onload = function() {
					logoImg.src = targetSrc;
					if ( logoImg.hasAttribute ( 'srcset' ) ) {
						logoImg.removeAttribute( 'srcset' );
					}
					if ( logoImg.hasAttribute( 'data-src' ) ) {
						logoImg.setAttribute( 'data-src', targetSrc );
					}
				};
				newImg.onerror = function() {
					logoImg.src = targetSrc; // Try anyway
				};
				newImg.src = targetSrc;
			}
		} );
	},

	/**
	 * Handle Dark Mode Compatibility.
	 */
	handleDarkModeCompatibility: function () {
		// Add the dark mode class.
		document.body.classList.toggle( 'astra-dark-mode-enable' );

		// Todo: Handle dark compatibility CSS.
	},

	/**
	 * Helper function to set a cookie.
	 */
	setCookie: ( name, value, days ) => {
		const expires = new Date();
		expires.setTime( expires.getTime() + days * 24 * 60 * 60 * 1000 );
		document.cookie = `${ name }=${ value }; expires=${ expires.toUTCString() }; path=/`;
	},

	/**
	 * Helper function to get a cookie.
	 */
	getCookie: ( name ) => {
		const cookies = document.cookie.split( '; ' );
		for ( let cookie of cookies ) {
			const [ key, val ] = cookie.split( '=' );
			if ( key === name ) return val;
		}
		return null;
	},
};

/**
 * Account Login Popup Trigger
 *
 * Moved from theme's JS to addon to ensure the login popup JS always loads with the account component.
 * Fixes cases where the JS was missing when the widget was added due to theme script loading order.
 *
 * @since 4.11.5 Moved from theme to addon
 */
var accountPopupTrigger = function () {
	if ( typeof astraAddon === 'undefined' || 'login' !== astraAddon.hf_account_logout_action ) {
		return;
	}

	// Account login form popup.
	var header_account_trigger =  document.querySelectorAll( '.ast-account-action-login' );

	if (!header_account_trigger.length) {
		return;
	}

	const formWrapper = document.querySelector('#ast-hb-account-login-wrap');

	if (!formWrapper) {
		return;
	}

	const formCloseBtn = document.querySelector('#ast-hb-login-close');

	header_account_trigger.forEach(function(_trigger) {
		_trigger.addEventListener('click', function(e) {
			e.preventDefault();

			formWrapper.classList.add('show');
		});
	});

	if (formCloseBtn) {
		formCloseBtn.addEventListener('click', function(e) {
			e.preventDefault();
			formWrapper.classList.remove('show');
		});
	}
};

document.addEventListener( 'astPartialContentRendered', function() {
    accountMenuToggle();
    accountPopupTrigger();
});

window.addEventListener( 'load', function() {
    accountMenuToggle();
    accountPopupTrigger();
    astraColorSwitcher.init();
} );

document.addEventListener( 'astLayoutWidthChanged', function() {
    accountMenuToggle();
    accountPopupTrigger();
} );

// Close mobile menu across both headers when anchor links inside a mobile header are clicked.
document.addEventListener( 'click', function( e ) {
    var target = e.target.closest( 'a' );
    if ( ! target ) {
        return;
    }
    var href = target.getAttribute( 'href' );
    if ( ! href || href.indexOf( '#' ) === -1 ) {
        return;
    }
    if ( ! target.closest( '#masthead #ast-mobile-header, #ast-fixed-header #ast-mobile-header' ) ) {
        return;
    }
    setTimeout( function() {
        astraSyncMobileMenuState( false );
    }, 20 );
} );
