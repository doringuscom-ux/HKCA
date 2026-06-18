const axios = require('axios');
require('dotenv').config();

// We will add the actual Google Script URL from .env or directly once you generate it
const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL || 'YOUR_GOOGLE_SCRIPT_URL_HERE';

const sendViaProxy = async (to, subject, htmlContent) => {
    try {
        const response = await axios.post(GOOGLE_SCRIPT_URL, null, {
            params: {
                to: to,
                subject: subject,
                message: htmlContent
            }
        });

        if (response.data && response.data.success) {
            return { success: true };
        }
        return { success: false, error: response.data?.error || 'Unknown proxy error' };
    } catch (err) {
        return { success: false, error: err.message };
    }
};

const sendResolutionEmail = async (to, userName) => {
    const subject = 'Your Query has been Resolved - HKCA';

    // As per your required template
    const htmlContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 600px; margin: auto; line-height: 1.6;">
            <p>Dear ${userName},</p>
            <p>Thank you for visiting the Association’s website and submitting your query.</p>
            <p>We are pleased to inform you that the documents requested by you have been prepared and provided accordingly. Your request has been duly attended to and the matter now stands resolved.</p>
            <p>We appreciate your patience and cooperation.</p>
            <br/>
            <p>Best wishes</p>
            <p><strong>Haryana Kayaking and Canoeing Association</strong></p>
        </div>
    `;

    const result = await sendViaProxy(to, subject, htmlContent);
    if (result.success) {
        console.log(`[Email Service] Resolution email sent successfully to ${to}`);
        return true;
    } else {
        console.error(`[Email Service] Resolution email failed for ${to}:`, result.error);
        return false;
    }
};

module.exports = { sendResolutionEmail };
