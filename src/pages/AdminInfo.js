import React from 'react';

import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import Popup from '../components/Popup';
import FormInput from '../components/FormInput';

import '../css/adminInfo.css';

class AdminInfo extends React.Component {
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
					window.location.href = '/login';
				};
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

				fetch('https://compawnion-backend.onrender.com/ra', {
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

		fetch('https://compawnion-backend.onrender.com/ra', {
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
					branches={this.state.user.branches}

					active='rescues'
				/>

				<form id='addRescuedPetMain'>
					<header id='header'>
						<h4>Admin Info</h4>
						<div>
							<Button
								title='Save'
								id='save'
							/>
						</div>
					</header>

					<section id='basicInfo'>
						<div id='image'>
							<input type='file' name='imageInput' id='imageInput' accept="image/*" />
							<div id='img' onClick={() => {
								const imageInput = document.getElementById('imageInput');
								imageInput.onchange = () => {
									const file = imageInput.files[0];
									const img = document.getElementById('img');
									const reader = new FileReader();

									reader.onload = (e) => {
										img.style.backgroundImage = `url(${e.target.result})`;
									};

									if (file) reader.readAsDataURL(file);
								};

								imageInput.click();
							}} />
							<Button
								title='Upload Image'
								theme='dark'
								fill='outline'

								onClick={() => {
									const img = document.getElementById('img');
									img.click();
								}}
							/>
						</div>

						<div>
							<FormInput
								label='Name'
								type='text'
								id='name'
								name='name'
								placeholder='Name'
							/>
							<FormInput
								label='Type'
								type='text'
								id='type'
								name='type'
								placeholder='Username'
								disabled={true}	
							/>
							<FormInput
								label='Branch'
								type='text'
								id='ageYear'
								name='ageYear'
								placeholder='Branch'
								disabled={true}
							/>
						</div>
						<div>
							<FormInput
								label='Admin'
								type='text'
								id='petID'
								name='petID'
								value='###-###'
								disabled={true}
							/>
							<FormInput
								label='Email'
								type='test'
								id='breed'
								name='breed'
								placeholder='Email'
							/>
							<FormInput
								label='Phone Number'
								type='number'
								id='gender'
								name='gender'
								placeholder='Phone Number'
							/>
						</div>
					</section>
				</form>
			</>
		);
	}
};

export default AdminInfo;