<?php

/**
 * Manages the admin settings UI in relation to display configuration.
 *
 * @since TBD
 */
class Tribe__Tickets__Admin__Display_Settings {

	/**
	 * Add display settings on the Events > Settings > Display tab.
	 *
	 * @since TBD
	 */
	public function hook() {
		add_filter( 'tribe_display_settings_tab_fields', [ $this, 'add_display_settings' ] );
	}

	/**
	 * Add display settings for Event Tickets.
	 *
	 * @since TBD
	 *
	 * @param array $settings List of display settings.
	 *
	 * @return array List of display settings.
	 */
	public function add_display_settings( $settings ) {
		// @todo Remove this in G20.07
		if ( null === constant( 'TRIBE_TICKETS_RSVP_NEW_VIEWS' ) ) {
			return $settings;
		}

		$plugin_path = Tribe__Tickets__Main::instance()->plugin_path;
		include $plugin_path . 'src/admin-views/tribe-options-display.php';

		return $settings;
	}
}