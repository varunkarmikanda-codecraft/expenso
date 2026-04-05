import { FriendsController } from "../controller/friends.controller.js";
import { displayTable } from "../core/display-table.js";
import { ConflictError } from "../core/errors/conflict.error.js";
import { numberValidator, rangeValidator } from "../core/validators/number.validator.js";
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

    if (!query) return;

    const matchedResult = friendController.searchFriends(query);
    if (!matchedResult.data || matchedResult.data.length === 0) {
        console.log('No data matched!')
        return
    }
    displayTable(matchedResult.data, { id: "", name: "", email: "", phone: "", balance: 0})
}

const updateFriend = async () => {

    const query = await ask("Enter search query for friend to update: ", { validator: requiredValidator });

    if (!query) return

    const matchedResult = friendController.searchFriends(query);
    
    if (!matchedResult.data || matchedResult.data.length === 0) {
        console.log('No data matched!')
        return
    }

    const indexedFriendsList = matchedResult.data.map((friend, index) => ({
        ...friend, index: index + 1 
    }))
    displayTable(indexedFriendsList, { index: 0, id: "", name: "", email: "", phone: "", balance: 0 })

    const index = await ask('Enter the index of the friend you want to update: ', { validator: rangeValidator(1, matchedResult.data.length)});

    if(!index) return;

    const friend = matchedResult.data[Number(index) - 1];
    if(!friend) return

        const updatedName = await ask(`Enter the new name (Current : ${friend?.name})`, { validator: optional(nameValidator), defaultAnswer: friend?.name });
        const updatedEmail = await ask(`Enter the new email (Current : ${friend?.email})`, { validator: optional(emailValidator), defaultAnswer: friend?.email });
        const updatedPhone = await ask(`Enter the new phone number (Current : ${friend?.phone})`, { validator: optional(phoneValidator), defaultAnswer: friend?.phone });
        const updatedBalance = await ask(`Enter the new balance (Current : ${friend?.balance})`, { validator: optional(numberValidator), defaultAnswer: String(friend?.balance) });

        if(updatedName === friend.name && updatedEmail === friend.email && updatedPhone === friend.phone && updatedBalance === String(friend.balance)) {
            console.log("No fields of the friend was updated!")
            return
        }

        if(updatedName) friend.name = updatedName;
        if(updatedEmail) friend.email = updatedEmail;
        if(updatedPhone) friend.phone = updatedPhone;
        if(updatedBalance) friend.balance = Number(updatedBalance);

        friendController.updateFriends(friend)

    
}

const removeFriend = async () => {

    const query = await ask("Enter search query for friend to remove: ", { validator: requiredValidator });
    if(!query) return;

    const matchedResult = friendController.searchFriends(query);

    if(!matchedResult.data || matchedResult.data.length === 0) {
        console.log('No data matched!')
        return;
    }

    const indexedFriendsList = matchedResult.data.map((friend, index) => ({
        ...friend, index: index + 1
    }))

    displayTable(indexedFriendsList, { index: 0, id: "", name: "", email: "", phone: "", balance: 0 })

    const index = await ask('Enter the index of the friend you want to delete: ', { validator: rangeValidator(1, matchedResult.data.length)})
    if(!index) return

    const friend = matchedResult.data[Number(index) - 1];
    if(!friend) return;

    displayTable([friend], { id: "", name: "", email: "", phone: "", balance: 0 })
    
    const toDelete = await ask("Are your sure you want to delete your friend? (yes/no)", { defaultAnswer: "yes" });

    if(!toDelete) return;

    const deleteResponses = ['yes', 'y'];
    const canDelete = deleteResponses.includes(toDelete?.toLowerCase());
    
    if(canDelete) {
        friendController.removeFriends(friend?.id);
        console.log('Deleted');
        return
    }
    console.log('Delete cancelled')
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