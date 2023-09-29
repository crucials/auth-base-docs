import { DefaultTheme } from 'vitepress';

export default <DefaultTheme.Sidebar>[
    {
        text: 'Intro to Nest.js Auth Base',
        link: '/guide/get-started',
        collapsed: true,
        items: [
            {
                text: 'Install into your project',
                link: '/guide/get-started#install-into-your-project'
            },

            {
                text: 'Setting up the module',
                link: '/guide/get-started#setting-up-the-module'
            },

            {
                text: 'Learn more',
                link: '/guide/get-started#learn-more'
            }
        ]
    },

    {
        text: 'Using Prisma with Auth Base',
        collapsed: true,
        link: '/guide/prisma',
        items: [
            {
                text: 'Generate Prisma client',
                link: '/guide/prisma#generate-prisma-client'
            },

            {
                text: 'Create some services',
                link: '/guide/prisma#create-some-services'
            },

            {
                text: 'Register Auth Base module',
                link: '/guide/prisma#register-auth-base-module'
            },

            {
                text: 'Last steps',
                link: '/guide/prisma#last-steps'
            }
        ]
    }
]