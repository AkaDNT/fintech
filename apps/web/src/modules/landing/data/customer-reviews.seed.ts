export interface CustomerReviewSeed {
  id: string;
  name: string;
  role: string;
  company: string;
  review: string;
  avatarText: string;
}

export const CUSTOMER_REVIEWS_SEED: CustomerReviewSeed[] = [
  {
    id: "cr-01",
    name: "Noah",
    role: "Regular User",
    company: "Yubeepay",
    review:
      "Whether I am paying bills or moving funds between wallets, everything feels instant and secure. The app has reduced my day-to-day friction a lot.",
    avatarText: "N",
  },
  {
    id: "cr-02",
    name: "Priya K.",
    role: "Small Business Owner",
    company: "Yubeepay",
    review:
      "Yubeepay makes online payments effortless. It is fast, reliable, and easy to use. I can track every transaction in real time without extra tools.",
    avatarText: "P",
  },
  {
    id: "cr-03",
    name: "Vik",
    role: "Freelancer",
    company: "Yubeepay",
    review:
      "With Yubeepay, sending and receiving money is intuitive and transparent. The transfer history is clear, and I always know where my funds are.",
    avatarText: "V",
  },
  {
    id: "cr-04",
    name: "Noah",
    role: "Regular User",
    company: "Yubeepay",
    review:
      "Whether I am paying bills or moving funds between wallets, everything feels instant and secure. The app has reduced my day-to-day friction a lot.",
    avatarText: "N",
  },
  {
    id: "cr-05",
    name: "Priya K.",
    role: "Small Business Owner",
    company: "Yubeepay",
    review:
      "Yubeepay makes online payments effortless. It is fast, reliable, and easy to use. I can track every transaction in real time without extra tools.",
    avatarText: "P",
  },
  {
    id: "cr-06",
    name: "Vik",
    role: "Freelancer",
    company: "Yubeepay",
    review:
      "With Yubeepay, sending and receiving money is intuitive and transparent. The transfer history is clear, and I always know where my funds are.",
    avatarText: "V",
  },
];

export const FEATURED_REVIEW_INDEX = 1;
