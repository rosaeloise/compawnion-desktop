import React from 'react';

import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import Popup from '../components/Popup';
import FormInput from '../components/FormInput';

import '../css/appDetails.css';

class CompawnionInfo extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			user: {
				avatar: '',
				name: '',
				role: '',
				username: ''
			},
			compawnion: {
				id: '',
				name: '',
				compawnionUser: {
					accountCreate: {
						username: '',
						email: '',
					},
				},
			},
			popupContent: <></>,
			petID: 0
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
			.then(res => {
				this.setState({
					user: {
						avatar: res.aStaffInfo.Picture,
						name: res.aStaffInfo.Name,
						role: res.aStaffInfo.Branches,
						username: res.aStaffInfo.Username
					}
				});
			})
			.catch(error => console.error('Error fetching admin data:', error));

		// Get Compawnion ID from URL
		const compawnionID = (() => {
			const url = window.location.href;
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
					compawnion: res
				});
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
					role={user.role}
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
								value={compawnion?.name || ''}
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
								value={compawnion?.compawnionUser?.accountCreate?.username || ''}
								disabled={true}
							/>
							<FormInput
								label="Email"
								type="text"
								id="email"
								name="email"
								value={compawnion?.compawnionUser?.accountCreate?.email || ''}
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
							/>
						</div>
					</section>

					<section id="backgroundInfo">
						<h6>Compawnion Online Checking Schedule</h6>
						<div>
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
							title="Delete Account"
							onClick={() => alert('Account deletion is not yet implemented.')}
						/>
					</section>
				</form>
			</>
		);
	}
}

export default CompawnionInfo;
