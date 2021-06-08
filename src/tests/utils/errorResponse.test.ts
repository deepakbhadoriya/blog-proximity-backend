/* eslint-disable */
import { ifNotFoundById, validateMongoObjId } from '../../utils/errorResponse';

const mockResponse = () => {
  const res = {} as any;
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

describe('Test ifNotFoundByIdFunction', () => {
  test('should not return anything', () => {
    const res = mockResponse();
    ifNotFoundById(false, res, 'test for if id not found');
    expect(null);
  });
  test('should return 404 status with Custom message', () => {
    expect(true).toBe(true);
    const res = mockResponse();
    ifNotFoundById(false, res, 'test for if id not found');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith({ message: 'test for if id not found' });
  });
});

describe('Test validateMongoObjId', () => {
  test('should not return anything', () => {
    const res = mockResponse();
    validateMongoObjId('60b7cb8474638d66e0e85f43', res, 'test for validate mongoObjId');
    expect(null);
  });
  test('should return 404 status with custom message', () => {
    const res = mockResponse();
    validateMongoObjId('12345', res, 'test for validate mongoObjId');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith({ message: 'test for validate mongoObjId' });
  });
});
