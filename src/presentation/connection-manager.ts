import { FriendsController } from "../controller/friends.controller.js";
import { displayTable } from "../core/display-table.js";
import { ConflictError } from "../core/errors/conflict.error.js";
import { ExistsError } from "../core/errors/exists.error.js";
import { numberValidator, rangeValidator } from "../core/validators/number.validator.js";
import { emailValidator, nameValidator, phoneValidator, requiredValidator } from "../core/validators/string.validator.js";
import type { ValidatorFn } from "../core/validators/validator.types.js";
import type { iFriend } from "../models/friend.model.js";
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
const friendController = new FriendsController();

const showFriendForm = (initialData?: iFriend) => {

    const isUpdate = Boolean(initialData)

    const friendData = {
        name: initialData?.name ||  "",
        email: initialData?.email || null,
        phone: initialData?.phone || null,
        balance: initialData?.balance || 0
    }

    const fill = async () => {
        friendData.name = await ask(`Enter friend\'s name: ${friendData.name ? `(${friendData.name})` : ''}`, { validator: isUpdate ?  optional(nameValidator) : nameValidator, defaultAnswer: friendData.name });
        const email = await ask(`Enter friend\'s email: ${friendData.email ? `(${friendData.email})` : ''}`, { validator: optional(emailValidator), defaultAnswer: friendData.email || null });
        friendData.email = email ? email : null;
        const phone = await ask(`Enter friend\'s phone number: ${friendData.phone ? `(${friendData.phone})` : ''}`, { validator: optional(phoneValidator), defaultAnswer: friendData.phone || null });
        friendData.phone = phone ? phone : null;
        friendData.balance = parseInt(await ask(`Enter opening balance (positive means they owe you, negative means you owe them): ${friendData.balance ? `(${friendData.balance})` : ''}`, { validator: numberValidator, defaultAnswer: '0' }));
    }

    const fixConflict = async (conflictKeys: string[]) => {
        for(const key of conflictKeys) {
            console.log(`Conflict found on "${key}"`);
            if(key === 'name') {
                friendData.name = await ask(`${friendData.name} already exists. Please enter a different name: `, { validator: nameValidator });
            }
            if(key === 'email') {
                friendData.email = await ask(`${friendData.email} already exists. Please enter a different email: `, { validator: emailValidator });
            }
            if(key === 'phone') {
                friendData.phone = await ask(`${friendData.phone} already exists. Please enter a different phone: `, { validator: phoneValidator });
            }
        }
    }

    const values = (): iFriend => {
        return {
            id: Date.now().toString(),
            name: friendData.name,
            email: friendData.email,
            phone: friendData.phone,
            balance: Number(friendData.balance) || 0
        }
    }

    return {
        fill,
        fixConflict,
        values
    }
}

const addFriend = async () => {

    const form = showFriendForm();
    await form.fill()

    if(!form.values().name) {
        console.log('Name is required')
    }

    while(true) {
        try {
            await friendController.addFriend(form.values());
            console.log("Friend added successfully");
            return
        } catch(error) {
            if(error instanceof ExistsError) {
                console.log(`Error: ${error.message}`);
                await form.fixConflict(error.conflictKeys);
                continue;
            }
            console.log('Unknown error please try again!')
            break;
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

    const form = showFriendForm(friend);
    await form.fill();

    if(friend === form.values()) {
        console.log("No field was updated!")
        return;
    }

    while(true) {
        try {
            await friendController.updateFriends(form.values());
            console.log(`Friend updated successfully`)
            return
        } catch(error) {
            if(error instanceof ExistsError) {
                console.log(`Error: ${error.message}`);
                await form.fixConflict(error.conflictKeys);
                continue
            }
            console.log('Unknown error please try again!')
            break;
        }
    }
    
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