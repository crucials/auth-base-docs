---
prev: 
  text: 'Intro to Nest.js Auth Base'
  link: '/guide/get-started'
next: false
---

::: tip Before you start reading this page
Recommend reading the [introduction article](/guide/get-started) first
:::

# Using Prisma with Auth Base

Since account creation/querying is in your control, it's easy.

## Generate Prisma client

Firstly, you need to setup Prisma ([_guide_](https://www.prisma.io/docs/getting-started/quickstart)).
Your account model in schema file must contain unique username and password columns. We also added an 
additional `reputation` field. 

Include `roles` column if you need authorization (_role-based access_).

```prisma
model Account {
  id Int @id @default(autoincrement())
  username String @unique
  password String
  roles Role[]
  reputation Int
}

enum Role {
  USER
  ADMIN
}
```

After that, [generate your Prisma client](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases/install-prisma-client-typescript-postgresql).

## Create some services

To use Prisma client via dependency injection, you need to create a service named like `PrismaService` and extend
`PrismaClient`

```typescript
@Injectable()
export class PrismaService extends PrismaClient {}
```

Now, you need to write a service that extends `AuthBaseAccountsService`. Pass Prisma-generated type as 
generic and inject our prisma service

```typescript
type Account = Prisma.AccountCreateInput

@Injectable()
export class AccountsService extends AuthBaseAccountsService<Account> {
    constructor(private readonly prismaService : PrismaService) {
        super()
    }

    async createAccount(credentials: ProcessedCredentials) {
        const newAccount : Account = {
            username: credentials.username,
            password: credentials.hashedPassword,
            roles: [ 'USER' ],
            reputation: 0 
        }

        await this.prismaService.account.create({ data: newAccount })

        return newAccount
    }
    
    async getAccountByUsername(username: string) {
        const foundAccount = await this.prismaService.account.findUnique({
            where: {
                username: username
            }
        })

        return foundAccount
    }
}
```

## Register Auth Base module

As it was said in [introduction](/guide/get-started), if you need to use some services in Auth Base 
components (_for example, accounts service_) you must specify them in `imports` (_for modules_) 
or `providers` (_for services_) fields in module options. In our case we have just service, so place
it in `providers`.

```typescript
@Module({
    imports: [
        AuthBaseModule.register({
            accountsService: AccountsService,
            jwtSecretKey: 'YOUR_SECRET_KEY',

            providers: [ PrismaService ]
        })
    ],
    providers: [ PrismaService ],
    controllers: [ AppController ],
})
export class AppModule {}
```

## Last steps

You're all set. Now, add guards to some endpoint.

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