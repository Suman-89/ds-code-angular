export class ProcessVariableConstants {
     procVarGridColumns = [
        { text: 'Field Label',   datafield: 'label', width: 300},
        { text: 'Field Name', datafield: 'name', width: 300},
        { text: 'Data Type', datafield: 'datatype', width: 150 },
        { text: 'Variable Family', datafield: 'categoryname',  },
        { text: 'Reference Data', datafield: 'refdatacode'},
        { text: 'Linked To Metadata', datafield: 'linkedtometadata', cellsrenderer: (row, datafield, value) => {
            return '<div style="padding: 5px; text-transform: capitalize">' + value.toString() + '</div>';
        }
       },
        { "text": "Process Name", "datafield": "processNames",width: 130 },
          ]  ;


}
