import React from 'react';

import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import Popup from '../components/Popup';
import FormInput from '../components/FormInput';

import '../css/addRescuedPet.css';

class AddRescuedPet extends React.Component {
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
						petID: petID,
						name: name,
						type: type,
						breed: breed,
						age: {
							year: ageYear,
							month: ageMonth
						},
						picture: imageBase64
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

					active='rescues'
				/>

				<form id='addRescuedPetMain'>
					<header id='header'>
						<h4>Add New Rescued Pet</h4>
						<div>
							<Button
								title='Save'
								id='save'
							/>
							<Button
								title='Cancel'
								theme='dark'

								onClick={() => {
									window.location.hash = '/rescues';
								}}
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
								placeholder='Enter pet name'
							/>
							<FormInput
								label='Type'
								type='dropdown'
								id='type'
								name='type'
								placeholder='Select type'

								options={[
									{
										value: 'cat',
										label: 'Cat'
									},
									{
										value: 'dog',
										label: 'Dog'
									}
								]}
							/>
							<span>
								<FormInput
									label='Age'
									type='number'
									id='ageYear'
									name='ageYear'
								/>
								<h6>Yr.</h6>

								<FormInput
									type='number'
									id='ageMonth'
									name='ageMonth'
								/>
								<h6>Months</h6>
							</span>
						</div>
						<div>
							<FormInput
								label='Pet ID'
								type='text'
								id='petID'
								name='petID'
								value='###-###'
								disabled={true}
							/>
							<FormInput
								label='Breed'
								type='dropdown'
								id='breed'
								name='breed'
								placeholder='Select breed'

								options={(() => {
									const cats = [
										{
											value: 'siamese',
											label: 'Siamese'
										},
										{
											value: 'persian',
											label: 'Persian'
										},
										{
											value: 'ragdoll',
											label: 'Ragdoll'
										}
									];
									const dogs = [
										{
											value: 'beagle',
											label: 'Beagle'
										},
										{
											value: 'bulldog',
											label: 'Bulldog'
										},
										{
											value: 'poodle',
											label: 'Poodle'
										}
									];

									const type = document.getElementById('type');
									if (!type) return [];

									type.addEventListener('change', () => {
										const breed = document.getElementById('breed');
										breed.value = '';

										const options = breed.querySelectorAll('option');
										for (const option of options) {
											option.remove();
										};

										const cats = [
											{
												value: 'siamese',
												label: 'Siamese'
											},
											{
												value: 'persian',
												label: 'Persian'
											},
											{
												value: 'ragdoll',
												label: 'Ragdoll'
											}
										];
										const dogs = [
											{
												value: 'beagle',
												label: 'Beagle'
											},
											{
												value: 'bulldog',
												label: 'Bulldog'
											},
											{
												value: 'poodle',
												label: 'Poodle'
											}
										];

										const type = document.getElementById('type');
										if (!type) return [];
										if (type.value === 'cat') {
											for (const cat of cats) {
												const option = document.createElement('option');
												option.value = cat.value;
												option.innerHTML = cat.label;
												breed.appendChild(option);
											};
										};
										if (type.value === 'dog') {
											for (const dog of dogs) {
												const option = document.createElement('option');
												option.value = dog.value;
												option.innerHTML = dog.label;
												breed.appendChild(option);
											};
										};
									});

									if (type.value === 'cat') return cats;
									if (type.value === 'dog') return dogs;
									return [];
								})()}
							/>
							<FormInput
								label='Gender'
								type='dropdown'
								id='gender'
								name='gender'
								placeholder='Select gender'

								options={[
									{
										value: 'male',
										label: 'Male'
									},
									{
										value: 'female',
										label: 'Female'
									}
								]}
							/>
						</div>
					</section>

					<section id='backgroundInfo'>
						<h6>Background</h6>
						<div>
							<FormInput
								label='Attributes/Personality'
								type='textarea'
								id='personality'
								name='personality'
								placeholder='Enter attributes or description'
							/>
							<FormInput
								label='Rescue Story'
								type='textarea'
								id='backgroundStory'
								name='backgroundStory'
								placeholder='Enter rescue story'
							/>
							<FormInput
								label='Rescue Date'
								type='date'
								id='rescueDate'
								name='rescueDate'
							/>
						</div>

						<h6>Medical Information</h6>
						<div>
							<FormInput
								label='Weight'
								type='number'
								id='weight'
								name='weight'
							/>
							<h6>Kg</h6>
							<FormInput
								label='Size'
								type='dropdown'
								id='size'
								name='size'

								options={[
									{
										value: 'small',
										label: 'Small'
									},
									{
										value: 'medium',
										label: 'Medium'
									},
									{
										value: 'large',
										label: 'Large'
									}
								]}
							/>
						</div>

						<h6>Vaccination</h6>
						<div id='vaccination'>
							{this.state.vaccination.map((vaccination, index) => {
								return (
									<div key={index}>
										<FormInput
											label='Name'
											type='dropdown'
											id='vaccinationName'
											name='vaccinationName'
											placeholder='Enter vaccination name'
											value={vaccination.name}

											options={[
												{
													value: '',
													label: ''
												},
												{
													value: 'antiRabies',
													label: 'Anti-Rabies'
												},
												{
													value: 'da2ppVaccine',
													label: 'DA2PP'
												},
												{
													value: 'leptospiraVaccine',
													label: 'Leptospira Vaccine  (Leptospirosis)'
												}
											]}
										/>
										<FormInput
											label='Date'
											type='date'
											id='vaccinationDate'
											name='vaccinationDate'
											placeholder='Enter vaccination date'
											value={vaccination.date}
										/>
										<FormInput
											label='Expiry'
											type='date'
											id='vaccinationExpiry'
											name='vaccinationExpiry'
											placeholder='Enter vaccination expiry'
											value={vaccination.expiry}
										/>

										{this.state.vaccinationCount > 1 && (
											<Button
												title='-'
												theme='dark'

												onClick={() => {
													this.setState({
														vaccinationCount: this.state.vaccinationCount - 1,
														vaccination: this.state.vaccination.filter((v, i) => i !== index)
													});
												}}
											/>
										)}
									</div>
								);
							})}
							<Button
								title='Add Vaccination'

								onClick={() => {
									this.setState({
										vaccinationCount: this.state.vaccinationCount + 1,
										vaccination: this.state.vaccination.concat([
											{
												name: null,
												date: null,
												expiry: null
											}
										])
									});
								}}
							/>
						</div>

						<h6>Medical History</h6>
						<div id='medicalHistory'>
							{this.state.medicalHistory.map((medicalHistory, index) => {
								return (
									<div key={index}>
										<FormInput
											label='Procedure'
											type='text'
											id='medicalHistoryProcedure'
											name='medicalHistoryProcedure'
											placeholder='Enter procedure'
											value={medicalHistory.procedure}
										/>
										<FormInput
											label='Date'
											type='date'
											id='medicalHistoryDate'
											name='medicalHistoryDate'
											placeholder='Enter date'
											value={medicalHistory.date}
										/>
										<span>
											<FormInput
												label='Notes'
												type='textarea'
												id='medicalHistoryNotes'
												name='medicalHistoryNotes'
												placeholder='Enter notes'
												value={medicalHistory.notes}
											/>

											{this.state.medicalHistoryCount > 1 && (
												<Button
													title='-'
													theme='dark'

													onClick={() => {
														this.setState({
															medicalHistoryCount: this.state.medicalHistoryCount - 1,
															medicalHistory: this.state.medicalHistory.filter((m, i) => i !== index)
														});
													}}
												/>
											)}
										</span>
									</div>
								);
							})}
							<Button
								title='Add Medical History'

								onClick={() => {
									this.setState({
										medicalHistoryCount: this.state.medicalHistoryCount + 1,
										medicalHistory: this.state.medicalHistory.concat([
											{
												date: null,
												procedure: null,
												vet: null,
												notes: null
											}
										])
									});
								}}
							/>
						</div>
					</section>

					<section id='rfid'>
						<h6>RFID</h6>
						<div>
							<FormInput
								label='Radio-frequency Identification Tag'
								type='password'
								id='rfidTag'
								name='rfidTag'
								placeholder='Enter RFID'
								disabled={true}

								onEnter={() => {
									const rfidTag = document.getElementById('rfidTag');
									rfidTag.disabled = true;
								}}
							/>
							<Button
								title='Scan RFID'
								
								onClick={() => {
									const rfidTag = document.getElementById('rfidTag');
									rfidTag.disabled = false;
									console.log(rfidTag);
									
									rfidTag.focus();
									console.log('Scanning RFID...');
									
								}}
							/>
						</div>
					</section>
				</form>
			</>
		)
	};
};

export default AddRescuedPet;