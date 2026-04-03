import * as readline from 'node:readline';
import { stdin as input, stdout as output } from 'node:process'
import type { ValidatorFn } from '../core/validators/validator.types.js';


export interface AskOptions {
    defaultAnswer?: string | undefined;
    validator?: ValidatorFn | undefined;
}

export interface Choice {
    label: string;
    value: string;
}

export const openInteractionManager = () => {

    const rl = readline.createInterface({ input, output });
    
    const ask = (question: string, options?: AskOptions): Promise<string | undefined> => {
        const { defaultAnswer, validator } = options ?? {};
        return new Promise((resolve) => {
            rl.question(defaultAnswer ? `${question} (${defaultAnswer}) ` : `${question} `, (answer: string) => {
                if(validator) {
                    const ValidationResult = validator(answer);
                    if(typeof ValidationResult === 'string') {
                        console.log(`${ValidationResult}`);
                        return resolve(ask(question, { defaultAnswer: defaultAnswer, validator: validator }))
                    }
                }
                resolve(answer || defaultAnswer);
            })
        })
    }
    
    const choose: (question: string, choices: Choice[], optional?: boolean) => Promise<Choice | undefined> = async (question, choices, optional) => {
        console.log(question);
        choices.forEach((choice) => {
            console.log(`\t${choice.value}. ${choice.label}`);
        })
        const choice = await ask('Please enter your choice: ', {
            validator: (input) => {
                if(!optional && input.trim() === "") {
                    return true;
                }
                if(!choices.some(choice => choice.value === input)) {
                    return 'Invlid choice! Try again with a valid choice.'
                }
                return true;
            }
        })
        return choices.find(c => c.value === choice)
    }
    
    const close = () => {
        rl.close();
    }

    return {
        ask,
        choose,
        close,
    }
}