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
				username: '',
				id: '',
				email: '',
				phone: ''
			},
			aStaffInfo: {
				Name: '',
				Picture: '',
				Username: '',
				Password: '',
				Email: '',
				Mobilenumber: '',
				Branches: ''
			},
			popupContent: <></>,
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
							username: res.aStaffInfo.Username,
							id: res.id,
							email: res.aStaffInfo.Email,
							phone: res.aStaffInfo.Mobilenumber
						},
						aStaffInfo: res.aStaffInfo
					});
				} catch (error) {
					localStorage.removeItem('token');
					window.location.hash = '/login';
				};
			});
	};

	saveAdminInfo = async (e) => { };

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
								onClick={this.saveAdminInfo}
							/>
						</div>
					</header>

					<section id='basicInfo'>
						<div id='image'>
							<input type='file' name='imageInput' id='imageInput' accept="image/*" />
							<div
								id='img'
								onClick={() => {
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
								}}

								style={{
									backgroundImage: this.state.aStaffInfo.Picture ? `url(${this.state.aStaffInfo.Picture})` : ''
								}}
							/>
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
								value={this.state.aStaffInfo.Name}
								defaultValue={this.state.aStaffInfo.Name}
							/>
							<FormInput
								label='Type'
								type='text'
								id='type'
								name='type'
								placeholder='Username'
								disabled={true}
								value={this.state.aStaffInfo.Username}
								defaultValue={this.state.aStaffInfo.Username}
							/>
							<FormInput
								label='Branch'
								type='text'
								id='ageYear'
								name='ageYear'
								placeholder='Branch'
								disabled={true}
								value={this.state.aStaffInfo.Branches}
								defaultValue={this.state.aStaffInfo.Branches}
							/>
						</div>
						<div>
							<FormInput
								label='Admin'
								type='text'
								id='petID'
								name='petID'
								disabled={true}
								value={this.state.petID}
								defaultValue={this.state.petID}
							/>
							<FormInput
								label='Email'
								type='test'
								id='breed'
								name='breed'
								placeholder='Email'
								value={this.state.aStaffInfo.Email}
								defaultValue={this.state.aStaffInfo.Email}
							/>
							<FormInput
								label='Phone Number'
								type='number'
								id='gender'
								name='gender'
								placeholder='Phone Number'
								value={this.state.aStaffInfo.Mobilenumber}
								defaultValue={this.state.aStaffInfo.Mobilenumber}
							/>
						</div>
					</section>
				</form>
			</>
		);
	}
};

export default AdminInfo;