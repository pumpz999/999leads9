export const API_CAPABILITIES = {
  XLOVECAM: {
    TOTAL_APIS: 6,
    CATEGORIES: [
      {
        name: 'Performer APIs',
        apis: [
          {
            name: 'Performer Filter List',
            endpoint: '/model/filterList/',
            description: 'Retrieve filtered list of performers',
            parameters: ['limit', 'category', 'country']
          },
          {
            name: 'Online Performers',
            endpoint: '/model/listonline/',
            description: 'Get currently online performers',
            parameters: ['limit', 'category']
          },
          {
            name: 'Performer Online Status',
            endpoint: '/model/checkisonline/',
            description: 'Check online status of specific performers',
            parameters: ['modelid']
          }
        ]
      },
      {
        name: 'Profile APIs',
        apis: [
          {
            name: 'Performer Profile Info',
            endpoint: '/model/getprofileinfo/',
            description: 'Retrieve detailed performer profiles',
            parameters: ['modelid']
          }
        ]
      },
      {
        name: 'SSO APIs',
        apis: [
          {
            name: 'SSO Register',
            endpoint: '/v1/sso/register/',
            description: 'Register new user through SSO',
            parameters: ['nickname', 'email']
          },
          {
            name: 'SSO Login',
            endpoint: '/v1/sso/login/',
            description: 'Login user through SSO token',
            parameters: ['token']
          }
        ]
      }
    ]
  }
};

export const PLATFORM_FEATURES = {
  PERFORMANCE_OPTIMIZATIONS: [
    'Lazy Loading',
    'Infinite Scroll',
    'Caching Mechanisms',
    'Responsive Design'
  ],
  UI_INTERACTIONS: [
    'Smooth Animations',
    'Hover Effects',
    'Transition Animations',
    'Interactive Components'
  ]
};
