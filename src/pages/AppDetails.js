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
				branches: '',
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
		fetch('https://compawnion-backend.onrender.com/admins/me', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${localStorage.getItem('token')}`
			}
		})
			.then(res => res.json())
			.then(res => {
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
					window.location.hash = '/login';
				};
			});

		const appID = (() => {
			const url = window.location.hash;
			const id = url.split('/');
			return id[id.length - 1];
		})()
		fetch(`https://compawnion-backend.onrender.com/application/${appID}`, {
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
					branches={this.state.user.branches}

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
						{
							this.state.application.status !== 'Online Approved' && <Button
								title='Print Contract'
								onClick={() => {
									window.location.hash = `/contract/${this.state.application.applicationAppId}`;
								}}
							/>
						}
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
									const response = await fetch(`https://compawnion-backend.onrender.com/application/${this.state.application.id}/onlineApprove`, {
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
									const response = await fetch(`https://compawnion-backend.onrender.com/application/${this.state.application.id}/onsiteApprove`, {
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
									const response = await fetch(`https://compawnion-backend.onrender.com/application/${this.state.application.id}/approve`, {
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
							title="Decline"
							onClick={async () => {
								// Confirm if the user really wants to decline the application
								const confirmDecline = window.confirm(
									"Are you sure you want to decline this application?"
								);

								if (!confirmDecline) return;

								try {
									const response = await fetch(
										`https://compawnion-backend.onrender.com/application/${this.state.application.id}/reject`,
										{
											method: "PUT", // Use the appropriate method based on your backend
											headers: {
												"Content-Type": "application/json",
												Authorization: `Bearer ${localStorage.getItem("token")}`,
											},
										}
									);

									if (response.status === 200) {
										alert("Application declined successfully.");
										// Redirect to the applications list page
										window.location.hash = "/applications";
									} else {
										// Handle error response
										const errorData = await response.json();
										alert(`Failed to decline application: ${errorData.message}`);
									}
								} catch (error) {
									console.error("Error declining application:", error);
									alert("An error occurred while declining the application. Please try again.");
								}
							}}
						/>
					</section>
				</form>
			</>
		)
	};
};

export default AppDetails;