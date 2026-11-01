import ExcelJS from 'exceljs';

const istOffset=330*60*1000;
function istDate(value){
 if(!value)return null;
 const raw=value instanceof Date?value:new Date(typeof value==='string'&&!/[zZ]|[+-]\d\d:\d\d$/.test(value)?value.replace(' ','T')+'Z':value);
 return Number.isNaN(raw.getTime())?null:new Date(raw.getTime()+istOffset);
}
export async function writeInterestReport({stream,records,search='',exportedAt=new Date()}){
 const workbook=new ExcelJS.stream.xlsx.WorkbookWriter({stream,useStyles:true,useSharedStrings:false});
 workbook.creator='KANAGEE';workbook.created=exportedAt;
 const sheet=workbook.addWorksheet('Interested visitors',{views:[{state:'frozen',ySplit:5}],properties:{defaultRowHeight:22}});
 sheet.columns=[{width:9},{width:23},{width:27},{width:27},{width:21},{width:27}];
 sheet.mergeCells('A1:F1');const title=sheet.getCell('A1');title.value='KANAGEE | Interested visitors';title.font={name:'Calibri',size:18,bold:true,color:{argb:'FF922420'}};sheet.getRow(1).height=34;
 sheet.mergeCells('A2:F2');sheet.getCell('A2').value='Exported: '+istDate(exportedAt).toISOString().slice(0,16).replace('T',' ')+' IST · Source: KANAGEE registrations';sheet.getCell('A2').font={name:'Calibri',size:10,color:{argb:'FF78675D'}};
 sheet.mergeCells('A3:F3');sheet.getCell('A3').value=search?'Mobile search: '+search:'All registered contacts';sheet.getCell('A3').font={name:'Calibri',size:11};
 sheet.getRow(4).height=10;
 const headers=sheet.getRow(5);headers.values=['No.','Mobile number','Signed up (IST)','Consent recorded (IST)','Notification status','Notified at (IST)'];headers.height=28;headers.eachCell(cell=>{cell.fill={type:'pattern',pattern:'solid',fgColor:{argb:'FF922420'}};cell.font={name:'Calibri',size:11,bold:true,color:{argb:'FFFFFDF7'}};cell.alignment={vertical:'middle'}});
 for(let row=1;row<=5;row++)sheet.getRow(row).commit();
 let count=0;
 for await(const contact of records){
  if(count>=1048569)throw new Error('Excel row limit reached');
  count++;
  const row=sheet.addRow([count,String(contact.mobile??''),istDate(contact.created_at),istDate(contact.consent_at),String(contact.notification_status??'pending'),istDate(contact.notified_at)]);
  row.eachCell({includeEmpty:true},cell=>{cell.font={name:'Calibri',size:11};cell.alignment={vertical:'middle'};if(count%2===0)cell.fill={type:'pattern',pattern:'solid',fgColor:{argb:'FFF7F1E4'}}});
  row.getCell(2).numFmt='@';for(const col of [3,4,6])row.getCell(col).numFmt='dd mmm yyyy, hh:mm';row.commit();
 }
 sheet.autoFilter={from:'A5',to:'F'+Math.max(5,count+5)};
 sheet.addRow([]).commit();const total=sheet.addRow(['Total contacts',count]);total.getCell(1).font={bold:true,color:{argb:'FF922420'}};total.getCell(2).font={bold:true};total.commit();
 sheet.commit();await workbook.commit();return count;
}
