import React from 'react';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import Popup from '../components/Popup';
import FormInput from '../components/FormInput';

import '../css/rescuedInfo.css';

const MySwal = withReactContent(Swal);

class AddRescuedPet extends React.Component {
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
			rescuedPet: {
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

		// Get pet ID from URL
		this.fetchRescuedInfo();
	};
	async fetchRescuedInfo() {
		const petIDFromURL = window.location.hash.split('/').pop();
		if (!petIDFromURL) return;
		const response = await fetch(`https://compawnion-backend.onrender.com/ra/${petIDFromURL}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		const result = await response.json();
		this.setState({
			petID: petIDFromURL,
			rescuedPet: result,
			vaccinationCount: result.background.vaccination.length,
			vaccination: result.background.vaccination,
			medicalHistoryCount: result.background.medicalHistory.length,
			medicalHistory: result.background.medicalHistory
		});
	};
	async updateRescuedInfo() {
		const petID = this.state.petID;
		const name = this.state.rescuedPet.personal.name;
		const type = this.state.rescuedPet.personal.type;
		const breed = this.state.rescuedPet.personal.breed;
		const ageYear = this.state.rescuedPet.personal.age.year;
		const ageMonth = this.state.rescuedPet.personal.age.month;
		const gender = this.state.rescuedPet.personal.gender;

		const attributes = this.state.rescuedPet.background.attributes;
		const rescueStory = this.state.rescuedPet.background.rescueStory;
		const rescueDate = this.state.rescuedPet.background.rescueDate;

		const weight = this.state.rescuedPet.background.weight;
		const size = this.state.rescuedPet.background.size;

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
		if (this.state.rescuedPet.background.rescueDate > new Date().toISOString().split('T')[0]) {
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
		const rfidTag = this.state.rescuedPet.rfidTag;

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
				const response = await fetch(`https://compawnion-backend.onrender.com/ra/${petID}`, {
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
						title: <h1>Failed to update rescued info.</h1>,
						width: '60rem',
						confirmButtonColor: 'var(--primary-color)'
					});
					throw new Error('Failed to update rescued info.');
				};
				const result = await response.json();
				if (result.message === 'Pet updated successfully') {
					await MySwal.fire({
						icon: 'success',
						iconColor: 'var(--primary-color)',
						title: <h1>Rescued pet info updated successfully.</h1>,
						width: '60rem',
						confirmButtonColor: 'var(--primary-color)'
					});
					window.location.reload();
				} else {
					MySwal.fire({
						icon: 'error',
						iconColor: 'red',
						title: <h1>{result.message || 'Failed to update rescued info.'}</h1>,
						width: '60rem',
						confirmButtonColor: 'var(--primary-color)'
					});
				};
			} catch (err) {
				console.error(err);
				MySwal.fire({
					icon: 'error',
					iconColor: 'red',
					title: <h1>Failed to update rescued info.</h1>,
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

				<form id='rescuedInfoMain'>
					<header id='header'>
						<h4>Rescued Pet Infotmation</h4>
						<div>
							<Button
								title='Update'
								id='update'
								onClick={() => {
									this.updateRescuedInfo();
								}}
							/>
							<Button
								title='Archive'
								theme='dark'

								onClick={() => {
									MySwal.fire({
										icon: 'warning',
										iconColor: 'var(--primary-color)',
										title: <h1>Are you sure you want to archive this rescued pet?</h1>,
										width: '60rem',
										showCancelButton: true,
										confirmButtonColor: 'var(--primary-color)',
										cancelButtonColor: 'var(--primary-color)',
										confirmButtonText: 'Yes, archive it.'
									}).then(async (result) => {
										if (result.isConfirmed) {
											const response = await fetch(`https://compawnion-backend.onrender.com/ra/archived/${this.state.petID}`, {
												method: 'POST',
												headers: {
													'Content-Type': 'application/json'
												}
											});
											if (!response.ok) {
												MySwal.fire({
													icon: 'error',
													iconColor: 'red',
													title: <h1>Failed to archive rescued pet.</h1>,
													width: '60rem',
													confirmButtonColor: 'var(--primary-color)'
												});
												return;
											};
											const result = await response.json();
											if (result.message === 'Pet archived successfully') {
												MySwal.fire({
													icon: 'success',
													iconColor: 'var(--primary-color)',
													title: <h1>Rescued pet archived successfully.</h1>,
													width: '60rem',
													confirmButtonColor: 'var(--primary-color)'
												});
												window.location.hash = '/rescues';
											} else {
												MySwal.fire({
													icon: 'error',
													iconColor: 'red',
													title: <h1>{result.message || 'Failed to archive rescued pet.'}</h1>,
													width: '60rem',
													confirmButtonColor: 'var(--primary-color)'
												});
											};
										};
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
							}} style={{ backgroundImage: `${this.state.rescuedPet?.personal?.picture ? `url(${this.state.rescuedPet.personal.picture})` : ''}` }}></div>
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
								value={this.state.rescuedPet?.personal?.name}
								defaultValue={this.state.rescuedPet?.personal?.name}
								placeholder='Enter pet name'
								onChange={(e) => {
									this.setState({
										rescuedPet: {
											...this.state.rescuedPet,
											personal: {
												...this.state.rescuedPet.personal,
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
								value={this.state.rescuedPet?.personal?.type}
								defaultValue={this.state.rescuedPet?.personal?.type}
								placeholder='Select type'
								onChange={(e) => {
									this.setState({
										rescuedPet: {
											...this.state.rescuedPet,
											personal: {
												...this.state.rescuedPet.personal,
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
									value={this.state.rescuedPet?.personal?.age?.year}
									defaultValue={this.state.rescuedPet?.personal?.age?.year}
									onChange={(e) => {
										this.setState({
											rescuedPet: {
												...this.state.rescuedPet,
												personal: {
													...this.state.rescuedPet.personal,
													age: {
														...this.state.rescuedPet.personal.age,
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
									value={this.state.rescuedPet?.personal?.age?.month}
									defaultValue={this.state.rescuedPet?.personal?.age?.month}
									onChange={(e) => {
										this.setState({
											rescuedPet: {
												...this.state.rescuedPet,
												personal: {
													...this.state.rescuedPet.personal,
													age: {
														...this.state.rescuedPet.personal.age,
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
								value={this.state.rescuedPet?.petId}
								disabled={true}
							/>
							<FormInput
								label='Breed'
								type='list'
								id='breed'
								name='breed'
								value={this.state.rescuedPet?.personal?.breed}
								defaultValue={this.state.rescuedPet?.personal?.breed}
								placeholder='Select breed'
								onChange={(e) => {
									this.setState({
										rescuedPet: {
											...this.state.rescuedPet,
											personal: {
												...this.state.rescuedPet.personal,
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

									return this.state.rescuedPet?.personal?.type === 'Cat' ? cats : dogs;
								})()}
							/>
							<FormInput
								label='Gender'
								type='dropdown'
								id='gender'
								name='gender'
								value={this.state.rescuedPet?.personal?.gender}
								defaultValue={this.state.rescuedPet?.personal?.gender}
								placeholder='Select gender'
								onChange={(e) => {
									this.setState({
										rescuedPet: {
											...this.state.rescuedPet,
											personal: {
												...this.state.rescuedPet.personal,
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
								value={this.state.rescuedPet?.background?.attributes}
								defaultValue={this.state.rescuedPet?.background?.attributes}
								placeholder='Enter attributes or description'
								onChange={(e) => {
									this.setState({
										rescuedPet: {
											...this.state.rescuedPet,
											background: {
												...this.state.rescuedPet.background,
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
								value={this.state.rescuedPet?.background?.rescueStory}
								defaultValue={this.state.rescuedPet?.background?.rescueStory}
								placeholder='Enter rescue story'
								onChange={(e) => {
									this.setState({
										rescuedPet: {
											...this.state.rescuedPet,
											background: {
												...this.state.rescuedPet.background,
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
								value={this.state.rescuedPet?.background?.rescueDate}
								defaultValue={this.state.rescuedPet?.background?.rescueDate}
								onChange={(e) => {
									this.setState({
										rescuedPet: {
											...this.state.rescuedPet,
											background: {
												...this.state.rescuedPet.background,
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
								value={this.state.rescuedPet?.background?.weight}
								defaultValue={this.state.rescuedPet?.background?.weight}
								placeholder='Enter weight'
								onChange={(e) => {
									this.setState({
										rescuedPet: {
											...this.state.rescuedPet,
											background: {
												...this.state.rescuedPet.background,
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
								value={this.state.rescuedPet?.background?.size}
								defaultValue={this.state.rescuedPet?.background?.size}
								placeholder='Select size'
								onChange={(e) => {
									this.setState({
										rescuedPet: {
											...this.state.rescuedPet,
											background: {
												...this.state.rescuedPet.background,
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
													rescuedPet: {
														...this.state.rescuedPet,
														background: {
															...this.state.rescuedPet.background,
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
													rescuedPet: {
														...this.state.rescuedPet,
														background: {
															...this.state.rescuedPet.background,
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
													rescuedPet: {
														...this.state.rescuedPet,
														background: {
															...this.state.rescuedPet.background,
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
														rescuedPet: {
															...this.state.rescuedPet,
															background: {
																...this.state.rescuedPet.background,
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
										rescuedPet: {
											...this.state.rescuedPet,
											background: {
												...this.state.rescuedPet.background,
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
													rescuedPet: {
														...this.state.rescuedPet,
														background: {
															...this.state.rescuedPet.background,
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
													rescuedPet: {
														...this.state.rescuedPet,
														background: {
															...this.state.rescuedPet.background,
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
														rescuedPet: {
															...this.state.rescuedPet,
															background: {
																...this.state.rescuedPet.background,
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
															rescuedPet: {
																...this.state.rescuedPet,
																background: {
																	...this.state.rescuedPet.background,
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
										rescuedPet: {
											...this.state.rescuedPet,
											background: {
												...this.state.rescuedPet.background,
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
								value={this.state.rescuedPet?.rfidTag}
								defaultValue={this.state.rescuedPet?.rfidTag}

								onEnter={() => {
									const rfidTag = document.getElementById('rfidTag');
									rfidTag.disabled = true;
									this.setState({
										rescuedPet: {
											...this.state.rescuedPet,
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
									title: <h1>Are you sure you want to delete this rescued pet?</h1>,
									width: '60rem',
									showCancelButton: true,
									confirmButtonColor: 'var(--primary-color)',
									cancelButtonColor: 'red',
									confirmButtonText: 'Yes, delete it',
									cancelButtonText: 'No, cancel',
									reverseButtons: true
								}).then((result) => {
									if (result.isConfirmed) {
										fetch(`https://compawnion-backend.onrender.com/ra/${this.state.petID}`, {
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
														title: <h1>Rescued pet deleted successfully.</h1>,
														width: '60rem',
														confirmButtonColor: 'var(--primary-color)'
													});
													window.location.hash = '/rescues';
												} else {
													MySwal.fire({
														icon: 'error',
														iconColor: 'red',
														title: <h1>{res.message || 'Failed to delete rescued pet.'}</h1>,
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
													title: <h1>Failed to delete rescued pet.</h1>,
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

export default AddRescuedPet;