import { buildEndpoint } from "../utils/http.js";

export class LeetCodeApi {
  static async getDailyQuestion(): Promise<any> {
    const response = await fetch(
      `${buildEndpoint("http")}/api/leetcode/dailyQuestion`
    );
    return await response.json();
  }

  static async getQuestionByTitleSlug(titleSlug: string): Promise<any> {
    const response = await fetch(
      `${buildEndpoint("http")}/api/leetcode/select?titleSlug=${titleSlug}`
    );
    return await response.json();
  }

  // Pending: https://github.com/alfaarghya/alfa-leetcode-api/pull/27
  static async getRandomQuestion(): Promise<any> {
    const skip = Math.floor(Math.random() * 3219);
    const response = await fetch(
      `${buildEndpoint("http")}/api/leetcode/problems?limit=1&skip=${skip}`
    );
    return await response.json();
  }
}
