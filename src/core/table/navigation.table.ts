import readline from "node:readline";
import { displayTable } from "./display.table.js";

export const tableNavigation = <T extends object>(data: T[], model: T) => {

    return new Promise<void>((resolve) => {

        let currentPage = 1;
        const limit = 5;
        const totalPages = Math.ceil(data.length / limit);

        displayTable(data, model, currentPage, limit);

        readline.emitKeypressEvents(process.stdin);
        if(process.stdin.isTTY) 
            process.stdin.setRawMode(true);

        const handleKeyPress =(_str: string, key: readline.Key) => {
            if(key.name === 'right') {
                if(currentPage < totalPages) {
                    currentPage++;
                    displayTable(data, model, currentPage, limit);
                }
            } else if(key.name === 'left') {
                if(currentPage > 1) {
                    currentPage--;
                    displayTable(data, model, currentPage, limit);
                }
            } else if(key.name === 'escape' || (key.ctrl && key.name === 'c')) {
                process.stdin.removeListener('keypress', handleKeyPress);

                if (process.stdin.isTTY) {
                    process.stdin.setRawMode(false);
                }

                process.stdout.write('\n');
                resolve();
            }
        }
        process.stdin.on('keypress', handleKeyPress);
    })
}