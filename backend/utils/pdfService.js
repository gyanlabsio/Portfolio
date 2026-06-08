const PDFDocument = require('pdfkit');

const generateQuotationPdf = (quotation, items, res) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });

      // Pipe the document to the response
      doc.pipe(res);

      // Header
      doc
        .fillColor('#333333')
        .fontSize(20)
        .text('QUOTATION', { align: 'right' })
        .fontSize(10)
        .text(`Quotation Number: ${quotation.quotationNumber}`, { align: 'right' })
        .text(`Date: ${new Date(quotation.createdAt).toLocaleDateString()}`, { align: 'right' })
        .text(`Valid Until: ${new Date(quotation.validUntil).toLocaleDateString()}`, { align: 'right' })
        .moveDown(2);

      // Portfolio Branding (Left Side Header)
      doc
        .fontSize(16)
        .text('Gyanaranjan Das', 50, 50)
        .fontSize(10)
        .text('Freelance Full Stack Developer')
        .text('gyanlabs.io@gmail.com')
        .text('https://gyanaranjandas.me');

      doc.moveDown(3);

      // Client Info
      doc
        .fontSize(12)
        .text('Prepared For:', 50, 150)
        .fontSize(10)
        .text(quotation.clientName)
        .text(quotation.clientEmail);
        
      if (quotation.company) {
        doc.text(quotation.company);
      }

      doc.moveDown(2);

      // Project Info
      doc
        .fontSize(12)
        .text('Project Details:', 50, 220)
        .fontSize(10)
        .text(`Title: ${quotation.projectTitle}`);
        
      if (quotation.projectDescription) {
        doc.text(`Description: ${quotation.projectDescription}`);
      }

      doc.moveDown(2);

      // Table Header
      let y = doc.y + 10;
      doc
        .fontSize(10)
        .text('Item', 50, y)
        .text('Description', 200, y)
        .text('Qty', 350, y, { width: 40, align: 'right' })
        .text('Rate', 400, y, { width: 50, align: 'right' })
        .text('Amount', 470, y, { width: 70, align: 'right' });
      
      doc
        .moveTo(50, y + 15)
        .lineTo(540, y + 15)
        .stroke();

      y += 25;

      // Table Rows
      items.forEach(item => {
        if (y > 700) {
          doc.addPage();
          y = 50;
        }

        doc
          .fontSize(9)
          .text(item.title, 50, y)
          .text(item.description || '', 200, y, { width: 140 })
          .text(item.quantity.toString(), 350, y, { width: 40, align: 'right' })
          .text(`${quotation.currency} ${item.rate.toFixed(2)}`, 400, y, { width: 50, align: 'right' })
          .text(`${quotation.currency} ${item.amount.toFixed(2)}`, 470, y, { width: 70, align: 'right' });

        const height = Math.max(
          doc.heightOfString(item.title, { width: 140 }),
          doc.heightOfString(item.description || '', { width: 140 })
        );
        
        y += height + 10;
        
        doc
          .moveTo(50, y - 5)
          .lineTo(540, y - 5)
          .strokeColor('#e0e0e0')
          .stroke()
          .strokeColor('#000000');
      });

      y += 10;

      // Totals
      doc
        .fontSize(10)
        .text('Subtotal:', 380, y, { width: 70, align: 'right' })
        .text(`${quotation.currency} ${quotation.subtotal.toFixed(2)}`, 450, y, { width: 90, align: 'right' });
      
      y += 15;
      doc
        .text('Tax:', 380, y, { width: 70, align: 'right' })
        .text(`${quotation.currency} ${quotation.tax.toFixed(2)}`, 450, y, { width: 90, align: 'right' });

      y += 15;
      doc
        .fontSize(12)
        .text('Total:', 380, y, { width: 70, align: 'right' })
        .text(`${quotation.currency} ${quotation.total.toFixed(2)}`, 450, y, { width: 90, align: 'right' });

      // Notes
      if (quotation.notes) {
        if (doc.y > 650) {
          doc.addPage();
        }
        doc
          .moveDown(4)
          .fontSize(10)
          .text('Notes:', 50)
          .fontSize(9)
          .text(quotation.notes);
      }

      // Footer
      doc
        .fontSize(8)
        .fillColor('#888888')
        .text('This quotation is an estimate and is valid until the specified date. Final pricing and scope will be determined in a formal contract.', 50, 750, { align: 'center', width: 490 });

      doc.end();
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  generateQuotationPdf
};
