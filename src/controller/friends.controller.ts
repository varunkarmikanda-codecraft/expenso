import { ExistsError } from "../core/errors/exists.error.js";
import type { iFriend } from "../models/friend.model.js";
import { FriendRepository } from "../repository/friends.repository.js";

const repository = FriendRepository.getInstance();

export class FriendsController {
  getFriends() {
    return FriendRepository.getInstance().f;
  }

  async addFriend(friend: iFriend) {
    const conflictKeys = [];
    if(repository.findFriendByName(friend.name)) {
        conflictKeys.push('name');
    }
    if(friend.email && repository.findFriendByEmail(friend.email)) {
        conflictKeys.push('email');
    }
    if(friend.phone && repository.findFriendByPhone(friend.phone)) {
        conflictKeys.push('phone');
    }
    if(conflictKeys.length > 0) {
        throw new ExistsError('Friend data conflicts with existing friend', conflictKeys);
    }
    await repository.addFriend(friend);
  }

  searchFriends(query: string) {
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
    const conflictKeys = [];
    const existingFriendData = repository.findFriendByID(friend.id);

    if (!existingFriendData) {
        throw new Error("Friend not found");
    }

    if(existingFriendData.name !== friend.name) {
      if(repository.findFriendByName(friend.name)) {
        conflictKeys.push('name');
      }
    }
    if(existingFriendData.email !== friend.email) {
      if(friend.email && repository.findFriendByEmail(friend.email)) {
        conflictKeys.push('email');
      }
    }
    if(existingFriendData.phone !== friend.phone) {
      if(friend.phone && repository.findFriendByPhone(friend.phone)) {
        conflictKeys.push('phone');
      }
    }
    if(conflictKeys.length > 0) {
      throw new ExistsError('Friend data conflicts with existing friend', conflictKeys);
    }
    return await repository.updateFriends(friend);
  }

  async removeFriends(name: string) {
    if (!repository) {
      return { success: false };
    }
    await repository.removeFriends(name);
  }

  allFriends() {
    return repository.f;
  }
}
