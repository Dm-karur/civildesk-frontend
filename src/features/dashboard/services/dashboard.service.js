import { dashboardData } from '../data/dashboard.mock';

// Simulates network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const dashboardService = {
  getSummary: async () => {
    await delay(800);
    // Simulate occasional error for testing if needed (disabled by default)
    // if (Math.random() > 0.9) throw new Error("Network Error");
    return dashboardData;
  }
};
