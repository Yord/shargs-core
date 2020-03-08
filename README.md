![shargs teaser][teaser]

🦈 Shargs (**sh**ell **args**) is a highly customizable and extensible command-line arguments parser.

[![node version][shield-node]][node]
[![npm version][shield-npm]][npm-package]
[![license][shield-license]][license]
[![PRs Welcome][shield-prs]][contribute]
[![linux unit tests status][shield-unit-tests-linux]][actions]
[![macos unit tests status][shield-unit-tests-macos]][actions]
[![windows unit tests status][shield-unit-tests-windows]][actions]

## Installation

Installation is done using [`npm`][npm-install].

```bash
$ npm i --save shargs
```

## Features

+   **Declarative:** Describe command-line options using a declarative DSL and derive parsers and usage from that.
+   **Predefined Parsers:** Choose between many predefined parsers.
+   **Modular Parsers:** Compose your own parsers by combining predefined parser functions with your own functions.
+   **Predefined Usage Texts:** Choose between many predefined usage documentation templates.
+   **Modular Usage Texts:** Build your own usage documentation template using a high-level DSL.

## Getting Started

<details>
<summary>
Describe command-line options:

<p>

```js
const opts = [
  string('question', ['-q', '--question'], {desc: 'A question.'}),
  number('answer', ['-a', '--answer'], {desc: 'The (default) answer.', only: [42]}),
  flag('help', ['-h', '--help'], {desc: 'Print this help message and exit.'})
]
```

</p>
</summary>

Shargs provides a DSL for declaring command-line options.
This example uses three different shargs type constructors:
`string`, `number`, and `flag`.

Type constructors are only syntactic sugar.
In fact, `opts` could have also been written as:

```js
const opts = [
  {key: 'question', types: ['string'], args: ['-q', '--question'], desc: 'A question.'},
  {key: 'answer', types: ['number'], args: ['-a', '--answer'], desc: 'The (default) answer.', only: [42]},
  {key: 'help', types: [], args: ['-h', '--help'], desc: 'Print this help message and exit.'}
]
```

</details>

<details>
<summary>
Declare a parser:

<p>

```js
const deepThought = parser({
  argv: [splitShortOptions],
  opts: [cast, restrictToOnly],
  args: [emptyRest]
})
```

</p>
</summary>

Parsers have three different stages:
`argv`, `opts`, and `args`.
Each stage takes several parser functions that are used to transform input in the order they are defined.
Two special stages transform data between the three stages:
`toOpts` and `toArgs`.
These two stages take exactly one parser function that is predefined, but can also be passed by the user.

The `deepThought` parser consists of six parser functions that are applied in the following order:

1.  `splitShortOptions`
2.  `toOpts` (is called after `argv` and before `opts`)
3.  `cast`
4.  `restrictToOnly`
5.  `toArgs` (is called after `opts` and before `args`)
6.  `removeRest`

</details>

<details>
<summary>
Declare a usage documentation:

<p>

```js
const docs = usage([
  synopsis('deepThought'),
  space,
  optsList,
  space,
  note(
    'Deep Thought was created to come up with the Answer to ' +
    'The Ultimate Question of Life, the Universe, and Everything.'
  )
])
```

</p>
</summary>

Every command-line tools benefits from a well-formatted usage documentation.
Shargs brings its own DSL for defining one that can easily be extended with user functions.
The DSL is declarative, which means it describes the desired structure without concerning itself with the details.
Try changing `optsList` to `optsDefs` later to experience of what this means:

```js
const docs = usage([
  synopsis('deepThought'),
  space,
  optsDefs,
  space,
  note(
    'Deep Thought was created to come up with the Answer to ' +
    'The Ultimate Question of Life, the Universe, and Everything.'
  )
])
```

</details>

<details>
<summary>
Style the usage documentation:

<p>

```js
const style = {
  line: {width: 80},
  cols: [{width: 20}, {width: 60}]
}
```

</p>
</summary>

Supplying `opts` and a `style` to `docs` renders a help text.

```js
const help = docs(opts)(style)
```

The style defines how the help is layouted.
With the current style, the following is rendered:

```bash
deepThought [-q|--question] [-a|--answer] [-h|--help]                           
                                                                                
-q, --question      A question. [string]                                        
-a, --answer        The (default) answer. [number]                              
-h, --help          Print this help message and exit. [flag]                    
                                                                                
Deep Thought was created to come up with the Answer to The Ultimate Question of 
Life, the Universe, and Everything.
```

You may experiment with `style` to get the result you like.
E.g. you may want to change the style to the following:

```js
const style = {
  line: {width: 40},
  cols: [{width: 10, padEnd: 2}, {width: 28}]
}

const help = docs(opts)(style)
```

`help` now reads:

```bash
deepThought [-q|--question]
            [-a|--answer] [-h|--help]

-q,         A question. [string]
--question
-a,         The (default) answer.
--answer    [number]
-h, --help  Print this help message and
            exit. [flag]

Deep Thought was created to come up with
the Answer to The Ultimate Question of
Life, the Universe, and Everything.
```

Note, how shargs automatically takes care of line breaks and other formatting for you.

</details>

<details>
<summary>
Use the parser and the usage documentation in your program:

<p>

```js
// node index.js --unknown -ha 42
const argv = ['--unknown', '-ha', '42']

const {errs, args} = deepThought(opts)(argv)

const help = docs(opts)(style)

if (args.help) {
  console.log(help)
} else {
  console.log('The answer is: ' + args.answer)
}
```

</p>
</summary>

Parsing `argv` returned the following `args`:

```json
{"help": true, "answer": 42, "_": []}
```

Note, that `help` is `true`.
Other command-line argument parsers would now display usage documentation for you.
Shargs leaves that to the user, giving him more control.

Our program reads:
If `args` contains a `help` field, the `help` text is printed:

```bash
deepThought [-q|--question] [-a|--answer] [-h|--help]                           
                                                                                
-q, --question      A question. [string]                                        
-a, --answer        The (default) answer. [number]                              
-h, --help          Print this help message and exit. [flag]                    
                                                                                
Deep Thought was created to come up with the Answer to The Ultimate Question of 
Life, the Universe, and Everything.
```

Otherwise, the answer is printed.

</details>

## 🦈 Shargs

Shargs is the command-line argument parser used by [`pxi`][pxi].

### Command-Line Options DSL

The most important concept in shargs is that of command-line options.
They are the basis for parsers as well as for usage documentation.
Command-line options are defined as objects in shargs: 

```js
const askOpts = [
  {key: 'question', types: ['string'], args: ['-q', '--question'], desc: 'A question.'},
  {key: 'help', types: [], args: ['-h', '--help'], desc: 'Print this help message and exit.'}
]
```

Command-line options may have the following fields (\* these fields are required):

| Field     | Value                                                                                  | Default | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
|-----------|----------------------------------------------------------------------------------------|---------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `key`\*   | string                                                                                 |         | The command-line option's value is assigned to a key of this name.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `args`\*  | array of strings                                                                       |         | A list of options that may be used to set the command-line option.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `types`\* | `['string']`, `['number']`, `['bool']`, `[]`, `null`, `['string','number','bool',...]` |         | <ul><li>`['string']` takes exactly one string.</li><li>`['number']` takes exactly one number.</li><li>`['bool']` takes exactly one boolean, `true` or `false`.</li><li>`[]` takes no value. It is a flag that is `true` if used and `false` if not used.</li><li>`null` is a command. It may have its own list of arguments (see `opts`) and is terminated by either `--` or a line ending.</li><li>`['number','string','bool',...]` takes an array of any types of arbitrary length. The values are expected to be in the specified order and of the specified type.</li></ul> |
| `desc`    | string                                                                                 | `''`    | Description of the command-line option for use in the usage text.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `only`    | array of values                                                                        | `null`  | The command-line option's value can only be one of the values in this list. If `only` is `null`, the value may be set freely.                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `opts`    | command-line options array                                                             | `null`  | This field is used if the command-line option is a command (if `types` is `null`) to describe the command's options.                                                                                                                                                                                                                                                                                                                                                                                                                                                            |

#### Functional Options DSL

Since writing out objects is repetetive, shargs includes a DSL for creating command-line options:

```js
const opts = [
  command('ask', ['ask'], {desc: 'Just ask.', opts: askOpts}),
  number('answer', ['-a', '--answer'], {desc: 'The (default) answer.', only: [42]}),
  flag('help', ['-h', '--help'], {desc: 'Print this help message and exit.'})
]
```

Each supported type has its own function, that takes `key` and `args` as arguments
as well as an object holding any optional field.
If an optional field is left out, the type functions sets a sensible default.

| Function                          | Description                                                |
|-----------------------------------|------------------------------------------------------------|
| `array(types)(key, args, fields)` | Assigns `types`, `key`, and `args` to `fields`.            |
| `bool(key, args, fields)`         | Assigns `types: ['bool']`, `key` and `args` to `fields`.   |
| `command(key, args, fields)`      | Assigns `types: null`, `key` and `args` to `fields`.       |
| `flag(key, args, fields)`         | Assigns `types: []`, `key` and `args` to `fields`.         |
| `number(key, args, fields)`       | Assigns `types: ['number']`, `key` and `args` to `fields`. |
| `string(key, args, fields)`       | Assigns `types: ['string']`, `key` and `args` to `fields`. |

While the `array` function describes arrays with a known length and known types,
the `command` function describes variable-length string arrays.
If a command has an `opts` field, the string array is treated as command-line arguments.

### Command-Line Parsers DSL

A shargs command-line parser is a composition of parser functions:

```js
function deepThought (opts) {
  return argv => pipe(
    splitShortOptions,
    toOpts(combine(...opts.map(option)).args),
    cast,
    restrictToOnly,
    toArgs(deepThought),
    emptyRest
  )({argv})
}
```

There are five stages of parser functions:

1.  `argv` functions modify arrays of command-line arguments.
2.  `toOpts` transforms `argv` arrays into the command-line option DSL and adds a `values` field.
3.  `opts` functions modify command-line options.
4.  `toArgs` transforms `opts` into an object of `key` / `values` pairs.
5.  `args` functions modify `args` objects.

The stages must always be applied in the given order,
while functions from the same stage may be supplied in any order that makes sense for the parser.
The following parser functions are available:

| Stage    | Plugin&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Description |
|----------|-----------------------------------|-----------------------------------------------------------------------------------------------------------------|
| `argv`   | `splitShortOptions({errs, argv})` | Splits argument groups of shape `-vs` to `-v -s`. Only works if the arguments are preceded by a single dash.    |
| `toOpts` | `toOpts(args)({errs, argv})`      | Transforms `argv` arrays into the command-line option DSL and adds a `values` field.                            |
| `opts`   | `cast(opts)`                      | Casts all `values` according to the options' types.                                                             |
| `opts`   | `restrictToOnly(opts)`            | Records an error if the `values` are not contained in the `only` list.                                          |
| `toArgs` | `toArgs(parser)({errs, argv})`    | Transforms `opts` into an object of `key` / `values` pairs.                                                     |
| `args`   | `emptyRest(args)`                 | Removes all entries from the `_` key.                                                                           |

#### Functional Parsers DSL

The functional parser DSL takes care of applying parser stages in the correct order under the hood.
It also passes on errors for you:

```js
const deepThought = parser({
  argv: [splitShortOptions],
  opts: [cast, restrictToOnly],
  args: [emptyRest]
})
```

### Usage Documentation

Every decent command-line tools has a usage documentation.
The `deepThought` tool is no exception and could e.g. show the following text if the `--help` flag is present:

```bash
deepThought ask [-q|--question] [-h|--help]                                     
                                                                                
-q, --question      A question. [string]                                        
-h, --help          Print this help message and exit. [flag]                    
                                                                                
Deep Thought was created to come up with the Answer to The Ultimate Question of 
Life, the Universe, and Everything. 
```

Writing the usage documentation yourself is not a good idea,
because you would have to update it every time a command-line option is added or changed.
This is why shargs takes care for writing usage documentation for you.

#### Layout Documentation DSL

Shargs uses its own markup language for formatting text in the terminal called layout functions DSL.
The `deepThought ask` documentation could be written as follows in layout syntax:

```js
const askDocs = layout([
  text('deepThought ask [-q|--question] [-h|--help]'),
  br,
  table([
    ['-q, --question', 'A question. [string]'],
    ['-h, --help', 'Print this help message and exit. [flag]']
  ]),
  br,
  text(
    'Deep Thought was created to come up with the Answer to ' +
    'The Ultimate Question of Life, the Universe, and Everything.'
  )
])
```

Shargs includes the following layout functions:

<table>
<tr>
<th>Layout&nbsp;Function&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
<th>Description (and Example)</th>
</tr>
<tr>
<td><code>br(style)</code><br /><code>brFrom(id)(style)</code></td>
<td>
<details>
<summary>
Introduces a single blank line.
</summary>

<br />

```js
const br = brFrom('line')
```

Example:

```js
const style = {
  line: {width: 40}
}

layout([
  line('First line'),
  br,
  line('Last line')
])(style)
```

Result:

```bash
First line                              
                                        
Last line                               
```

</details>
</td>
</tr>
<tr>
<td><code>brs(length)(style)</code><br /><code>brsFrom(id)(length)(style)</code></td>
<td>
<details>
<summary>
Introduces several blank lines with the number defined by the length parameter.
</summary>

<br />

```js
const brs = brsFrom('line')
```

Example:

```js
const style = {
  line: {width: 40}
}

layout([
  line('First line'),
  brs(2),
  line('Last line')
])(style)
```

Result:

```bash
First line                              
                                        
                                        
Last line                               
```

</details>
</td>
</tr>
<tr>
<td><code>cols(columns)(style)</code><br /><code>colsFrom(id)(columns)(style)</code></td>
<td>
<details>
<summary>
Takes a list of columns with each column consisting of several strings.
Prints the first column at the left and the last column at the right.
The style parameter must have a <code>cols</code> id with a number of style objects equal to the number of columns.
If a column string is longer than a column's width, it is cut off.
</summary>

<br />

```js
const cols = colsFrom('cols')
```

Example:

```js
const style = {
  cols: [
    {width: 15},
    {width: 25}
  ]
}

cols([
  [
    '-h, --help',
    '-v, --version'
  ],
  [
    'Prints the help.',
    'Prints the version.'
  ]
])(style)
```

Result:

```bash
-h, --help     Prints the help.         
-v, --version  Prints the version.      
```

</details>
</td>
</tr>
<tr>
<td><code>line(string)(style)</code><br /><code>lineFrom(id)(string)(style)</code></td>
<td>
<details>
<summary>
Prints the string with a line break at the end.
Takes the line width from style and pads with spaces at the end.
If the string is too long to fit the line's width, it is cut off.
</summary>

<br />

```js
const line = lineFrom('line')
```

Example:

```js
const style = {
  line: {width: 40}
}

line('A line')(style)
```

Result:

```bash
A line                              
```

</details>
</td>
</tr>
<tr>
<td><code>lines(strings)(style)</code><br /><code>linesFrom(id)(strings)(style)</code></td>
<td>
<details>
<summary>
Prints several strings using the <code>line</code> function for each.
</summary>

<br />

```js
const lines = linesFrom('line')
```

Example:

```js
const style = {
  line: {width: 40}
}

lines([
  'First line',
  'Last line'
])(style)
```

Result:

```bash
First line                              
Last line                               
```

</details>
</td>
</tr>
<tr>
<td><code>defs(rowsList)(style)</code><br /><code>defsFrom(id1, id2)(rowsList)(style)</code></td>
<td>
<details>
<summary>
Takes a list of title/desc row pairs.
Prints the title as a <code>text</code> before printing the desc as a <code>text</code>.
Title and text may be assigned different style ids.
</summary>

<br />

```js
const defs = defsFrom('line', 'desc')
```

Example:

```js
const style = {
  line: {width: 40},
  desc: {padStart: 4, width: 36}
}

defs([
  [
    '-h, --help',
    'Prints the help.'
  ],
  [
    '-v, --version',
    'Prints the version.'
  ]
])(line)
```

Result:

```bash
-h, --help                              
    Prints the help.                    

-v, --version                           
    Prints the version.                 
```

</details>
</td>
</tr>
<tr>
<td><code>table(rowsList)(style)</code><br /><code>tableFrom(id)(rowsList)(style)</code></td>
<td>
<details>
<summary>
Takes a rows list with each row holding a number of strings equal to the number of columns.
The style parameter must have a <code>cols</code> key with a number of style objects equal to the number of columns.
The strings in each row are formatted according to the defined columns.
If a string surpasses the width of a column, its remaining words are printed in the following rows.
</summary>

<br />

```js
const table = tableFrom('cols')
```

Example:

```js
const style = {
  cols: [
    {width: 10, padEnd: 2},
    {width: 28}
  ]
}

table([
  [
    '-v, --version',
    'Prints the version.'
  ],
  [
    '-h, --help',
    'Prints the help.'
  ]
])(style)
```

Result:

```bash
-v,         Prints the version.         
--version                                    
-h, --help  Prints the help.            
```

</details>
</td>
</tr>
<tr>
<td><code>text(string)(style)</code><br /><code>textFrom(id)(string)(style)</code></td>
<td>
<details>
<summary>
Text acts much like <code>line</code>, but does not cut off strings that surpass a line's width.
Instead, it splits the string by words and adds new lines with the remaining words.
</summary>

<br />

```js
const text = textFrom('line')
```

Example:

```js
const style = {
  line: {width: 40}
}

text(
  'Deep Thought was created to come up with the Answer.'
)(style)
```

Result:

```bash
Deep Thought was created to come up with
the Answer.                             
```

</details>
</td>
</tr>
<tr>
<td><code>texts(strings)(style)</code><br /><code>textsFrom(id)(strings)(style)</code></td>
<td>
<details>
<summary>
Takes several strings and applies the <code>text</code> function to each.
</summary>

<br />

```js
const texts = textsFrom('line')
```

Example:

```js
const style = {
  line: {width: 40}
}

texts([
  'Deep Thought was created to come up with the Answer.',
  'To The Ultimate Question.'
])(style)
```

Result:

```bash
Deep Thought was created to come up with
the Answer.                             
To The Ultimate Question.
```

</details>
</td>
</tr>
</table>

Layout functions can be combined with the following layout combinators:

<table>
<tr>
<th>Layout&nbsp;Combinator&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
<th>Description (and Example)</th>
</tr>
<tr>
<td><code>layout(functions)(style)</code></td>
<td>
<details>
<summary>
Groups several layout DSL functions together.
</summary>

<br />

Example:

```js
const style = {
  line: {width: 40}
}

layout([
  line('First line'),
  line('Last line')
])(style)
```

Result:

```bash
First line                              
Last line                               
```

</details>
</td>
</tr>
<tr>
<td><code>layoutMap(f)(itemsList)(style)</code></td>
<td>
<details>
<summary>
Takes a list of strings and a function <code>f</code>,
which is applied to each string and is expected to return a layout function.
The strings are then formatted according to f.
</summary>

<br />

Example:

```js
const style = {
  line: {width: 40},
  desc: {padStart: 3, width: 37}
}

const itemsList = [
  [
    '-h, --help',
    'Prints the help.'
  ],
  [
    '-v, --version',
    'Prints the version.'
  ]
]

const f = ([title, desc]) => [
  text(title),
  textFrom('desc')(desc)
]

layoutMap(f)(itemsList)(style)
```

Result:

```bash
-h, --help                              
   Prints the help.                     
-v, --version                           
   Prints the version.                  
```

</details>
</td>
</tr>
</table>

#### Style DSL

Note how all DSL functions take a style argument as last parameter.
The following is a minimum definition of `style` for `deepThought`:

```js
const style = {
  line: {width: 80},
  cols: [{width: 20}, {width: 60}]
}
```

It defines style objects for two ids: `line` and `cols`.
These two ids are used internally by the layout functions to decide, how lines and columns should be printed.
A style object may have the following parameters:

| Parameter  | Type   | Description                                                     |
|------------|--------|-----------------------------------------------------------------|
| `padEnd`   | number | Defines a padding to the right of a line.                       |
| `padStart` | number | Defines a padding to the left of a line.                        |
| `width`    | number | Defines the length of a line before a line break is introduced. |

While `line` and `cols` are the default ids, any valid key may be used as an id.
In order to connect layout functions to a different id than the default,
pass it as a string to the `id` parameter of any `*From` function.

#### Usage Documentation DSL

The usage DSL extends the layout DSL by providing functions that have access to command-line options.
Using this DSL makes defining usage documentation for command-line options very declarative:

```js
const docs = usage([
  synopsis('deepThought'),
  space,
  optsList,
  space,
  note(
    'Deep Thought was created to come up with the Answer to ' +
    'The Ultimate Question of Life, the Universe, and Everything.'
  )
])
```

Note how the usage DSL needs notably less code than the layout DSL,
since its functions have access to the command-line options.
Shargs includes the following usage functions:

<table>
<tr>
<th>Usage&nbsp;Function&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
<th>Description (and Example)</th>
</tr>
<tr>
<td><code>usage(functions)(opts)(style)</code></td>
<td>
<details>
<summary>
Groups several usage DSL functions together.
</summary>

<br />

Example:

```js
const opts = [
  number('answer', ['-a', '--answer'], {desc: 'The answer.'}),
  flag('help', ['-h', '--help'], {desc: 'Prints help.'}),
  flag('version', ['--version'], {desc: 'Prints version.'})
]

const style = {
  line: {width: 40},
  cols: [
    {width: 10, padEnd: 2},
    {width: 28}
  ]
}

usage([
  synopsis('deepThought'),
  space,
  optsList,
  space,
  note('Deep Thought was created to come up with the Answer.')
])(opts)(style)
```

Result:

```bash
deepThought [-a|--answer] [-h|--help]   
            [--version]                 
                                        
-a,         The answer. [number]        
--answer                                
-h, --help  Prints help. [flag]         
--version   Prints version. [flag]      
                                        
Deep Thought was created to come up with
the Answer.                             
```

</details>
</td>
</tr>
<tr>
<td><code>note(string)(opts)(style)</code><br /><code>noteFrom(id)(string)(opts)(style)</code></td>
<td>
<details>
<summary>
Prints the string with a line break at the end. Takes the line width from style and pads with spaces at the end. If the string is too long to fit the line's width, it is broken up into words, and all remaining words are put into the following line.
</summary>

<br />

```js
const note = noteFrom('line')
```

Example:

```js
const opts = []

const style = {
  line: {width: 40}
}

note(
  'Deep Thought was created to come up with the Answer.'
)(opts)(style)
```

Result:

```bash
Deep Thought was created to come up with
the Answer.                             
```

</details>
</td>
</tr>
<tr>
<td><code>notes(strings)(opts)(style)</code><br /><code>notesFrom(id)(strings)(opts)(style)</code></td>
<td>
<details>
<summary>
Prints several strings using the <code>note</code> function for each.
</summary>

<br />

```js
const notes = notesFrom('line')
```

Example:

```js
const opts = []

const style = {
  line: {width: 40}
}

notes([
  'Deep Thought answered',
  'The Ultimate Question.'
])(opts)(style)
```

Result:

```bash
Deep Thought answered                   
The Ultimate Question.                  
```

</details>
</td>
</tr>
<tr>
<td><code>space(opts)(style)</code><br /><code>spaceFrom(id)(opts)(style)</code></td>
<td>
<details>
<summary>
Introduces a single blank line.
</summary>

<br />

```js
const space = spaceFrom('line')
```

Example:

```js
const opts = []

const style = {
  line: {width: 40}
}

usage([
  note('Deep Thought answered'),
  space,
  note('The Ultimate Question.')
])(opts)(style)
```

Result:

```bash
Deep Thought answered                   
                                        
The Ultimate Question.                  
```

</details>
</td>
</tr>
<tr>
<td><code>spaces(length)(opts)(style)</code><br /><code>spacesFrom(id)(length)(opts)(style)</code></td>
<td>
<details>
<summary>
Introduces several blank lines with the number defined by the length parameter.
</summary>

<br />

```js
const spaces = spacesFrom('line')
```

Example:

```js
const opts = []

const style = {
  line: {width: 40}
}

usage([
  note('Deep Thought answered'),
  spaces(2),
  note('The Ultimate Question.')
])(opts)(style)
```

Result:

```bash
Deep Thought answered                   
                                        
                                        
The Ultimate Question.                  
```

</details>
</td>
</tr>
<tr>
<td><code>optsDefs(opts)(style)</code><br /><code>optsDefsFrom(id1, id2)(opts)(style)</code></td>
<td>
<details>
<summary>
Prints a definition list, with the command-line option <code>args</code> as title
and the <code>desc</code> key as text.
</summary>

<br />

```js
const optsDefs = optsDefsFrom('line', 'desc')
```

Example:

```js
const opts = [
  number('answer', ['-a', '--answer'], {desc: 'The answer.'}),
  flag('help', ['-h', '--help'], {desc: 'Prints help.'}),
  flag('version', ['--version'], {desc: 'Prints version.'})
]

const style = {
  line: {width: 40},
  desc: {padStart: 4, width: 36}
}

optsDefs(opts)(style)
```

Result:

```bash
-a, --answer [number]                   
    The answer.                         

-h, --help [flag]                       
    Prints help.                        

--version [flag]                        
    Prints version.                     
```

</details>
</td>
</tr>
<tr>
<td><code>optsList(opts)(style)</code><br /><code>optsListFrom(id)(opts)(style)</code></td>
<td>
<details>
<summary>
Prints a table with two columns:
The command-line option's <code>args</code> in the left,
and the <code>desc</code> key in the right column.
</summary>

<br />

```js
const optsList = optsListFrom('cols')
```

Example:

```js
const opts = [
  number('answer', ['-a', '--answer'], {desc: 'The answer.'}),
  flag('help', ['-h', '--help'], {desc: 'Prints help.'}),
  flag('version', ['--version'], {desc: 'Prints version.'})
]

const style = {
  cols: [
    {width: 10, padEnd: 2},
    {width: 28}
  ]
}

optsList(opts)(style)
```

Result:

```bash
-a,         The answer. [number]        
--answer                                
-h, --help  Prints help. [flag]         
--version   Prints version. [flag]      
```

</details>
</td>
</tr>
<tr>
<td><code>synopsis(start, end)(opts)(style)</code><br /><code>synopsisFrom(id)(start, end)(opts)(style)</code></td>
<td>
<details>
<summary>
Prints a command's synopsis:
The <code>start</code> string is printed first, the command-line option's <code>args</code> next,
followed by the <code>end</code> string.
</summary>

<br />

```js
const synopsis = synopsisFrom('cols')
```

Example:

```js
const opts = [
  number('answer', ['-a', '--answer'], {desc: 'The answer.'}),
  flag('help', ['-h', '--help'], {desc: 'Prints help.'}),
  flag('version', ['--version'], {desc: 'Prints version.'})
]

const style = {
  line: {width: 40}
}

synopsis('deepThought')(opts)(style)
```

Result:

```bash
deepThought [-a|--answer] [-h|--help]   
            [--version]                 
```

</details>
</td>
</tr>
</table>

#### Usage Decorators DSL

Sometimes you want to pass only a portion of the command-line options to a usage function.
Shargs has usage decorators for that:

```js
const decoratedDocs = usage([
  decorate(noCommands, onlyFirstArg)(synopsis('deepThought')),
  space,
  onlyCommands(optsDefs),
  space,
  noCommands(optsList),
  space,
  note(
    'Deep Thought was created to come up with the Answer to ' +
    'The Ultimate Question of Life, the Universe, and Everything.'
  )
])
```

`decoratedDocs` displays commands and other command-line options in separate text blocks
by using the `onlyCommands` and `noCommands` decorators to filter relevant options.
Shargs includes the following usage decorators:

| Usage&nbsp;Decorator&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Description |
|---------------------------------------------|----------------------------------------------------------------------------------------|
| `decorate(decorators)(usageFunction)(opts)` | Combines several usage decorators to one decorator.                                    |
| `justArgs(array)(usageFunction)(opts)`      | Takes an array of args and keeps only those `opts` that have an arg in the args array. |
| `noCommands(usageFunction)(opts)`           | Filters out all commands from `opts`.                                                  |
| `onlyCommands(usageFunction)(opts)`         | Keeps only commands in `opts`.                                                         |
| `onlyFirstArg(usageFunction)(opts)`         | Keeps only the first arg from each opt.                                                |
| `optsFilter(p)(usageFunction)(opts)`        | Applies `filter` to the `opts` array using a predicate `p`.                            |
| `optsMap(f)(usageFunction)(opts)`           | Applies `map` to the `opts` array using a function `f`.                                |

### Combining Options, Parser, and Usage Documentation

The command-line options, the parser, and the usage documentation are combined to a program:

```js
// ./deepThought -a 42 ask -q 'What is the answer to everything?'
const argv = ['-a', '42', 'ask', '-q', 'What is the answer to everything?']

const {errs, args} = deepThought(opts)(argv)

const help = docs(opts)(style)
const askHelp = askDocs(style)

if (args.help) {
  console.log(help)
} else if (args.ask && args.ask.help) {
  console.log(askHelp)
} else {
  console.log('The answer is: ' + args.answer)
}
```

Shargs lets you define the three parts individually.
This gives you a lot of flexibility:
E.g. It lets you mix in custom parser and usage functions.

## Reporting Issues

Please report issues [in the tracker][issues]!

## Contributing

We are open to, and grateful for, any contributions made by the community.
By contributing to pixie, you agree to abide by the [code of conduct][code].
Please read the [contributing guide][contribute].

## License

Shargs is [MIT licensed][license].

[actions]: https://github.com/Yord/shargs/actions
[code]: https://github.com/Yord/shargs/blob/master/CODE_OF_CONDUCT.md
[contribute]: https://github.com/Yord/shargs/blob/master/CONTRIBUTING.md
[issues]: https://github.com/Yord/shargs/issues
[license]: https://github.com/Yord/shargs/blob/master/LICENSE
[node]: https://nodejs.org/
[npm-install]: https://docs.npmjs.com/downloading-and-installing-packages-globally
[npm-package]: https://www.npmjs.com/package/shargs
[pxi]: https://github.com/Yord/pxi
[shield-license]: https://img.shields.io/npm/l/shargs?color=yellow&labelColor=313A42
[shield-node]: https://img.shields.io/node/v/shargs?color=red&labelColor=313A42
[shield-npm]: https://img.shields.io/npm/v/shargs.svg?color=orange&labelColor=313A42
[shield-prs]: https://img.shields.io/badge/PRs-welcome-green.svg?labelColor=313A42
[shield-unit-tests-linux]: https://github.com/Yord/shargs/workflows/linux/badge.svg?branch=master
[shield-unit-tests-macos]: https://github.com/Yord/shargs/workflows/macos/badge.svg?branch=master
[shield-unit-tests-windows]: https://github.com/Yord/shargs/workflows/windows/badge.svg?branch=master
[teaser]: https://github.com/Yord/pxi/blob/master/teaser.gif?raw=true