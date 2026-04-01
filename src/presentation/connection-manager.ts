import { FriendsController } from "../controller/friends.controller.js";
import { openInteractionManager, type Choice } from "./interaction-manager.js";

const options: Choice[] = [
    { label: 'Add friend', value: '1'},
    { label: 'Search friend', value: '2'},
    { label: 'Update friend', value: '3'},
    { label: 'Remove friend', value: '4'},
    { label: 'Exit', value: '5'},
];

const { ask, choose, close } = openInteractionManager();
const friendController = new FriendsController()

const addFriend = async () => {
    const name = await ask('Enter friend\'s name: ')
    const email = await ask('Enter friend\'s email: ')
    const phone = await ask('Enter friend\'s phone number: ')
    const openingBalance = await ask('Enter opening balance (positive means they owe you, negative means you owe them): ');

    if(!name || !email || !phone) {
        console.log("All fields required!");
        return;
    }

    const friend = {
        id: Date.now().toString(),
        name: name,
        email: email,
        phone: phone,
        balance: Number(openingBalance)
    }

    friendController.addFriend(friend)
}

const searchFriend = async () => {
    const query = await ask('Enter search query: ');

    if(!query) {
        console.log("Enter to search")
        return
    }
    
    friendController.searchFriends(query)
}

export const manageFriend = async () => {
    while(true) {
        const choice = await choose('\nWhat do you want to do?', options, false);

        switch(choice?.value) {
            case '1':
                await addFriend()
                break;
            case '2':
                await searchFriend()
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