import * as path from "path";

type Argument = { name: string, isRequired: boolean, help: string };
type Option = { name: string, short: string, type: OptionType, def: boolean | string, help: string };
export type OptionType = 'bool' | 'required' | 'optional';


/**
 * This class adds proper command line argument parsing to your CLI commands.
 *
 * Use https://github.com/holkerveen/typescript-trait to add the class to your Commands as a trait. Example usage:
 * ```
 * import {trait} from "../Core/trait";
 *
 * @trait(CommandHelper)
 * class YourCommand {
 *      test(){
 *          console.log()this.getArgumentsHelp());
 *      }
 * };
 * ```
 *
 * TODO add input options parsing as well as arguments
 */
export class CommandHelper {

    private cliOptions: Option[] = [];
    private cliArguments: Argument[] = [];
    private parsedArguments: { [k: string]: string } = {};
    private parsedOptions: { [k: string]: (string | boolean) } = {};

    /**
     * Add Argument to the command line processor
     *
     * @param name Name to reference the argument by in your code
     * @param isRequired Whether an error should be generated if the argument is missing
     * @param help Help text, displayed when help is calle for the command
     */
    addArgument(name: string, isRequired: boolean, help: string): void {
        if (this.cliArguments.slice(-1).length && this.cliArguments.slice(-1)[0].isRequired)
            throw new Error(`Required argument '${name}' must be placed in front of optional arguments`);
        this.cliArguments.push({
            name: name,
            isRequired: isRequired,
            help: help,
        });
    }

    addOption(name: string, short: string, type: OptionType, def: boolean | string, help: string): void {
        if (this.cliArguments.length)
            throw new Error(`Options must be defined before all arguments`);
        this.cliOptions.push({
            name: name,
            short: short,
            type: type,
            def: def,
            help: help,
        });
    }

    /**
     * Build usage instructions from the list of arguments
     */
    getUsage(): string {
        let str = "Usage:\n  "
            + path.basename(process.argv[1]) + " " + path.basename(process.argv[3]) + " ";
        if (this.cliOptions.length) str += "[options] ";
        str += this.cliArguments.map((a: Argument) => a.isRequired ? `<${a.name}>` : `[${a.name}]`).join(" ");
        if (this.cliOptions.length) {
            str += "\noptions:\n"
                + this.cliOptions.map(o => `  -${o.short}, --${o.name}: ${o.help} [${o.def === true ? 'true' : o.def === false ? 'false' : o.def}]\n`).join('');
        }
        if (this.cliArguments.length) {
            str += "\narguments:\n"
                + this.cliArguments.map(a => `  ${a.name} - ${a.help}\n`).join('');
        }
        return str;
    }

    getArgumentValue(name: string): string {
        this.parseArgv();
        return this.parsedArguments[name];
    }

    getOptionValue(name: string): boolean | string {
        this.parseArgv();
        return this.parsedOptions[name];
    }

    private parseArgv(): void {
        // TODO generate error if required argument is missing
        if (this.parsedArguments !== null) return;

        this.parsedArguments = {};
        this.parsedOptions = {};
        const args = process.argv.slice(3);

        this.cliOptions.forEach(o => this.parsedOptions[o.name] = o.def);

        const re = /^((?<short>-\w)|(?<long>--\w+))$/;
        while (args[0] && re.test(args[0])) {
            const str = args.shift() ?? "";
            const matches = re.exec(str)?.groups ?? {};

            const option = this.cliOptions.filter(o => matches.short ? o.short === matches.short.slice(1) : o.name === matches.long.slice(2))[0];
            if (!option) throw Error(`Unknown option '${str}'`);

            if (option.type === "bool") {
                this.parsedOptions[option.name] = true;
            } else if (option.type === "required") {
                this.parsedOptions[option.name] = args.shift() ?? option.def;
            } else if (!re.test(args[0])) {
                this.parsedOptions[option.name] = args.shift() ?? option.def;
            }

        }

        for (let arg of this.cliArguments) {
            if (arg.isRequired) {
                let v = args.shift();
                if(!v) throw new Error(`Argument '${arg.name}' is required`);
                else this.parsedArguments[arg.name] = v;
            } else {
                if (args.length > 0) this.parsedArguments[arg.name] = args.shift() ?? "";
            }
        }
    }

}
