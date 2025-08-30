import LightningDatatable from 'lightning/datatable';
import picklistView from './customPicklist/picklistView.html';
import picklistEdit from './customPicklist/picklistEdit.html';
import referenceView from './customReference/referenceView.html';

export default class CustomDatatable extends LightningDatatable {
    static customTypes = {
        customPicklist: {
            template: picklistView,
            editTemplate: picklistEdit,
            standardCellLayout: true,
            typeAttributes: ['value', 'options', 'context']
        },
        customReference: {
            template: referenceView,
            standardCellLayout: true,
            typeAttributes: ['value', 'context', 'icon']
        }
    }
}