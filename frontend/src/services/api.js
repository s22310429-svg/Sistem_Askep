const API_BASE = 'http://localhost:5000/api';

function getToken() {
  return localStorage.getItem('askep_token');
}

function setToken(token) {
  localStorage.setItem('askep_token', token);
}

function removeToken() {
  localStorage.removeItem('askep_token');
}

function getStoredUser() {
  const u = localStorage.getItem('askep_user');
  return u ? JSON.parse(u) : null;
}

function setStoredUser(user) {
  localStorage.setItem('askep_user', JSON.stringify(user));
}

function removeStoredUser() {
  localStorage.removeItem('askep_user');
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (res.status === 401) {
    removeToken();
    removeStoredUser();
    window.location.href = '/';
    throw new Error('Sesi telah berakhir, silakan login kembali');
  }
  // Handle CSV/blob responses
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('text/csv')) {
    if (!res.ok) throw new Error('Export gagal');
    return res.blob();
  }
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Terjadi kesalahan');
  return data;
}

/* ============ AUTH ============ */
export async function login(username, password) {
  const data = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  setToken(data.token);
  setStoredUser(data.user);
  return data.user;
}

export async function register(username, email, fullname, password) {
  const data = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, email, fullname, password }),
  });
  setToken(data.token);
  setStoredUser(data.user);
  return data.user;
}

export async function getProfile() {
  return request('/auth/profile');
}

export async function updateProfile(fullname, email) {
  const data = await request('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify({ fullname, email }),
  });
  const user = getStoredUser();
  if (user) {
    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    setStoredUser(user);
  }
  return data;
}

export async function changePassword(oldPassword, newPassword) {
  return request('/auth/password', {
    method: 'PUT',
    body: JSON.stringify({ oldPassword, newPassword }),
  });
}

export async function logout() {
  try { await request('/auth/logout', { method: 'POST' }); } catch (e) { /* ignore */ }
  removeToken();
  removeStoredUser();
}

/* ============ PATIENTS ============ */
export async function getPatients() {
  return request('/patients');
}

export async function getPatient(id) {
  return request(`/patients/${id}`);
}

export async function createPatient(data) {
  return request('/patients', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updatePatient(id, data) {
  return request(`/patients/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deletePatient(id) {
  return request(`/patients/${id}`, { method: 'DELETE' });
}

/* ============ ASKEP AI PLAN ============ */
export async function generateAskepPlan(patient_id, assessment) {
  return request('/askep/generate', {
    method: 'POST',
    body: JSON.stringify({ patient_id, assessment }),
  });
}

export async function saveAskepPlan(patient_id, assessment, plan) {
  return request('/askep/save', {
    method: 'POST',
    body: JSON.stringify({ patient_id, assessment, plan }),
  });
}

export async function getAskepPlans() {
  return request('/askep');
}

export async function editIntervention(id, data) {
  return request(`/askep/intervention/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/* ============ IMPLEMENTATIONS ============ */
export async function getPendingInterventions() {
  return request('/implementations/pending');
}

export async function getCompletedImplementations() {
  return request('/implementations/completed');
}

export async function getImplementationDetail(id) {
  return request(`/implementations/${id}`);
}

export async function saveImplementation(data) {
  return request('/implementations', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function editImplementation(id, data) {
  return request(`/implementations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/* ============ EVALUATIONS ============ */
export async function getEvaluations() {
  return request('/evaluations');
}

export async function exportEvaluations() {
  return request('/evaluations/export');
}

/* ============ REPORTS ============ */
export async function getReports() {
  return request('/reports');
}

export async function getReportDetail(id) {
  return request(`/reports/${id}`);
}

export async function exportReports() {
  return request('/reports/export/csv');
}

/* ============ DASHBOARD ============ */
export async function getDashboardStats() {
  return request('/dashboard/stats');
}

export async function getDashboardActivities() {
  return request('/dashboard/activities');
}

/* ============ UTILS ============ */
export function downloadBlob(blob, filename) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

export { getToken, getStoredUser, removeToken, removeStoredUser };
