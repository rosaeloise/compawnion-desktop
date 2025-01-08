import React from 'react';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import Popup from '../components/Popup';
import FormInput from '../components/FormInput';

import '../css/archivedInfo.css';

const MySwal = withReactContent(Swal);

class ArchivedPet extends React.Component {
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
			petID: 0,
			archivedPet: {
				id: '',
				personal: {
					name: '',
					type: '',
					breed: '',
					age: {
						year: '',
						month: ''
					},
					picture: '',
					gender: ''
				},
				background: {
					attributes: '',
					rescueStory: '',
					rescueDate: '',
					weight: '',
					size: '',
					vaccination: [
						{
							name: '',
							date: '',
							expiry: ''
						}
					],
					medicalHistory: [
						{
							procedure: '',
							date: '',
							notes: ''
						}
					]
				},
				rfidTag: '',
				petId: '',
				status: '',
				appPetID: ''
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
			});

		// Get pet ID from URL
		this.fetchArchivedInfo();
	};
	async fetchArchivedInfo() {
		const petIDFromURL = window.location.hash.split('/').pop();
		if (!petIDFromURL) return;
		const response = await fetch(`https://compawnion-backend.onrender.com/ra/archived/${petIDFromURL}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		const result = await response.json();
		this.setState({
			petID: petIDFromURL,
			archivedPet: result,
			vaccinationCount: result.background.vaccination.length,
			vaccination: result.background.vaccination,
			medicalHistoryCount: result.background.medicalHistory.length,
			medicalHistory: result.background.medicalHistory
		});
	};
	async updateArchivedInfo() {
		const petID = this.state.petID;
		const name = this.state.archivedPet.personal.name;
		const type = this.state.archivedPet.personal.type;
		const breed = this.state.archivedPet.personal.breed;
		const ageYear = this.state.archivedPet.personal.age.year;
		const ageMonth = this.state.archivedPet.personal.age.month;
		const gender = this.state.archivedPet.personal.gender;

		const attributes = this.state.archivedPet.background.attributes;
		const rescueStory = this.state.archivedPet.background.rescueStory;
		const rescueDate = this.state.archivedPet.background.rescueDate;

		const weight = this.state.archivedPet.background.weight;
		const size = this.state.archivedPet.background.size;

		if (!petID || !name || !type || !breed || !ageYear || !ageMonth || !gender || !attributes || !rescueStory || !rescueDate || !weight || !size) {
			MySwal.fire({
				icon: 'error',
				iconColor: 'red',
				title: <h4>Please fill out all fields.</h4>,
				width: '60rem',
				confirmButtonColor: 'var(--primary-color)'
			});
			return;
		};
		if (parseInt(ageYear) < 0 || parseInt(ageMonth) < 0 || parseInt(weight) < 0) {
			MySwal.fire({
				icon: 'error',
				iconColor: 'red',
				title: <h4>Please enter valid values.</h4>,
				width: '60rem',
				confirmButtonColor: 'var(--primary-color)'
			});
			return;
		};
		if (parseInt(ageYear) > 30) {
			MySwal.fire({
				icon: 'error',
				iconColor: 'red',
				title: <h4>Please enter valid year.</h4>,
				width: '60rem',
				confirmButtonColor: 'var(--primary-color)'
			});
			return;
		};
		if (parseInt(ageMonth) > 11) {
			MySwal.fire({
				icon: 'error',
				iconColor: 'red',
				title: <h4>Please enter valid month.</h4>,
				width: '60rem',
				confirmButtonColor: 'var(--primary-color)'
			});
			return;
		};
		if (parseInt(weight) > 200) {
			MySwal.fire({
				icon: 'error',
				iconColor: 'red',
				title: <h1>Please enter valid weight.</h1>,
				width: '60rem',
				confirmButtonColor: 'var(--primary-color)'
			});
			return;
		}
		if (this.state.vaccinationCount > 1 && this.state.vaccination.some(v => !v.name || !v.date || !v.expiry)) {
			MySwal.fire({
				icon: 'error',
				iconColor: 'red',
				title: <h1>Please fill out all vaccination fields.</h1>,
				width: '60rem',
				confirmButtonColor: 'var(--primary-color)'
			});
			return;
		};
		if (this.state.medicalHistoryCount > 1 && this.state.medicalHistory.some(m => !m.procedure || !m.date || !m.notes)) {
			MySwal.fire({
				icon: 'error',
				iconColor: 'red',
				title: <h1>Please fill out all medical history fields.</h1>,
				width: '60rem',
				confirmButtonColor: 'var(--primary-color)'
			});
			return;
		};
		if (this.state.archivedPet.background.rescueDate > new Date().toISOString().split('T')[0]) {
			MySwal.fire({
				icon: 'error',
				iconColor: 'red',
				title: <h1>Rescue date cannot be in the future.</h1>,
				width: '60rem',
				confirmButtonColor: 'var(--primary-color)'
			});
			return;
		};

		const vaccination = this.state.vaccination;
		const medicalHistory = this.state.medicalHistory;
		const rfidTag = this.state.archivedPet.rfidTag;

		for (const vac of vaccination) {
			if (vac.expiry < vac.date) {
				MySwal.fire({
					icon: 'error',
					iconColor: 'red',
					title: <h1>Vaccination expiry cannot be before vaccination date.</h1>,
					width: '60rem',
					confirmButtonColor: 'var(--primary-color)'
				});
				return;
			};
			if (vac.date > new Date().toISOString().split('T')[0]) {
				MySwal.fire({
					icon: 'error',
					iconColor: 'red',
					title: <h1>Vaccination date cannot be in the future.</h1>,
					width: '60rem',
					confirmButtonColor: 'var(--primary-color)'
				});
				return;
			};
		};
		for (const med of medicalHistory) {
			if (med.date > new Date().toISOString().split('T')[0]) {
				MySwal.fire({
					icon: 'error',
					iconColor: 'red',
					title: <h1>Medical history date cannot be in the future.</h1>,
					width: '60rem',
					confirmButtonColor: 'var(--primary-color)'
				});
				return;
			};
		};
		if (!rfidTag) {
			MySwal.fire({
				icon: 'error',
				iconColor: 'red',
				title: <h1>Please scan RFID tag.</h1>,
				width: '60rem',
				confirmButtonColor: 'var(--primary-color)'
			});
			return;
		};

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
				picture: null,
				gender
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
			reader.onerror = () => console.error('Failed to read image file.');
		} else {
			data.personal.picture = document.getElementById('img').style.backgroundImage.slice(5, -2);
			await sendData(data);
		};

		async function sendData(data) {
			try {
				const response = await fetch(`https://compawnion-backend.onrender.com/ra/archived/${petID}`, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(data)
				});
				if (!response.ok) {
					MySwal.fire({
						icon: 'error',
						iconColor: 'red',
						title: <h1>Failed to update archived info.</h1>,
						width: '60rem',
						confirmButtonColor: 'var(--primary-color)'
					});
					throw new Error('Failed to update archived info.');
				};
				const result = await response.json();
				if (result.message === 'Pet updated successfully') {
					await MySwal.fire({
						icon: 'success',
						iconColor: 'var(--primary-color)',
						title: <h1>Archived pet info updated successfully.</h1>,
						width: '60rem',
						confirmButtonColor: 'var(--primary-color)'
					});
					window.location.reload();
				} else {
					MySwal.fire({
						icon: 'error',
						iconColor: 'red',
						title: <h1>{result.message || 'Failed to update archived info.'}</h1>,
						width: '60rem',
						confirmButtonColor: 'var(--primary-color)'
					});
				};
			} catch (err) {
				console.error(err);
				MySwal.fire({
					icon: 'error',
					iconColor: 'red',
					title: <h1>Failed to update archived info.</h1>,
					width: '60rem',
					confirmButtonColor: 'var(--primary-color)'
				});
			};
		};
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

				<form id='archivedInfoMain'>
					<header id='header'>
						<h4>Archived Pet Infotmation</h4>
						<div>
							<Button
								title='Update'
								id='update'
								onClick={() => {
									this.updateArchivedInfo();
								}}
							/>
							<Button
								title='Unarchive'
								theme='dark'

								onClick={() => {
									MySwal.fire({
										icon: 'warning',
										iconColor: 'var(--primary-color)',
										title: <h1>Are you sure you want to archive this archived pet?</h1>,
										width: '60rem',
										showCancelButton: true,
										confirmButtonColor: 'var(--primary-color)',
										cancelButtonColor: 'var(--primary-color)',
										confirmButtonText: 'Yes, archive it.'
									}).then(async (result) => {
										if (result.isConfirmed) {
											const response = await fetch(`https://compawnion-backend.onrender.com/ra/unarchived/${this.state.petID}`, {
												method: 'POST',
												headers: {
													'Content-Type': 'application/json'
												}
											});
											if (!response.ok) {
												MySwal.fire({
													icon: 'error',
													iconColor: 'red',
													title: <h1>Failed to unarchive pet.</h1>,
													width: '60rem',
													confirmButtonColor: 'var(--primary-color)'
												});
												return;
											};
											const result = await response.json();
											if (result.message === 'Pet successfully restored to RescuedAnimals') {
												await MySwal.fire({
													icon: 'success',
													iconColor: 'var(--primary-color)',
													title: <h1>Archived pet unarchived successfully.</h1>,
													width: '60rem',
													confirmButtonColor: 'var(--primary-color)'
												});
												window.location.hash = '/rescues';
											} else {
												MySwal.fire({
													icon: 'error',
													iconColor: 'red',
													title: <h1>{result.message || 'Failed to unarchive pet.'}</h1>,
													width: '60rem',
													confirmButtonColor: 'var(--primary-color)'
												});
											};
										}
									});
								}}
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
							<input type='file' name='imageInput' id='imageInput' accept='image/*' />
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
							}} style={{ backgroundImage: `${this.state.archivedPet?.personal?.picture ? `url(${this.state.archivedPet.personal.picture})` : ''}` }}></div>
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
								value={this.state.archivedPet?.personal?.name}
								defaultValue={this.state.archivedPet?.personal?.name}
								placeholder='Enter pet name'
								onChange={(e) => {
									this.setState({
										archivedPet: {
											...this.state.archivedPet,
											personal: {
												...this.state.archivedPet.personal,
												name: e.target.value
											}
										}
									});
								}}
							/>
							<FormInput
								label='Type'
								type='dropdown'
								id='type'
								name='type'
								value={this.state.archivedPet?.personal?.type}
								defaultValue={this.state.archivedPet?.personal?.type}
								placeholder='Select type'
								onChange={(e) => {
									this.setState({
										archivedPet: {
											...this.state.archivedPet,
											personal: {
												...this.state.archivedPet.personal,
												type: e.target.value,
												breed: ''
											}
										}
									});
								}}

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
									value={this.state.archivedPet?.personal?.age?.year}
									defaultValue={this.state.archivedPet?.personal?.age?.year}
									onChange={(e) => {
										this.setState({
											archivedPet: {
												...this.state.archivedPet,
												personal: {
													...this.state.archivedPet.personal,
													age: {
														...this.state.archivedPet.personal.age,
														year: e.target.value
													}
												}
											}
										});
									}}
								/>
								<h6>Yr.</h6>

								<FormInput
									type='number'
									id='ageMonth'
									name='ageMonth'
									value={this.state.archivedPet?.personal?.age?.month}
									defaultValue={this.state.archivedPet?.personal?.age?.month}
									onChange={(e) => {
										this.setState({
											archivedPet: {
												...this.state.archivedPet,
												personal: {
													...this.state.archivedPet.personal,
													age: {
														...this.state.archivedPet.personal.age,
														month: e.target.value
													}
												}
											}
										});
									}}
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
								value={this.state.archivedPet?.petId}
								disabled={true}
							/>
							<FormInput
								label='Breed'
								type='list'
								id='breed'
								name='breed'
								value={this.state.archivedPet?.personal?.breed}
								defaultValue={this.state.archivedPet?.personal?.breed}
								placeholder='Select breed'
								onChange={(e) => {
									this.setState({
										archivedPet: {
											...this.state.archivedPet,
											personal: {
												...this.state.archivedPet.personal,
												breed: e.target.value
											}
										}
									});
								}}

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

									return this.state.archivedPet?.personal?.type === 'Cat' ? cats : dogs;
								})()}
							/>
							<FormInput
								label='Gender'
								type='dropdown'
								id='gender'
								name='gender'
								value={this.state.archivedPet?.personal?.gender}
								defaultValue={this.state.archivedPet?.personal?.gender}
								placeholder='Select gender'
								onChange={(e) => {
									this.setState({
										archivedPet: {
											...this.state.archivedPet,
											personal: {
												...this.state.archivedPet.personal,
												gender: e.target.value
											}
										}
									});
								}}

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
								value={this.state.archivedPet?.background?.attributes}
								defaultValue={this.state.archivedPet?.background?.attributes}
								placeholder='Enter attributes or description'
								onChange={(e) => {
									this.setState({
										archivedPet: {
											...this.state.archivedPet,
											background: {
												...this.state.archivedPet.background,
												attributes: e.target.value
											}
										}
									});
								}}
							/>
							<FormInput
								label='Rescue Story'
								type='textarea'
								id='backgroundStory'
								name='backgroundStory'
								value={this.state.archivedPet?.background?.rescueStory}
								defaultValue={this.state.archivedPet?.background?.rescueStory}
								placeholder='Enter rescue story'
								onChange={(e) => {
									this.setState({
										archivedPet: {
											...this.state.archivedPet,
											background: {
												...this.state.archivedPet.background,
												rescueStory: e.target.value
											}
										}
									});
								}}
							/>
							<FormInput
								label='Rescue Date'
								type='date'
								id='rescueDate'
								name='rescueDate'
								value={this.state.archivedPet?.background?.rescueDate}
								defaultValue={this.state.archivedPet?.background?.rescueDate}
								onChange={(e) => {
									this.setState({
										archivedPet: {
											...this.state.archivedPet,
											background: {
												...this.state.archivedPet.background,
												rescueDate: e.target.value
											}
										}
									});
								}}
							/>
						</div>

						<h6>Medical Information</h6>
						<div>
							<FormInput
								label='Weight'
								type='number'
								id='weight'
								name='weight'
								value={this.state.archivedPet?.background?.weight}
								defaultValue={this.state.archivedPet?.background?.weight}
								placeholder='Enter weight'
								onChange={(e) => {
									this.setState({
										archivedPet: {
											...this.state.archivedPet,
											background: {
												...this.state.archivedPet.background,
												weight: e.target.value
											}
										}
									});
								}}
							/>
							<h6>Kg</h6>
							<FormInput
								label='Size'
								type='dropdown'
								id='size'
								name='size'
								value={this.state.archivedPet?.background?.size}
								defaultValue={this.state.archivedPet?.background?.size}
								placeholder='Select size'
								onChange={(e) => {
									this.setState({
										archivedPet: {
											...this.state.archivedPet,
											background: {
												...this.state.archivedPet.background,
												size: e.target.value
											}
										}
									});
								}}

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
											defaultValue={vaccination.name}
											onChange={(e) => {
												this.setState({
													vaccination: this.state.vaccination.map((v, i) => {
														if (i === index) {
															return {
																...v,
																name: e.target.value
															};
														}
														return v;
													}),
													archivedPet: {
														...this.state.archivedPet,
														background: {
															...this.state.archivedPet.background,
															vaccination: this.state.vaccination.map((v, i) => {
																if (i === index) {
																	return {
																		...v,
																		name: e.target.value
																	};
																}
																return v;
															})
														}
													}
												});
											}}

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
											defaultValue={vaccination.date}
											onChange={(e) => {
												this.setState({
													vaccination: this.state.vaccination.map((v, i) => {
														if (i === index) {
															return {
																...v,
																date: e.target.value
															};
														}
														return v;
													}),
													archivedPet: {
														...this.state.archivedPet,
														background: {
															...this.state.archivedPet.background,
															vaccination: this.state.vaccination.map((v, i) => {
																if (i === index) {
																	return {
																		...v,
																		date: e.target.value
																	};
																}
																return v;
															})
														}
													}
												});
											}}
										/>
										<FormInput
											label='Expiry'
											type='date'
											id='vaccinationExpiry'
											name='vaccinationExpiry'
											placeholder='Enter vaccination expiry'
											value={vaccination.expiry}
											defaultValue={vaccination.expiry}
											onChange={(e) => {
												this.setState({
													vaccination: this.state.vaccination.map((v, i) => {
														if (i === index) {
															return {
																...v,
																expiry: e.target.value
															};
														}
														return v;
													}),
													archivedPet: {
														...this.state.archivedPet,
														background: {
															...this.state.archivedPet.background,
															vaccination: this.state.vaccination.map((v, i) => {
																if (i === index) {
																	return {
																		...v,
																		expiry: e.target.value
																	};
																}
																return v;
															})
														}
													}
												});
											}}
										/>

										{this.state.vaccinationCount > 1 && (
											<Button
												title='-'
												theme='dark'

												onClick={() => {
													this.setState({
														varccinationCount: this.state.vaccinationCount - 1,
														vaccination: this.state.vaccination.filter((_, i) => i !== index),
														archivedPet: {
															...this.state.archivedPet,
															background: {
																...this.state.archivedPet.background,
																vaccination: this.state.vaccination.filter((_, i) => i !== index)
															}
														}
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
										vaccination: this.state.vaccination.concat({
											name: null,
											date: null,
											expiry: null
										}),
										archivedPet: {
											...this.state.archivedPet,
											background: {
												...this.state.archivedPet.background,
												vaccination: this.state.vaccination.concat({
													name: null,
													date: null,
													expiry: null
												})
											}
										}
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
											defaultValue={medicalHistory.procedure}
											onChange={(e) => {
												this.setState({
													medicalHistory: this.state.medicalHistory.map((m, i) => {
														if (i === index) {
															return {
																...m,
																procedure: e.target.value
															};
														}
														return m;
													}),
													archivedPet: {
														...this.state.archivedPet,
														background: {
															...this.state.archivedPet.background,
															medicalHistory: this.state.medicalHistory.map((m, i) => {
																if (i === index) {
																	return {
																		...m,
																		procedure: e.target.value
																	};
																}
																return m;
															})
														}
													}
												});
											}}
										/>
										<FormInput
											label='Date'
											type='date'
											id='medicalHistoryDate'
											name='medicalHistoryDate'
											placeholder='Enter date'
											value={medicalHistory.date}
											defaultValue={medicalHistory.date}
											onChange={(e) => {
												this.setState({
													medicalHistory: this.state.medicalHistory.map((m, i) => {
														if (i === index) {
															return {
																...m,
																date: e.target.value
															};
														}
														return m;
													}),
													archivedPet: {
														...this.state.archivedPet,
														background: {
															...this.state.archivedPet.background,
															medicalHistory: this.state.medicalHistory.map((m, i) => {
																if (i === index) {
																	return {
																		...m,
																		date: e.target.value
																	};
																}
																return m;
															})
														}
													}
												});
											}}
										/>
										<span>
											<FormInput
												label='Notes'
												type='textarea'
												id='medicalHistoryNotes'
												name='medicalHistoryNotes'
												placeholder='Enter notes'
												value={medicalHistory.notes}
												defaultValue={medicalHistory.notes}
												onChange={(e) => {
													this.setState({
														medicalHistory: this.state.medicalHistory.map((m, i) => {
															if (i === index) {
																return {
																	...m,
																	notes: e.target.value
																};
															}
															return m;
														}),
														archivedPet: {
															...this.state.archivedPet,
															background: {
																...this.state.archivedPet.background,
																medicalHistory: this.state.medicalHistory.map((m, i) => {
																	if (i === index) {
																		return {
																			...m,
																			notes: e.target.value
																		};
																	}
																	return m;
																})
															}
														}
													});
												}}
											/>

											{this.state.medicalHistoryCount > 1 && (
												<Button
													title='-'
													theme='dark'

													onClick={() => {
														this.setState({
															medicalHistoryCount: this.state.medicalHistoryCount - 1,
															medicalHistory: this.state.medicalHistory.filter((_, i) => i !== index),
															archivedPet: {
																...this.state.archivedPet,
																background: {
																	...this.state.archivedPet.background,
																	medicalHistory: this.state.medicalHistory.filter((_, i) => i !== index)
																}
															}
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
										medicalHistory: this.state.medicalHistory.concat({
											procedure: null,
											date: null,
											notes: null
										}),
										archivedPet: {
											...this.state.archivedPet,
											background: {
												...this.state.archivedPet.background,
												medicalHistory: this.state.medicalHistory.concat({
													procedure: null,
													date: null,
													notes: null
												})
											}
										}
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
								value={this.state.archivedPet?.rfidTag}
								defaultValue={this.state.archivedPet?.rfidTag}

								onEnter={() => {
									const rfidTag = document.getElementById('rfidTag');
									rfidTag.disabled = true;
									this.setState({
										archivedPet: {
											...this.state.archivedPet,
											rfidTag: rfidTag.value
										}
									});
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
					<div>
						<Button
							title='Delete'
							style={{ backgroundColor: 'red' }}

							onClick={() => {
								MySwal.fire({
									icon: 'warning',
									iconColor: 'red',
									title: <h1>Are you sure you want to delete this archived pet?</h1>,
									width: '60rem',
									showCancelButton: true,
									confirmButtonColor: 'var(--primary-color)',
									cancelButtonColor: 'red',
									confirmButtonText: 'Yes, delete it',
									cancelButtonText: 'No, cancel',
									reverseButtons: true
								}).then((result) => {
									if (result.isConfirmed) {
										fetch(`https://compawnion-backend.onrender.com/ra/archived/${this.state.petID}`, {
											method: 'DELETE',
											headers: {
												'Content-Type': 'application/json'
											}
										})
											.then(res => res.json())
											.then(res => {
												if (res.message === 'Pet deleted successfully') {
													MySwal.fire({
														icon: 'success',
														iconColor: 'var(--primary-color)',
														title: <h1>Archived pet deleted successfully.</h1>,
														width: '60rem',
														confirmButtonColor: 'var(--primary-color)'
													});
													window.location.hash = '/rescues';
												} else {
													MySwal.fire({
														icon: 'error',
														iconColor: 'red',
														title: <h1>{res.message || 'Failed to delete archived pet.'}</h1>,
														width: '60rem',
														confirmButtonColor: 'var(--primary-color)'
													});
												};
											})
											.catch(err => {
												console.error(err);
												MySwal.fire({
													icon: 'error',
													iconColor: 'red',
													title: <h1>Failed to delete archived pet.</h1>,
													width: '60rem',
													confirmButtonColor: 'var(--primary-color)'
												});
											});
									};
								});
							}}
						/>
					</div>
				</form>
			</>
		)
	};
};

export default ArchivedPet;