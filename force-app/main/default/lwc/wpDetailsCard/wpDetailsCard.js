import { LightningElement, api } from 'lwc';
const TEMP_METRIC_UNIT = '°C';
const SPEED_METRIC_UNIT = 'm/s';

export default class WpDetailsCard extends LightningElement {
    @api main;
    @api wind;
    @api name;
    tempUnit = TEMP_METRIC_UNIT;
    speedUnit = SPEED_METRIC_UNIT;
}