export const errorServiceMock = {
  notFound: jest.fn().mockResolvedValue(new Error('Not Found')),
  conflict: jest.fn().mockResolvedValue(new Error('Conflict')),
};
