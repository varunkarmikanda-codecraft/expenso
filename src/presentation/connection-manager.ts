import { FriendsController } from "../controller/friends.controller.js";
import { displayTable } from "../core/display-table.js";
import { ConflictError } from "../core/errors/conflict.error.js";
import { numberValidator } from "../core/validators/number.validator.js";
import { emailValidator, nameValidator, phoneValidator, requiredValidator } from "../core/validators/string.validator.js";
import type { ValidatorFn } from "../core/validators/validator.types.js";
import { openInteractionManager, type Choice } from "./interaction-manager.js";

const optional = (validator: ValidatorFn) => (input: string) => !input.trim() || validator(input);

const options: Choice[] = [
    { label: 'Add friend', value: '1' },
    { label: 'Search friend', value: '2' },
    { label: 'Update friend', value: '3' },
    { label: 'Remove friend', value: '4' },
    { label: 'All friends', value: '5' },
    { label: 'Exit', value: '6' },
];

const { ask, choose, close } = openInteractionManager();
const friendController = new FriendsController()

const addFriend = async () => {
    let name = await ask('Enter friend\'s name: ', { validator: nameValidator });
    let email = await ask('Enter friend\'s email: ', { validator: optional(emailValidator) });
    let phone = await ask('Enter friend\'s phone number: ', { validator: optional(phoneValidator) });
    const openingBalance = await ask('Enter opening balance (positive means they owe you, negative means you owe them): ', { validator: numberValidator, defaultAnswer: '0' });

    if (!name) {
        console.log("Name field required!");
        return;
    }
    
    while(true) {
        try {
            friendController.addFriend({
                id: Date.now().toString(),
                name: name!,
                email: email,
                phone: phone,
                balance: Number(openingBalance) || 0
            })
            return
        } catch (error) {
            if (error instanceof ConflictError) {
                console.log(`${error.name}: ${error.conflictError} | ${error.message}`);
                if(error.conflictError === 'name') {
                    name = await ask('Enter friend\'s name: ', { validator: nameValidator });
                    continue;
                }
                if (error.conflictError === 'email') {
                    email = await ask('Enter friend\'s email: ', { validator: optional(emailValidator) });
                    continue;
                }
                if (error.conflictError === 'phone') {
                    phone = await ask('Enter friend\'s phone number: ', { validator: optional(phoneValidator) });
                    continue;
                }
            } else if (error instanceof Error) {
                console.log(error.message);
            } else {
                console.log('Unknown error please try again!')
            }
        }
    }
}

const searchFriend = async () => {
    const query = await ask('Enter search query: ', { validator: requiredValidator });

    if (!query) {
        console.log("Enter to search")
        return
    }

    const result = friendController.searchFriends(query);
    if (!result.data || result.data.length === 0) {
        console.log('No data matched!')
        return
    }
    displayTable(result.data, { id: "", name: "", email: "", phone: "", balance: 0})
}

const updateFriend = async () => {
    const updateOptions: Choice[] = [
        { label: "Name", value: "1" },
        { label: "Email", value: "2" },
        { label: "Phone number", value: "3" },
        { label: "Balance", value: "4" },
    ];

    const name = await ask('Enter the name of the friend to update: ', { validator: nameValidator });
    if (!name) {
        console.log('Please enter a name')
        return;
    }
    const friend = friendController.findFriend(name);

    if (!friend) {
        console.log('Not found!')
        return;
    }


    const choice = await choose('\nWhat do you want to update? ', updateOptions, false);

    switch (choice?.value) {
        case '1':
            const updatedName = await ask(`Enter new name: (current: ${friend.name}) `, { validator: nameValidator, defaultAnswer: friend.name });
            if (updatedName) friend.name = updatedName;

            break
        case '2':
            const updatedEmail = await ask(`Enter new email: (current: ${friend.email}) `, { validator: emailValidator, defaultAnswer: friend.email });
            if (updatedEmail) friend.email = updatedEmail;
            break;
        case '3':
            const updatedPhone = await ask(`Enter new phone number: (current: ${friend.phone}) `, { validator: phoneValidator, defaultAnswer: friend.phone });
            if (updatedPhone) friend.phone = updatedPhone;
            break;
        case '4':
            const updatedBalance = await ask(`Enter new balance: (current: ${friend.balance}) `, { validator: numberValidator, defaultAnswer: 'friend.balance' });
            if (updatedBalance) friend.balance = Number(updatedBalance);
            break;
        case '5':
            console.log('Exit update');
            break;
    }
    friendController.updateFriends(friend);
}

const removeFriend = async () => {

    const name = await ask('Enter the name of the friend to update: ', { validator: nameValidator });
    if (!name) {
        console.log('Please enter a name')
        return;
    }

    friendController.removeFriends(name);

}

const allFriends = async () => {
    const allFriends = friendController.allFriends();

    if (allFriends.length === 0) {
        console.log("No friends");
        return;
    }

    displayTable(allFriends, { id: "", name: "", email: "", phone: "", balance: 0 });
}

export const manageFriend = async () => {
    while (true) {
        const choice = await choose('\nWhat do you want to do?', options, false);

        switch (choice?.value) {
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
                await allFriends();
                break;
            case '6':
                console.log('Exiting...');
                close()
                return;
        }
    }
}