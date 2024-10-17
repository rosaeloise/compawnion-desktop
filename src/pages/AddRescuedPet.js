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
				name: {
					first: '',
					last: ''
				},
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
			]
		};
	};
	componentDidMount() {
		setTimeout(() => {
			this.setState({
				loading: false,
				user: {
					avatar: 'https://scontent.fmnl8-1.fna.fbcdn.net/v/t1.6435-9/98343921_3964488750260462_3832610965619212288_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=dd6889&_nc_eui2=AeGm5O07sV4g2mWQJmqJ1-O-377aGaUqoBLfvtoZpSqgEsD_5TyQ1z8RgL1MZRyaVA-j34PtB1K_aLxqUbhLceQH&_nc_ohc=ki5IaXRBJwcQ7kNvgEkKQkZ&_nc_ht=scontent.fmnl8-1.fna&oh=00_AYAb4j1j4QVfh2vd-O-S1_AsIqj5A9mtV2U15ySydQl4TA&oe=6724C727',
					name: {
						first: 'Gumoan',
						last: 'Magsaysay'
					},
					role: 'Administrator',
					username: 'gumoan'
				}
			});
		}, 1000);
	};
	render() {
		return (
			<>
				<Popup>
					{this.state.popupContent}
				</Popup>

				<Sidebar
					avatar={this.state.user.avatar}
					name={this.state.user.name.first + ' ' + this.state.user.name.last}
					role={this.state.user.role}

					active='rescues'
				/>

				<form id='addRescuedPetMain'>
					<header id='header'>
						<h4>Add New Rescued Pet</h4>
						<div>
							<Button
								title='Save'
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
									id='age'
									name='ageYear'
									placeholder=''
								/>
								<FormInput
									label=''
									type='dropdown'
									id='yearOrMonth'
									name='yearOrMonth'
									placeholder='Year or Month'

									options={[
										{
											value: 'year',
											label: 'Years'
										},
										{
											value: 'month',
											label: 'Months'
										}
									]}

									onChange={() => {
										try {
											const age = document.getElementById('age');
											const yearOrMonth = document.getElementById('yearOrMonth');
											if (yearOrMonth.value === 'year') {
												age.setAttribute('name', 'ageYear');
												age.value = Math.floor(age.value / 12);
											};
											if (yearOrMonth.value === 'month') {
												age.setAttribute('name', 'ageMonth');
												age.value = age.value * 12;
											};
										} catch (error) {
											console.log(error);
										};
									}}
								/>
								<FormInput
									label='Weight'
									type='number'
									id='weight'
									name='weight'
									placeholder='Kilograms'
								/>
							</span>
						</div>
						<div>
							<FormInput
								label='Pet ID'
								type='text'
								id='petID'
								name='petID'
								value='000-001'
								placeholder='000-001'
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
								label='Attributes/Description'
								type='textarea'
								id='attributes'
								name='attributes'
								placeholder='Enter attributes or description'
							/>
							<FormInput
								label='Rescue Story'
								type='textarea'
								id='rescueStory'
								name='rescueStory'
								placeholder='Enter rescue story'
							/>
						</div>

						<h6>Vaccination</h6>
						<div id='vaccination'>
							{this.state.vaccination.map((vaccination, index) => {
								return (
									<div key={index}>
										<FormInput
											label='Name'
											type='text'
											id='vaccinationName'
											name='vaccinationName'
											placeholder='Enter vaccination name'
											value={vaccination.name}
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