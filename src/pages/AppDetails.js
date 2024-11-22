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
				id: '066',
				termsAndCondission: true,
				paymentAgreement: true,
				applicationType: 'Online Application',
				applicationAppId: '066',
				appPetID: null,
				petId: '032',
				applicant: {
					name: {
						firstName: 'Kim Zedric',
						middleName: 'V',
						lastName: 'Rama'
					},
					birthdate: '',
					occupation: 'student',
					address: {
						country: 'Philippines',
						province: 'Rizal',
						cityOrMunicipality: 'Rodriguez',
						baranggay: 'San Jose',
						street: 'Hilltop Abatex',
						lot: ''
					},
					contact: {
						email: 'zedrama30@gmail.com',
						phoneNumber: '1234567890',
						facebook: ''
					}
				},
				dwelling: {
					type: 'Single-Storey House/Bungalow',
					ownership: 'Owned',
					numberOfHouseMembers: '3',
					numberOfPets: 'None',
					petsAllowedInHouse: 'No',
					planningToMoveOut: 'Yes'
				},
				petCare: {
					petOwnershipExperience: 'First Time/New pet-owner',
					veterinarian: 'Animal Clinic'
				},
				status: 'Waiting for Final Approval',
				schedules: {
					OnsiteMeetingDate: '2024-12-31'
				}
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
								disabled={this.state.application.status === 'Online Approved'}
								value={this.state.application.schedules?.roomLink}
								placeholder='Enter Room Link'
							/>
							<FormInput
								label='Date'
								type='date'
								id='meetingDate'
								disabled={this.state.application.status === 'Online Approved'}
								value={this.state.application.schedules?.roomLink}
								name='meetingDate'

							/>
							<FormInput
								label='Time'
								type='time'
								id='Time'
								disabled={this.state.application.status === 'Online Approved'}
								value={this.state.application.schedules?.roomLink}
								name='Time'
							/>
						</div>

						<h6>Onsite Interview Schedule</h6>
						<div>
							<FormInput
								label='Date'
								type='date'
								id='weight'
								disabled={this.state.application.status !== 'Online Approved'}
								name='weight'
							/>
						</div>
					</section>

					<section id='buttons'>
						<Button
							title='Print Contract'
						/>
						<Button
							title='Approve'
							onClick={async () => {
								if (this.state.application.status !== 'Online Approved') {
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