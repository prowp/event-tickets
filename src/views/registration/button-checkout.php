<?php
/**
 * This template renders the attendee registration checkout button
 *
 * Override this template in your own theme by creating a file at:
 * [your-theme]/tribe/tickets/registration/button-checkout.php
 *
 * @since 4.9
 * @since TBD Update template paths to add the "registration/" prefix
 * @version TBD
 *
 */
if ( ! $checkout_url ) {
	return;
}
?>
<form
	class="tribe-block__tickets__registration__checkout"
	action="<?php echo esc_url( $checkout_url ); ?>"
	method="post"
>
	<input type="hidden" name="tribe_tickets_checkout" value="1" />
	<button
		type="submit"
		class="alignright button-primary tribe-block__tickets__registration__checkout__submit"
		<?php if ( $cart_has_required_meta && ! $is_meta_up_to_date ) : ?>
		disabled
		<?php endif; ?>
	>
		<?php esc_html_e( 'Checkout', 'event-tickets' ); ?>
	</button>
</form>
