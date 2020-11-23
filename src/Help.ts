import * as path from "path";
import {CommandHelper} from "./CommandHelper";
import {CommandInterface, CommandObject} from "./CommandInterface";

export class Help implements CommandInterface {
    private helper: CommandHelper;
    private _commands: { [k: string]: CommandObject } = {};

    constructor() {
        this.helper = new CommandHelper();
    }

    set commands(commands: { [k: string]: CommandObject }) {
        this._commands = commands;
    }

    description(): string {
        return "Show help";
    }

    help(): string {
        return "The help command can be used to get instructions on how to run any of the configured commands.\n\n" +
            this.helper.getUsage();
    }

    configure(): void {
        this.helper.addArgument('command', false, 'Command name to show help for');
    }

    execute(): number {
        let command: CommandInterface;
        let commandName = this.helper.getArgumentValue('command');
        if (commandName) {
            if (this._commands.hasOwnProperty(commandName)) {
                command = new this._commands[commandName];
                command.configure();
                console.log(command.help());
            } else {
                throw new Error(`Unknown command '${commandName}'`);
            }
        } else {
            console.log("List of commands:");
            for (let commandName in this._commands) {
                if (this._commands.hasOwnProperty(commandName)) {
                    const command: CommandInterface = new this._commands[commandName];
                    console.log(`  ${commandName} - ${command.description()}`)
                }
            }
            console.log(`\nTo get detailed help for a command, run '${path.basename(process.argv[1])} help < command name >'`);

        }

        return 0;
    }

}
