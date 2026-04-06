import type { iFriend } from "../models/friend.model.js";
import { FriendRepository } from "../repository/friends.repository.js";

const repository = FriendRepository.getInstance();

export class FriendsController {
  getFriends() {
    return FriendRepository.getInstance().f;
  }

  async addFriend(friend: iFriend) {
    console.log("Attempting to add a friend...", friend);
    await repository.addFriend(friend);
  }

  searchFriends(query: string) {
    console.log("Search for friend in database...");
    return repository.searchFriends(query, {
      offset: 0,
      limit: repository.f.length,
    });
  }

  findFriend(name: string) {
    if (!repository) {
      return undefined;
    }
    return repository.findFriendByName(name);
  }

  async updateFriends(friend: iFriend) {
    if (!repository) {
      return { success: false };
    }
    console.log(`Updated ${friend.name}...`);
    return await repository.updateFriends(friend);
  }

  async removeFriends(name: string) {
    if (!repository) {
      return { success: false };
    }
    console.log(`Deleted ${name}...`);
    await repository.removeFriends(name);
  }

  allFriends() {
    return repository.f;
  }
}
