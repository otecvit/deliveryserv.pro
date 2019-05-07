import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

export function PrintOrder (record, ordersdetail) {

    console.log(record);
    console.log(ordersdetail);
    
    pdfMake.vfs = pdfFonts.pdfMake.vfs;        
    var docDefinition = generateOrder(record);
    //pdfMake.createPdf(docDefinition).open();
    pdfMake.createPdf(docDefinition).print();
    pdfMake.createPdf(docDefinition).download(`Заказ #${record.chNameOrder}.pdf`);
  
}

function generateOrder(record) {
    return {
         info: {
         title:`Заказ #${record.chNameOrder}`,
         author:'http://deliveryserv.pro',
         subject:`Заказ #${record.chNameOrder}`,
        },
        
        pageSize:'A4',
        pageOrientation:'portrait',//'landscape'
        pageMargins:[20,20,20,20],
       
        content: [


            {
              layout: 'noBorders', // optional
              table: {
                // headers are automatically repeated if the table spans over multiple pages
                // you can declare how many rows should be treated as headers
                headerRows: 1,
                widths: [ '20%', '50%', '30%' ],
        
                body: [
                  [ 
                    { 
                      text: '', bold: true 
                    }, 
                    { 
                      text: [
                          { text: 'Продавец: ', fontSize: 10 },
                          { text: 'ООО "Вода на дом"\n', fontSize: 10 },
                          { text: 'Покупатель: ', fontSize: 10 },
                          { text: 'Имя\n', fontSize: 15 },
                          { text: 'Адрес доставки: ', fontSize: 15 },
                          { text: 'Адрес\n', fontSize: 15 },
                          { text: 'Телефон: ', fontSize: 15 },
                          { text: 'Еулуфон\n', fontSize: 15 },
                        ] 
                    }, 
                    { 
                      text: '' 
                    }, 
                  ]
                ]
              }
            }
        
        
            ]
    }          
}