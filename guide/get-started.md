---
prev: false
next:
  text: 'Using Prisma with Auth Base'
  link: '/guide/prisma'
---

# Intro to Nest.js Auth Base

:key: This is customizable module for JWT username-password authentication and authorization.

You don't need any adapters or additional modules to use your data-access tools. Just write a 
small service with your favorite ORM/instrument, library will handle the rest.

## Install into your project

::: tip Recommendations
Suggest creating a new Nest.js 10 app with [nest-cli](https://docs.nestjs.com/first-steps#setup)

Also Node version 16 or higher is recommended
:::

:::: code-group
```bash:no-line-numbers [npm]
$ npm install nest-auth-base
```

```bash:no-line-numbers [yarn]
$ yarn add nest-auth-base
```

```bash:no-line-numbers [pnpm]
$ pnpm install nest-auth-base
```
::::

## Setting up the module

Before you register this module, you should write some types and services, so Auth Base 
will know how to manage your accounts' datasource. Also you should know Nest.js fundamentals 
(_services, controllers, guards_).

Let's start with your account interface. Unique username and password are required. If you want to 
use roles guard, you must add the `roles` property. Obviously, it's allowed to have some other 
properties. For example, we added `reputation` field.

::: tip Note
You don't need to create account types if your database tool generates them by itself, like 
Prisma. Check out [our Prisma + Auth Base guide](/guide/prisma) 
:::

```typescript
export interface Account {
  username : string,
  password : string,
  roles : string[],
  reputation : number
}
```

Then, create a service that extends `AuthBaseAccountsService` and pass your account's type as generic.
Here you can query your database, in this example we'll just use an array.

```typescript
@Injectable()
export class AccountsService extends AuthBaseAccountsService<Account> {
    private readonly accounts : Account[]

    createAccount(credentials: ProcessedCredentials) {
        const newAccount : Account = {
            username: credentials.username,
            password: credentials.hashedPassword,
            roles: [ 'USER' ],
            reputation: 0 
        }

        this.accounts.push(newAccount)

        return newAccount
    }
    
    getAccountByUsername(username: string) {
        return this.accounts.find(account => account.username === username)
    }
}
```

::: warning Remember when injecting other services in accounts service
If you need inject something into accounts service, you must specify it 
in `imports` (_for modules_) or `providers` (_for services_) fields in module options
(_scroll down_)
:::

Now you can finally register the module with some options. It's global so you can just import it in app 
module and use guards everywhere.

```typescript
@Module({
    imports: [
        AuthBaseModule.register({
            accountsService: AccountsService,
            jwtSecretKey: 'YOUR_SECRET_KEY',
            imports: [ ... ] // Import modules you want to use in AccountsService
            providers: [ ... ] // Import services you want to use in AccountsService
        })
    ],
    controllers: [ AppController ],
})
export class AppModule {}
```

::: warning
It's strongly recommended to get your `jwtSecretKey` from your enviroment variables via 
[Nest.js config module](https://docs.nestjs.com/techniques/configuration)
:::

Now there are two endpoints available:

::: details POST /auth/sign-up
Accepts body in this format:

```json
{
    "username": "USERNAME",
    "password": "PASSWORD"
}
```
:::

::: details POST /auth/log-in
Accepts body in this format:

```json
{
    "username": "USERNAME",
    "password": "PASSWORD"
}
```
:::

To protect some endpoint, put a guard on it.

`AuthGuard` checks if user is authenticated by verifying JWT token in bearer-type `Authorization` 
header.

```typescript
@Controller()
export class AppController {
    @Get('me')
    @UseGuards(AuthGuard)
    async getAccount(@CurrentAccount() account : Account) {   
        return account
    }
}
```

`RolesGuard` checks if user is authenticated and has one of specified roles.

```typescript
@Controller()
export class AppController {
    @Get('me')
    @AllowedRoles('ADMIN', 'DEVELOPER')
    @UseGuards(RolesGuard)
    async getAccount(@CurrentAccount() account : Account) {   
        return account
    }
}
```

That's all now you have secured API.

## Learn more

- [Validate registration credentials (username and password)](/guide/sign-up-validation)
- [Using Prisma with Auth Base](/guide/prisma)