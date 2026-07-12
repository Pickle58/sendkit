import { Command } from "commander";
import { sendTelegramMessage } from "sendkit-core";

const program = new Command();

program
    .name("sendkit")
    .description("SendKit tutorial CLI")
    .command("telegram")
    .description("Send a Telegram message")
    .argument("<chatId>", "Telegram chat ID")
    .argument("<message>", "Message text to send")
    .action(async (chatId: string, message: string) => {
        const token = process.env.TELEGRAM_BOT_TOKEN;

        if (!token) {
            console.error("Missing TELEGRAM_BOT_TOKEN environment variable");
            process.exit(1);
        }

        try {
            const result = await sendTelegramMessage({
                botToken: token,
                chatId,
                message,
            });

            console.log(`Sent message to Telegram chat ${result.chatId}.`);
            console.log(`Telegram Message ID: ${result.messageId}`);
        } catch (error) {
            const detail = error instanceof Error ? error.message : String(error);
            console.error(`Telegram API request failed: ${detail}`);
            process.exit(1);
        }
    });

program.parseAsync(process.argv).catch((err) => {
    console.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
});

