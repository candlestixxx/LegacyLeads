import { jest } from "@jest/globals";
import { Settings } from 'luxon';
import { isWithinLegalCallHours } from './compliance.js';

describe('TCPA Compliance Guardrails', () => {

    afterEach(() => {
        Settings.now = () => Date.now(); // reset mock
    });

    it('should allow calls at 12:00 PM EST in Michigan (48001)', () => {
        // Set fixed system time to roughly 12:00 PM EST
        Settings.now = () => new Date('2024-05-01T12:00:00.000-04:00').valueOf();
        const canCall = isWithinLegalCallHours('48001');
        expect(canCall).toBe(true);
    });

    it('should block calls at 6:00 AM EST in Michigan (48001)', () => {
        // Set fixed system time to roughly 6:00 AM EST
        Settings.now = () => new Date('2024-05-01T06:00:00.000-04:00').valueOf();
        const canCall = isWithinLegalCallHours('48001');
        expect(canCall).toBe(false);
    });

    it('should block calls at 9:00 PM EST in Michigan (48001)', () => {
        // Set fixed system time to roughly 9:00 PM EST
        Settings.now = () => new Date('2024-05-01T21:00:00.000-04:00').valueOf();
        const canCall = isWithinLegalCallHours('48001');
        expect(canCall).toBe(false);
    });

});