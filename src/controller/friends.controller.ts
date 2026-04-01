import type { PageOptions } from "../core/page-options.js";
import type { iFriend } from "../models/friend.model.js";
import { FriendRepository } from "../repository/friends.repository.js";

export class FriendsController{
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
        if(!FriendRepository.getInstance()){
            return { success:false }
        }
        console.log('Search for friend in database...');
        const res = FriendRepository.getInstance().searchFriends(query)
        if(!res.data || res.data.length === 0) {
            console.log('No data matched!')
            return
        }
        res.data.forEach((friend) => {
            console.log(friend)
        })
    }
}