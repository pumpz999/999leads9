export const API_CONFIGURATIONS = {
  XLOVECAM: {
    BASE_URL: 'https://webservice-affiliate.xlovecam.com',
    ENDPOINTS: {
      PERFORMER_FILTER: '/model/filterList/',
      PERFORMER_ONLINE: '/model/listonline/',
      PERFORMER_ONLINE_CHECK: '/model/checkisonline/',
      PERFORMER_PROFILE: '/model/getprofileinfo/',
      SSO_REGISTER: '/v1/sso/register/',
      SSO_LOGIN: '/v1/sso/login/'
    },
    DEFAULT_PARAMS: {
      AUTH_SERVICE_ID: '2',
      LANGUAGE: 'en'
    }
  }
}

export const DEFAULT_AFFILIATE_CONFIG = {
  affiliateId: '24010',
  secretKey: 'd87ac7785760d9190ca3b4d366980ec2',
  endpoint: 'https://webservice-affiliate.xlovecam.com'
}
