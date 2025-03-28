import { welcomeMessage } from "@/constants/messages";

export const getRandomWelcomeMessage = () => {
    return welcomeMessage[Math.floor(Math.random() * welcomeMessage.length)];
}