import {
	ActionRowBuilder,
	ApplicationCommandType,
	ChatInputCommandInteraction,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle
} from "discord.js";

import Command, { CommandCategory } from "@structures/Command.js";

export default class Register extends Command {
	constructor() {
		super({
			name: "register",
			type: ApplicationCommandType.ChatInput,
			category: CommandCategory.General,
			description: "Register yourself."
		});
	}

	override async executeInteraction(interaction: ChatInputCommandInteraction<"cached">) {
		const usernameInput = new TextInputBuilder()
			.setCustomId("username")
			.setLabel("Username")
			.setPlaceholder(`Enter your username.`)
			.setRequired(true)
			.setMaxLength(128)
			.setStyle(TextInputStyle.Paragraph);

		const actionRow = new ActionRowBuilder<TextInputBuilder>().setComponents(usernameInput);
		const modal = new ModalBuilder().setCustomId("modal").setTitle(`Registering`).setComponents(actionRow);

		return interaction.showModal(modal);
	}
}
