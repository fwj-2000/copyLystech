export function findDepartment(data) {
  const parts = data.split('/');
  const departmentKeyword = '部';
  for (let part of parts) {
    if (part.includes(departmentKeyword)) {
      return part;
    }
  }
  return 'No department found';
}

export function findSection(data) {
  const parts = data.split('/');
  const departmentKeyword = '科';
  for (let part of parts) {
    if (part.includes(departmentKeyword)) {
      return part;
    }
  }
  return 'No department found';
}
