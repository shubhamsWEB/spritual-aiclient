import { welcomeMessage } from "@/constants/messages";

export const getRandomWelcomeMessage = (username: string) => {
    const randomIndex = Math.floor(Math.random() * welcomeMessage.length);
    return welcomeMessage[randomIndex].replace('$username', username);
}