# Variant Deploy

This takes the output of the awesome variant theme builder and deconstructs it into a set of HTML pages.

## To Run

1. Place the theme in a directory called theme - filename doenst matter, as long as it's in zip format.

1. Place the variant package for deploy in a directory called deploy.

1. Run `npm i && npm start`

1. Copy the ouput in dist.

## Development

```sh
nvm use

npm i

npm start

# For testing
rm -rf dist && npm start && npx serve dist
```
