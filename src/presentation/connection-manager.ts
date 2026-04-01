import { openInteractionManager, type Choice } from "./interaction-manager.js";

const options: Choice[] = [
    { label: 'Add friend', value: '1'},
    { label: 'Search friend', value: '2'},
    { label: 'Update friend', value: '3'},
    { label: 'Remove friend', value: '4'},
    { label: 'Exit', value: '5'},
];

const { ask, choose, close } = openInteractionManager();

const addFriend = async () => {
    const name = await ask('Enter friend\'s name: ')
    const email = await ask('Enter friend\'s email: ')
    const phone = await ask('Enter friend\'s phone number: ')
    const openingBalance = await ask('Enter opening balance (positive means they owe you, negative means you owe them): ');

    const friend = {
        id: Date.now().toString(),
        name: name,
        email: email,
        phone: phone,
        openingBalance: openingBalance
    }
}

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