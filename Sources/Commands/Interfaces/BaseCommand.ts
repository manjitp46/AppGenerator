
export interface BaseCommand {
    registerCommand(vorpalApp:any): void
    processCommandAction(args:any, cb: Function): void
}