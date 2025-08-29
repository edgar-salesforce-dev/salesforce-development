import LightningDatatable from 'lightning/datatable';
import referenceView from './referenceView.html';

export default class CustomDatatableTypes extends LightningDatatable {
    static customTypes = {
        customReference: {
            template: referenceView,
            standardCellLayout: true,
            typeAttributes: ['icon', 'name', 'size', 'recordId']
        }
    }
}