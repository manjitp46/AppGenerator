import { GenerateRestAppCommand } from "./GenerateRestAppCommand";
import { GenerateDynamicWebAppCommand } from "./GenerateDynamicWebAppCommand";

export const Commands = [
    new GenerateRestAppCommand(),
    new GenerateDynamicWebAppCommand()
]