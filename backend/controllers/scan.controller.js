const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const path = require('path');
const vision = require('@google-cloud/vision');

// Initialize client
const client = new vision.ImageAnnotatorClient({
  keyFilename: './service-account-key.json'
});

require('dotenv').config();

// Initialize AWS S3 SDK v3
const s3 = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1', // Region
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});








exports.scanCheck = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image uploaded' });

    // Generate a unique filename for the uploaded image
    const filename = `${Date.now()}-${req.file.originalname}`;

    // Upload image to S3
    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET, // Make sure your bucket name is in the environment variables
      Key: filename,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };

    const s3UploadResult = await s3.send(new PutObjectCommand(uploadParams));

    // Construct image URL from S3
    const imageUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`;

    const [result] = await client.textDetection({
      image: { content: req.file.buffer },
    });

    const extractedText = result.fullTextAnnotation?.text || '';
    if (!extractedText) {
      return res.status(400).json({ error: 'No text extracted from image' });
    }

    const payeePatterns = [
      /Pay\s+to\s+the\s+order\s+of\s+([\w\s\.\-&']+)/i,
      /TO\s+THE\s+ORDER\s+OF:?\s+[\s\S]*?\n([\w\s\.\-&']+)/i,
      /Order\s+Of:?\s+Amount:\s+([\w\s\.\-&']+)/i,
      /TO\s+THE\s+ORDER\s*\n([\w\s\.\-&']+)\nOF/i,
      /Order\s+Of:\s+([\w\s\.\-&']+)/i,
      /\n([A-Z][\w\s\.\-&']{2,})\nTO\s+THE\s+ORDER/i
    ];
    // Try to find any payee name using the variations
    let payeeText = '';
    for (let pattern of payeePatterns) {
      const match = extractedText.match(pattern);
      if (match) {
        payeeText = match[1].trim();
        break;
      }
    }

    let customerName = payeeText || 'Unknown Customer';

    customerName = customerName.replace(/P\.?O\.? BOX[\w\s\-\.]+/, '').trim();

    const lines = customerName.split('\n').map(line => line.trim()).filter(line => line);

    const fullNameLine = lines[0] || '';

    const nameParts = fullNameLine.split(' ').filter(part => part);

    const customerFirstName = nameParts[0] || '';
    const customerLastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
    const customerMiddleName = nameParts.length > 2
      ? nameParts.slice(1, nameParts.length - 1).join(' ')
      : '';

    // === Amount Numeric ===
    const amountMatch = extractedText.match(/\$?\s?(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2}))/);

    const amountNumeric = amountMatch ? amountMatch[1].replace(',', '') : '';

    // === Amount in Words ===
    const amountWordsMatch = extractedText.match(/([A-Z][a-zA-Z\s\-]+(?:\s+and\s+\d{1,2}\/100)?)\s+(DOLLARS|AMOUNT)/i);
    const amountWords = amountWordsMatch ? amountWordsMatch[1].trim() + ' DOLLARS' : '';

    // === Date ===
    const dateMatch = extractedText.match(/(?:DATE|Dated)[:\s]*([0-9]{1,2}\/[0-9]{1,2}\/[0-9]{2,4})/i) ||
      extractedText.match(/([0-9]{1,2}\/[0-9]{1,2}\/[0-9]{2,4})/);
    const date = dateMatch ? dateMatch[1] : '';

    const parsedData = {
      imageUrl,
      customerName: customerName,
      customerFirstName,
      customerMiddleName,
      customerLastName,
      amountNumeric,
      amountWords,
      date,
      payee: '',
      memo: '',
      company: '',
      checkType: '',
      extractedText,
    };

    res.json(parsedData);

  } catch (error) {
    console.error('Error during scan:', error);
    res.status(500).json({ error: error.message });
  }
};


exports.scanLicense = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    // Generate a unique filename for the uploaded image
    const filename = `${Date.now()}-${req.file.originalname}`;

    // Upload image to S3
    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET, // Make sure your bucket name is in the environment variables
      Key: filename,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };

    const s3UploadResult = await s3.send(new PutObjectCommand(uploadParams));

    // Construct image URL from S3
    const imageUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`;

    // OCR using Google Vision API
    const [result] = await client.textDetection({
      image: { content: req.file.buffer },
    });

    const extractedText = result.textAnnotations?.[0]?.description || '';
    console.log('Extracted Text:', extractedText);

    // Regex patterns for data fields
    const nameMatch = extractedText.match(/(?:1\s+)?SAMPLE\s+([A-Z]+\s+[A-Z]+)/i);

    const licensePatterns = [
      /DL\s*No\.?:?\s*([\dA-Z\-]+)/i,
      /License\s*No\.?:?\s*([\dA-Z\-]+)/i,
      /DL\s*#\s*([\dA-Z\-]+)/i,
      /Driver(?:'s)?\s*License\s*Number[:\s]*([\dA-Z\-]+)/i,
      /DMV\s*ID\s*Number[:\s]*([\dA-Z\-]+)/i,
      /DLN[:\s]*([\dA-Z\-]+)/i
    ];

    let licenseNo = '';
    for (let pattern of licensePatterns) {
      const match = extractedText.match(pattern);
      if (match) {
        licenseNo = match[1].replace(/\s+/g, '').trim();
        break;
      }
    }

    const classMatch = extractedText.match(/CLASS[:\s]+([A-Z]+)/i);
    const dobMatch = extractedText.match(/DOB[:\s]+(\d{2}\/\d{2}\/\d{4})/i);
    const sexMatch = extractedText.match(/SEX[:\s]+([MF])/i);
    const eyesMatch = extractedText.match(/EYES[:\s]+([A-Z]+)/i);
    const heightMatch = extractedText.match(/(?:HT|HGT)[:\s]+([\d\-\'"]+)/i);
    const issuedMatch = extractedText.match(/(?:ISSUED|ISS)[:\s]+(\d{2}\/\d{2}\/\d{4})/i);
    const expiresMatch = extractedText.match(/(?:EXPIRES|EXP)[:\s]+(\d{2}\/\d{2}\/\d{4})/i);
    const addressMatch = extractedText.match(/(?:\d+\s+[A-Z0-9\s]+(?:APT\.?\s*\d*)?,?\s+[A-Z\s]+,\s+[A-Z]{2}\s+\d{5})/i);

    const parsedLicense = {
      imageUrl,
      name: nameMatch?.[1]?.trim() || '',
      licenseNo: licenseNo || '',
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
    res.status(500).json({ error: error.message });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image uploaded' });
    }

    const fileName = `${Date.now()}-${req.file.originalname}`;
    const fileContent = Buffer.from(req.file.buffer, 'binary'); // Get file content from buffer

    // Check if the bucket name is correctly set
    const bucketName = process.env.AWS_S3_BUCKET;
    if (!bucketName) {
      return res.status(500).json({ success: false, message: 'Bucket name is missing in environment variables' });
    }

    // Set up S3 upload parameters
    const params = {
      Bucket: bucketName, // Make sure the bucket name is correctly passed
      Key: `images/${fileName}`, // File path and name within the bucket
      Body: fileContent, // The content of the file
      ContentType: req.file.mimetype, // Set the MIME type for the file

    };

    // Upload the image to S3 using PutObjectCommand
    const command = new PutObjectCommand(params);
    const s3Response = await s3.send(command);

    // Image URL
    const imageUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/images/${fileName}`;

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        filename: fileName,
        imageUrl
      }
    });

  } catch (error) {
    console.error('Error uploading image to S3:', error);
    res.status(500).json({ success: false, message: 'Failed to upload image' });
  }
};


