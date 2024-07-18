# GalacticShooter

## 1. Install dependencies :

Navigate to the project repo directory.

Run:

`npm install`

assuming node installed in PC.

## 2. Run the development server:

Run:

`npm run dev`

This will run a server so game automatically opens in your default browser with browser-sync properties. It will also start a watch process, so you can change the source and the process will recompile and refresh the browser automatically.

### Webpack fix

Running `export NODE_OPTIONS=--openssl-legacy-provider` might be needed before `npm run start` due to `webpack` problem.

## 3. Contribution

+ **camelCase** for methods;
+ **snake_case** for variables;
+ **UpperCamelCase** for classes;
