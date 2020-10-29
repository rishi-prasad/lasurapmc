const express = require('express');
const path = require('path');
const multer = require('multer');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');


// Setting up mongodb connection
mongoose.connect('mongodb+srv://rishiprasad:rishiprasad@123@cluster0.vhyhx.mongodb.net/<dbname>?retryWrites=true&w=majority', {
    useNewUrlParser: true
});

const db = mongoose.connection;

db.on('error', error => console.log(error));
db.once('open', () => console.log('Connected to mongodb'));


const Farmers = require('./farmer');

function zeroPad(num) {
    let string = String(num);
    while (string.length <= 7) {
        string = "0" + string;
    }
    return string;
}

// function returnReceiptNo(req, res) {
//     let newFarmerReceiptNo; 
//     Farmers.find({}, (e, findFarmers) => {
//         const farmer = new Farmers({
//             receiptNo: findFarmers[0] === undefined ? 0000001 : findFarmers[findFarmers.length - 1].receiptNo + 1,
//             farmerName: req.body.name,
//             dateOfFormSubmitted: `${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}`
//         });

//         farmer.save((e, result) => {
//             if (e) console.log(e);
//             else console.log('New farmer created');
//         });

//         Farmers.find({
//             farmerName: req.body.name
//         }, (e, result) => {
//             newFarmerReceiptNo = result.receiptNo;
//         });

//     });
//     return newFarmerReceiptNo;
// }

// pdf modules

const PDFdocument = require('pdfkit');
const fs = require('fs');


const app = express();
// const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');


app.use(express.static('public'));

app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(bodyParser.json());

// multer configuration

let Storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, './public/uploads');
    },
    filename: function(req, file, callback) {
        console.log(file.originalname);
        callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`);
    }
});

let upload = multer({
    storage: Storage,
}).fields([{name: 'aadharFile', maxCount: 1}, {name: 'farmFile', maxCount: 1}, {name: 'passbook', maxCount: 1}]);

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

app.get('/facilities', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'facilities.html'));
});

app.get('/gallary', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'gallary.html'));
});


const receiverFile = `output_${Date.now()}.pdf`;
const outputFile = `output_${Date.now()}.pdf`;

// form section =======================================

app.get('/registration', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'form.html'));
});

app.post('/registration', (req, res) => {

    // const doc = new PDFdocument();
    // const receiver = new PDFdocument();
    // doc.pipe(fs.createWriteStream(path.join(__dirname, 'pdfOutput', `output_${Date.now()}.pdf`)));
    // receiver.pipe(fs.createWriteStream(path.join(__dirname, 'receiverOutput', `output_${Date.now()}.pdf`)));

    // doc.font(path.join(__dirname, 'fonts', 'NotoSans.ttf')).fontSize(18).text(`शेतकर्‍याचे नाव: ${req.body.name}\nआधार कार्ड क्रमांक: ${req.body.aadharNumber}\nफोन.नं / मो.नं: ${req.body.phoneNumber}\nगाव: ${req.body.village}\nतालुका: ${req.body.taluka}\nजिल्हा: ${req.body.district}\nजतीचे प्रवर्ग: ${req.body.castClass}\nबँकेचे नाव: ${req.body.bankName}\nशाखा: ${req.body.bankBranch}\nबँकेचे IFSC कोड क्रमांक: ${req.body.bankIFSC}\n7/12 गट क्रमांक: ${req.body.gutNumber}\nजमीन क्षेत्र: ${req.body.area}`)
    // receiver.font(path.join(__dirname, 'fonts', 'NotoSans.ttf')).fontSize(26).text(`पोच पावती \n नाव: ${req.body.name} \n फॉर्म जमा करण्याची तारीख: ${new Date()}`);

    // doc.end();
    // receiver.end();

    upload(req, res, err => {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            //     const doc = new PDFdocument();
            //     const receiver = new PDFdocument();
            //     doc.pipe(fs.createWriteStream(path.join(__dirname, 'pdfOutput', outputFile)));
            //     receiver.pipe(fs.createWriteStream(path.join(__dirname, 'receiverOutput', receiverFile)));

            //     doc.font(path.join(__dirname, 'fonts', 'NotoSans.ttf')).fontSize(18).text(`शेतकर्‍याचे नाव: ${req.body.name}\n\nआधार कार्ड क्रमांक: ${req.body.aadharNumber}\n\nफोन.नं / मो.नं: ${req.body.phoneNumber}\n\nगाव: ${req.body.village}\n\nतालुका: ${req.body.taluka}\n\nजिल्हा: ${req.body.district}\n\nजतीचे प्रवर्ग: ${req.body.castClass}\n\nबँकेचे नाव: ${req.body.bankName}\n\n बँकेचे खाते क्रमांक: ${req.body.bankAc}\n\nशाखा: ${req.body.bankBranch}\n\nबँकेचे IFSC कोड क्रमांक: ${req.body.bankIFSC}\n\n7/12 गट क्रमांक: ${req.body.gutNumber}\n\nजमीन क्षेत्र: ${req.body.area}`);

            //     receiver.image(path.join(__dirname, 'public', 'images', 'logo.jpg'), 290, 50, {
            //         fit: [60, 60],
            //         align: 'center',
            //         valign: 'top' 
            //     });
            //     receiver.font(path.join(__dirname, 'fonts', 'NotoSans.ttf')).fontSize(26).text(`\nकृषि उत्पन्न बाजार समिती, सचिव,`, 150, 80);   
            //     receiver.font(path.join(__dirname, 'fonts', 'NotoSans.ttf')).fontSize(20).text(`\nलासूर स्टेशन, ता. गंगापूर, जि. औरंगाबाद`, 165, 120);
            //     receiver.font(path.join(__dirname, 'fonts', 'NotoSans.ttf')).fontSize(22).text(`\n\n पोच पावती`, 250, 160);
            //     receiver.font(path.join(__dirname, 'fonts', 'NotoSans.ttf')).fontSize(20).text(`\nपावती क्रमांक: ${receiptNo}\n नाव: ${req.body.name} \n फॉर्म जमा करण्याची तारीख: ${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`, 140, 230);

            //     doc.end();
            //     receiver.end();
            //     // console.log(`farmer's name ${req.body.name}`, req.files['aadharFile'][0]);

            //     let transporter = nodemailer.createTransport({
            //         service: 'gmail',
            //         auth: {
            //             user: 'rishiprasad1010@gmail.com',
            //             pass: 'printer@3333'
            //         }
            //     });

            //     let mailOptions = {
            //         from: 'rishiprasad1010@gmail.com',
            //         to: 'bsprintronics@yahoo.com', 
            //         subject: 'शेतीमाल विक्री नोंदणी',
            //         text: `शेतकर्‍याचे नाव: ${req.body.name}\nआधार कार्ड क्रमांक: ${req.body.aadharNumber}\nफोन.नं / मो.नं: ${req.body.phoneNumber}\nगाव: ${req.body.village}\nतालुका: ${req.body.taluka}\nजिल्हा: ${req.body.district}\nजतीचे प्रवर्ग: ${req.body.castClass}\nबँकेचे नाव: ${req.body.bankName}\nशाखा: ${req.body.bankBranch}\nबँकेचे IFSC कोड क्रमांक: ${req.body.bankIFSC}\n7/12 गट क्रमांक: ${req.body.gutNumber}\nजमीन क्षेत्र: ${req.body.area}`,
            //         attachments: [
            //             {
            //                 path: req.files['aadharFile'][0].path
            //             },
            //             {
            //                 path: req.files['farmFile'][0].path
            //             },
            //             {
            //                 path: req.files['passbook'][0].path
            //             },
            //             {
            //                 path: path.join(__dirname, 'pdfOutput', outputFile)
            //             }
            //         ]
            //     }

            //     transporter.sendMail(mailOptions, function(err, info) {
            //         if (err) {
            //             res.send(err);
            //         } else {
            //             res.render('sent');
            //         }
            //     });

            Farmers.find({}, (e, findFarmers) => {
                const farmer = new Farmers({
                    receiptNo: `${zeroPad(findFarmers[0] === undefined ? 1 : Number(findFarmers[findFarmers.length - 1].receiptNo) + 1)}`,
                    farmerName: req.body.name,
                    dateOfFormSubmitted: `${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`,
                    aadhar: `${req.files['aadharFile'][0].filename}`,
                    passbook: `${req.files['passbook'][0].filename}`,
                    landDoc: `${req.files['farmFile'][0].filename}`,
                    outputFile: `${outputFile}`
                });

                console.log(req.files['aadharFile']);
                farmer.save((e, result) => {
                    if (e) console.log(e);
                    else {
                        console.log('New field created');
                        const doc = new PDFdocument();
                        const receiver = new PDFdocument();
                        doc.pipe(fs.createWriteStream(path.join(__dirname, 'pdfOutput', outputFile)));
                        receiver.pipe(fs.createWriteStream(path.join(__dirname, 'receiverOutput', receiverFile)));

                        console.log(result);

                        doc.font(path.join(__dirname, 'fonts', 'NotoSans.ttf')).fontSize(18).text(`पावती क्रमांक: ${result.receiptNo}\n\n शेतकर्‍याचे नाव: ${req.body.name}\n\nआधार कार्ड क्रमांक: ${req.body.aadharNumber}\n\nफोन.नं / मो.नं: ${req.body.phoneNumber}\n\nगाव: ${req.body.village}\n\nतालुका: ${req.body.taluka}\n\nजिल्हा: ${req.body.district}\n\nजतीचे प्रवर्ग: ${req.body.castClass}\n\nबँकेचे नाव: ${req.body.bankName}\n\n बँकेचे खाते क्रमांक: ${req.body.bankAc}\n\nशाखा: ${req.body.bankBranch}\n\nबँकेचे IFSC कोड क्रमांक: ${req.body.bankIFSC}\n\n7/12 गट क्रमांक: ${req.body.gutNumber}\n\nजमीन क्षेत्र: ${req.body.area}`);

                        receiver.image(path.join(__dirname, 'public', 'images', 'logo.jpg'), 290, 50, {
                            fit: [60, 60],
                            align: 'center',
                            valign: 'top' 
                        });
                        receiver.font(path.join(__dirname, 'fonts', 'NotoSans.ttf')).fontSize(26).text(`\nकृषि उत्पन्न बाजार समिती, सचिव,`, 150, 80);   
                        receiver.font(path.join(__dirname, 'fonts', 'NotoSans.ttf')).fontSize(20).text(`\nलासूर स्टेशन, ता. गंगापूर, जि. औरंगाबाद`, 165, 120);
                        receiver.font(path.join(__dirname, 'fonts', 'NotoSans.ttf')).fontSize(22).text(`\n\n पोच पावती`, 250, 160);
                        receiver.font(path.join(__dirname, 'fonts', 'NotoSans.ttf')).fontSize(20).text(`\nपावती क्रमांक: ${result.receiptNo}\n नाव: ${req.body.name} \n फॉर्म जमा करण्याची तारीख: ${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`, 140, 230);

                        doc.end();
                        receiver.end();
                    }
                });

                // Farmers.find({
                //     farmerName: req.body.name
                // }, (e, result) => {
                //     if (e) console.log(e);
                //     else {
                //     const doc = new PDFdocument();
                //     const receiver = new PDFdocument();
                //     doc.pipe(fs.createWriteStream(path.join(__dirname, 'pdfOutput', outputFile)));
                //     receiver.pipe(fs.createWriteStream(path.join(__dirname, 'receiverOutput', receiverFile)));

                //         console.log(result);

                //         doc.font(path.join(__dirname, 'fonts', 'NotoSans.ttf')).fontSize(18).text(`पावती क्रमांक: ${2}\n शेतकर्‍याचे नाव: ${req.body.name}\n\nआधार कार्ड क्रमांक: ${req.body.aadharNumber}\n\nफोन.नं / मो.नं: ${req.body.phoneNumber}\n\nगाव: ${req.body.village}\n\nतालुका: ${req.body.taluka}\n\nजिल्हा: ${req.body.district}\n\nजतीचे प्रवर्ग: ${req.body.castClass}\n\nबँकेचे नाव: ${req.body.bankName}\n\n बँकेचे खाते क्रमांक: ${req.body.bankAc}\n\nशाखा: ${req.body.bankBranch}\n\nबँकेचे IFSC कोड क्रमांक: ${req.body.bankIFSC}\n\n7/12 गट क्रमांक: ${req.body.gutNumber}\n\nजमीन क्षेत्र: ${req.body.area}`);

                //     receiver.image(path.join(__dirname, 'public', 'images', 'logo.jpg'), 290, 50, {
                //         fit: [60, 60],
                //         align: 'center',
                //         valign: 'top' 
                //     });
                //     receiver.font(path.join(__dirname, 'fonts', 'NotoSans.ttf')).fontSize(26).text(`\nकृषि उत्पन्न बाजार समिती, सचिव,`, 150, 80);   
                //     receiver.font(path.join(__dirname, 'fonts', 'NotoSans.ttf')).fontSize(20).text(`\nलासूर स्टेशन, ता. गंगापूर, जि. औरंगाबाद`, 165, 120);
                //     receiver.font(path.join(__dirname, 'fonts', 'NotoSans.ttf')).fontSize(22).text(`\n\n पोच पावती`, 250, 160);
                //         receiver.font(path.join(__dirname, 'fonts', 'NotoSans.ttf')).fontSize(20).text(`\nपावती क्रमांक: ${2}\n नाव: ${req.body.name} \n फॉर्म जमा करण्याची तारीख: ${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`, 140, 230);

                //     doc.end();
                //     receiver.end();
                    // console.log(`farmer's name ${req.body.name}`, req.files['aadharFile'][0]);

                    // let transporter = nodemailer.createTransport({
                    //     service: 'gmail',
                    //     auth: {
                    //         user: 'rishiprasad1010@gmail.com',
                    //         pass: 'printer@3333'
                    //     }
                    // });

                    // let mailOptions = {
                    //     from: 'rishiprasad1010@gmail.com',
                    //     to: 'bsprintronics@yahoo.com', 
                    //     subject: 'शेतीमाल विक्री नोंदणी',
                    //     text: `शेतकर्‍याचे नाव: ${req.body.name}\nआधार कार्ड क्रमांक: ${req.body.aadharNumber}\nफोन.नं / मो.नं: ${req.body.phoneNumber}\nगाव: ${req.body.village}\nतालुका: ${req.body.taluka}\nजिल्हा: ${req.body.district}\nजतीचे प्रवर्ग: ${req.body.castClass}\nबँकेचे नाव: ${req.body.bankName}\nशाखा: ${req.body.bankBranch}\nबँकेचे IFSC कोड क्रमांक: ${req.body.bankIFSC}\n7/12 गट क्रमांक: ${req.body.gutNumber}\nजमीन क्षेत्र: ${req.body.area}`,
                    //     attachments: [
                    //         {
                    //             path: req.files['aadharFile'][0].path
                    //         },
                    //         {
                    //             path: req.files['farmFile'][0].path
                    //         },
                    //         {
                    //             path: req.files['passbook'][0].path
                    //         },
                    //         {
                    //             path: path.join(__dirname, 'pdfOutput', outputFile)
                    //         }
                    //     ]
                    // }

                    // transporter.sendMail(mailOptions, function(err, info) {
                    //     if (err) {
                    //         res.send(err);
                    //     } else {
                    //         
                    //     }
                    // });
                // }
                // });
                res.render('sent');
        });
        }
    });
});

app.get('/pdf', (req, res) => {
    res.contentType('application/pdf');
    res.sendFile(path.join(__dirname, 'receiverOutput', receiverFile));
});

app.get('/all_farmers_list', async (req, res) => {
    try {
        const allFarmers = await Farmers.find({});
        res.render('allfarmers', { farmers: allFarmers });
    } catch (e) {
        console.log(e);
    }
});

app.get('/pdfOutput/:file', (req, res) => {
    res.contentType('application/pdf');
    res.sendFile(path.join(__dirname, 'pdfOutput', req.params.file));
});

app.get('/public/uploads/:file', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'uploads', req.params.file));
});

app.listen();