import * as fs from "node:fs";

const FILE_PATH = 'src/assets/friends.json';

export const storeFriendsInFile = <T>(data: T[]): void => {
  const friendsData = JSON.stringify(data, null, 2);

  console.log('Saved to file');
  fs.writeFileSync(FILE_PATH, friendsData);
};

export const getFriendsFromFile = (): [] => {
  if (!fs.existsSync(FILE_PATH)) return [];
  const retrievedFriends = fs.readFileSync(FILE_PATH, "utf-8");
  console.log('Fetched from file');
  return JSON.parse(retrievedFriends);
};
