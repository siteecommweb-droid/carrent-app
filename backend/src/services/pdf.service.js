const PDFDocument = require("pdfkit");

function generateInvoiceStream(res, invoice) {
  const doc = new PDFDocument({
    margin: 50,
  });

  res.setHeader(
    "Content-Type",
    "application/pdf"
  );

  doc.pipe(res);

  doc.fontSize(28)
    .text("AM38 RENT A CAR", {
      align: "center",
    });

  doc.moveDown();

  doc.fontSize(18)
    .text(`Invoice #${invoice.id}`);

  doc.moveDown();

  doc.text(`Customer: ${invoice.customer}`);
  doc.text(`Vehicle: ${invoice.vehicle}`);
  doc.text(`Amount: MUR ${invoice.amount}`);

  doc.moveDown();

  doc.text("Thank you for choosing AM38.");

  doc.end();
}

module.exports = {
  generateInvoiceStream,
};