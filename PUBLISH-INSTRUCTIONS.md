# How to Publish react-smart-fetch to npm

## Step 1: Login to npm
Run this command and follow the prompts:
```bash
npm login
```

You have two options:
1. **Browser login**: Press ENTER to open browser and login via web
2. **Command line**: Enter your npm username, password, and email

## Step 2: Verify login
```bash
npm whoami
```
This should display your npm username.

## Step 3: Publish the package
```bash
npm publish
```

## Step 4: Verify publication
```bash
npm view react-smart-fetch
```

## Alternative: Publish with scoped name
If "react-smart-fetch" is taken (unlikely), you can publish with your username:
```bash
# Update package name in package.json to @yourusername/react-smart-fetch
npm publish --access public
```

## What happens after publishing:
1. Your package will be available at: https://www.npmjs.com/package/react-smart-fetch
2. Users can install it with: `npm install react-smart-fetch`
3. You can update it later by incrementing version and running `npm publish` again

## Troubleshooting:
- **Name taken**: Change package name in package.json
- **Login issues**: Try `npm logout` then `npm login` again
- **Permission issues**: Make sure you're logged in with correct account

## After successful publishing:
Your package will be live and installable by anyone using:
```bash
npm install react-smart-fetch
```