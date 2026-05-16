const API_URL =
  'https://script.google.com/macros/s/AKfycbyK7jOW4JfAWWJaEIUdDrRUzIpemZDHN7Z6e97pbSg04qYXuELWGJ_eK2HCx2qv4Yg7w/exec';

export async function getApplicants() {

  const response = await fetch(
    `${API_URL}?action=getApplicants`
  );

  return response.json();
}

export async function createApplicant(data) {

  const response = await fetch(API_URL, {

    method: 'POST',

    body: JSON.stringify({
      action: 'create',
      ...data
    })
  });

  return response.json();
}
export async function deleteApplicant(id) {

  const response = await fetch(API_URL, {

    method: 'POST',

    body: JSON.stringify({
      action: 'delete',
      id
    })
  });

  return response.json();
}

export async function updateApplicant(data) {

  const response = await fetch(API_URL, {

    method: 'POST',

    body: JSON.stringify({
      action: 'update',
      ...data
    })
  });

  return response.json();
}

export async function updateStatus(
  id,
  status
) {

  const response =
    await fetch(API_URL, {

      method: 'POST',

      body: JSON.stringify({
        action: 'updateStatus',
        id,
        status
      })
    });

  return response.json();
}