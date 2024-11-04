import React from 'react';

import Sidebar from '../components/Sidebar';
import Input from '../components/Input';
import Button from '../components/Button';
import PetCard from '../components/PetCard';
import Popup from '../components/Popup';

import '../css/rescues.css';

class Rescues extends React.Component {
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
			rescues: []
		};

		fetch('http://localhost:3000/ra', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then(res => res.json())
			.then(res => {
				const rescues = [];
				for (const of in res) {
					rescues.push({
						image: res[of].personal.picture,
						name: res[of].personal.name,
						description: res[of].background.rescueStory,
						href: '#/rescues/' + res[of].petId,
						rfid: res[of].rfidTag,
						petId: res[of].id,
						type: res[of].personal.type,
						size: res[of].background.size,
						age: parseInt(res[of].personal.age.year) * parseInt(res[of].personal.age.month) // Age in months
					});
				};
				console.log(rescues);

				this.setState({
					rescues: rescues
				});
			});
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

		// Type
		const cat = document.getElementById('cat');
		const dog = document.getElementById('dog');
		const both = document.getElementById('both');

		cat.addEventListener('change', () => {
			const petCardsElement = document.getElementById('petCards');
			const petCards = petCardsElement.querySelectorAll('.petCard');

			this.state.rescues.forEach(rescue => {
				if (rescue.type === 'cat') {
					petCards.forEach(card => {
						const cardId = card.getAttribute('id');
						if (rescue.petId === cardId) {
							card.style.display = 'flex';
						};
					});
				} else {
					petCards.forEach(card => {
						const cardId = card.getAttribute('id');
						if (rescue.petId === cardId) {
							card.style.display = 'none';
						};
					});
				};
			});
		});
		dog.addEventListener('change', () => {
			const petCardsElement = document.getElementById('petCards');
			const petCards = petCardsElement.querySelectorAll('.petCard');

			this.state.rescues.forEach(rescue => {
				if (rescue.type === 'dog') {
					petCards.forEach(card => {
						const cardId = card.getAttribute('id');
						if (rescue.petId === cardId) {
							card.style.display = 'flex';
						};
					});
				} else {
					petCards.forEach(card => {
						const cardId = card.getAttribute('id');
						if (rescue.petId === cardId) {
							card.style.display = 'none';
						};
					});
				};
			});
		});
		both.addEventListener('change', () => {
			const petCardsElement = document.getElementById('petCards');
			const petCards = petCardsElement.querySelectorAll('.petCard');

			this.state.rescues.forEach(rescue => {
				petCards.forEach(card => {
					const cardId = card.getAttribute('id');
					if (rescue.petId === cardId) {
						card.style.display = 'flex';
					};
				});
			});
		});

		// Size
		const small = document.getElementById('small');
		const medium = document.getElementById('medium');
		const large = document.getElementById('large');
		small.checked = true;
		medium.checked = true;
		large.checked = true;

		small.addEventListener('change', () => {
			const petCardsElement = document.getElementById('petCards');
			const petCards = petCardsElement.querySelectorAll('.petCard');

			if (small.checked) {
				this.state.rescues.forEach(rescue => {
					if (rescue.size === 'small') {
						petCards.forEach(card => {
							const cardId = card.getAttribute('id');
							if (rescue.petId === cardId) {
								card.style.display = 'flex';
							};
						});
					};
				});
			} else {
				this.state.rescues.forEach(rescue => {
					if (rescue.size === 'small') {
						petCards.forEach(card => {
							const cardId = card.getAttribute('id');
							if (rescue.petId === cardId) {
								card.style.display = 'none';
							};
						});
					};
				});
			};
		});
		medium.addEventListener('change', () => {
			const petCardsElement = document.getElementById('petCards');
			const petCards = petCardsElement.querySelectorAll('.petCard');

			if (medium.checked) {
				this.state.rescues.forEach(rescue => {
					if (rescue.size === 'medium') {
						petCards.forEach(card => {
							const cardId = card.getAttribute('id');
							if (rescue.petId === cardId) {
								card.style.display = 'flex';
							};
						});
					};
				});
			} else {
				this.state.rescues.forEach(rescue => {
					if (rescue.size === 'medium') {
						petCards.forEach(card => {
							const cardId = card.getAttribute('id');
							if (rescue.petId === cardId) {
								card.style.display = 'none';
							};
						});
					};
				});
			};
		});
		large.addEventListener('change', () => {
			const petCardsElement = document.getElementById('petCards');
			const petCards = petCardsElement.querySelectorAll('.petCard');

			if (large.checked) {
				this.state.rescues.forEach(rescue => {
					if (rescue.size === 'large') {
						petCards.forEach(card => {
							const cardId = card.getAttribute('id');
							if (rescue.petId === cardId) {
								card.style.display = 'flex';
							};
						});
					};
				});
			} else {
				this.state.rescues.forEach(rescue => {
					if (rescue.size === 'large') {
						petCards.forEach(card => {
							const cardId = card.getAttribute('id');
							if (rescue.petId === cardId) {
								card.style.display = 'none';
							};
						});
					};
				});
			};
		});

		// Age
		const months = document.getElementById('months');
		const oneToFiveYears = document.getElementById('1-5years');
		const fivePlusYears = document.getElementById('5+years');
		months.checked = true;
		oneToFiveYears.checked = true;
		fivePlusYears.checked = true;

		months.addEventListener('change', () => {
			const petCardsElement = document.getElementById('petCards');
			const petCards = petCardsElement.querySelectorAll('.petCard');

			if (months.checked) {
				this.state.rescues.forEach(rescue => {
					if (rescue.age < 12) {
						petCards.forEach(card => {
							const cardId = card.getAttribute('id');
							if (rescue.petId === cardId) {
								card.style.display = 'flex';
							};
						});
					};
				});
			} else {
				this.state.rescues.forEach(rescue => {
					if (rescue.age < 12) {
						petCards.forEach(card => {
							const cardId = card.getAttribute('id');
							if (rescue.petId === cardId) {
								card.style.display = 'none';
							};
						});
					};
				});
			};
		});
		oneToFiveYears.addEventListener('change', () => {
			const petCardsElement = document.getElementById('petCards');
			const petCards = petCardsElement.querySelectorAll('.petCard');

			if (oneToFiveYears.checked) {
				this.state.rescues.forEach(rescue => {
					if (rescue.age >= 12 && rescue.age < 60) {
						petCards.forEach(card => {
							const cardId = card.getAttribute('id');
							if (rescue.petId === cardId) {
								card.style.display = 'flex';
							};
						});
					};
				});
			} else {
				this.state.rescues.forEach(rescue => {
					if (rescue.age >= 12 && rescue.age < 60) {
						petCards.forEach(card => {
							const cardId = card.getAttribute('id');
							if (rescue.petId === cardId) {
								card.style.display = 'none';
							};
						});
					};
				});
			};
		});
		fivePlusYears.addEventListener('change', () => {
			const petCardsElement = document.getElementById('petCards');
			const petCards = petCardsElement.querySelectorAll('.petCard');

			if (fivePlusYears.checked) {
				this.state.rescues.forEach(rescue => {
					if (rescue.age >= 60) {
						petCards.forEach(card => {
							const cardId = card.getAttribute('id');
							if (rescue.petId === cardId) {
								card.style.display = 'flex';
							};
						});
					};
				});
			} else {
				this.state.rescues.forEach(rescue => {
					if (rescue.age >= 60) {
						petCards.forEach(card => {
							const cardId = card.getAttribute('id');
							if (rescue.petId === cardId) {
								card.style.display = 'none';
							};
						});
					};
				});
			};
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

				<main id='rescuesMain'>
					<form id='filter'>
						<div id='type'>
							<h6>Type</h6>
							<input type='radio' name='type' id='both' defaultChecked value='both' />
							<label htmlFor='both'>
								Both
							</label>
							<input type='radio' name='type' id='cat' value='cat' />
							<label htmlFor='cat'>
								Cat
							</label>
							<input type='radio' name='type' id='dog' value='dog' />
							<label htmlFor='dog'>
								Dog
							</label>
						</div>

						<div id='size'>
							<h6>Size</h6>
							<input type='checkbox' id='small' value='small' />
							<label htmlFor='small'>
								Small
							</label>
							<input type='checkbox' id='medium' value='medium' />
							<label htmlFor='medium'>
								Medium
							</label>
							<input type='checkbox' id='large' value='large' />
							<label htmlFor='large'>
								Large
							</label>
						</div>

						<div id='age'>
							<h6>Age</h6>
							<input type='checkbox' id='months' value='months' />
							<label htmlFor='months'>
								Months
							</label>
							<input type='checkbox' id='1-5years' value='1-5years' />
							<label htmlFor='1-5years'>
								1-5 years
							</label>
							<input type='checkbox' id='5+years' value='5+years' />
							<label htmlFor='5+years'>
								5+ years
							</label>
						</div>

						<svg viewBox='0 0 328 335'>
							<path d='M309.73 210.348C317.249 236.423 303.368 271.224 285.378 275.213C248.625 292.41 235.965 262.508 207.172 269.981C178.379 277.453 193.992 298.931 148.476 318.402C129.164 325.303 77.4098 300.6 69.3721 272.729C51.2137 209.764 81.1702 117.767 147.543 100.541C213.916 83.3151 291.571 147.383 309.73 210.348Z' fill='var(--primary-color)' />
							<path d='M73.6083 98.8125C85.0648 117.479 80.9985 137.625 70.5525 143.394C58.1636 150.237 36.576 144.493 25.1194 125.827C13.6629 107.161 13.026 77.7052 25.4148 70.8623C40.0963 71.9716 62.1517 80.1465 73.6083 98.8125Z' fill='var(--primary-color)' />
							<path d='M130.847 42.9437C139.326 62.9897 141.415 83.7752 128.111 88.8396C114.806 93.904 97.1468 81.759 88.668 61.713C80.1891 41.6669 86.565 29.242 99.8697 24.1776C113.174 19.1132 122.368 22.8977 130.847 42.9437Z' fill='var(--primary-color)' />
							<path d='M211.851 40.1472C211.335 61.7411 199.298 78.9965 184.965 78.6881C170.633 78.3797 162.496 66.9258 163.012 45.3318C163.227 36.3535 169.296 29.0447 172.212 21.2441C176.31 10.2834 178.462 0.309156 186.835 0.489341C201.168 0.797761 212.367 18.5532 211.851 40.1472Z' fill='var(--primary-color)' />
							<path d='M280.14 72.338C278.952 82.5272 275.194 87.3248 267.801 94.3494C262.194 101.529 257.294 109.289 249.808 108.503C235.559 107.008 226.037 88.3919 228.54 66.9233C231.044 45.4547 244.624 29.2631 258.873 30.7584C273.122 32.2536 282.644 50.8695 280.14 72.338Z' fill='var(--primary-color)' />
						</svg>
					</form>

					<div id='rescues'>
						<div id='header'>
							<h3>Results</h3>

							<form>
								<Input
									type='search'
									placeholder='Search for Name or Pet ID'
									icon={
										<svg viewBox='0 0 17 15' fill='transparent'>
											<path d='M11.5485 8.68585C11.839 8.01588 12 7.27674 12 6.5C12 3.46243 9.53757 1 6.5 1C3.46243 1 1 3.46243 1 6.5C1 9.53757 3.46243 12 6.5 12C7.72958 12 8.86493 11.5965 9.78085 10.9147M11.5485 8.68585L14.8235 10.8921C15.4731 11.3297 15.6449 12.2109 15.2073 12.8605C14.7698 13.51 13.8885 13.6819 13.239 13.2443L9.78085 10.9147M11.5485 8.68585C11.1629 9.57534 10.549 10.3429 9.78085 10.9147' stroke='var(--primary-complement)' strokeWidth='2' />
										</svg>
									}

									onChange={(e) => {
										const rescues = this.state.rescues;
										const search = e.target.value.toLowerCase();

										const filteredRescues = rescues.filter(rescue => {
											return rescue.name.toLowerCase().includes(search)
												|| rescue.petId.toLowerCase().includes(search)
												|| rescue.description.toLowerCase().includes(search)
												|| rescue.href.toLowerCase().includes(search);
										});

										const petCardsElement = document.getElementById('petCards');
										const petCards = petCardsElement.querySelectorAll('.petCard');

										petCards.forEach(card => {
											const cardId = card.getAttribute('id');
											if (filteredRescues.some(rescue => rescue.petId === cardId)) {
												card.style.display = 'flex';
											} else {
												card.style.display = 'none';
											};
										});
									}}
								/>
								<Button
									title='Add New'

									onClick={(e) => {
										e.preventDefault();
										window.location.hash = '/rescues/add';
									}}
								/>
								<Button
									title='Scan RFID'
									theme='dark'

									onClick={(e) => {
										e.preventDefault();
										this.setState({
											popupContent: (
												<>
													<h1>Scan RFID</h1>
													<Input
														type='password'
														placeholder='RFID'
														id='rfid'
														onKeyDown={(e) => {
															if (e.key === 'Enter') {
																const rescues = this.state.rescues;
																const search = e.target.value.toLowerCase();

																const filteredRescues = rescues.filter(rescue => {
																	return rescue.rfid.toLowerCase().includes(search);
																});

																const petCardsElement = document.getElementById('petCards');
																const petCards = petCardsElement.querySelectorAll('.petCard');

																petCards.forEach(card => {
																	const cardId = card.getAttribute('id');
																	if (filteredRescues.some(rescue => rescue.petId === cardId)) {
																		card.style.display = 'flex';
																	} else {
																		card.style.display = 'none';
																	}
																});

																const popup = document.getElementById('popup');
																popup.style.top = '-50%';

																setTimeout(() => {
																	this.setState({
																		popupContent: <></>
																	});
																}, 250);
															};
														}}
													/>
													<Button
														title='Cancel'
														theme='dark'
														onClick={() => {
															const popup = document.getElementById('popup');
															popup.style.top = '-50%';

															setTimeout(() => {
																this.setState({
																	popupContent: <></>
																});
															}, 250);
														}}
													/>
												</>
											)
										});

										const popup = document.getElementById('popup');
										popup.style.top = '50%';
										try {
											setTimeout(() => {
												const input = popup.querySelector('#rfid');
												input.focus();
											}, 250);
										} catch (error) { console.log(error) };
									}}
								/>
							</form>
						</div>

						<div id='petCards'>
							{this.state.rescues.map((rescue, index) => (
								<PetCard
									key={index}
									id={rescue.petId}
									image={rescue.image}
									name={rescue.name}
									description={rescue.description}
									href={rescue.href}
								/>
							))}
						</div>
					</div>
				</main>
			</>
		)
	};
};

export default Rescues;