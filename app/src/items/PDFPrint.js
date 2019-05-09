import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

export function PrintOrder (record, ordersdetail, chCurrency) {
    
    pdfMake.vfs = pdfFonts.pdfMake.vfs;        
    var docDefinition = generateOrder(record, ordersdetail, chCurrency);
    //pdfMake.createPdf(docDefinition).open();
    pdfMake.createPdf(docDefinition).print();
    pdfMake.createPdf(docDefinition).download(`Заказ #${record.chNameOrder}.pdf`);
  
}

function generateOrder(record, ordersdetail, chCurrency) {
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
          // Заголовок
          {
            layout: 'noBorders', 
            table: {
              headerRows: 1,
              widths: [ '25%', '25%', '50%' ],
              body: [
                [ 
                  {
                    text: [
                      { text: `Время принятия заказа:\n`, fontSize: 10 },
                      { text: `Время доставки\n`, fontSize: 10 },
                    ] 
                    
                  }, 
                  { 
                    text: [
                        { text: `${record.chPlaced}\n`, fontSize: 10 },
                        { text: `${record.chDue}`, fontSize: 10, bold: true },
                      ] 
                  }, 
                  { 
                    text: '' 
                  }, 
                ]
              ]
            }
          },
          // Заказ
          {
            text: `Заказ #${record.chNameOrder}`,
            fontSize: 16,
            bold: true,
            alignment:'center',//left  right
          },
          // Клиент
          {
            text: [
              { text: `Клиент: `, fontSize: 10 },
              { text: `${record.chNameClient}`, fontSize: 10},
            ]
          },
          // Адрес доставки
          {
            text: [
              { text: `Адрес доставки: `, fontSize: 10 },
              { text: `${record.chAddress}`, fontSize: 10, bold: true},
            ]
          },
          // Телефон
          {
            text: [
              { text: `Телефон: `, fontSize: 10 },
              { text: `${record.chPhone}`, fontSize: 10, bold: true},
            ]
          },
          // Способ оплаты
          {
            text: [
              { text: `Способ оплаты: `, fontSize: 10 },
              { text: `${record.chPaymentMethod}`, fontSize: 10},
              { text: record.chAmountDeposited !== "" ? ` (потребуется сдача с ${record.chAmountDeposited} ${chCurrency})` : ``, fontSize: 10},
            ]
          },
          // Комментарии
          {
            text: [
              { text: `Комментарий: `, fontSize: 10 },
              { text: `${record.chComment}`, fontSize: 10},
            ]
          },
          // Таблица заказа
          {
            table: {
              headerRows: 1,
              widths: [ '3%', '82%', '15%' ],
              body: generateOrderDetail(ordersdetail)
            }
          },   
          {
            layout: 'noBorders',
            table: {
              headerRows: 0,
              widths: [ '85%', '14%' ],
              body: generateTotalOrderDetail(record, chCurrency)
            }
          },      
        ]
    }          
}

// формируем таблицу с заказом
function generateOrderDetail(ordersdetail) {

  const ordersDetailTable = ordersdetail.map((item, index) => {

    // вытягиваем список ингридиентов
    const ingridients = item.arrOption.map(option => {
      return { text: `• ${option.chOption}\n`, fontSize: 8.5, alignment: 'left' }
    });

    // считаем итого по товару
    let sumPrice = Number(item.chPriceProduct);

    // вытягиваем изменения по цене
    const changePrice = item.arrOption.map(option => {
      sumPrice += Number(option.chChangePrice);
      return { text: `+${Number(option.chChangePrice).toFixed(2)}\n`, fontSize: 8.5, alignment: 'right' }
    });

    // возвращаем массив по товару
    return [
        { text: `${index + 1}`, fontSize: 8.5, alignment: 'center'}, 
        { text: [ 
          { text: `${item.chNameProduct}\n`, fontSize: 8.5, alignment: 'left' },
          ...ingridients,
          { text: `Итого по товару`, bold: true, fontSize: 8.5, alignment: 'left' }
        ]},
        { text: [ 
          {text: `${Number(item.chPriceProduct).toFixed(2)}\n`, fontSize: 8.5, alignment: 'right'},
          ...changePrice,
          { text: `${Number(sumPrice).toFixed(2)}`, bold: true, fontSize: 8.5, alignment: 'right' }
        ]},        
    ]
  });

  // возвращаем массив по заказу
  return [
    [ 
      { text: `№`, bold: true, fontSize: 10, alignment: 'center' },                   
      { text: `Товар`, bold: true, fontSize: 10, alignment: 'center' },                 
      { text: `Цена`, bold: true, fontSize: 10, alignment: 'center' }, 
    ],
    ...ordersDetailTable
  ]
}

// формируем итог по заказу
function generateTotalOrderDetail(record, chCurrency) {
  return [ 
    [
      { text: `Стоимость доставки:`,fontSize: 8.5, alignment:'right' },                 
      { text: `${Number(record.chCostDilevery).toFixed(2)}`, fontSize: 8.5, alignment:'right' }, 
    ],
    [
      { text: `Итого:`, bold: true, fontSize: 10, alignment:'right' },                 
      { text: `${Number(record.chOrderPrice).toFixed(2)} ${chCurrency}`, bold: true, fontSize: 10, alignment:'right' }, 
    ],
  ]
}