const {
  writeFragment,
  readFragment,
  writeFragmentData,
  readFragmentData,
} = require('../../src/model/data/memory/index');

describe('Memory testing', () => {
  test('invalid fragment should throw error', async () => {
    const fragmentTest = { ownerId: 'a', id: 1, body: 'abcd' };
    expect(async () => await writeFragment(fragmentTest)).rejects.toThrow();
  });

  test('writeFragment returns nothing ', async () => {
    const fragmentTest = { ownerId: 'a', id: 'b', body: 'abcd' };
    const res = await writeFragment(fragmentTest);

    expect(res).toBe(undefined);
  });

  test('readFragment reads what writeFragment inserted to db', async () => {
    const data = Buffer.from('asdf');
    const fragmentTest = { ownerId: 'a', id: 'b', data };
    await writeFragment(fragmentTest);

    const fragment = await readFragment('a', 'b');
    expect(fragment.ownerId).toBe('a');
    expect(fragment.id).toBe('b');
    expect(fragment.data).toBe(data);
  });

  test('writeFragmentData writes to the db and returns nothing', async () => {
    const res = await writeFragmentData('a', 'b', Buffer.from('asdf'));
    expect(res).toBe(undefined);
  });

  test('readFragmentData reads what writeFragmentData inserted to db', async () => {
    const data = Buffer.from('qwerty');
    await writeFragmentData('a', 'b', data);

    const res = await readFragmentData('a', 'b');
    expect(res).toBe(data);
  });

  test('readFragmentData reads what writeFragmentData inserted to db', async () => {
    const data = Buffer.from('qwerty');
    await writeFragmentData('a', 'b', data);

    const res = await readFragmentData('a', 'b');
    expect(res).toBe(data);
  });

  /*
  // Uncomment for assignment 2. Accidentally wrote the function.
  test('listFragments returns empty array if there are none assocaited to ownerId', async () => {
    const res = await listFragments('randomOwnerIDThatDoesNotExist', false);
    expect(Array.isArray(res));
    expect(res).toEqual([]);
  });
  */
});
