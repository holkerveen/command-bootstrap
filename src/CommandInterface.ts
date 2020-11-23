export type CommandObject = { new(): CommandInterface };

export interface CommandInterface {

    /**
     * Return a short description of the command
     */
    description(): string;

    /**
     * Return a more detailed help text
     */
    help(): string;

    /**
     * Configure input options
     */
    configure(): void;

    /**
     * Run the command
     */
    execute(): number;

}
