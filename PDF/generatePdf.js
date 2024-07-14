const fs = require('fs');
const pdfmake = require('pdfmake/build/pdfmake');
const vfsFonts = require('pdfmake/build/vfs_fonts');
const Employee = require('./model/employee.Model');
const mongoose = require('mongoose');

pdfmake.vfs = vfsFonts.pdfMake.vfs;

const generatePDF = async () => 
  {
  try 
  {
    await mongoose.connect("mongodb://localhost:27017/Itechnosol");
    const employees = await Employee.find().populate('department country state city zipcode');

    const pdfDataArray = [];

    for (const employee of employees) 
      {
      const { employeeName, dob, department, phoneNo, email, address, country, state, city, zipcode } = employee;

      const content = 
      [
        { text: `Employee Name: ${employeeName}`, width: 'auto' },
        { text: `DOB: ${new Date(dob).toLocaleDateString()}`, width: 'auto' },
        { text: `Department: ${department.departmentName}`, width: 'auto' },
        { text: `Phone No: ${phoneNo}`, width: 'auto' },
        { text: `Email: ${email}`, width: 'auto' },
        { text: `Address: ${address}\nCountry: ${country.countryName}\nState: ${state.stateName}\nCity: ${city.cityName}\nZipcode: ${zipcode.zipcode}`, width: 'auto' },
      ];
      const docDefinition = 
      {
        content: 
        [
          { text: "Employee Data", style: "header" },
          { table: { body: [content] } }
        ],
        styles: 
        {
          header: 
          {
            fontSize: 17,
            bold: true,
            margin: [0, 0, 0, 10]
          }
        }
      };
      const pdfDoc = pdfmake.createPdf(docDefinition);

      const fileName = `${employeeName.replace(/\s+/g, '_')}_Emp_File.pdf`;
      const filePath = `./${fileName}`;

      pdfDoc.getBuffer(async (buffer) => 
        {
        try 
        {
          fs.writeFileSync(filePath, buffer);
          const pdfData = buffer.toString('base64');
          pdfDataArray.push({ fileName, pdfData });
          console.log(`PDF file generated for ${employeeName} with base64 data: ${pdfData}`);
          
          if (pdfDataArray.length === employees.length) 
          {
            // All PDFs generated, proceed to download
            downloadPDFs(pdfDataArray);
          }
        } 
        catch (error) 
        {
          console.error('Error writing PDF file:', error);
        }
      });
    }
    mongoose.disconnect();
  } 
  catch (error) 
  {
    console.error('Error generating PDF:', error.message);
    mongoose.disconnect();
  }
};
const downloadPDFs = (pdfDataArray) => 
  {
  // You can implement the download process here
  for (const { fileName, pdfData } of pdfDataArray) 
    {
    const base64Data = Buffer.from(pdfData, 'base64');
    fs.writeFileSync(fileName, base64Data);
    console.log(`PDF downloaded: ${fileName}`);
  }
  console.log('PDFs downloaded successfully.');
};
generatePDF()
  .then(() => 
  {
    console.log('PDF generation completed');
  })
  .catch(error => 
    {
    console.error('Error generating PDF:', error.message);
  });
