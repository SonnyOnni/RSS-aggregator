[![Actions Status](https://github.com/SonnyOnni/RSS-aggregator/workflows/hexlet-check/badge.svg)](https://github.com/SonnyOnni/RSS-aggregator/actions)
[![Maintainability](https://api.codeclimate.com/v1/badges/76ff6abd7d3f7bc201c5/maintainability)](https://codeclimate.com/github/SonnyOnni/RSS-aggregator/maintainability)
[![ESlint](https://github.com/SonnyOnni/RSS-aggregator/actions/workflows/eslint.yml/badge.svg)](https://github.com/SonnyOnni/RSS-aggregator/actions)

<p align="center">
  <a href="https://frontend-project-11-sigma.vercel.app/">
    <img alt="aggregator" src="src/img/example-img.png">
  </a>
</p>

# Description: 
**RSS aggregator** (or **RSS reader**) - the software could use the XML structure to present a neat display to the end users.

Subscribing to RSS feeds can allow a user to keep track of many different websites in a single news aggregator, which constantly monitor sites for new content, removing the need for the user to manually check them. 

Users subscribe to feeds by entering a feed's URI into the reader. The reader checks the user's feeds regularly for new information and can automatically download it.

## How to install:
1. Make sure you have installed [Node.js](https://nodejs.org/en/) no lower version 12: ```node -v```.
2. Clone repository: ```git@github.com:SonnyOnni/RSS-aggregator.git```.
3. Change directory to RSS-aggregator
4. Run the command: ```make install```.

```shell
$ git clone git@github.com:SonnyOnni/RSS-aggregator.git
$ cd RSS-aggregator
$ make install
```

This project has been created using **webpack-cli**, you can now run

```
npm run build
```

or

```
yarn build
```

to bundle your application
