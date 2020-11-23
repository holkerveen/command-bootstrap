import {Help} from "./Help";
import {CommandInterface} from "./CommandInterface";

export type CommandObject = { new(): CommandInterface };

export class Cli {

    private commands: { [k: string]: CommandObject } = {};

    constructor() {
        this.add('help', Help);
    }

    public add(name: string, command: CommandObject): void {
        this.commands[name] = command;
    }

    public run(): number {
        const requestedCommandName = process.argv[2] ?? 'help';
        let command: CommandInterface;
        if (requestedCommandName === 'help') {
            command = new Help();
            (<Help>command).commands = this.commands;
        } else {
            command = new this.commands[requestedCommandName];
        }
        // const command = requestedCommandName === 'help'
        //     ? new Help(this.commands)
        //     : new this.commands[requestedCommandName];
        command.configure();
        return command.execute();
    }
}



