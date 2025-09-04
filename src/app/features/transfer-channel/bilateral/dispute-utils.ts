
/**
 * @author thanhvv.os
 * @description xử lý commonn dispute
 */
import * as moment from 'moment';
import { DISPUTE_KEYS, SP_RESPONSE_STATUS_CODE, DISPUTE_TYPES } from './constants';

export default class DisputeUtils {

    /**
     * check transaction dispute can update or send request dispute
     * @param value
     * @returns
     */
    public static canUpdate(portalState: String, responseStatus: String): boolean {
        // console.log("canUpdateOrSend", { portalState, responseStatus })
        if (portalState === DISPUTE_KEYS.NEW && (!responseStatus || responseStatus === SP_RESPONSE_STATUS_CODE.NOAN))
            return true;
        if (portalState === DISPUTE_KEYS.REJECT && responseStatus === SP_RESPONSE_STATUS_CODE.NACK)
            return true
        return false;
    }

    public static canSend(portalState: String, responseStatus: String, traceType: String): boolean {
        // console.log("canUpdateOrSend", { portalState, responseStatus })
        if (portalState === DISPUTE_KEYS.NEW && (!responseStatus || responseStatus === SP_RESPONSE_STATUS_CODE.NOAN))
            return true;
        if (portalState === DISPUTE_KEYS.REJECT && responseStatus === SP_RESPONSE_STATUS_CODE.NACK && traceType === DISPUTE_TYPES.RQAD)
            return true
        return false;
    }

    /**
     * check transaction dispute can delete
     * @param value
     * @returns
     */
    public static canDelete(portalState: String, responseStatus: String): boolean {
        if (portalState === DISPUTE_KEYS.NEW && (!responseStatus || responseStatus === SP_RESPONSE_STATUS_CODE.NOAN))
            return true;
        return false;
    }
}
