import dummyData from "@/lib/data";
import { CreateUserPrams, GetMenuParams, SignInParams } from "@/type";
import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
  platform: "prm.foodordering",
  databaseId: "68a5a87b00165fd93783",
  bucketId: "68a6d427000b8018d0a7",
  userCollectionId: "68a5a8c3000b09010004",
  categoriesCollectionId: "68a6cf08001fe72834d2",
  menuCollectionId: "68a6cf8d00318b1ce722",
  customizationsCollectionId: "68a6d10a001d1eca6dd3",
  menuCustomizationsCollectionId: "68a6d1da0001b38fc01f",
};

export const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId);
// .setPlatform(appwriteConfig.platform)
console.log("Endpoint:", appwriteConfig.endpoint);
console.log("Project ID:", appwriteConfig.projectId);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
const avatars = new Avatars(client);

export const createUser = async ({
  email,
  password,
  name,
}: CreateUserPrams) => {
  try {
    const newAccount = await account.create(ID.unique(), email, password, name);
    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitialsURL(name);

    return await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      { email, name, accountId: newAccount.$id, avatar: avatarUrl }
    );
  } catch (e) {
    console.error("Create user error:", e);
    throw new Error(e as string);
  }
};

export const signIn = async ({ email, password }: SignInParams) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    console.log("Signing in with:", email);
  } catch (e) {
    throw new Error(e as string);
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (e) {
    console.log(e);
    throw new Error(e as string);
  }
};
export const getMenu = async ({ category, query }: GetMenuParams) => {
  // Use local dummy data instead of Appwrite for menus
  const normalizedCategory = (category || "").trim();
  const normalizedQuery = (query || "").trim().toLowerCase();

  const filtered = dummyData.menu.filter((item) => {
    const byCategory =
      !normalizedCategory || normalizedCategory === "all"
        ? true
        : item.category_name === normalizedCategory;
    const byQuery = !normalizedQuery
      ? true
      : item.name.toLowerCase().includes(normalizedQuery);
    return byCategory && byQuery;
  });

  // Attach minimal ids for UI keying; keep other fields as-is
  return filtered.map((item, index) => ({
    $id: `${item.name}-${index}`,
    ...item,
  }));
};

export const getCategories = async (
  _params?: Record<string, string | number>
) => {
  // Use local dummy data instead of Appwrite for categories
  return dummyData.categories.map((c) => ({
    $id: c.name,
    name: c.name,
    description: c.description,
  }));
};
