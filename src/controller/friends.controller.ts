import type { PageOptions } from "../core/page-options.js";
import type { iFriend } from "../models/friend.model.js";
import { FriendRepository } from "../repository/friends.repository.js";

export class FriendsController{
    getFriends() {
        return FriendRepository.getInstance().f;
    }
    
    checkEmailExists(email:string){
        return false;
    }

    checkPhoneExists(phone:string){
        return false;
    }

    addFriend(friend:iFriend){
        if(!FriendRepository.getInstance()){
            return { success:false }
        }
        console.log('Adding friend to database...',friend)
        FriendRepository.getInstance().addFriend(friend);
    }

    searchFriends(query: string) {
        console.log('Search for friend in database...');
        return FriendRepository.getInstance().searchFriends(query, { offset: 0, limit: FriendRepository.getInstance().f.length})
    }

    findFriend(name: string) {
        if(!FriendRepository.getInstance()) {
            return undefined;
        }
        return FriendRepository.getInstance().findFriendByName(name)
    }

    updateFriends(friend: iFriend) {
        if(!FriendRepository.getInstance()) {
            return { success: false };
        }
        console.log(`Updated ${friend.name}...`)
        return FriendRepository.getInstance().updateFriends(friend);
    }
    
    removeFriends(name: string) {
        if(!FriendRepository.getInstance()) {
            return { success: false };
        }
        console.log(`Deleted ${name}...`)
        FriendRepository.getInstance().removeFriends(name);
    }

    allFriends() {
        return FriendRepository.getInstance().f;
    }
}