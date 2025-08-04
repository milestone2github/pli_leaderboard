// export const authUrl = (state) => `https://accounts.zoho.com/oauth/v2/auth?response_type=code&client_id=${process.env.ZOHO_CLIENT_ID}&scope=profile,email,ZOHOPEOPLE.forms.ALL&redirect_uri=${process.env.ZOHO_REDIRECT_URI}&access_type=offline&state=${state}&prompt=consent`;
export const authUrl = (state) => `https://accounts.zoho.com/oauth/v2/auth?response_type=code&client_id=${process.env.ZOHO_CLIENT_ID}&scope=profile,email&redirect_uri=${process.env.ZOHO_REDIRECT_URI}&access_type=offline&state=${state}&prompt=consent`;

export const ZOHO_OAUTH_URL = "https://accounts.zoho.com/oauth/v2/token";

