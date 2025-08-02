# Cloud Server Deployment Configuration

## Server Details
- **Server IP**: 51.195.63.173
- **Portal URL**: http://51.195.63.173:3001
- **Hasura Console**: http://51.195.63.173:8080

## Auth0 Configuration
The production environment is configured with Auth0 development keys for testing purposes.

### Current Auth0 Settings:
```
AUTH0_CLIENT_ID=iEmpkVZQiKqdFwSygfwXypcR5NsXZCQO
AUTH0_CLIENT_SECRET=I0UlCuThD1pwHeEI-HYTmEPd8mOxNfVQWmJh4HizlP9upMMq7iqEKtrdcpu1yuyV
AUTH0_DOMAIN=dev-adu0fqt7s24qyp0g.us.auth0.com
AUTH0_AUDIENCE=https://dev-adu0fqt7s24qyp0g.us.auth0.com/api/v2/
AUTH0_BASE_URL=http://51.195.63.173:3001
AUTH0_ISSUER_BASE_URL=https://dev-adu0fqt7s24qyp0g.us.auth0.com
```

## Important Notes

### Development Keys Warning
The Auth0 configuration uses development keys (notice the `dev-` prefix in the domain). This will show a warning in Auth0:
> "One or more of your connections are currently using Auth0 development keys and should not be used in production."

### For Real Production Deployment
1. Create a production Auth0 tenant
2. Update the `.env` file with production credentials
3. Remove the `dev-` prefix from the domain
4. Configure proper callback URLs in Auth0

### Current Status
✅ **Working**: Application is running and accessible at http://51.195.63.173:3001
✅ **Auth0**: Redirecting to Auth0 login (with development keys)
✅ **Services**: All Docker services are healthy

## Access URLs
- **Main Application**: http://51.195.63.173:3001
- **Hasura Console**: http://51.195.63.173:8080
- **Database**: localhost:5432 (internal)
- **Redis**: localhost:6379 (internal) 