import React from 'react';

import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import Popup from '../components/Popup';
import FormInput from '../components/FormInput';

import '../css/rescuedInfo.css';

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

		// Get pet ID from URL
		const petIDFromURL = window.location.hash.split('/').pop();
		if (petIDFromURL) {
			fetch(`http://localhost:3000/ra/${petIDFromURL}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			}).then(res => res.json()).then(res => {
				const personal = res.personal;
				const background = res.background;

				document.getElementById('petID').value = res.petId;
				document.getElementById('name').value = personal.name;
				document.getElementById('type').value = personal.type;
				document.getElementById('breed').value = personal.breed;
				document.getElementById('gender').value = personal.gender;
				document.getElementById('ageYear').value = personal.age.year;
				document.getElementById('ageMonth').value = personal.age.month;
				document.getElementById('img').style.backgroundImage = `url(${personal.picture})`;

				document.getElementById('personality').value = background.attributes;
				document.getElementById('backgroundStory').value = background.rescueStory;
				document.getElementById('rescueDate').value = background.rescueDate;
				document.getElementById('weight').value = background.weight;
				document.getElementById('size').value = background.size;

				const vaccination = background.vaccination;
				this.setState({
					vaccinationCount: vaccination.length,
					vaccination: vaccination
				});

				const medicalHistory = background.medicalHistory;
				this.setState({
					medicalHistoryCount: medicalHistory.length,
					medicalHistory: medicalHistory
				});

				document.getElementById('rfidTag').value = res.rfidTag;

				// Update breed options based on type
				const typeElement = document.getElementById('type');
				const breedElement = document.getElementById('breed');
				const breedOptions = {
					cat: [
						{ value: 'Siamese', label: 'Siamese' },
						{ value: 'Persian', label: 'Persian' },
						{ value: 'Ragdoll', label: 'Ragdoll' }
					],
					dog: [
						{ value: 'Beagle', label: 'Beagle' },
						{ value: 'Bulldog', label: 'Bulldog' },
						{ value: 'Poodle', label: 'Poodle' }
					]
				};

				const updateBreedOptions = () => {
					const selectedType = typeElement.value;
					const options = breedOptions[selectedType] || [];
					breedElement.innerHTML = '';
					options.forEach(option => {
						const opt = document.createElement('option');
						opt.value = option.value;
						opt.textContent = option.label;
						breedElement.appendChild(opt);
					});
					breedElement.value = personal.breed;
				};

				typeElement.addEventListener('change', updateBreedOptions);
				updateBreedOptions();
			});
		};

		// Update rescued info
		const updateButton = document.getElementById('update');
		updateButton.addEventListener('click', async () => {
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

			const vaccination = Array.from({ length: this.state.vaccinationCount }, (_, i) => ({
				name: document.getElementsByName('vaccinationName')[i].value,
				date: document.getElementsByName('vaccinationDate')[i].value,
				expiry: document.getElementsByName('vaccinationExpiry')[i].value
			}));

			const medicalHistory = Array.from({ length: this.state.medicalHistoryCount }, (_, i) => ({
				procedure: document.getElementsByName('medicalHistoryProcedure')[i].value,
				date: document.getElementsByName('medicalHistoryDate')[i].value,
				notes: document.getElementsByName('medicalHistoryNotes')[i].value
			}));

			const rfidTag = document.getElementById('rfidTag').value;

			if (!rfidTag) {
				alert('Please scan RFID.');
				return;
			}

			const imageInput = document.getElementById('imageInput').files[0];
			const data = {
				personal: {
					name,
					type,
					breed,
					age: {
						year: ageYear,
						month: ageMonth
					},
					picture: null
				},
				background: {
					attributes,
					rescueStory,
					rescueDate,
					weight,
					size,
					vaccination,
					medicalHistory
				},
				rfidTag
			};

			if (imageInput instanceof Blob) {
				const reader = new FileReader();
				reader.readAsDataURL(imageInput);
				reader.onload = async () => {
					data.personal.picture = reader.result;
					await sendData(data);
				};
				reader.onerror = () => console.error("Failed to read image file.");
			} else {
				data.personal.picture = document.getElementById('img').style.backgroundImage.slice(5, -2);
				await sendData(data);
			}

			async function sendData(data) {
				try {
					const response = await fetch(`http://localhost:3000/ra/${petID}`, {
						method: 'PUT',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify(data)
					});
					if (!response.ok) {
						throw new Error('Failed to update rescued info.');
					}
					const result = await response.json();
					if (result.message === 'Pet updated successfully') {
						alert(result.message);
						window.location.hash = '/rescues';
					} else {
						alert(result.message || 'Failed to update rescued info.');
					}
				} catch (err) {
					console.error(err);
					alert(err.message);
				}
			}
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

				<form id='rescuedInfoMain'>
					<header id='header'>
						<h4>Rescued Pet Infotmation</h4>
						<div>
							<Button
								title='Update'
								id='update'
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
										value: 'Cat',
										label: 'Cat'
									},
									{
										value: 'Dog',
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
											value: 'Siamese',
											label: 'Siamese'
										},
										{
											value: 'Persian',
											label: 'Persian'
										},
										{
											value: 'Ragdoll',
											label: 'Ragdoll'
										}
									];
									const dogs = [
										{
											value: 'Beagle',
											label: 'Beagle'
										},
										{
											value: 'Bulldog',
											label: 'Bulldog'
										},
										{
											value: 'Poodle',
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
												value: 'Siamese',
												label: 'Siamese'
											},
											{
												value: 'Persian',
												label: 'Persian'
											},
											{
												value: 'Ragdoll',
												label: 'Ragdoll'
											}
										];
										const dogs = [
											{
												value: 'Beagle',
												label: 'Beagle'
											},
											{
												value: 'Bulldog',
												label: 'Bulldog'
											},
											{
												value: 'Poodle',
												label: 'Poodle'
											}
										];

										const type = document.getElementById('type');
										if (!type) return [];
										if (type.value === 'Cat') {
											for (const cat of cats) {
												const option = document.createElement('option');
												option.value = cat.value;
												option.innerHTML = cat.label;
												breed.appendChild(option);
											};
										};
										if (type.value === 'Dog') {
											for (const dog of dogs) {
												const option = document.createElement('option');
												option.value = dog.value;
												option.innerHTML = dog.label;
												breed.appendChild(option);
											};
										};
									});

									if (type.value === 'Cat') return cats;
									if (type.value === 'Dog') return dogs;
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
										value: 'Male',
										label: 'Male'
									},
									{
										value: 'Female',
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
										value: 'Small',
										label: 'Small'
									},
									{
										value: 'Medium',
										label: 'Medium'
									},
									{
										value: 'Large',
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
													value: 'Anti-Rabies',
													label: 'Anti-Rabies'
												},
												{
													value: 'DA2PP',
													label: 'DA2PP'
												},
												{
													value: 'Leptospira Vaccine  (Leptospirosis)',
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
														vaccination: this.state.vaccination.filter((_, i) => i !== index)
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
															medicalHistory: this.state.medicalHistory.filter((_, i) => i !== index)
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