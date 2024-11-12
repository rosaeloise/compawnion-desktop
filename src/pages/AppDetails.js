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
			vaccinationCount: 1,
			vaccination: [
				{
					name: null,
					date: null,
					expiry: null
				}
			],
			medicalHistoryCount: 1,
			medicalHistory: [
				{
					date: null,
					procedure: null,
					notes: null
				}
			],
			petID: 0
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

		const saveButton = document.getElementById('save');
		saveButton.addEventListener('click', () => {
			const petID = document.getElementById('petID').value;
			const name = document.getElementById('name').value;
			const type = document.getElementById('type').value;
			const gender = document.getElementById('gender').value;
			const breed = document.getElementById('breed').value;
			const ageYear = document.getElementById('ageYear').value;
			const ageMonth = document.getElementById('ageMonth').value;

			const attributes = document.getElementById('personality').value;
			const rescueStory = document.getElementById('backgroundStory').value;
			const rescueDate = document.getElementById('rescueDate').value;

			const weight = document.getElementById('weight').value;
			const size = document.getElementById('size').value;

			if (!petID || !name || !type || !breed || !ageYear || !ageMonth || !attributes || !rescueStory || !rescueDate || !weight || !size) {
				alert('Please fill out all fields.');
				return;
			}

			const vaccination = [];
			for (let i = 0; i < this.state.vaccinationCount; i++) {
				const vaccinationName = document.getElementsByName('vaccinationName')[i].value;
				const vaccinationDate = document.getElementsByName('vaccinationDate')[i].value;
				const vaccinationExpiry = document.getElementsByName('vaccinationExpiry')[i].value;
				vaccination.push({
					name: vaccinationName,
					date: vaccinationDate,
					expiry: vaccinationExpiry
				});
			};

			const medicalHistory = [];
			for (let i = 0; i < this.state.medicalHistoryCount; i++) {
				const medicalHistoryProcedure = document.getElementsByName('medicalHistoryProcedure')[i].value;
				const medicalHistoryDate = document.getElementsByName('medicalHistoryDate')[i].value;
				const medicalHistoryNotes = document.getElementsByName('medicalHistoryNotes')[i].value;
				medicalHistory.push({
					procedure: medicalHistoryProcedure,
					date: medicalHistoryDate,
					notes: medicalHistoryNotes
				});
			};

			const rfidTag = document.getElementById('rfidTag').value;

			if (!rfidTag) {
				alert('Please scan RFID.');
				return;
			};

			const image = document.getElementById('imageInput').files[0];
			// Convert image to base64
			const reader = new FileReader();
			reader.readAsDataURL(image);
			reader.onload = () => {
				const imageBase64 = reader.result;

				const data = {
					personal: {
						name: name,
						type: type,
						breed: breed,
						age: {
							year: ageYear,
							month: ageMonth
						},
						picture: imageBase64,
						gender: gender
					},
					background: {
						attributes: attributes,
						rescueStory: rescueStory,
						rescueDate: rescueDate,
						weight: weight,
						size: size,
						vaccination: vaccination,
						medicalHistory: medicalHistory
					},
					rfidTag: rfidTag,
				};

				for (const key in data) {
					if (data[key] === null) {
						alert('Please fill out all fields.');
						return;
					};
					if (typeof data[key] === 'object') {
						for (const k in data[key]) {
							if (data[key][k] === null) {
								alert('Please fill out all fields.');
								return;
							};
						};
					};
				};

				console.log(data);

				fetch('http://localhost:3000/ra', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(data)
				}).then(res => res.json()).then(res => {
					window.location.hash = '/rescues';
				});
			};
		});

		fetch('http://localhost:3000/ra', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		}).then(res => res.json()).then(res => {
			const petID = document.getElementById('petID');
			const petIDValue = (res.length + 1).toString().padStart(4, '0');
			this.setState({
				petID: petIDValue
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
								title='Save'
								id='save'
							/>
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
								disabled={true}
							/>
							<FormInput
								label='Name'
								type='text'
								id='type'
								name='type'
								disabled={true}
							/>
						</div>
						<div>
							<FormInput
								label='Pet Type'
								type='text'
								id='petID'
								name='petID'
								disabled={true}
							/>
							<FormInput
								label='Status'
								type='text'
								id='breed'
								name='breed'
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
								id='personality'
								name='personality'
								placeholder='Enter Room Link'
							/>
							<FormInput
								label='Date'
								type='date'
								id='backgroundStory'
								name='backgroundStory'

							/>
							<FormInput
								label='Time'
								type='time'
								id='rescueDate'
								name='rescueDate'
							/>
						</div>

						<h6>Onsite Interview Schedule</h6>
						<div>
							<FormInput
								label='Date'
								type='date'
								id='weight'
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