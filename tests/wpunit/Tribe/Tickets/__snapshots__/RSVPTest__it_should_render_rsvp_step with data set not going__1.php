<?php return '<div  class="tribe-tickets-loader__dots tribe-common-c-loader tribe-common-a11y-hidden" >
	<div class="tribe-common-c-loader__dot tribe-common-c-loader__dot--first"></div>
	<div class="tribe-common-c-loader__dot tribe-common-c-loader__dot--second"></div>
	<div class="tribe-common-c-loader__dot tribe-common-c-loader__dot--third"></div>
</div>



	
<form
	name="tribe-tickets-rsvp-form"
	data-rsvp-id="TICKET_ID"
>
	<input type="hidden" name="tribe_tickets[TICKET_ID][ticket_id]" value="TICKET_ID">
	<input type="hidden" name="tribe_tickets[TICKET_ID][attendees][0][order_status]" value="not-going">
	<input type="hidden" name="tribe_tickets[TICKET_ID][attendees][0][optout]" value="1">

	<div class="tribe-tickets__rsvp-form-wrapper">

		<div class="tribe-tickets__rsvp-form-title">
	<h3 class="tribe-common-h5">
		Please submit your information even if you are unable to attend.	</h3>
</div>

		<div class="tribe-tickets__rsvp-form-content tribe-tickets__form">

			<div class="tribe-common-b1 tribe-common-b2--min-medium tribe-tickets__form-field tribe-tickets__form-field--required">
	<label
		class="tribe-tickets__form-field-label"
		for="tribe-tickets-rsvp-name-320"
	>
		Name<span class="screen-reader-text">required</span>
		<span class="tribe-required" aria-hidden="true" role="presentation">*</span>
	</label>
	<input
		type="text"
		class="tribe-common-form-control-text__input tribe-tickets__form-field-input tribe-tickets__rsvp-form-field-name"
		name="tribe_tickets[TICKET_ID][attendees][0][full_name]"
		id="tribe-tickets-rsvp-name-320"
		value=""
		required
		placeholder="Your Name"
	>
</div>
<div class="tribe-common-b1 tribe-common-b2--min-medium tribe-tickets__form-field tribe-tickets__form-field--required">
	<label
		class="tribe-tickets__form-field-label"
		for="tribe-tickets-rsvp-email-320"
	>
		Email<span class="screen-reader-text">required</span>
		<span class="tribe-required" aria-hidden="true" role="presentation">*</span>
	</label>
	<input
		type="email"
		class="tribe-common-form-control-text__input tribe-tickets__form-field-input tribe-tickets__rsvp-form-field-email"
		name="tribe_tickets[TICKET_ID][attendees][0][email]"
		id="tribe-tickets-rsvp-email-320"
		value=""
		required
		placeholder="your@email.com"
	>
</div>
<div class="tribe-common-b1 tribe-tickets__form-field tribe-tickets__form-field--required">
	<label
		class="tribe-common-b2--min-medium tribe-tickets__form-field-label"
		for="quantity_320"
	>
		Number of Guests Not Attending<span class="screen-reader-text">(required)</span>
		<span class="tribe-required" aria-hidden="true" role="presentation">*</span>
	</label>
	<input
		type="number"
		name="tribe_tickets[TICKET_ID][quantity]"
		id="quantity_320"
		class="tribe-common-form-control-text__input tribe-tickets__form-field-input tribe-tickets__rsvp-form-input-number tribe-tickets__rsvp-form-field-quantity"
		value="1"
		required
		min="1"
		max="10"
	>
</div>

			<div class="tribe-tickets__rsvp-form-buttons">
	<button
	class="tribe-common-h7 tribe-tickets__rsvp-form-button tribe-tickets__rsvp-form-button--cancel"
	type="reset"
>
	Cancel</button>
	<button
	class="tribe-common-c-btn tribe-tickets__rsvp-form-button"
	type="submit"
>
	Finish</button>
</div>

		</div>

	</div>

</form>

';
