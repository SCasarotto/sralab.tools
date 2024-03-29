# SRALab Tools

[sralab.tools](https://www.sralab.tools/) is a collection of helpful tools to save SRALab employees time. Please report any bugs or feature requests in the [issues tab](https://github.com/SCasarotto/sralab.tools/issues).

## Disclaimer

This code and tool is not associated with SRA Lab or any of its employees. It is provided as is, with no warranty or guarantee of any kind. Use at your own risk.

# Archived and Moved

These tools have been moved to a different repo and are hosted in a new location. You can find the code as apart of [casarotto.family](https://github.com/SCasarotto/casarotto.family).

## Deployment

After having run the `create-remix` command and selected "Vercel" as a deployment target, you only need to [import your Git repository](https://vercel.com/new) into Vercel, and it will be deployed.

If you'd like to avoid using a Git repository, you can also deploy the directory by running [Vercel CLI](https://vercel.com/cli):

```sh
npm i -g vercel
vercel
```

It is generally recommended to use a Git repository, because future commits will then automatically be deployed by Vercel, through its [Git Integration](https://vercel.com/docs/concepts/git).

## Development

To run your Remix app locally, make sure your project's local dependencies are installed:

```sh
npm install
```

Afterwards, start the Remix development server like so:

```sh
npm run dev
```

Open up [http://localhost:3000](http://localhost:3000) and you should be ready to go!

If you're used to using the `vercel dev` command provided by [Vercel CLI](https://vercel.com/cli) instead, you can also use that, but it's not needed.
