const vision = require('@google-cloud/vision');

// Initialize client
const client = new vision.ImageAnnotatorClient({
  keyFilename: './service-account-key.json'
});


const fs = require('fs');
const path = require('path');
const Check = require('../model/check.model');
const baseUrl = 'http://137.184.217.34:5000';


exports.scanCheck = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image uploaded' });

    const filename = `${Date.now()}-${req.file.originalname}`;
    const filepath = path.join(__dirname, '..', 'upload', filename);
    fs.writeFileSync(filepath, req.file.buffer);
    const imageUrl = `${baseUrl}/upload/${filename}`;

    const [result] = await client.textDetection({
      image: { content: req.file.buffer },
    });

    const extractedText = result.textAnnotations?.[0]?.description || '';
    const lines = extractedText.split('\n');

    // Helper to get value after a label
    const getValueAfterLabel = (label) => {
      const idx = lines.findIndex(line => line.toUpperCase().includes(label.toUpperCase()));
      return idx >= 0 && idx + 1 < lines.length ? lines[idx + 1].trim() : '';
    };

    const date = lines.find(line =>
      line.match(/\b(?:\d{1,2}[\/\-\.]){2}\d{2,4}\b/) ||
      line.match(/\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\.?\s+\d{1,2},?\s+\d{4}\b/i)
    ) || '';

    let amountNumeric = '';
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Case 1: Line directly contains a valid currency amount
      const directMatch = line.match(/(\d{1,3}(?:[.,]\d{3})*[.,]\d{2})/);
      if (directMatch && !amountNumeric) {
        amountNumeric = directMatch[1];
      }

      // Case 2: "$" or similar symbol is on one line, and amount is on the next line
      if ((line.includes('$') || line.includes('€')) && i + 1 < lines.length) {
        const nextLine = lines[i + 1];
        const match = nextLine.match(/(\d{1,3}(?:[.,]\d{3})*[.,]\d{2})/);
        if (match && !amountNumeric) {
          amountNumeric = match[1];
        }
      }

      // Once found, break early
      if (amountNumeric) break;
    }

    // Convert comma decimal (e.g., 715,39) to dot format
    if (amountNumeric.includes(',') && !amountNumeric.includes('.')) {
      amountNumeric = amountNumeric.replace(',', '.');
    }

    const amountWords = lines.find(line =>
      line.match(/\b(?:One|Two|Three|Four|Five|Six|Seven|Eight|Nine|Ten|Eleven|Twelve|Thirteen|Fifteen|Twenty|Hundred|Thousand|Million|DOLLARS)\b/i)
    ) || '';

    const payeeLine = lines.find(line => line.toUpperCase().includes("PAY TO THE ORDER OF"));
    const payee = payeeLine ? getValueAfterLabel("PAY TO THE ORDER OF") : '';

    const memoLine = lines.find(line => line.toUpperCase().includes("MEMO"));
    const memo = memoLine ? memoLine.replace(/MEMO[:\s]*/i, '').trim() : '';

    const customerName = lines.find(line => /^[A-Z][a-z]+\s[A-Z][a-z]+$/.test(line)) || '';
    const company = lines.find(line => /USA|CORP|INC|LLC|BANK|FINANCE|CORPORATION|BRANCHES/i.test(line)) || '';

    // Set first/middle/last names to same value if name found
    const customerFirstName = customerName || '';
    const customerMiddleName = customerName || '';
    const customerLastName = customerName || '';

    const parsedData = {
      imageUrl,
      customerName,
      customerFirstName,
      customerMiddleName,
      customerLastName,
      date: date.trim(),
      amountNumeric: amountNumeric.trim(),
      amountWords: amountWords.trim(),
      payee: payee.trim(),
      memo,
      company: company.trim(),
      extractedText
    };


    res.json(parsedData);
  } catch (error) {
    console.error('Error during scan:', error);
    res.status(500).json({ error: 'Failed to process image' });
  }
};

exports.scanLicense = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const filename = `${Date.now()}-${req.file.originalname}`;
    const filepath = path.join(__dirname, '..', 'upload', filename);
    fs.writeFileSync(filepath, req.file.buffer);
    const imageUrl = `${baseUrl}/upload/${filename}`;

    // OCR using Google Vision API
    const [result] = await client.textDetection({
      image: { content: req.file.buffer },
    });

    const extractedText = result.textAnnotations?.[0]?.description || '';


    // Better regex patterns
    const nameMatch = extractedText.match(/(?:1\s+)?SAMPLE\s+([A-Z]+\s+[A-Z]+)/i);
    const licenseNoMatch = extractedText.match(/(?:LIC|DLN)[:\s]+([\d\s]+)/i);
    const classMatch = extractedText.match(/CLASS[:\s]+([A-Z]+)/i);
    const dobMatch = extractedText.match(/DOB[:\s]+(\d{2}\/\d{2}\/\d{4})/i);
    const sexMatch = extractedText.match(/SEX[:\s]+([MF])/i);
    const eyesMatch = extractedText.match(/EYES[:\s]+([A-Z]+)/i);
    const heightMatch = extractedText.match(/(?:HT|HGT)[:\s]+([\d\-\'"]+)/i);
    const issuedMatch = extractedText.match(/(?:ISSUED|ISS)[:\s]+(\d{2}\/\d{2}\/\d{4})/i);
    const expiresMatch = extractedText.match(/(?:EXPIRES|EXP)[:\s]+(\d{2}\/\d{2}\/\d{4})/i);
    const addressMatch = extractedText.match(/(?:\d+\s+[A-Z\s]+(?:APT\.?\s*\d*)?,?\s+[A-Z\s]+,\s+[A-Z]{2}\s+\d{5})/i);

    const parsedLicense = {
      imageUrl,
      name: nameMatch?.[1]?.trim() || '',
      licenseNo: licenseNoMatch?.[1]?.replace(/\s+/g, '') || '',
      class: classMatch?.[1] || '',
      dob: dobMatch?.[1] || '',
      sex: sexMatch?.[1] || '',
      eyes: eyesMatch?.[1] || '',
      height: heightMatch?.[1] || '',
      address: addressMatch?.[0] || '',
      issuedDate: issuedMatch?.[1] || '',
      expiryDate: expiresMatch?.[1] || ''
    };

    res.json(parsedLicense);

  } catch (error) {
    console.error('Error scanning license:', error);
    res.status(500).json({ error: 'Failed to process license image' });
  }
};


exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image uploaded' });
    }

    const filename = `${Date.now()}-${req.file.originalname}`;
    const filepath = path.join(__dirname, '..', 'upload', filename);

    // Save image to disk
    fs.writeFileSync(filepath, req.file.buffer);

    // Construct image URL (you can use process.env.MAIN_URL if set)
    const imageUrl = `${req.protocol}://${req.get('host')}/upload/${filename}`;

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        filename,
        imageUrl
      }
    });

  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ success: false, message: 'Failed to upload image' });
  }
};


// exports.scanCheck = async (req, res) => {
//   try {
//     if (!req.file) return res.status(400).json({ error: 'No image uploaded' });

//     const filename = `${Date.now()}-${req.file.originalname}`;
//     const filepath = path.join(__dirname, '..', 'upload', filename);
//     fs.writeFileSync(filepath, req.file.buffer);
//     const imageUrl = `${baseUrl}/upload/${filename}`;

//     // OCR with Google Vision
//     const [result] = await client.textDetection({
//       image: { content: req.file.buffer },
//     });

//     const extractedText = result.textAnnotations?.[0]?.description || '';
//     const lines = extractedText.split('\n').map(l => l.trim()).filter(Boolean);

//     res.json({
//       imageUrl,
//       extractedText,
//       lines
//     });
//   } catch (error) {
//     console.error('Error during scan:', error);
//     res.status(500).json({ error: 'Failed to process image' });
//   }
// };


// exports.scanLicense = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: 'No image uploaded' });
//     }

//     const filename = `${Date.now()}-${req.file.originalname}`;
//     const filepath = path.join(__dirname, '..', 'upload', filename);
//     fs.writeFileSync(filepath, req.file.buffer);
//     const imageUrl = `${baseUrl}/upload/${filename}`;

//     // OCR using Google Vision API
//     const [result] = await client.textDetection({
//       image: { content: req.file.buffer },
//     });

//     const extractedText = result.textAnnotations?.[0]?.description || '';
//     const lines = extractedText.split('\n').map(l => l.trim()).filter(Boolean);

//     res.json({
//       imageUrl,
//       extractedText,
//       lines
//     });

//   } catch (error) {
//     console.error('Error scanning license:', error);
//     res.status(500).json({ error: 'Failed to process license image' });
//   }
// };
