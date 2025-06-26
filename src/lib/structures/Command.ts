import { ArgumentStream, IUnorderedStrategy, Lexer, Parser } from "@sapphire/lexure";
import { ApplicationCommandData, Awaitable, CommandInteraction, Message } from "discord.js";

import { Args as ArgsC } from "./Args.js";
import { client } from "@/index.js";
import { FlagStrategy } from "./FlagStrategy.js";

export default abstract class Command {
	/**
	 * The client that owns this command.
	 */

	public client = client;

	/**
	 * The name of the command.
	 */

	public readonly name: string;

	/**
	 * The aliases of the command.
	 * These are alternative names that can be used to invoke the command.
	 */

	public readonly aliases: string[];

	/**
	 * The category of the command.
	 * Useful for documentation and help commands, but required for all commands.
	 */

	public readonly category: keyof typeof CommandCategory;

	/**
	 * The description of the command.
	 * Useful for documentation and help commands, but required for all commands.
	 */

	public readonly description: string;

	/**
	 * The application command data for the command.
	 * This is used to register the command with Discord.
	 */

	public readonly data: ApplicationCommandData | null;

	/**
	 * The lexer to be used by the command.
	 */

	private lexer: Lexer;

	/**
	 * The strategy to be used by the argument parser.
	 */

	private readonly strategy: IUnorderedStrategy;

	/**
	 * Constructs a new command.
	 *
	 * @param commandOptions The options for the command.
	 */

	public constructor(commandOptions: CommandOptions) {
		const { category, messageOnly, aliases, flags: cmdFlags, ...rest } = commandOptions;

		this.name = commandOptions.name;
		this.aliases = aliases ?? [];
		this.category = category;
		this.description = commandOptions.description;

		this.data = messageOnly ? null : { ...rest };
		this.lexer = new Lexer({
			quotes: []
		});

		const { flags, options } = Command._getStrategyOptions(cmdFlags ?? []);
		this.strategy = new FlagStrategy({ flags, options });
	}

	/**
	 * Handler that is called when the command is executed as an application command.
	 *
	 * @param interaction The interaction that triggered the command.
	 */

	public executeInteraction?(interaction: CommandInteraction<"cached">): Awaitable<unknown>;

	/**
	 * Handler that is called when the command is executed as a message command.
	 *
	 * @param message The message that triggered the command.
	 * @param args The argument parser for the command.
	 */

	public executeMessage?(message: Message<true>, args: ArgsC): Awaitable<unknown>;

	/**
	 * Get the argument handler for the command.
	 * This is used to parse the arguments passed to the command.
	 *
	 * @param message The message that triggered the command.
	 * @param parameters The parameters passed to the command.
	 */

	public getArgsClass(message: Message<true>, parameters: string) {
		const parser = new Parser(this.strategy);
		const stream = new ArgumentStream(parser.run(this.lexer.run(parameters)));
		return new ArgsC(message, stream);
	}

	/**
	 * Parses the flags array passed to the command and returns the flags and options.
	 *
	 * @param _flags The flags to parse.
	 * @returns An object containing the flags and options.
	 */

	private static _getStrategyOptions(flags: FlagsArray): { flags: string[]; options: string[] } {
		return flags.reduce<{ flags: string[]; options: string[] }>(
			(acc, flag) => {
				const destination = flag.acceptsValue ? acc.options : acc.flags;
				destination.push(...flag.keys);
				return acc;
			},
			{ flags: [], options: [] }
		);
	}
}

/**
 * The category a command belongs to.
 * You'll need to extend this to add your own categories.
 *
 * @example
 * ```ts
 * export const CommandCategory = {
 *      Utility: "Utility",
 *      General: "General",
 * 		Developer: "Developer",
 * 		Fun: "Fun"
 * } as const;
 * export type CommandCategory = (typeof CommandCategory)[keyof typeof CommandCategory];
 * ```
 */

export const CommandCategory = {
	Utility: "Utility",
	General: "General",
	Developer: "Developer"
} as const;
export type CommandCategory = (typeof CommandCategory)[keyof typeof CommandCategory];

/**
 * The options for a command.
 * This extends the {@link ApplicationCommandData} type provided by Discord.js.
 */

export type CommandOptions = ApplicationCommandData & {
	/**
	 * The aliases of the command.
	 * These are alternative names that can be used to invoke the command.
	 */

	aliases?: string[];

	/**
	 * The category of the command.
	 * Useful for documentation and help commands, but required for all commands.
	 */
	category: keyof typeof CommandCategory;

	/**
	 * The description of the command.
	 * Useful for documentation and help commands, but required for all commands.
	 */
	description: string;

	/**
	 * Whether the command can only be used as a message command.
	 */
	messageOnly?: boolean;

	/**
	 * The flags to pass onto the lexer.
	 * These are used to determine which flags are available to the argument parser.
	 *
	 * Flags are typically used for options that do not require a value, such as `--verbose` or `--force`.
	 * However, they can also be used for options that do require a value, such as `--port=8080`.
	 */

	flags?: FlagsArray;
};

type FlagsArray = { keys: string[]; acceptsValue: boolean }[];
