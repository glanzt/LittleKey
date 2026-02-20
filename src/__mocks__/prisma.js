const prisma = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  childProfile: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  userSettings: {
    findUnique: jest.fn(),
    upsert: jest.fn(),
  },
  userLevelProgress: {
    findMany: jest.fn(),
    upsert: jest.fn(),
  },
  userLetterStats: {
    findMany: jest.fn(),
    upsert: jest.fn(),
  },
  userGameSession: {
    findMany: jest.fn(),
    create: jest.fn(),
  },
  $transaction: jest.fn((ops) => Promise.resolve(ops)),
};

module.exports = prisma;
module.exports.default = prisma;
