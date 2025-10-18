import React from 'react'
import {Table as RadixTable} from '@radix-ui/themes'

 type Column = {
	key : string,
	label : string,
	accessor?: string,
	// render?: (row : any , rowIndex: number) => React.ReactNode;
	width : string
}

type Props = {
	columns : Column[],
	rows : any[],

}


const Table = ({columns,rows} : Props) => {
	if(!columns) return null;
  return(
    <RadixTable.Root>
	<RadixTable.Header>
		<RadixTable.Row>
			{columns.map((col)=>(
				<RadixTable.ColumnHeaderCell key={col.key} style={{width : col.width}}>{col.label}</RadixTable.ColumnHeaderCell>
			))}
			
		</RadixTable.Row>
	</RadixTable.Header>

    <RadixTable.Body>
        {rows.map((row , index)=>(
            <RadixTable.Row key={index}>
				{columns.map((col)=>(

			<RadixTable.Cell key={col.key}>{row[col.key] ?? "-"}</RadixTable.Cell>
				))}
		</RadixTable.Row>
        ))}
    </RadixTable.Body>

    </RadixTable.Root>


  )
}

export default Table
