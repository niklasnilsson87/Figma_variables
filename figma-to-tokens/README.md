# Figma variables to Design Token (W3C)

First attempt to fetch Figma local variables and turn them into Design tokens in
W3C format.

inspired by figmas own code for fetching variables
[variables-github-action-example](https://github.com/figma/variables-github-action-example)

## Setup

- Deno runtime
  - installation [Deno](https://docs.deno.com/runtime/)

## Environment

The application requires two environment variables whitch can be found in the
`.example.env` file. It need an
[access token](https://www.figma.com/developers/api#access-tokens) and one file
token.

### deno commands

- `deno install`
- `deno task start`

### deno format & lint

- `deno lint`
- `deno format`
