import { ButtonInteraction } from "discord.js";

import Component from "@structures/Component.js";

export default class Ping extends Component {
	constructor() {
		super({ startsWith: "ping" });
	}

	override async execute(interaction: ButtonInteraction<"cached">) {
		return interaction.reply({
			content: `Pong! Heartbeat: ${this.client.ws.ping}ms.`
		});
	}
}
