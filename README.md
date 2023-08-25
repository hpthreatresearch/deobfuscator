# Modular JavaScript Deobfuscator

_We are looking for a better name_


This tool is a simple web app for deobfuscating JavaScript code using a library of modules. You can choose and configure what modules you want for a given task. Every module comes with a comprehensive documentation and example. When you are happy with your work, you can save it as a JSON and share it.

The tool is designed for all levels. From familiarizing yourself with the different modules on small code snippets, stepping through recipes to writing your own modules, this tool has you covered. 

This tool was heavily inspired by [CyberChef](https://github.com/gchq/CyberChef).

## Disclaimer

> Before using this tool please make sure you have the legal rights and permissions to modify or deobfuscate the code.
> Use this tool responsibly and in compliance with all local laws, regulations and copyright restrictions.
> The tool is provided "as is" and we do not guarantee its accuracy or effectiveness.

## Usage

[Check out the demo](https://pages.github.com/hpthreatresearch/deobfuscator/)

This tool is still under active development.  There is still testing and bug fixing to do, new features to be added and additional documentation to write. Please contribute!

### Running the web client

> ⚠ This tool was made to deobfuscate malware in a dedicated VM.
> It has multiple security risks and deobfuscating code with this tool can compromise your machine.

You can clone this repo using `git clone https://github.com/hpthreatresearch/deobfuscator.git`.

You will then need to install all the dependencies using `npm install`.

To run the web client run `npm start`.

### Running from the command line

TODO: Not supported but a planned feature

### Creating new modules

To create a new module, after cloning the module and installing the dependencies,  run `npm run new` and follow the onscreen instructions.

You are highly encouraged to create documentation as you go for your modules, **especially if you intend on sharing them**.

If you do not like the default components, check out the `target/replace-expression` module to see how to add your own component for your module.

## Contributing

Looking to contribute ? Great 😊.

Please leave us a PR.

### Where to start ?

If you do not kow where to start, look out for `TODO:`, `HACK:` and `FIXME:` tags.

There is also a `Todo.md` file with planned features.

They range in difficulty from _"I felt lazy"_ to _"I'm going to let someone smarter figure this out"_.
