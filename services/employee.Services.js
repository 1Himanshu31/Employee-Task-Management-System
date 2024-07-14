const Employee = require('../model/employee.Model');
const fs = require('fs');
// const fonts = require('./fonts'); 
const department = require('../model/department.Model')
const Country = require('../model/country.Model');
const State = require('../model/state.Model');
const City = require('../model/city.Model');
const zipcode = require('../model/zipcode.Model');
const mongoose = require('mongoose');


const pdfmake = require('pdfmake');
const vfsFonts = require('pdfmake/build/vfs_fonts');


const { parse } = require('path');

pdfmake.vfs = vfsFonts.pdfMake.vfs;

var fonts = 
{
    Roboto: 
    {
        normal: 'fonts/Roboto-Regular.ttf',
        bold: 'fonts/Roboto-Medium.ttf',
        italics: 'fonts/Roboto-Italic.ttf',
        bolditalics: 'fonts/Roboto-MediumItalic.ttf',
    }
};

exports.createEmployees = async function (employeeData) 
{
    try 
    {
        const newEmployee = new Employee(employeeData);
        const savedEmployee = await newEmployee.save();
        // await savedEmployee.populate('department country state city zipcode');
        return savedEmployee;
    } 
    catch (error) 
    {
        throw new Error('Error while creating employee: ' + error.message);
    }
};
exports.importEmployees = async function (employeesData) 
{
    try 
    {
        const importedEmployees = [];

        for (let i = 0; i < employeesData[0].employeeNameArr.length; i++) 
            {
            
            const employeeData = 
            {
                employeeName: employeesData[0].employeeNameArr[i],
                dob: employeesData[0].dobArr[i],
                department: employeesData[0].departmentArr[i],
                phoneNo: employeesData[0].phoneNoArr[i],
                email: employeesData[0].emailArr[i],
                address: employeesData[0].addressArr[i],
                country:  employeesData[0].countryArr[i],
                state:  employeesData[0].stateArr[i],
                city:  employeesData[0].cityArr[i],
                zipcode:  employeesData[0].zipcodeArr[i],
            };

            const newEmployee = new Employee(employeeData);
            const savedEmployee = await newEmployee.save();
            importedEmployees.push(savedEmployee);
        }

        return importedEmployees;
    } 
    catch (error) 
    {
        throw new Error('Error while importing employees: ' + error.message);
    }
};
exports.getEmployees = async function (req, res) 
{
    try 
    {
        const page = parseInt(req.body.page) || 1;
        const pageSize = parseInt(req.body.pageSize) ||  100;
        const sortBy = req.body.sortBy || 'col1';
        const sortOrder = req.body.sortOrder || 'asc';
        const limit = parseInt(req.body.limit) || 0;

        const populateOption = 
        [
            {
                path: 'department',
                select: 'departmentName'
            },
            {
                path: 'country',
                select: 'countryName'
            },
            {
                path: 'state',
                select: 'stateName'
            },
            {
                path: 'city',
                select: 'cityName'
            },
            {
                path: 'zipcode',
                select: 'zipcode'
            }
        ];

        const skip = (page - 1) * pageSize; 
        let sortOrderNum = sortOrder === 'asc' ? 1 : -1;
        const sortCriteria = {};

        if (sortBy === 'col1') 
        {
            sortCriteria.employeeName = sortOrderNum;
        }

        const matchStage = 
        {
            isActive: true,
            isDeleted: false,
        };

        const pipeline = 
        [
            {
                $lookup: {
                    from: 'departments',
                    localField: 'department',
                    foreignField: '_id',
                    as: 'department',
                },
            },
            {
                $lookup: {
                    from: 'countries',
                    localField: 'country',
                    foreignField: '_id',
                    as: 'country',
                },
            },
            {
                $lookup: {
                    from: 'states',
                    localField: 'state',
                    foreignField: '_id',
                    as: 'state',
                },
            },
            {
                $lookup: {
                    from: 'cities',
                    localField: 'city',
                    foreignField: '_id',
                    as: 'city',
                },
            },
            {
                $lookup: {
                    from: 'zipcodes',
                    localField: 'zipcode',
                    foreignField: '_id',
                    as: 'zipcode',
                },
            },
            {
                $match: matchStage,
            },
            {
                $sort: sortCriteria,
            },
            {
                $skip: skip,
            },
            {
                $limit: limit > 0 ? limit : pageSize, 
            },
            {
                $group: {
                    _id: null,
                    count: { $sum: 1 },
                    employees: { $push: '$$ROOT' },
                },
            },
            {
                $addFields: {
                    totalCount: '$count',
                },
            },
            {
                $project: {
                    _id: 0,
                    employees: 1,
                    totalCount: 1,
                },
            },
        ];

        const employeesAggregate = await Employee.aggregate(pipeline).exec();
        const employees = employeesAggregate.length > 0 ? employeesAggregate[0].employees : [];
        const totalCount = employeesAggregate.length > 0 ? employeesAggregate[0].totalCount : 0;
        const totalPages = Math.ceil(totalCount / 7);
        const headers = ['Employee Name', 'DOB', 'Department', 'Phone No', 'Email', 'Address'];

        
        const tableBody = [headers].concat(employees.map(employee =>
            [
            { text: employee.employeeName, style: 'tableCell' },
            { text: new Date(employee.dob).toLocaleDateString(), style: 'tableCell' },
            { text: employee.department[0].departmentName, style: 'tableCell' }, 
            { text: employee.phoneNo, style: 'tableCell' },
            { text: employee.email, style: 'tableCell' },
            { text: `${employee.address}\n${employee.country[0].countryName}\n${employee.state[0].stateName}\n${employee.city[0].cityName}\n${employee.zipcode[0].zipcode}`, style: 'tableCell' },
            
        ]));
        

        const docDefinition = 
        {
            content: 
            [
                { text: "Employee Data", style: "header" },
                {
                    table:
                    {
                        headerRows: 1,
                        dontBreakRows: true,
                        body: tableBody,
                        pageBreak: 'auto'
                    },
                },
            ],
   
            styles: 
            {
                header: 
                {
                    fontSize: 17,
                    bold: true,
                    margin: [0, 19, 0, 10],
                },
                tableCell: 
                {
                    margin: [2, 2],
                },
            },
            header: 
            {
                stack: 
                [
                    {
                        columns: [
                            {
                                image: 'C:\\Users\\hc312\\Downloads\\logo.jpeg',
                                style: 'header',
                                width: 28,
                                alignment: 'left',
                                margin: [10, 0],
                            },
                            {
                                text: 'Employee Details ',
                                style: 'header',
                                alignment: 'center',
                                margin: [10, 0, 0, 0],
                            },
                        ],
                    },
                ],
                margin: [0, 10, 0, 0],
            },
            footer: function (currentPage, pageCount) {
                return {
                    columns: [
                        {
                            canvas: [
                                { type: 'line', x1: 5, y1: 0, x2: 580, y2: 0, lineWidth: 1 },
                            ],
                            width: '0%',
                            margin: [0, 0, 0, 0],
                        },
                        {
                            text: [
                                { text: `Generated By: `, style: 'footer' },
                                { text: new Date().toLocaleString(), style: 'footer' },
                            ],
                            width: '50%',
                            alignment: 'left',
                            margin: [7, 0],
                        },
                        {
                            text: [
                                { text: `Page ${currentPage} of ${pageCount}`, style: 'footer' },
                            ],
                            width: '50%',
                            alignment: 'right',
                            margin: [0, 0],
                        },
                    ],
                    margin: [10, 10, 10, 10],
                };
            },
        };
        
        const printer = new pdfmake(fonts);
        const pdf = printer.createPdfKitDocument(docDefinition);

        pdf.pipe(fs.createWriteStream("PDFFF.pdf"));
        pdf.end();

        return {
            data: employees,
            totalCount,
            totalPages,
        };
    } catch (error) {
        throw new Error('Error while retrieving employees: ' + error.message);
    }
};
exports.getEmployeesDashboard = async function (req, res) 
{
    try 
    {
        const result = await Employee.aggregate([
            {
                $match: 
                {
                    isActive: true,
                    isDeleted: false,
                },
            },
            {
                $group: 
                {
                    _id: '$city',  
                    activeEmployeeCount: { $sum: 1 },
                    
                },
            },
            {
                $lookup: 
                {
                    from: 'cities',  
                    localField: '_id',
                    foreignField: '_id',
                    as: 'cityInfo',
                },
            },
            {
                $unwind: '$cityInfo',
            },
            {
                $project: 
                {
                    city: '$cityInfo.cityName',  
                    counts: 
                    {
                        activeEmployeeCount: '$activeEmployeeCount',
                    },
                },
            },
        ]).exec();
        

        return {
            

            data: result,
            
        };
        
    } 
    catch (error) 
    {
        throw new Error('Error getting employee status count');
    }
};
// const generatePDF = async (res) => {
//     try {
        
//         const employees = await Employee.aggregate(pipeline).exec();
//         const content = employees.map(employee => [
//             { text: employee.employeeName, style: 'tableCell' },
//             { text: new Date(employee.dob).toLocaleDateString(), style: 'tableCell' },
//             { text: employee.department, style: 'tableCell' },
//             { text: employee.phoneNo, style: 'tableCell' },
//             { text: employee.email, style: 'tableCell' },
//             { text: `${employee.address}\n${employee.country}\n${employee.state}\n${employee.city}\n${employee.zipcode}`, style: 'tableCell' },
//         ]);

//         const headers = ['Employee Name', 'DOB', 'Department', 'Phone No', 'Email', 'Address'];

//         const tableBody = [headers].concat(content);

//         const docDefinition = {
//             content: [
//                 { text: "Employee Data", style: "header" },
//                 {
//                     table: {
//                         headerRows: 1,
//                         body: tableBody,
//                     },
//                 },
//             ],
//             styles: {
//                 header: {
//                     fontSize: 17,
//                     bold: true,
//                     margin: [0, 19, 0, 10],
//                 },
//                 tableCell: {
//                     margin: [5, 2],
//                 },
//             },

//             header: {
//                 stack: [
//                     {
//                         columns: [
//                             {
//                                 image: 'C:\\Users\\hc312\\Downloads\\logo.jpeg',
//                                 width: 50,
//                                 alignment: 'left',
//                                 margin: [10, 0],
//                             },
//                             {
//                                 text: 'Employee Details For',
//                                 style: 'header',
//                                 alignment: 'center',
//                                 margin: [10, 0, 0, 0],
//                             },

//                         ],
//                     },
//                 ],
//                 margin: [0, 10, 0, 0],
//             },
//             footer: function (currentPage, pageCount) {
//                 return {
//                     columns: [
//                         {
//                             canvas: [
//                                 { type: 'line', x1: 5, y1: 0, x2: 580, y2: 0, lineWidth: 1 },
//                             ],
//                             width: '0%',
//                             margin: [0, 0, 0, 0],
//                         },

//                         {
//                             text: [
//                                 { text: `Generated By: `, style: 'footer' },
//                                 { text: new Date().toLocaleString(), style: 'footer' },
//                             ],
//                             width: '50%',
//                             alignment: 'left',
//                             margin: [7, 0],
//                         },
//                         {
//                             text: [
//                                 { text: `Page ${currentPage} of ${pageCount}`, style: 'footer' },
//                             ],
//                             width: '50%',
//                             alignment: 'right',
//                             margin: [0, 0],
//                         },
//                     ],
//                     margin: [10, 10, 10, 10],
//                 };
//             },
//         };

//         var printer = new pdfmake(fonts);
//         const pdf = printer.createPdfKitDocument(docDefinition);

//         pdf.pipe(fs.createWriteStream("PDFFF.pdf"));
//         pdf.end();
//     } catch (error) {
//         console.error('Error generating PDF:', error.message);
//         // res.status(500).json({ status: 500, message: "Error generating PDF" });
//     }
// };

// generatePDF();

// await generateExcel(employees);


//         return employees;
//     } catch (error) {
//         throw new Error('Error while retrieving employees: ' + error.message);
//     }
// };
// async function generateExcel(employees) {
//     try {
//         const workbook = new exceljs.Workbook();
//         const worksheet = workbook.addWorksheet("Employees", { views: [{ state: 'frozen', xSplit: 1 }] });
//         worksheet.columns = [
//             { header: 'Employee Name', key: 'name', width: 20 },
//             { header: 'Date of Birth', key: 'dob', width: 20 },
//             { header: 'Department', key: 'department', width: 20 },
//             { header: 'Phone No', key: 'phoneNo', width: 20 },
//             { header: 'Email', key: 'email', width: 30 },
//             { header: 'Address', key: 'address', width: 20 },
//             { header: 'Country', key: 'country', width: 20 },
//             { header: 'State', key: 'state', width: 20 },
//             { header: 'City', key: 'city', width: 20 },
//             { header: 'Zipcode', key: 'zipcode', width: 20 },
//         ];
//         worksheet.getColumn('phoneNo').alignment = { horizontal: 'left' }
//         worksheet.getColumn('zipcode').alignment = { horizontal: 'left' }
//         await Promise.all(employees.map(async (employee) => {
//             worksheet.addRow({
//                 name: employee.employeeName || '--',
//                 dob: employee.dob ? new Date(employee.dob).toLocaleDateString() : '--',
//                 department: employee.department.departmentName || '--',
//                 phoneNo: employee.phoneNo || '--',
//                 email: employee.email || '--',
//                 address: employee.address || '--',
//                 country: employee.country.countryName || '--',
//                 state: employee.state.stateName || '--',
//                 city: employee.city.cityName || '--',
//                 zipcode: employee.zipcode.zipcode || '--',
//             });
//         }));
//         await workbook.xlsx.writeFile('Employees.xlsx');
//         console.log('Excel file successfully generated.');
//     } catch (e) {
//         console.error('Error in Excel generation:', e.message);
//         throw new Error("Error in Excel generation");
//     }
// }

exports.getEmployeeById = async function (employeeId, res) 
{
    try 
    {
        const populateOption = 
        [
            {
                path: 'department',
                select: 'departmentName'
            },
            {
                path: 'country',
                select: 'countryName'
            },
            {
                path: 'state',
                select: 'stateName'
            },
            {
                path: 'city',
                select: 'cityName'
            },
            {
                path: 'zipcode',
                select: 'zipcode'
            }
        ];
        const employee = await Employee.findById(employeeId).populate(populateOption);

        if (!employee) 
        {
            throw new Error('Employee not found');
        }

        const generatePDF = 
        {
            header: 
            {
                stack: 
                [
                    {
                        columns: 
                        [
                            {
                                image: 'C:\\Users\\hc312\\Downloads\\logo.jpeg',
                                width: 34,
                                alignment: 'left',
                                margin: [5, 5],
                            },
                        ],
                    },
                ],
                margin: [0, 1, 3, 10],
            },
            styles: 
            {
                header: 
                {
                    fontSize: 17,
                    bold: true,
                    margin: [0, 10, 0, 10],
                },
                tableCell: 
                {
                    margin: [5, 0],
                },
            },
            footer: function (currentPage, pageCount) 
            {
                return {
                    columns: [
                        {
                            canvas: 
                            [
                                { type: 'line', x1: 5, y1: 0, x2: 580, y2: 0, lineWidth: 1 },
                            ],
                            width: '0%',
                            margin: [0, 0, 0, 0],
                        },
                        {
                            text: 
                            [
                                { text: `Generated By: `, style: 'footer' },
                                { text: new Date().toLocaleString(), style: 'footer' },
                            ],
                            width: '50%',
                            alignment: 'left',
                            margin: [7, 0],
                        },
                        {
                            text: 
                            [
                                { text: `Page ${currentPage} of ${pageCount}`, style: 'footer' },
                            ],
                            width: '50%',
                            alignment: 'right',
                            margin: [0, 0],
                        },
                    ],
                    margin: [10, 10, 10, 10],
                };
            },
            content: 
            [
                {
                    text: "Employee Details For",
                    style: "header",
                    bold: true,
                    alignment: "center",
                    margin: [10, 0, 0, 10],
                },
                {
                    text: employee.employeeName,
                    style: 'employeeName',
                    alignment: 'center',
                    bold: true,
                    margin: [10, 0, 0, 10],
                },
                {
                    text: "Personal Information",
                    style: "PI",
                    bold: true,
                    // pageBreak: 'after'
                },
                {
                    table: 
                    {
                        headerRows: 1,
                        widths: [250, 250],
                        body: 
                        [
                            [
                                { text: 'Employee Name', bold: true },
                                { text: 'Date of Birth', bold: true },
                            ],
                            [
                                { text: employee.employeeName },
                                { text: new Date(employee.dob).toLocaleDateString() },
                            ],
                            [
                                { text: 'Department', bold: true },
                                { text: 'Country', bold: true },
                            ],
                            [
                                { text: employee.department.departmentName },
                                { text: employee.country.countryName },
                            ],
                        ]
                    },
                    layout: 
                    {
                        defaultBorder: true
                    }
                },
                {
                    text: "Address Information",
                    style: "AI",
                    bold: true,
                    pageBreak: 'before'
                },
                {
                    table: 
                    {
                        headerRows: 1,
                        widths: [250, 250],
                        body: 
                        [
                            [
                                { text: 'Address', bold: true },
                                { text: 'State', bold: true },
                            ],
                            [
                                { text: employee.address },
                                { text: employee.state.stateName },
                            ],
                            [
                                { text: 'City', bold: true },
                                { text: 'Zipcode', bold: true },
                            ],
                            [
                                { text: employee.city.cityName },
                                { text: employee.zipcode.zipcode },
                            ]
                        ]
                    },
                    layout: 
                    {
                        defaultBorder: true
                    }
                },
            ]
        };

        const printer = new pdfmake(fonts);
        const pdfDocument = printer.createPdfKitDocument(generatePDF);
        pdfDocument.pipe(fs.createWriteStream("PDFDetail.pdf"));
        console.log("PDF created");
        pdfDocument.end();
        return employee;
    } 
    catch (error) 
    {
        console.error('Error generating PDF:', error.message);
    }
};



exports.updateEmployeeStatus = async function (employeeId, newStatus) 
{ //CONTROLLER ONLY
    try 
    {
        const employee = await Employee.findByIdAndUpdate(
            employeeId,
            { isActive: newStatus },
            { new: true }
        );
        if (!employee) 
        {
            throw new Error('Employee not found');
        }
        return employee;
    } 
    catch (error) 
    {
        throw new Error('Error while updating employee status: ' + error.message);
    }
};

// exports.canDeleteEmployee = async function (employeeId) {
//     try {
//         const employee = await Employee.findById(employeeId);

//         if (!employee) {
//             throw new Error('Employee not found');
//         }

//         const canDelete = employee.status === 'Inactive';

//         let message = '';
//         if (!canDelete) {
//             message = 'Employee cannot be deleted because it is still active or used somewhere.';
//         }

//         return { canDelete, employee };
//     } catch (error) {
//         throw new Error('Error while checking if the employee can be deleted: ' + error.message);
//     }
// };
exports.getEmployeeList = async function () 
{
    try 
    {
        const employeeList = await Employee.find({ isActive: true, isDeleted: false }, '_id employeeName')
            .sort({ employeeName: 1 });

        return employeeList;
    } 
    catch (error) 
    {
        throw new Error('Error while retrieving employee list: ' + error.message);
    }
};

exports.updateEmployee = async function (employeeId, updatedData) 
{
    try 
    {
        console.log('Employee ID:', employeeId);
        console.log('Updated Data:', updatedData);
        const employee = await Employee.findByIdAndUpdate(
            employeeId,
            { $set: updatedData },
            { new: true }
        );

        if (!employee) 
        {
            throw new Error('Employee not found');
        }

        return employee;
    } 
    catch (error) 
    {
        throw new Error('Error while updating employee: ' + error.message);
    }
};