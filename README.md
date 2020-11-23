# Node Command Bootstrap

This library implements a convenient way to jumpstart your CLI toolbox programmed in node. Based on the `symfony/console` component for PHP, you can use this library to quickly generate a CLI application containing any number of scripts, and the generated application will have a comprehensive help system which adheres *many* CLI best practices.

To install this library, run:
```
npm i @holkerveen/command-bootstrap
```

## Creating your first command

Let's dive in by creating a traditional *hello world* command.

At its core, all you need to do is create a class that implements `CommandInterface` and then register your command!

```typescript
// /src/Hello.ts
import {CommandInterface} from "@holkerveen/command-bootstrap";

export class Hello implements CommandInterface {

    description(): string {
        return "Show message";
    }

    help(): string {
        return "This command will show a message";
    }

    configure(): void {
        // empty
    }

    execute(): number {
        console.log(`Hello world!`);
        return 0;
    }

}
```

Now, create a base app. Its task will be to register all your commands and then invoke the bootstrap code.

```typescript
// /src/cli.ts
import {Hello} from "./Hello";
import {Cli} from "@holkerveen/command-bootstrap";

const cli = new Cli();
cli.add('hello', Hello);
cli.run();
```

When done, you can compile (transpile) and run your command. Use any build tool you like. Example:

```bash
npx webpack
```

Now run the cli script:
```
node index.js
```

As you have not specified a command, it will show the list of available commands. If all is well, your commmand should be in that list as well! Congratulations :-). If you want to see the extended help message (which we defined in the *description* function), run:

```
node index.js help hello
```

Finally, to run your command itself:

```
node index.js hello
```

## Add an argument

The empty `configure` function is where you can define your cli arguments and options. For that, we need to include our helper and use addArgument to add an argument:

```typescript
class Hello {
    
    // ...

    private helper: CommandHelper;
    constructor() {
        this.helper = new CommandHelper;
    }

    configure(): void {
        this.helper.addArgument('name', true, 'Name to say hello to');
    }
    // ...
}
```

In this example, `'name'` is the handle by which we can reference the argument in our code, true means that the argument is required (use `false` otherwise), and the third parameter is a short help text explaining its meaning.
Next, we can modify your `console.log` function to update include the argument value in our message:

```typescript
class Hello {
    
    // ...

    execute(): number {
        console.log(`Hello ${this.helper.getArgumentValue('name')}`);
        return 0;
    }
    // ...
}
```

## Add an argument

The same helper can be used to include a command line option:

```typescript
class Hello {
    // ...

    configure(): void {
        this.helper.addArgument('name', true, 'Name to say hello to');
        helper.addOption('shout','s', "bool", false, "Shout your hello");
    }

    // ...
}
```

In this example, 'shout' is the name of the switch, 's' is the short version, "bool" indicates that this is a boolean option, `false` is the default value, and the last parameter is again a quick explanation of the option.

In the `execute` function, use the `getOptionValue` function to retreive its value:
```typescript
class Hello {
    
    // ...

    execute(): number {
        let message = `Hello ${this.helper.getArgumentValue('name')}`; 
        if(this.helper.getOptionValue('shout')) {
            message = message.toUpperCase();
        }
        console.log(message);
        return 0;
    }
    // ...
}
```

## Better help messages

Finally, there is a helper function that will automatically generate usage instructions for your extended help text.
While completely optional, you could modify your `help` function as follows to get proper, standardized usage instructions:

```typescript
class Hello {
    // ...

    help(): string {
        return "Show message\n\n" + this.helper.getUsage();
    }

    // ...
}
```

# Feedback

I would like to hear from you! Please drop me a line if this lib is to your liking, or if you have ideas to improve on it!