import {
	ActionRowBuilder,
	ApplicationCommandType,
	ButtonBuilder,
	ButtonStyle,
	ChatInputCommandInteraction,
	Message
} from "discord.js";

import Command, { CommandCategory } from "@structures/Command.js";

export default class Ping extends Command {
	constructor() {
		super({
			name: "ping",
			type: ApplicationCommandType.ChatInput,
			aliases: ["pong", "latency"],
			category: CommandCategory.Utility,
			description: `Get the bot's websocket heartbeat and API latency.`
		});
	}

	override async executeInteraction(interaction: ChatInputCommandInteraction<"cached">) {
		const start = performance.now();
		await interaction.deferReply();
		const end = performance.now();

		const timeTaken = Math.round(end - start);
		const ws = this.client.ws.ping;

		return interaction.editReply({
			content: `Pong! Roundtrip took: ${timeTaken}ms. Heartbeat: ${ws}ms.`,
			components: [Ping._getActionRow()]
		});
	}

	override async executeMessage(message: Message<true>) {
		const start = performance.now();
		const reply = await message.reply("Pinging...");
		const end = performance.now();

		const timeTaken = Math.round(end - start);
		const ws = this.client.ws.ping;

		return reply
			.edit({
				content: `Pong! Roundtrip took: ${timeTaken}ms. Heartbeat: ${ws}ms.`,
				components: [Ping._getActionRow()]
			})
			.catch(() => {
				return message.channel.send({
					content: `Pong! Roundtrip took: ${timeTaken}ms. Heartbeat: ${ws}ms.`,
					components: [Ping._getActionRow()]
				});
			});
	}

	/**
	 * @returns An action row with a button to ping the bot.
	 */

	private static _getActionRow(): ActionRowBuilder<ButtonBuilder> {
		const button = new ButtonBuilder().setStyle(ButtonStyle.Primary).setCustomId("ping").setLabel("Ping?");
		return new ActionRowBuilder<ButtonBuilder>().setComponents(button);
	}
}
