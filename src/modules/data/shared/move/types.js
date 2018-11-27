/**
 * Internal dependencies
 */
import { PREFIX_TICKETS_STORE } from '@moderntribe/tickets/data/utils';

//
// ─── MODAL UI STATE ─────────────────────────────────────────────────────────────
//

export const INITIALIZE_MODAL = `${ PREFIX_TICKETS_STORE }/INITIALIZE_MODAL`;
export const SHOW_MODAL = `${ PREFIX_TICKETS_STORE }/SHOW_MODAL`;
export const HIDE_MODAL = `${ PREFIX_TICKETS_STORE }/HIDE_MODAL`;

//
// ─── API ───────────────────────────────────────────────────────────────────────-
//

export const FETCH_POST_TYPES = `${ PREFIX_TICKETS_STORE }/FETCH_POST_TYPES`;
export const FETCH_POST_TYPES_SUCCESS = `${ PREFIX_TICKETS_STORE }/FETCH_POST_TYPES_SUCCESS`;
export const FETCH_POST_TYPES_ERROR = `${ PREFIX_TICKETS_STORE }/FETCH_POST_TYPES_ERROR`;

export const FETCH_POST_CHOICES = `${ PREFIX_TICKETS_STORE }/FETCH_POST_CHOICES`;
export const FETCH_POST_CHOICES_SUCCESS = `${ PREFIX_TICKETS_STORE }/FETCH_POST_CHOICES_SUCCESS`;
export const FETCH_POST_CHOICES_ERROR = `${ PREFIX_TICKETS_STORE }/FETCH_POST_CHOICES_ERROR`;

export const MOVE_TICKET = `${ PREFIX_TICKETS_STORE }/MOVE_TICKET`;
export const MOVE_TICKET_SUCCESS = `${ PREFIX_TICKETS_STORE }/MOVE_TICKET_SUCCESS`;
export const MOVE_TICKET_ERROR = `${ PREFIX_TICKETS_STORE }/MOVE_TICKET_ERROR`;

