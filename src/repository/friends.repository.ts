import type { PageOptions } from "../core/page-options.js";
import type { iFriend } from "../models/friend.model.js";

export class FriendRepository {
  private static instance: FriendRepository;
  private friends: iFriend[] = [];
  static getInstance() {
    if (!FriendRepository.instance) {
      FriendRepository.instance = new FriendRepository();
    }
    return FriendRepository.instance;
  }

  get f () {
    return this.friends;
  }

  private constructor() {}
  addFriend(friend: iFriend) {
    this.friends.push(friend);
  }

  findFriendByName(name: string) {
    return this.friends.find((friend) => friend.name === name);
  }

  findFriendByEmail(email: string) {
    return this.friends.find((friend) => friend.email === email);
  }

  findFriendByPhone(phone: string) {
    return this.friends.find((friend) => friend.phone === phone);
  }

  searchFriends(query: string, pageOption?: PageOptions) {
    const lowerQuery = query.toLowerCase();
    const filtered = this.friends.filter((friend) => {
      return (
        friend.name.toLowerCase().includes(lowerQuery) ||
        friend.email.toLowerCase().includes(lowerQuery) ||
        friend.phone.toLowerCase().includes(lowerQuery)
      )
    });

    console.log('Search complete');
    return {
      data: filtered.slice(
        pageOption?.offset || 0,
        (pageOption?.offset || 0) + (pageOption?.limit || 5),
      ),
      matched: filtered.length,
      total: this.friends.length,
    };
  }

  updateFriends(updatedFriend: iFriend) {
    const index = this.friends.findIndex(friend => friend.id === updatedFriend.id);
    if(index !== -1) {
      this.friends[index] = updatedFriend;
      return true;
    }
    return false;
  }

  removeFriends(query: string) {
    const friend = this.searchFriends(query);
    const friendToDelete = friend.data[0];

    if(!friendToDelete) {
      console.log('Friend not found!');
      return;
    }

    if(friendToDelete?.balance !== 0) {
      console.log('Need to settle the balance before deleting friend');
      return;
    }

    const index = this.friends.findIndex(friend => friend.id === friendToDelete?.id);
    if(index !== -1) {
      this.friends.splice(index, 1);
      return true;
    }
    return false;
  }
}
