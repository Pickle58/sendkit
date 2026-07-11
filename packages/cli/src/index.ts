import { Command } from "commander";

type TelegramRespnse = {
    ok: boolean;
    result?: {
        message_id?: number;
    };
    description?: string;
};

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

        if (!chatId) {
            console.error("Missing Telegram chatId argument");
            process.exit(1);
        }

        if (!message) {
            console.error("Missing Telegram message text.");
            process.exit(1);
        }

        const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message,
                }),
            });

            const data = (await response.json()) as TelegramRespnse;

            if (!response.ok || !data.ok) {
                const details = data.description ?? response.statusText;
                console.error(`Telegram API request failed: ${details}`);
                process.exit(1);
            }

            const messageId = data.result?.message_id;

            console.log(`Sent message to Telegram chat ${chatId}.`);

            if (messageId !== undefined) {
                console.log(`Telegram Message ID: ${messageId}`);
            }
    });

program.parseAsync(process.argv);

