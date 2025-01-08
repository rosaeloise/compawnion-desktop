import React from 'react';

import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import Popup from '../components/Popup';
import FormInput from '../components/FormInput';

import '../css/appDetails.css';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

class CompawnionInfo extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			user: {
				avatar: '',
				name: '',
				branches: '',
				username: ''
			},
			compawnion: {
				id: '',
				LastLogout: null,
				Status: '',
				LastLogin: '',
				CompawnionUser: {
					MedSched: [],
					TrustedVet: [],
					appPetID: '',
					accountCreate: {
						Name: '',
						FirstName: '',
						LastName: '',
						Username: '',
						Email: '',
						PhoneNumber: '',
					},
					CompawnionSched: [
						{
							GmeetRoom: '',
							CSTime: '',
							EventTitle: '',
							CSDate: '',
						}
					]
				}
			},
			popupContent: <></>,
			appPetID: 0
		};
	}

	componentDidMount() {
		// Fetch logged-in admin's info
		fetch('https://compawnion-backend.onrender.com/admins/me', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${localStorage.getItem('token')}`
			}
		})
			.then(res => res.json())
			.then(async res => {
				try {
					this.setState({
						user: {
							avatar: res.aStaffInfo.Picture,
							name: res.aStaffInfo.Name,
							branches: res.aStaffInfo.Branches,
							username: res.aStaffInfo.Username
						}
					});
				} catch (error) {
					localStorage.removeItem('token');
					await MySwal.fire({
						title: <h4>Session Expired</h4>,
						html: <p>Please login again.</p>,
						icon: 'error',
						iconColor: 'var(--primary-color)',
						confirmButtonColor: 'var(--primary-color)'
					});
					window.location.hash = '/login';
				};
			})
			.catch(error => console.error('Error fetching admin data:', error));

		// Get Compawnion ID from URL
		const compawnionID = (() => {
			const url = window.location.hash;
			const id = url.split('/').pop();
			return id;
		})();

		// Fetch Compawnion info
		fetch(`https://compawnion-backend.onrender.com/compawnions/${compawnionID}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${localStorage.getItem('token')}`
			}
		})
			.then(res => res.json())
			.then(res => {
				this.setState({
					compawnion: res.data
				});
				console.log(res.data);
			})
			.catch(error => console.error('Error fetching compawnion data:', error));
	}

	render() {
		const { user, compawnion } = this.state;

		return (
			<>
				<Popup>
					{this.state.popupContent}
				</Popup>

				<Sidebar
					avatar={user.avatar}
					name={user.name}
					branches={user.branches}
					active="compawnions"
				/>

				<form id="appDetailsMain">
					<header id="header">
						<h4>Compawnion User Info</h4>
						<div>
							<Button
								title="Cancel"
								theme="dark"
								onClick={() => {
									window.location.hash = '/compawnions';
								}}
							/>
						</div>
					</header>

					<section id="basicInfo">
						<div>
							<FormInput
								label="Name"
								type="text"
								id="name"
								name="name"
								value={this.state.compawnion.CompawnionUser.accountCreate.Name || ''}
								disabled={true}
							/>
							<FormInput
								label="Account ID"
								type="text"
								id="id"
								name="id"
								value={compawnion?.id || ''}
								disabled={true}
							/>
						</div>
						<div>
							<FormInput
								label="Username"
								type="text"
								id="username"
								name="username"
								value={this.state.compawnion.CompawnionUser.accountCreate.Username || ''}
								disabled={true}
							/>
							<FormInput
								label="Email"
								type="text"
								id="email"
								name="email"
								value={this.state.compawnion.CompawnionUser.accountCreate.Email || ''}
								disabled={true}
							/>
						</div>
						<div>
							<h6>Application Details</h6>
							<Button
								title="View Application Form"
							/>
							<Button
								title="View Pets Information"
								onClick={() => {
									window.location.hash = `/adopted/${this.state.compawnion.CompawnionUser.appPetID}`;
								}}
							/>
						</div>
					</section>

					<section id="backgroundInfo">
						<h6>Compawnion Online Checking Schedule</h6>
						<div>
							<FormInput
								label="Title"
								type="text"
								id="title"
								name="title"
								placeholder="Enter Title"
							/>
							<FormInput
								label="Room Link"
								type="text"
								id="roomlink"
								name="roomlink"
								placeholder="Enter Room Link"
							/>
							<FormInput
								label="Date"
								type="date"
								id="date"
								name="date"
							/>
							<FormInput
								label="Time"
								type="time"
								id="time"
								name="time"
							/>
						</div>
					</section>

					<section id="buttons">
						<Button
							title="Save"
							onClick={() => {
								const title = document.getElementById('title').value;
								const roomLink = document.getElementById('roomlink').value;
								const date = document.getElementById('date').value;
								const time = document.getElementById('time').value;

								fetch(`https://compawnion-backend.onrender.com/Compawnions/addCompawnionSched/${compawnion.id}`, {
									method: 'POST',
									headers: {
										'Content-Type': 'application/json',
										'Authorization': `Bearer ${localStorage.getItem('token')}`
									},
									body: JSON.stringify({
										CompawnionSched: {
											EventTitle: title,
											CSDate: date,
											CSTime: time,
											GmeetRoom: roomLink
										}
									})
								}).then(res => {
									if (res.status === 200) {
										alert('Compawnion Online Checking Schedule added successfully.');
										window.location.hash = '/compawnions';
									} else {
										alert('Failed to add Compawnion Online Checking Schedule.');
									}
								});
							}}
						/>

						<Button
							title="Delete Account"
							onClick={() => {
								MySwal.fire({
									title: <h4>Delete Account</h4>,
									html: <>
										<p>Please enter username and password to delete this account.</p>
										<FormInput
											label="Username"
											type="text"
											id="username"
											name="username"
										/>
										<FormInput
											label="Password"
											type="password"
											id="password"
											name="password"
										/>
									</>,
									width: '60rem',
									icon: 'warning',
									iconColor: 'var(--primary-color)',
									showCancelButton: true,
									confirmButtonText: 'Delete',
									confirmButtonColor: 'var(--primary-color)',
									cancelButtonText: 'Cancel',
									cancelButtonColor: 'var(--primary-color)',
									preConfirm: () => {
										const username = document.getElementById('username').value;
										const password = document.getElementById('password').value;

										fetch(`https://compawnion-backend.onrender.com/Compawnions/${compawnion.id}`, {
											method: 'DELETE',
											headers: {
												'Content-Type': 'application/json',
												'Authorization': `Bearer ${localStorage.getItem('token')}`
											},
											body: JSON.stringify({
												adminUsername: user.username,
												adminPassword: password
											})
										}).then(res => {
											if (res.status === 200) {
												alert('Compawnion User deleted successfully.');
												window.location.hash = '/compawnions';
											} else {
												alert('Failed to delete Compawnion User.');
											}
										});
									}
								});
							}}
						/>
					</section>
				</form>
			</>
		);
	}
}

export default CompawnionInfo;
