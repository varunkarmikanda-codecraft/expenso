import { ConflictError } from "../core/errors/conflict.error.js";
import { getFriendsFromFile, storeFriendsInFile } from "../core/friends.storage.js";
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

  private constructor() {
    this.friends = getFriendsFromFile()
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

  addFriend(friend: iFriend) {
    if(this.findFriendByName(friend.name)) {
      throw new ConflictError('Friend with name exists.', 'name');
    }
    if(friend.email && this.findFriendByEmail(friend.email)) {
      throw new ConflictError('Friend with this mail exists.', 'email');
    }
    if(friend.phone && this.findFriendByPhone(friend.phone)) {
      throw new ConflictError('Friend with this phone number exists.', 'phone');
    }
    this.friends.push(friend);
    storeFriendsInFile(this.friends);
  }

  searchFriends(query: string, pageOption?: PageOptions) {
    const lowerQuery = query.toLowerCase();
    const filtered = this.friends.filter((friend) => {
      return (
        friend.name.toLowerCase().includes(lowerQuery) ||
        friend.email?.toLowerCase().includes(lowerQuery) ||
        friend.phone?.toLowerCase().includes(lowerQuery)
      )
    });

    console.log('Search complete');
    return {
      data: filtered.slice(
        pageOption?.offset || 0,
        (pageOption?.offset || 0) + (pageOption?.limit || filtered.length),
      ),
      matched: filtered.length,
      total: this.friends.length,
    };
  }

  updateFriends(updatedFriend: iFriend) {
    const index = this.friends.findIndex(friend => friend.id === updatedFriend.id);
    if(index !== -1) {
      this.friends[index] = updatedFriend;
      storeFriendsInFile(this.friends)
      return true;
    }
    return false;
  }

  removeFriends(name: string) {
    const friend = this.findFriendByName(name);

    if(!friend) {
      console.log('Friend not found!');
      return;
    }

    if(friend.balance !== 0) {
      console.log('Need to settle the balance before deleting friend');
      return;
    }

    const index = this.friends.findIndex(f => f.id === friend.id);
    if(index !== -1) {
      this.friends.splice(index, 1);
      storeFriendsInFile(this.friends)
      return true;
    }
    return false;
  }
}
