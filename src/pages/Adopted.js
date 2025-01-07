import React from 'react';

import Sidebar from '../components/Sidebar';
import Input from '../components/Input';
import Button from '../components/Button';
import PetCard from '../components/PetCard';
import Popup from '../components/Popup';

import '../css/adopted.css';

class Adopted extends React.Component {
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
			adopted: [
				{
					rfidTag: '',
					petId: '',
					background: {
						size: '',
						weight: '',
						attributes: '',
						rescueDate: '',
						rescueStory: '',
						medicalHistory: [
							{
								procedure: '',
								date: '',
								notes: '',
							}
						],
						vaccination: [
							{
								name: '',
								date: '',
								expiry: '',
							}
						]
					},
					appPetID: null,
					personal: {
						gender: '',
						name: '',
						type: '',
						breed: '',
						picture: '',
						age: {
							month: '',
							year: '',
						}
					},
					id: '',
					status: '',
				}
			]
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
						text: <p>Please login again.</p>,
						icon: 'error',
						iconColor: 'var(--primary-color)',
						confirmButtonColor: 'var(--primary-color)'
					});
					window.location.hash = '/login';
				};
			});

		this.fetchAdopted();
	};

	fetchAdopted() {
		const appPetID = (() => {
			const path = window.location.hash.split('/');
			return path[path.length - 1];
		})();

		if (!appPetID) return;
		fetch(`https://compawnion-backend.onrender.com/adoptedAnimals/${appPetID}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then(res => res.json())
			.then(res => {
				const adoptedAnimals = [];

				for (const adoptedAnimal of Object.values(res)) {
					if (typeof adoptedAnimal === 'object') {
						adoptedAnimals.push(adoptedAnimal);
					};
				};

				this.setState({
					adopted: adoptedAnimals
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

					active='adopted'
				/>

				<main id='adoptedMain'>
					<div id='adopted'>
						<div id='header'>
							<h3>Adopted Pets</h3>
							
							<Button
								title='Back'
								theme='dark'
								onClick={() => {
									window.history.back();
								}}
							/>
						</div>

						<div id='petCards'>
							{this.state.adopted.map((adopted, index) => (
								<PetCard
									key={index}
									id={adopted.petId}
									image={adopted.personal.picture}
									name={adopted.personal.name}
									description={adopted.background.attributes}
									href={adopted.appPetID}
								/>
							))}
						</div>
					</div>
				</main>
			</>
		)
	};
};

export default Adopted;