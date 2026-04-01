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
        balance: Number(openingBalance) || 0
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

const updateFriend = async () => {
    const updateOptions: Choice[] = [
        { label: "Name", value: "1"},
        { label: "Email", value: "2"},
        { label: "Phone number", value: "3"},
        { label: "Balance", value: "4"},
    ];

    const name = await ask('Enter the name of the friend to update: ');
    if(!name) {
        console.log('Please enter a name')
        return;
    }
    const friend = friendController.findFriend(name);

    if(!friend) {
        console.log('Not found!')
        return;
    }

    
    const choice = await choose('\nWhat do you want to update? ', updateOptions, false);

    switch(choice?.value) {
        case '1': 
            const updatedName = await ask(`Enter new name: (current: ${friend.name}) `);
            if(updatedName) friend.name = updatedName;
            friendController.updateFriends(friend);
            break
        case '2':
            const updatedEmail = await ask(`Enter new email: (current: ${friend.email}) `);
            if(updatedEmail) friend.email = updatedEmail;
            friendController.updateFriends(friend);
            break;
        case '3':
            const updatedPhone = await ask(`Enter new phone number: (current: ${friend.phone}) `);
            if(updatedPhone) friend.phone = updatedPhone;
            friendController.updateFriends(friend);
            break;
        case '4':
            const updatedBalance = await ask(`Enter new balance: (current: ${friend.balance}) `);
            if(updatedBalance) friend.balance = Number(updatedBalance);
            friendController.updateFriends(friend);
            break;
        case '5':
            console.log('Exit update');
            break;
    }
}

const removeFriend = async () => {
    const query = await ask('Enter search query: ');

    if(!query) {
        console.log("Enter to search")
        return
    }

    friendController.removeFriends(query);
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
                await updateFriend()
                break;
            case '4':
                await removeFriend()
                break;
            case '5':
                console.log('Exiting...');
                close()
                return;
        }
    }
}