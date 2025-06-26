import {
	ActionRowBuilder,
	ApplicationCommandType,
	ChatInputCommandInteraction,
	StringSelectMenuBuilder
} from "discord.js";

import { selectMenuOptions } from "@utils/Constants.js";

import Command, { CommandCategory } from "@structures/Command.js";

export default class Color extends Command {
	constructor() {
		super({
			name: "color",
			type: ApplicationCommandType.ChatInput,
			category: CommandCategory.General,
			description: "Pick your favorite color."
		});
	}

	override async executeInteraction(interaction: ChatInputCommandInteraction<"cached">) {
		const selectMenu = new StringSelectMenuBuilder()
			.setCustomId("select-menu")
			.setPlaceholder("Select color...")
			.setOptions(selectMenuOptions);

		const actionRow = new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(selectMenu);

		return interaction.reply({
			content: `Pick your favorite color below!`,
			components: [actionRow]
		});
	}
}
