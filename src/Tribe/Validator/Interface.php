<?php


interface Tribe__Tickets__Validator__Interface extends Tribe__Validator__Interface {

	/**
	 * whether the value is the post id of an existing ticket or not.
	 *
	 * @since tbd
	 *
	 * @param int $ticket_id
	 *
	 * @return bool
	 */
	public function is_ticket_id( $ticket_id );

	/**
	 * Whether the value is the post ID of an existing event or not.
	 *
	 * @since TBD
	 *
	 * @param int|string $event_id
	 *
	 * @return bool
	 */
	public function is_event_id( $event_id );

	/**
	 * Whether a post ID exists.
	 *
	 * @since TBD
	 *
	 * @param int $post_id
	 *
	 * @return bool
	 */
	public function is_post_id( $post_id );

	/**
	 * Whether a csv list, or array, of post IDs only contains valid posts IDs or not.
	 *
	 * @since TBD
	 *
	 * @param        string|array $posts
	 * @param string              $sep
	 *
	 * @return bool
	 */
	public function is_post_id_list( $posts, $sep = ',' );

}
