module.exports = {
  PROVIDERS: [
    {
      name: 'XloveCam',
      endpoint: 'https://webservice-affiliate.xlovecam.com/model/filterList/',
      credentials: {
        affiliateId: process.env.XLOVECAM_AFFILIATE_ID || '',
        secretKey: process.env.XLOVECAM_SECRET_KEY || ''
      },
      fetchInterval: 3 * 60 * 1000, // 3 minutes
      active: true
    },
    {
      name: 'LiveJasmin',
      endpoint: 'https://api.livejasmin.com/v2/models',
      credentials: {
        apiKey: process.env.LIVEJASMIN_API_KEY || '',
        partnerId: process.env.LIVEJASMIN_PARTNER_ID || ''
      },
      fetchInterval: 5 * 60 * 1000, // 5 minutes
      active: false
    },
    {
      name: 'Chaturbate',
      endpoint: 'https://chaturbate.com/api/public/affiliates/',
      credentials: {
        username: process.env.CHATURBATE_USERNAME || '',
        apiKey: process.env.CHATURBATE_API_KEY || ''
      },
      fetchInterval: 4 * 60 * 1000, // 4 minutes
      active: false
    }
  ]
};
