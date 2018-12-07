/* eslint-disable max-len */

/**
 * External Dependencies
 */
import { select as wpSelect, dispatch as wpDispatch, subscribe } from '@wordpress/data';
import { put, call, all, select, takeEvery, take, fork, cancel, cancelled } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { some } from 'lodash';

/**
 * Internal dependencies
 */
import * as types from './types';
import * as actions from './actions';
import * as selectors from './selectors';
import { updateRSVP } from './thunks';
import { globals, moment as momentUtil } from '@moderntribe/common/utils';
import { editor } from '@moderntribe/common/data';
import { MOVE_TICKET_SUCCESS } from '@moderntribe/tickets/data/shared/move/types';
import * as moveSelectors from '@moderntribe/tickets/data/shared/move/selectors';

/**
 * Set details for current RSVP
 *
 * @export
 * @param {Object} action redux action
 */
export function* setRSVPDetails( action ) {
	const {
		title,
		description,
		capacity,
		notGoingResponses,
		startDate,
		startDateInput,
		startDateMoment,
		startTime,
		endDate,
		endDateInput,
		endDateMoment,
		endTime,
	} = action.payload;
	yield all( [
		put( actions.setRSVPTitle( title ) ),
		put( actions.setRSVPDescription( description ) ),
		put( actions.setRSVPCapacity( capacity ) ),
		put( actions.setRSVPNotGoingResponses( notGoingResponses ) ),
		put( actions.setRSVPStartDate( startDate ) ),
		put( actions.setRSVPStartDateInput( startDateInput ) ),
		put( actions.setRSVPStartDateMoment( startDateMoment ) ),
		put( actions.setRSVPStartTime( startTime ) ),
		put( actions.setRSVPEndDate( endDate ) ),
		put( actions.setRSVPEndDateInput( endDateInput ) ),
		put( actions.setRSVPEndDateMoment( endDateMoment ) ),
		put( actions.setRSVPEndTime( endTime ) ),
	] );
}

/**
 * Set details for current temp RSVP
 *
 * @export
 * @param {Object} action redux action
 */
export function* setRSVPTempDetails( action ) {
	const {
		tempTitle,
		tempDescription,
		tempCapacity,
		tempNotGoingResponses,
		tempStartDate,
		tempStartDateInput,
		tempStartDateMoment,
		tempStartTime,
		tempEndDate,
		tempEndDateInput,
		tempEndDateMoment,
		tempEndTime,
	} = action.payload;
	yield all( [
		put( actions.setRSVPTempTitle( tempTitle ) ),
		put( actions.setRSVPTempDescription( tempDescription ) ),
		put( actions.setRSVPTempCapacity( tempCapacity ) ),
		put( actions.setRSVPTempNotGoingResponses( tempNotGoingResponses ) ),
		put( actions.setRSVPTempStartDate( tempStartDate ) ),
		put( actions.setRSVPTempStartDateInput( tempStartDateInput ) ),
		put( actions.setRSVPTempStartDateMoment( tempStartDateMoment ) ),
		put( actions.setRSVPTempStartTime( tempStartTime ) ),
		put( actions.setRSVPTempEndDate( tempEndDate ) ),
		put( actions.setRSVPTempEndDateInput( tempEndDateInput ) ),
		put( actions.setRSVPTempEndDateMoment( tempEndDateMoment ) ),
		put( actions.setRSVPTempEndTime( tempEndTime ) ),
	] );
}

/**
 * Create date objects used throughout sagas
 *
 * @export
 * @param {String} date datetime string
 * @returns {Object} Object of dates/moments
 */
export function* createDates( date ) {
	const { datepickerFormat } = yield call( [ globals, 'tecDateSettings' ] );
	const moment = yield call( momentUtil.toMoment, date );
	const currentDate = yield call( momentUtil.toDate, moment );
	const dateInput = yield datepickerFormat
		? call( momentUtil.toDate, moment, datepickerFormat )
		: call( momentUtil.toDate, moment );
	const time = yield call( momentUtil.toDatabaseTime, moment );

	return {
		moment,
		date: currentDate,
		dateInput,
		time,
	};
}

/**
 * Determines if current post is a tribe event
 * @export
 * @returns {Boolean} bool
 */
export function* isTribeEventPostType() {
	const postType = yield call( [ wpSelect( 'core/editor' ), 'getEditedPostAttribute' ], 'type' );
	return postType === editor.EVENT;
}

/**
 * Initializes RSVP that has not been created
 * @borrows TEC - Optional functionality requires TEC to be enabled and post type to be event
 * @export
 */
export function* initializeRSVP() {
	const publishDate =  yield call( [ wpSelect( 'core/editor' ), 'getEditedPostAttribute' ], 'date' );
	const {
		moment: startMoment,
		date: startDate,
		dateInput: startDateInput,
		time: startTime,
	} = yield call( createDates, publishDate );

	yield all( [
		put( actions.setRSVPTempStartDate( startDate ) ),
		put( actions.setRSVPTempStartDateInput( startDateInput ) ),
		put( actions.setRSVPTempStartDateMoment( startMoment ) ),
		put( actions.setRSVPTempStartTime( startTime ) ),
	] );

	try {
		if ( yield call( isTribeEventPostType ) ) {
			// NOTE: This requires TEC to be installed, if not installed, do not set an end date
			const eventStart = yield select( window.tribe.events.data.blocks.datetime.selectors.getStart ); // RSVP window should end when event starts... ideally
			const {
				moment: endMoment,
				date: endDate,
				dateInput: endDateInput,
				time: endTime,
			} = yield call( createDates, eventStart );

			yield all( [
				put( actions.setRSVPTempEndDate( endDate ) ),
				put( actions.setRSVPTempEndDateInput( endDateInput ) ),
				put( actions.setRSVPTempEndDateMoment( endMoment ) ),
				put( actions.setRSVPTempEndTime( endTime ) ),
				put( actions.setRSVPEndDate( endDate ) ),
				put( actions.setRSVPEndDateInput( endDateInput ) ),
				put( actions.setRSVPEndDateMoment( endMoment ) ),
				put( actions.setRSVPEndTime( endTime ) ),
			] );
		}
	} catch ( error ) {
		// ¯\_(ツ)_/¯
		console.error( error );
	}
}

/**
 * Will sync RSVP sale end to be the same as event start date and time, if field has not been manually edited
 * @borrows TEC - Functionality requires TEC to be enabled
 * @param {String} prevStartDate Previous start date before latest set date time changes
 * @export
 */
export function* syncRSVPSaleEndWithEventStart( prevStartDate ) {
	try {
		const tempEndMoment = yield select( selectors.getRSVPTempEndDateMoment );
		const endMoment = yield select( selectors.getRSVPEndDateMoment );
		const { moment: prevEventStartMoment } = yield call( createDates, prevStartDate );

		// NOTE: Mutation
		// Convert to use local timezone
		yield all( [
			call( [ tempEndMoment, 'local' ] ),
			call( [ endMoment, 'local' ] ),
			call( [ prevEventStartMoment, 'local' ] ),
		] );

		// If initial end and current end are the same, the RSVP has not been modified
		const isNotManuallyEdited = yield call( [ tempEndMoment, 'isSame' ], endMoment, 'minute' );
		const isSyncedToEventStart = yield call( [ tempEndMoment, 'isSame' ], prevEventStartMoment, 'minute' );

		if ( isNotManuallyEdited && isSyncedToEventStart ) {
			const eventStart = yield select( window.tribe.events.data.blocks.datetime.selectors.getStart );
			const {
				moment: endDateMoment,
				date: endDate,
				dateInput: endDateInput,
				time: endTime,
			} = yield call( createDates, eventStart );

			yield all( [
				put( actions.setRSVPTempEndDate( endDate ) ),
				put( actions.setRSVPTempEndDateInput( endDateInput ) ),
				put( actions.setRSVPTempEndDateMoment( endDateMoment ) ),
				put( actions.setRSVPTempEndTime( endTime ) ),

				// Sync RSVP end items as well so as not to make state 'manually edited'
				put( actions.setRSVPEndDate( endDate ) ),
				put( actions.setRSVPEndDateInput( endDateInput ) ),
				put( actions.setRSVPEndDateMoment( endDateMoment ) ),
				put( actions.setRSVPEndTime( endTime ) ),

				// Trigger UI button
				put( actions.setRSVPHasChanges( true ) ),
			] );

			// Sub fork which will wait to sync RSVP when post saves
			yield fork( saveRSVPWithPostSave );
		}
	} catch ( error ) {
		// ¯\_(ツ)_/¯
		console.error( error );
	}
}

/**
 * Creates event channel subscribing to WP editor state when saving post
 *
 * @returns {Function} Channel
 */
export function createWPEditorSavingChannel() {
	return eventChannel( emit => {
		const wpEditor = wpSelect( 'core/editor' );

		const predicates = [
			() => wpEditor.isSavingPost() && ! wpEditor.isAutosavingPost(),
		];

		// Returns unsubscribe function
		return subscribe( () => {
			// Only emit when truthy
			if ( some( predicates, fn => fn() ) ) {
				emit( true ); // Emitted value is insignificant here, but cannot be left undefined
			}
		} );
	} );
}

/**
 * Allows the RSVP to be saved at the same time a post is being saved.
 * Avoids the user having to open up the RSVP block, and then click update again there, when changing the event start date.
 *
 * @export
 */
export function* saveRSVPWithPostSave() {
	let saveChannel;
	try {
		// Do nothing when not already created
		if ( yield select( selectors.getRSVPCreated ) ) {
			// Create channel for use
			saveChannel = yield call( createWPEditorSavingChannel );

			// Wait for channel to save
			yield take( saveChannel );

			const payload = yield all( {
				id: select( selectors.getRSVPId ),
				title: select( selectors.getRSVPTempTitle ),
				description: select( selectors.getRSVPTempDescription ),
				capacity: select( selectors.getRSVPTempCapacity ),
				notGoingResponses: select( selectors.getRSVPTempNotGoingResponses ),
				startDate: select( selectors.getRSVPTempStartDate ),
				startDateInput: select( selectors.getRSVPTempStartDateInput ),
				startDateMoment: select( selectors.getRSVPTempStartDateMoment ),
				endDate: select( selectors.getRSVPTempEndDate ),
				endDateInput: select( selectors.getRSVPTempEndDateInput ),
				endDateMoment: select( selectors.getRSVPTempEndDateMoment ),
				startTime: select( selectors.getRSVPTempStartTime ),
				endTime: select( selectors.getRSVPTempEndTime ),
			} );

			// Use update thunk to submit
			yield put( updateRSVP( payload ) );
		}
	} catch ( error ) {
		console.error( error );
	} finally {
		// Close channel if exists
		if ( saveChannel ) {
			yield call( [ saveChannel, 'close' ] );
		}
	}
}

/**
 * Listens for event start date and time changes after RSVP block is loaded.
 * @borrows TEC - Functionality requires TEC to be enabled and post type to be event
 * @export
 */
export function* handleEventStartDateChanges() {
	try {
		const isEvent = yield call( isTribeEventPostType );
		if ( isEvent && window.tribe.events ) {
			// Proceed after creating dummy RSVP or after fetching
			yield take( [ types.INITIALIZE_RSVP, types.SET_RSVP_DETAILS ] );
			const { SET_START_DATE_TIME, SET_START_TIME } = window.tribe.events.data.blocks.datetime.types;

			let syncTask;
			while ( true ) {
				// Cache current event start date for comparison
				const eventStart = yield select( window.tribe.events.data.blocks.datetime.selectors.getStart );

				// Wait til use changes date or time on TEC datetime block
				yield take( [ SET_START_DATE_TIME, SET_START_TIME ] );

				// Important to cancel any pre-existing forks to prevent bad data from being sent
				if ( syncTask ) {
					yield cancel( syncTask );
				}
				syncTask = yield fork( syncRSVPSaleEndWithEventStart, eventStart );
			}
		}
	} catch ( error ) {
		// ¯\_(ツ)_/¯
		console.error( error );
	}
}

/**
 * Handles proper RSVP deletion and RSVP block removal upon moving RSVP
 *
 * @export
 */
export function* handleRSVPMove() {
	const rsvpId = yield select( selectors.getRSVPId );
	const modalTicketId = yield select( moveSelectors.getModalTicketId );

	if ( rsvpId === modalTicketId ) {
		const blockId = yield select( moveSelectors.getModalBlockId );
		yield put( actions.deleteRSVP() );
		yield call( [ wpDispatch( 'core/editor' ), 'removeBlocks' ], [ blockId ] );
	}
}

/**
 * Temporary bandaid until datepickers allow blank state
 *
 * @export
 */
export function* setNonEventPostTypeEndDate() {
	if ( yield call( isTribeEventPostType ) ) {
		return;
	}

	yield take( [ types.INITIALIZE_RSVP ] );
	const tempEndMoment = yield select( selectors.getRSVPTempEndDateMoment );
	const endMoment = yield call( [ tempEndMoment, 'clone' ] );
	yield call( [ endMoment, 'add' ], 100, 'years' );
	const { date, dateInput, moment, time } = yield call( createDates, endMoment.toDate() );

	yield all( [
		put( actions.setRSVPTempEndDate( date ) ),
		put( actions.setRSVPTempEndDateInput( dateInput ) ),
		put( actions.setRSVPTempEndDateMoment( moment ) ),
		put( actions.setRSVPTempEndTime( time ) ),
		put( actions.setRSVPEndDate( date ) ),
		put( actions.setRSVPEndDateInput( dateInput ) ),
		put( actions.setRSVPEndDateMoment( moment ) ),
		put( actions.setRSVPEndTime( time ) ),
	] );
}

export default function* watchers() {
	yield takeEvery( types.SET_RSVP_DETAILS, setRSVPDetails );
	yield takeEvery( types.SET_RSVP_TEMP_DETAILS, setRSVPTempDetails );
	yield takeEvery( types.INITIALIZE_RSVP, initializeRSVP );
	yield takeEvery( MOVE_TICKET_SUCCESS, handleRSVPMove );
	yield fork( handleEventStartDateChanges );
	yield fork( setNonEventPostTypeEndDate );
}
