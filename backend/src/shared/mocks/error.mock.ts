export const errorServiceMock = {
  notFound: jest.fn().mockRejectedValueOnce(new Error('Not Found')),
  conflict: jest.fn().mockRejectedValueOnce(new Error('Conflict')),
};
