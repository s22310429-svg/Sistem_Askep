
import React from 'react';
import '../assets/Profile.css';

const dummyProfile = {
	namaLengkap: 'Administrator Sistem Askep',
	username: 'Sergio',
	email: 'sergio@sistemaskep.local',
	tanggalBergabung: '27 September 2025, 22:31 WIB',
	loginTerakhir: '30 September 2025, 14:11 WIB',
	status: 'Aktif',
};

const dummyLog = [
  { waktu: '27/09/2025 22:31', aktivitas: 'Login Sistem', detail: 'Akses dashboard utama', status: 'Berhasil' },
  { waktu: '26/09/2025 14:30', aktivitas: 'Update Data', detail: 'Menambah data penelitian baru', status: 'Berhasil' },
  { waktu: '25/09/2025 09:15', aktivitas: 'Export Laporan', detail: 'Download laporan bulanan', status: 'Berhasil' },
];

const Profile = ({ user }) => {
  const profile = user || dummyProfile;
  return (
		<div className="profile-page">
			{/* Decorative SVG Accent */}
			<div className="profile-bg-accent">
				<svg width="320" height="120" viewBox="0 0 320 120" fill="none" xmlns="http://www.w3.org/2000/svg">
					<ellipse cx="160" cy="60" rx="140" ry="40" fill="#2563eb" opacity="0.08"/>
					<ellipse cx="240" cy="30" rx="60" ry="18" fill="#60a5fa" opacity="0.10"/>
				</svg>
			</div>

			<div className="profile-header">
				<div className="profile-header-left">
					<div className="profile-avatar">{profile.username?.charAt(0).toUpperCase()}</div>
					<div className="profile-header-info">
						<h2>{profile.namaLengkap}</h2>
						<span className="profile-role">@{profile.username} • <span className="profile-email">{profile.email}</span></span>
					</div>
				</div>
				<div className="profile-join-date">
					Bergabung sejak <b>{profile.tanggalBergabung}</b>
				</div>
			</div>

			<div className="profile-divider"></div>

			<div className="profile-main-grid">
				<div className="profile-info-card">
					<h3>Informasi Profil</h3>
					<table className="profile-info-table">
						<tbody>
							<tr><td>Nama Lengkap</td><td>{profile.namaLengkap}</td></tr>
							<tr><td>Username</td><td className="profile-username">{profile.username}</td></tr>
							<tr><td>Email</td><td className="profile-email">{profile.email}</td></tr>
							<tr><td>Tanggal Bergabung</td><td>{profile.tanggalBergabung}</td></tr>
							<tr><td>Login Terakhir</td><td>{profile.loginTerakhir}</td></tr>
							<tr><td>Status Akun</td><td><span className="profile-status active">{profile.status}</span></td></tr>
						</tbody>
					</table>
				</div>

				<div className="profile-settings-card">
					<h3>Pengaturan Akun</h3>
					<button className="btn-edit-profile">Edit Profil</button>
					<button className="btn-change-password">Ubah Password</button>
					<button className="btn-back-dashboard">← Kembali ke Dashboard</button>
					<div className="profile-stats">
						<div><b>Bergabung:</b> 27 Sep 2025</div>
						<div><b>Total login:</b> 15+</div>
						<div><b>Keamanan:</b> <span className="profile-safe">Aman</span></div>
					</div>
				</div>
			</div>

			<div className="profile-log-card">
				<h3>Riwayat Aktivitas Terbaru</h3>
				<table className="profile-log-table">
					<thead>
						<tr>
							<th>Waktu</th>
							<th>Aktivitas</th>
							<th>Detail</th>
							<th>Status</th>
						</tr>
					</thead>
					<tbody>
						{(user?.log || dummyLog).map((log, idx) => (
							<tr key={idx}>
								<td>{log.waktu}</td>
								<td>{log.aktivitas}</td>
								<td>{log.detail}</td>
								<td><span className="profile-log-status success">{log.status}</span></td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default Profile;
