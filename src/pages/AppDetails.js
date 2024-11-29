import React from 'react';

import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import Popup from '../components/Popup';
import FormInput from '../components/FormInput';

import '../css/appDetails.css';

class AppDetails extends React.Component {
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
			popupContent: <></>,
			application: {
				id: '',
				termsAndCondission: true,
				paymentAgreement: true,
				applicationType: '',
				applicationAppId: '',
				appPetID: null,
				petId: '',
				applicant: {
					name: {
						firstName: '',
						middleName: '',
						lastName: ''
					},
					birthdate: '',
					occupation: '',
					address: {
						country: '',
						province: '',
						cityOrMunicipality: '',
						baranggay: '',
						street: '',
						lot: ''
					},
					contact: {
						email: '',
						phoneNumber: '',
						facebook: ''
					}
				},
				dwelling: {
					type: '',
					ownership: '',
					numberOfHouseMembers: '',
					numberOfPets: '',
					petsAllowedInHouse: '',
					planningToMoveOut: ''
				},
				petCare: {
					petOwnershipExperience: '',
					veterinarian: ''
				},
				status: '',
				schedules: {}
			}
		};
	};
	componentDidMount() {
		fetch('http://localhost:3000/admins/me', {
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
			});

		const appID = (() => {
			const url = window.location.href;
			const id = url.split('/');
			return id[id.length - 1];
		})()
		fetch(`http://localhost:3000/application/${appID}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${localStorage.getItem('token')}`
			}
		})
			.then(res => res.json())
			.then(res => {
				this.setState({
					application: res.application
				});
			});
	};
	render() {
		return (
			<>
				<Popup>
					{this.state.popupContent}
				</Popup>

				<Sidebar
					avatar={this.state.user.avatar}
					name={this.state.user.name}
					role={this.state.user.role}

					active='applications'
				/>

				<form id='appDetailsMain'>
					<header id='header'>
						<h4>Application Info</h4>
						<div>
							<Button
								title='Cancel'
								theme='dark'

								onClick={() => {
									window.location.hash = '/applications';
								}}
							/>
						</div>
					</header>

					<section id='basicInfo'>
						<div>
							<FormInput
								label='Application ID'
								type='text'
								id='name'
								name='name'
								value={this.state.application.id}
								disabled={true}
							/>
							<FormInput
								label='Applicant Name'
								type='text'
								id='type'
								name='type'
								value={`${this.state.application.applicant.name.firstName} ${this.state.application.applicant.name.middleName} ${this.state.application.applicant.name.lastName}`}
								disabled={true}
							/>
						</div>
						<div>
							<FormInput
								label='Pet ID'
								type='text'
								id='petID'
								name='petID'
								value={this.state.application.petId}
								disabled={true}
							/>
							<FormInput
								label='Status'
								type='text'
								id='breed'
								name='breed'
								value={this.state.application.status}
								disabled={true}
							/>
						</div>
						<div>
							<h6>Application Details</h6>
							<Button
								title='View Application Form'
							/>
							<Button
								title='View Pets Information'
							/>
						</div>
					</section>

					<section id='backgroundInfo'>
						<h6>Online Interview Schedule</h6>
						<div>
							<FormInput
								label='Room Link'
								type='text'
								id='roomLink'
								name='roomLink'
								disabled={!(this.state.application.status === '' || this.state.application.status === undefined || this.state.application.status === 'Pending')}
								value={this.state.application.schedules?.roomLink}
								placeholder='Enter Room Link'
							/>
							<FormInput
								label='Date'
								type='date'
								id='meetingDate'
								disabled={!(this.state.application.status === '' || this.state.application.status === undefined || this.state.application.status === 'Pending')}
								value={this.state.application.schedules?.roomLink}
								name='meetingDate'

							/>
							<FormInput
								label='Time'
								type='time'
								id='Time'
								disabled={!(this.state.application.status === '' || this.state.application.status === undefined || this.state.application.status === 'Pending')}
								value={this.state.application.schedules?.Time}
								name='Time'
							/>
						</div>

						<h6>Onsite Interview Schedule</h6>
						<div>
							<FormInput
								label='Date'
								type='date'
								id='OnSiteMeetingDate'
								disabled={this.state.application.status !== 'Online Approved'}
								value={this.state.application.schedules?.OnsiteMeetingDate}
								name='OnSiteMeetingDate'
							/>
						</div>
					</section>

					<section id='buttons'>
						<Button
							title='Print Contract'
							onClick={() => {
								window.location.hash = `/contract/${this.state.application.applicationAppId}`;
							}}
						/>
						<Button
							title='Approve'
							onClick={async () => {
								if (
									this.state.application.status === '' ||
									this.state.application.status === undefined ||
									this.state.application.status === 'Pending'
								) {
									if (document.getElementById('roomLink').value === '' || document.getElementById('meetingDate').value === '' || document.getElementById('Time').value === '') {
										alert('Please fill up the required fields.');
										return;
									};
									const response = await fetch(`http://localhost:3000/application/${this.state.application.id}/onlineApprove`, {
										method: 'POST',
										headers: {
											'Content-Type': 'application/json',
											'Authorization': `Bearer ${localStorage.getItem('token')}`
										},
										body: JSON.stringify({
											schedules: {
												roomLink: document.getElementById('roomLink').value,
												meetingDate: document.getElementById('meetingDate').value,
												Time: document.getElementById('Time').value
											}
										})
									});

									if (response.status === 200) {
										alert('Application approved.');
										window.location.hash = '/applications';
									} else {
										alert('Failed to approve application.');
									};
								};

								if (this.state.application.status === 'Online Approved') {
									if (document.getElementById('OnSiteMeetingDate').value === '') {
										alert('Please fill up the required fields.');
										return;
									};
									const response = await fetch(`http://localhost:3000/application/${this.state.application.id}/onsiteApprove`, {
										method: 'PUT',
										headers: {
											'Content-Type': 'application/json',
											'Authorization': `Bearer ${localStorage.getItem('token')}`
										},
										body: JSON.stringify({
											schedules: {
												OnsiteMeetingDate: document.getElementById('OnSiteMeetingDate').value
											}
										})
									});

									if (response.status === 200) {
										alert('Application approved.');
										window.location.hash = '/applications';
									} else {
										alert('Failed to approve application.');
									};
								};

								if (this.state.application.status === 'Waiting for Final Approval') {
									const response = await fetch(`http://localhost:3000/application/${this.state.application.id}/approve`, {
										method: 'POST',
										headers: {
											'Content-Type': 'application/json',
											'Authorization': `Bearer ${localStorage.getItem('token')}`
										}
									});

									if (response.status === 200) {
										alert('Application approved.');
										window.location.hash = '/applications';
									} else {
										alert('Failed to approve application.');
									};
								};
							}}
						/>
						<Button
							title='Decline'
						/>
					</section>
				</form>
			</>
		)
	};
};

export default AppDetails;