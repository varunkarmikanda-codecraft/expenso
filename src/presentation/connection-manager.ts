import { openInteractionManager, type Choice } from "./interaction-manager.js";

const options: Choice[] = [
    { label: 'Add friend', value: '1'},
    { label: 'Search friend', value: '2'},
    { label: 'Update friend', value: '3'},
    { label: 'Remove friend', value: '4'},
    { label: 'Exit', value: '5'},
];

const { ask, choose, close } = openInteractionManager();

export const manageFriend = async () => {
    while(true) {
        const choice = await choose('\nWhat do you want to do?', options, false);

        switch(choice?.value) {
            case '1':
                console.log('Adding friend...');
                break;
            case '2':
                console.log('Searching friend...');
                break;
            case '3':
                console.log('Updating friend...');
                break;
            case '4':
                console.log('Remove friend...');
                break;
            case '5':
                console.log('Exiting...');
                close()
                return;
        }
    }
}